import { useState } from "react";

export function LoveCard() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative mx-auto h-[22rem] w-80 cursor-pointer select-none sm:w-96"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
      role="img"
      aria-label='Cartão animado que abre com a mensagem "Gosto muito e você!"'
    >
      {/* tampa do envelope (abre pra cima) */}
      <div
        className="absolute bottom-40 left-0 right-0 z-10 origin-bottom transition-transform duration-700 ease-out"
        style={{ transform: open ? "rotateX(150deg)" : "rotateX(0deg)", perspective: "900px" }}
      >
        <div
          className="mx-auto h-0 w-0"
          style={{
            borderLeft: "10rem solid transparent",
            borderRight: "10rem solid transparent",
            borderTop: "5rem solid color-mix(in oklab, var(--primary) 55%, black)",
          }}
        />
      </div>

      {/* carta que sobe */}
      <div
        className="absolute inset-x-4 bottom-28 z-20 rounded-2xl border border-primary/30 bg-card px-5 py-6 text-center shadow-[var(--shadow-glow)] transition-all duration-700 ease-out"
        style={{
          transform: open ? "translateY(-4.5rem) rotate(-1.5deg)" : "translateY(3rem) scale(0.9)",
          opacity: open ? 1 : 0,
        }}
      >
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Para a Carol</p>
        <p className="mt-3 font-display text-2xl leading-snug sm:text-3xl">
          Gosto muito <span className="text-gradient">e você!</span>
        </p>
        <p className="mt-3 text-sm text-muted-foreground">— Luís 💗</p>
      </div>

      {/* frente do envelope */}
      <div
        className="absolute inset-x-0 bottom-0 z-30 h-40 overflow-hidden rounded-2xl border border-primary/40"
        style={{ background: "var(--gradient-petal)" }}
      >
        <div className="absolute -left-1/4 bottom-0 h-full w-3/4 rotate-12 bg-background/10" />
        <div className="absolute -right-1/4 bottom-0 h-full w-3/4 -rotate-12 bg-background/10" />
        <div className="absolute bottom-4 left-0 right-0 text-center font-display text-sm text-primary-foreground/90">
          {open ? " é pra você" : "passe o mouse ✨"}
        </div>
      </div>

      {/* coraçõezinhos */}
      {open &&
        Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="animate-heart-rise pointer-events-none absolute bottom-36 z-40 text-lg"
            style={{ left: `${10 + i * 15}%`, animationDelay: `${i * 0.18}s` }}
          >
            😘
          </span>
        ))}
    </div>
  );
}
