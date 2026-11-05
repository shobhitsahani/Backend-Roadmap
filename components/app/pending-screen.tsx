export function PendingScreen({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <section className="flex min-h-[60dvh] flex-col justify-center border-b border-hairline py-20">
      <p className="font-mono text-micro tracking-[0.16em] text-phase-1 uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-4 font-display text-display-sm font-semibold tracking-[-0.04em] text-ink">
        {title}
      </h1>
      <p className="mt-4 max-w-lg font-sans text-body-lg leading-relaxed text-ink-muted">
        This view is being calibrated. The roadmap and checklist remain fully operational.
      </p>
    </section>
  );
}
