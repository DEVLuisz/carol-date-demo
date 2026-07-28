import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { LoadingVeil } from "@/components/date/LoadingVeil";
import { SpMap } from "@/components/date/SpMap";
import { DATE_SPOTS, type DateSpot } from "@/components/date/spots";
import { LoveCard } from "@/components/date/LoveCard";

/** Para onde vai o aviso do date escolhido. */
const LUIS_EMAIL = "louisfiveghz@outlook.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Carol" },
      {
        name: "description",
        content:
          "Um convite fofo do Luís para a Carol: aceite o date e escolha no mapa de São Paulo o lugar perfeito para a gente.",
      },
      { property: "og:title", content: "Carol, aceita um date? · um convite do Luís" },
      {
        property: "og:description",
        content: "Aceite o convite e escolha no mapa de SP onde vai ser o nosso date.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DateInvite,
});

type Stage = "booting" | "invite" | "loading-map" | "map" | "sent";

const BOOT_MESSAGES = [
  "Acendendo as velinhas...",
  "Carregando DBD...",
  "Separando os mimos...",
  "Enchendo a banheira (vai que né)...",
  "Criando coragem pra te chamar...",
];

const MAP_MESSAGES = [
  "Desdobrando o mapa de São Paulo...",
  "Marcando os lugares fofos...",
  "Checando se tem açai perto...",
  "Prontinho, Carol.",
];

