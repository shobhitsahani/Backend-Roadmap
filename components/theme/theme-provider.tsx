"use client";

import { animate } from "motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  isDarkTheme,
  migrateStoredTheme,
  resolveTheme,
  themeColors,
  THEME_STORAGE_KEY,
  type ThemeSetting,
} from "@/lib/theme/config";
import { DEFAULT_THEME, themeNames, type ThemeName } from "@/lib/theme/tokens";

type SystemTheme = "dark" | "light";

type ThemeContextValue = {
  /** Stored preference: a concrete theme or `system`. */
  theme: ThemeSetting;
  /** Concrete theme currently applied to `<html data-theme>`. */
  resolvedTheme: ThemeName;
  systemTheme: SystemTheme;
  themes: readonly ThemeName[];
  setTheme: (theme: ThemeSetting) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DARK_QUERY = "(prefers-color-scheme: dark)";

function getSystemTheme(): SystemTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function applyToDocument(theme: ThemeName) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = isDarkTheme(theme) ? "dark" : "light";

  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = themeColors[theme];
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => unknown;
};

function fallbackCrossfade(from: ThemeName, update: () => void) {
  const overlay = document.createElement("div");
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:9999",
    "pointer-events:none",
    `background:${themeColors[from]}`,
  ].join(";");
  document.body.appendChild(overlay);

  update();

  const animation = animate(overlay, { opacity: 0 }, { duration: 0.22, ease: "easeOut" });
  void Promise.resolve(animation.finished).finally(() => overlay.remove());
}

function swapTheme(next: ThemeName) {
  const root = document.documentElement;
  const current = root.getAttribute("data-theme") as ThemeName | null;
  if (current === next) {
    applyToDocument(next);
    return;
  }

  const update = () => applyToDocument(next);

  if (prefersReducedMotion() || !current) {
    update();
    return;
  }

  const viewTransition = (document as ViewTransitionDocument).startViewTransition;
  if (viewTransition) {
    viewTransition.call(document, update);
    return;
  }

  fallbackCrossfade(current, update);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeSetting>(DEFAULT_THEME);
  const [systemTheme, setSystemTheme] = useState<SystemTheme>("dark");
  const themeRef = useRef<ThemeSetting>(DEFAULT_THEME);

  const apply = useCallback(
    (next: ThemeSetting, options: { animate: boolean; persist: boolean }) => {
      const system = getSystemTheme();
      const resolved = resolveTheme(next, system === "dark");

      themeRef.current = next;
      setSystemTheme(system);
      setThemeState(next);

      if (options.animate) {
        swapTheme(resolved);
      } else {
        applyToDocument(resolved);
      }

      if (options.persist && typeof window !== "undefined") {
        try {
          window.localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {
          // Storage can be unavailable in private mode; the in-memory theme still works.
        }
      }
    },
    [],
  );

  // Hydrate from storage after the blocking script has already painted.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      stored = null;
    }

    const migrated = migrateStoredTheme(stored);
    if (stored === "dark") {
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, "black");
      } catch {
        // Ignore: the value is migrated in memory regardless.
      }
    }

    if (!migrated) return;

    // Defer to a task: the blocking script has already painted the theme, and
    // this only needs to sync React state. Calling setState inline in an effect
    // triggers the react-hooks/set-state-in-effect rule (and a cascading render).
    const timer = window.setTimeout(() => {
      apply(migrated, { animate: false, persist: false });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [apply]);

  // Sync across tabs.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      const next = migrateStoredTheme(event.newValue);
      if (next) apply(next, { animate: false, persist: false });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [apply]);

  // Follow the OS when the preference is System.
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    const onChange = () => {
      if (themeRef.current !== "system") return;
      apply("system", { animate: false, persist: false });
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [apply]);

  const setTheme = useCallback(
    (next: ThemeSetting) => {
      apply(next, { animate: true, persist: true });
    },
    [apply],
  );

  const resolvedTheme = useMemo(
    () => resolveTheme(theme, systemTheme === "dark"),
    [theme, systemTheme],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      systemTheme,
      themes: themeNames,
      setTheme,
    }),
    [resolvedTheme, setTheme, systemTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
