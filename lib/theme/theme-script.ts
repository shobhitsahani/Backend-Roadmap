import { themeColors, THEME_STORAGE_KEY } from "./config";

/**
 * Runs as a `beforeInteractive` script in the root layout: migrates the legacy
 * `dark` preference, resolves `system`, and stamps `data-theme`, `color-scheme`
 * and the theme-color meta before the first paint. Kept dependency-free.
 */
export function themeInitScript(): string {
  const colors = JSON.stringify(themeColors);
  return `(function(){try{var key=${JSON.stringify(THEME_STORAGE_KEY)};var root=document.documentElement;var stored=null;try{stored=localStorage.getItem(key)}catch(e){}var setting=stored==="dark"?"black":(stored==="black"||stored==="purple"||stored==="light"||stored==="system"?stored:null);if(stored==="dark"){try{localStorage.setItem(key,"black")}catch(e){}}if(!setting){setting="black"}var prefersDark=window.matchMedia("(prefers-color-scheme: dark)").matches;var theme=setting==="system"?(prefersDark?"black":"light"):setting;root.setAttribute("data-theme",theme);root.style.colorScheme=theme==="light"?"light":"dark";root.classList.remove("dark","light");var colors=${colors};var meta=document.querySelector('meta[name="theme-color"]');if(!meta){meta=document.createElement("meta");meta.setAttribute("name","theme-color");document.head.appendChild(meta)}meta.setAttribute("content",colors[theme]||colors.black)}catch(e){try{document.documentElement.setAttribute("data-theme","black")}catch(_){}}})();`;
}