function DateInvite() {
  const [stage, setStage] = useState<Stage>("booting");
  const [selected, setSelected] = useState<DateSpot | null>(null);
  const [noCount, setNoCount] = useState(0);
  const [bath, setBath] = useState(false);

  const noLabels = [
    "Não 🥺",
    "Tem certeza?",
    "Pensa de novo...",
    "O killer vai ficar triste",
    "Ok, mas e os mimos?",
    "Esse botão quebrou 😌",
  ];
  const noLabel = noLabels[Math.min(noCount, noLabels.length - 1)];

  const mailHref = useMemo(() => {
  const spot = selected ?? DATE_SPOTS[0];

  const assunto = encodeURIComponent(
    ` Carol aceitou o date! - ${spot.name}`
  );

  const maps = `https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`;

  const corpo = encodeURIComponent(
`Oi Luís! 

Tenho uma ótima notícia...

Aceitei o convite! 🥰

📍 Lugar escolhido:
${spot.name}

📌 Região:
${spot.area}

✨ Clima:
${spot.vibe}

🗺 Google Maps:
${maps}

Agora é só marcar o dia! E conversar com os meus pais`
  );

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${LUIS_EMAIL}&su=${assunto}&body=${corpo}`;

}, [selected]);

  const [sending, setSending] = useState(false);

const confirmSpot = useCallback(() => {
  if (!selected || sending) return;

  setSending(true);

  setTimeout(() => {
    window.open(mailHref, "_blank");

    setTimeout(() => {
      setStage("sent");
      setSending(false);
    }, 500);

  }, 1000);

}, [mailHref, selected, sending]);

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-10">
      {bath && (
        <div className="pointer-events-none fixed inset-0 z-40">
          {Array.from({ length: 26 }).map((_, i) => (
            <span
              key={i}
              className="animate-heart-rise absolute text-xl"
              style={{
                left: `${(i * 11 + 3) % 97}%`,
                bottom: "-30px",
                animationDelay: `${(i % 9) * 0.28}s`,
              }}
            >
              🫧
            </span>
          ))}
        </div>
      )}

      {stage === "booting" && (
        <LoadingVeil messages={BOOT_MESSAGES} duration={3600} onDone={() => setStage("invite")} />
      )}
      {stage === "loading-map" && (
        <LoadingVeil messages={MAP_MESSAGES} duration={2600} onDone={() => setStage("map")} />
      )}

      <button
        type="button"
        onClick={() => setBath((b) => !b)}
        className="fixed bottom-5 right-5 z-45 rounded-full border border-primary/40 bg-card/80 px-4 py-2 font-display text-sm shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
      >
        🚿 Tomar banho
      </button>

      {stage === "invite" && (
        <section className="animate-fade-up mx-auto flex max-w-5xl flex-col items-center gap-8 pt-6 text-center">
          <span className="rounded-full border border-primary/40 bg-card/60 px-4 py-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Para: Ana Carolina
          </span>
          <h1 className="font-display text-5xl leading-tight sm:text-7xl">
            Carol, <span className="text-gradient">aceita um date</span> comigo?
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            A gente ainda esta se conhecendo mas só quem arrisca merece viver o extraordinário. Agora eu
            queria te ver longe da tela — só eu, você e São Paulo inteira pra escolher.
          </p>

          <LoveCard />

          <div className="grid w-full gap-3 sm:grid-cols-3">
            {[
              { t: "Mimos garantidos", d: "Já é tradição, não vou parar agora.", e: "🎁" },
              { t: "Co-op na vida real", d: "Sem perk de fuga dessa vez.", e: "🕹️" },
              { t: "Banho tomado", d: "Juro. Cheirosinho. Piada interna cumprida.", e: "🚿" },
            ].map((c) => (
              <div key={c.t} className="surface-card rounded-2xl p-4 text-left">
                <div className="text-2xl">{c.e}</div>
                <h2 className="mt-2 font-display text-lg">{c.t}</h2>
                <p className="text-sm text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => setStage("loading-map")}
              className="rounded-full px-9 py-4 font-display text-lg text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-petal)" }}
            >
              Sim, quero! 💗
            </button>
            <button
              type="button"
              disabled={noCount >= 5}
              onClick={() => setNoCount((n) => n + 1)}
              className="rounded-full border border-border bg-card/70 px-7 py-4 font-display text-base text-muted-foreground transition-transform hover:scale-95 disabled:opacity-40"
              style={{ transform: `scale(${Math.max(0.55, 1 - noCount * 0.09)})` }}
            >
              {noLabel}
            </button>
          </div>
        </section>
      )}

      {stage === "map" && (
        <section className="animate-fade-up mx-auto grid max-w-6xl gap-8 pt-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-5xl">
              Agora escolhe: <span className="text-gradient">onde vai ser?</span>
            </h1>
            <p className="text-muted-foreground">
              Toca num pininho do mapa de São Paulo. O lugar que você escolher chega direto no meu
              e-mail.
            </p>
            <SpMap selected={selected} onSelect={setSelected} />
          </div>

          <aside className="surface-card flex h-fit flex-col gap-4 rounded-3xl p-6">
            <h2 className="font-display text-2xl">
              {selected ? selected.name : "Nenhum lugar ainda"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {selected
                ? `${selected.area} — ${selected.vibe}`
                : "Escolhe um dos pininhos e eu já começo a me arrumar (e a tomar banho)."}
            </p>

            <div className="grid max-h-64 gap-2 overflow-y-auto pr-1">
              {DATE_SPOTS.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setSelected(spot)}
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-2 text-left text-sm transition-colors ${
                    selected?.id === spot.id
                      ? "border-accent bg-accent/15"
                      : "border-border bg-card/50 hover:bg-secondary"
                  }`}
                >
                  <span className="text-lg">{spot.emoji}</span>
                  <span>
                    <span className="block font-semibold">{spot.name}</span>
                    <span className="block text-xs text-muted-foreground">{spot.area}</span>
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={!selected || sending}
              onClick={confirmSpot}
              className="rounded-full px-6 py-3 font-display text-base text-primary-foreground transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              style={{ background: "var(--gradient-petal)" }}
            >
              Confirmar e avisar o Luís ✉️
            </button>
          </aside>
        </section>
      )}

      {stage === "sent" && (
        <section className="animate-fade-up mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-6 text-center">
          <div className="animate-float-soft text-7xl">💌</div>
          <h1 className="font-display text-4xl sm:text-5xl">
            É um <span className="text-gradient">date</span>, Carol.
          </h1>
          <p className="text-muted-foreground">
            {selected?.name} — {selected?.area}. Já tá anotado e o aviso foi pro meu e-mail.
          </p>
          <p className="text-sm text-muted-foreground">
            Se o app de e-mail não abriu, é só me mandar:{" "}
            <a href={mailHref} className="text-accent underline underline-offset-4">
              avisar o Luís
            </a>
          </p>
          <p className="font-display text-lg text-accent">Agora sim eu vou tomar banho. 🚿</p>
        </section>
      )}
    </main>
  );
}
