import { useEffect, useState } from "react";

interface LoadingVeilProps {
  messages: string[];
  duration?: number;
  onDone: () => void;
}

export function LoadingVeil({ messages, duration = 3200, onDone }: LoadingVeilProps) {
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const tick = window.setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / duration) * 100);
      setProgress(pct);
      setIndex(Math.min(messages.length - 1, Math.floor((pct / 100) * messages.length)));
      if (pct >= 100) {
        window.clearInterval(tick);
        window.setTimeout(onDone, 420);
      }
    }, 60);
    return () => window.clearInterval(tick);
  }, [duration, messages.length, onDone]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="animate-heart-rise absolute text-2xl"
            style={{
              left: `${(i * 7.3 + 4) % 96}%`,
              bottom: "-40px",
              animationDelay: `${(i % 7) * 0.42}s`,
            }}
            aria-hidden="true"
          >
            {i % 3 === 0 ? "🫧" : i % 3 === 1 ? "💗" : "🕯️"}
          </span>
        ))}
      </div>

      <div className="relative flex flex-col items-center gap-8 text-center">
        <div className="animate-float-soft relative flex h-32 w-32 items-center justify-center">
          <div className="animate-pulse-ring absolute inset-0 rounded-full bg-primary/20" />
          <div className="flex h-full w-full items-center justify-center rounded-full border border-primary/40 bg-card/70 text-5xl">
            💌
          </div>
        </div>

        <p className="shimmer-text max-w-sm font-display text-xl">{messages[index]}</p>

        <div className="h-2 w-64 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%`, background: "var(--gradient-petal)" }}
          />
        </div>
        <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
          {Math.floor(progress)}%
        </span>
      </div>
    </div>
  );
}
