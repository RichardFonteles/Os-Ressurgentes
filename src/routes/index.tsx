import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import heroForest from "@/assets/hero-forest.jpg";
import mentorPortrait from "@/assets/mentor-portrait-original.jpg.asset.json";
import horizon from "@/assets/horizon.jpg";
import logoOriginal from "@/assets/logo-transparent.png.asset.json";
import { launchConfig } from "@/lib/launch-config";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    links: [
      // LCP hint — pré-carrega a imagem do hero em alta prioridade
      { rel: "preload", as: "image", href: heroForest, fetchPriority: "high" },
    ],
  }),
});

// A página permanece em pré-lançamento até a validação operacional.
const CONTACT_URL = launchConfig.contactUrl;
const CTA_URL = CONTACT_URL;

/* ------------ hooks ------------ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal, .reveal-left, .reveal-scale");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/**
 * useParallax — deslocamento vertical sutil em elementos [data-parallax].
 * `data-parallax="0.15"` → 15% da distância entre o centro do elemento e
 * o centro da viewport. Usa rAF + IntersectionObserver para só calcular
 * quando visível. Respeita prefers-reduced-motion.
 */
function useParallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    if (!nodes.length) return;

    const visible = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) visible.add(el);
          else visible.delete(el);
        });
      },
      { rootMargin: "200px 0px" },
    );
    nodes.forEach((n) => io.observe(n));

    let raf = 0;
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      visible.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const delta = center - vh / 2;
        const speed = parseFloat(el.dataset.parallax || "0.12");
        el.style.setProperty("--py", `${(-delta * speed).toFixed(1)}px`);
      });
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);
}

/**
 * useScrollProgress — atualiza a variável --sp (0..1) no elemento .scroll-progress
 * conforme a página é rolada. Barra dourada fina no topo, guia sem distrair.
 */
function useScrollProgress(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    let raf = 0;
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (ref.current) ref.current.style.setProperty("--sp", p.toString());
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}

/* ------------ small components ------------ */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="gold-rule" />
      <span className="label-eyebrow">{children}</span>
    </div>
  );
}

function SectionTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`text-display text-[clamp(2rem,4.6vw,3.6rem)] text-ivory ${className}`}
      style={{ color: "var(--ivory)" }}
    >
      {children}
    </h2>
  );
}

function ReflectionNote() {
  return (
    <aside className="ds-card p-8 md:p-12" aria-label="O que levar da Travessia">
      <p className="label-eyebrow">da reflexão ao movimento</p>
      <h3 className="serif text-3xl">Um espaço de escuta. Um próximo passo possível.</h3>
      <p className="text-base leading-relaxed" style={{ color: "var(--sand)" }}>
        Você traz seu momento. O grupo amplia as perspectivas. O plano coletivo organiza o que pode
        começar a mudar na rotina.
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "var(--sand)" }}>
        Sem promessa de transformação garantida. Com espaço para escolher e assumir seus próximos
        passos.
      </p>
    </aside>
  );
}

/* ------------ nav ------------ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : previous;
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const links: [string, string][] = [
    ["#limbo", "Para quem é"],
    ["#travessia", "Como funciona"],
    ["#duvidas", "Dúvidas"],
    ["#manifesto", "Manifesto"],
  ];

  return (
    <header
      className="fixed inset-x-0 top-0 z-40"
      style={{
        backgroundColor: scrolled || open ? "rgba(13,15,14,0.78)" : "transparent",
        backdropFilter: scrolled || open ? "blur(14px) saturate(120%)" : "none",
        borderBottom: `1px solid ${scrolled || open ? "rgba(240,234,223,0.08)" : "transparent"}`,
        transition:
          "background-color 640ms var(--ease-out-editorial), backdrop-filter 640ms var(--ease-out-editorial), border-color 640ms var(--ease-out-editorial), padding 320ms var(--ease-out-editorial)",
        paddingBlock: scrolled ? "0.75rem" : "1.25rem",
      }}
    >
      <div className="container-editorial flex items-center justify-between">
        <a
          href="#top"
          className="flex items-center gap-3 ds-focus"
          style={{ color: "var(--ivory)" }}
          aria-label="Os Ressurgentes — início"
        >
          <img
            src={logoOriginal.url}
            alt=""
            aria-hidden
            className="h-10 w-10 object-contain"
            style={{ filter: "invert(1)" }}
          />
          <span className="serif text-[0.78rem] tracking-[0.34em] uppercase hidden sm:inline">
            Os Ressurgentes
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-9" aria-label="Navegação principal">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="ds-nav-link">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={CTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ds-btn ds-btn-primary hidden md:inline-flex"
            style={{ padding: "0.65rem 1.15rem", fontSize: "0.7rem" }}
          >
            Solicitar entrevista
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="md:hidden ds-focus grid h-10 w-10 place-items-center"
            style={{ color: "var(--ivory)" }}
          >
            <span
              className="relative block h-[2px] w-6"
              style={{
                backgroundColor: "currentColor",
                transform: open ? "translateY(0) rotate(45deg)" : "translateY(-5px)",
                transition: "transform 320ms var(--ease-out-editorial)",
              }}
            />
            <span
              className="absolute block h-[2px] w-6"
              style={{
                backgroundColor: "currentColor",
                transform: open ? "translateY(0) rotate(-45deg)" : "translateY(5px)",
                transition: "transform 320ms var(--ease-out-editorial)",
              }}
            />
          </button>
        </div>
      </div>

      {/* Sheet mobile */}
      <div
        className="md:hidden overflow-hidden"
        inert={!open}
        style={{
          maxHeight: open ? "80vh" : "0px",
          transition: "max-height 480ms var(--ease-out-editorial)",
        }}
      >
        <nav
          className="container-editorial flex flex-col gap-1 pb-8 pt-4"
          aria-label="Navegação mobile"
        >
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="serif text-2xl py-3"
              style={{ color: "var(--ivory)", borderBottom: "1px solid var(--border)" }}
            >
              {label}
            </a>
          ))}
          <a
            href={CTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="ds-btn ds-btn-primary mt-6"
          >
            Solicitar entrevista
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ------------ manifesto modal ------------ */
function ManifestoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    const before = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClose={onClose}
      aria-labelledby="manifesto-title"
      className="manifesto-dialog"
    >
      <button autoFocus type="button" onClick={onClose} className="ds-btn ds-btn-ghost">
        Fechar manifesto
      </button>
      <p className="label-eyebrow mt-8">homens e mulheres em travessia</p>
      <h2 id="manifesto-title" className="serif mt-6 text-4xl">
        Manifesto dos Ressurgentes
      </h2>
      <div className="serif mt-8 space-y-6 text-xl leading-relaxed">
        <p>Não buscamos voltar a ser quem éramos.</p>
        <p>Escolhemos atravessar. Reconstruir. Ressurgir diferentes.</p>
        <p>
          Reconhecemos nossas Correntes Invisíveis e acolhemos as histórias que cada pessoa escolhe
          compartilhar.
        </p>
        <p>Caminhamos juntos, respeitando diferenças, limites e o tempo de cada pessoa.</p>
        <p>Não prometemos uma vida sem medo. Escolhemos dar o próximo passo possível.</p>
        <p style={{ color: "var(--gold)" }}>Uma nova fase se constrói em movimento.</p>
      </div>
    </dialog>
  );
}

/* ============================================================= */
function Landing() {
  useReveal();
  useParallax();
  const progressRef = useRef<HTMLDivElement | null>(null);
  useScrollProgress(progressRef);
  const [manifestoOpen, setManifestoOpen] = useState(false);
  return (
    <div id="top" style={{ backgroundColor: "var(--ink)", color: "var(--ivory)" }}>
      {/* Barra de progresso do scroll — guia sutil, dourada */}
      <div ref={progressRef} className="scroll-progress" aria-hidden />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />

        {/* ============ HERO ============ */}
        <section className="relative flex min-h-screen items-center overflow-hidden">
          <img
            src={heroForest}
            alt="Caminho em uma floresta enevoada, com luz entre as árvores"
            className="parallax-y absolute inset-0 h-[115%] w-full -top-[7%] object-cover"
            data-parallax="0.18"
            width={1920}
            height={1280}
            fetchPriority="high"
            decoding="async"
          />
          <div className="mist-overlay" />
          <div className="container-editorial relative z-10 pt-32 pb-24">
            <div className="max-w-3xl">
              <p className="label-eyebrow mb-8 reveal">
                OS RESSURGENTES · homens e mulheres em uma nova fase
              </p>
              <h1
                className="text-display text-[clamp(2.4rem,6.4vw,5.6rem)] reveal"
                style={{ color: "var(--ivory)" }}
              >
                Você já entendeu muita coisa.
                <br />
                Agora, dê o próximo passo.
              </h1>
              <p
                className="mt-8 max-w-xl text-lg md:text-xl font-light leading-relaxed reveal"
                style={{ color: "rgba(240,234,223,0.78)" }}
              >
                Para homens e mulheres que estão adiando uma mudança importante. Uma entrevista só
                sua, o Jogo do Herói em um grupo misto de quatro pessoas e um plano coletivo para
                começar a agir.
              </p>
              <p className="serif mt-10 text-xl italic reveal" style={{ color: "var(--gold)" }}>
                Descer ao fundo. Ressurgir transformado.
              </p>
              <div className="mt-12 flex flex-wrap gap-4 reveal">
                <a
                  href={CTA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ds-btn ds-btn-primary"
                >
                  Solicitar entrevista
                </a>
                <a href="#video-travessia" className="ds-btn ds-btn-ghost">
                  Assistir à Travessia
                </a>
              </div>
              <p
                className="mt-6 text-xs uppercase tracking-[0.32em] reveal"
                style={{ color: "var(--sand)" }}
              >
                Entrevista individual · Grupo misto de 4 pessoas · Plano coletivo
              </p>
            </div>
          </div>
          <div
            className="scroll-cue absolute bottom-8 left-1/2 z-10 text-[0.65rem] uppercase tracking-[0.42em]"
            style={{ color: "var(--sand)" }}
            aria-hidden
          >
            role para descer
          </div>
        </section>

        <section
          id="video-travessia"
          className="scroll-mt-24 py-20 md:py-28"
          style={{ backgroundColor: "var(--ink)" }}
          aria-labelledby="video-title"
        >
          <div className="container-editorial">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:items-center">
              <div>
                <Eyebrow>a travessia em 30 segundos</Eyebrow>
                <h2 id="video-title" className="text-display text-4xl md:text-5xl">
                  Sua história é individual.
                  <br />O próximo passo pode ser construído junto.
                </h2>
                <p className="mt-6 text-lg leading-relaxed" style={{ color: "var(--sand)" }}>
                  Um espaço para escutar seu momento, ampliar perspectivas com outras pessoas e
                  organizar ações para a sua nova fase.
                </p>
                <a href="#travessia" className="ds-btn ds-btn-ghost mt-8">
                  Entender as três etapas
                </a>
              </div>
              <figure>
                <video
                  controls
                  playsInline
                  preload="none"
                  poster="/media/os-ressurgentes-misto-poster.jpg"
                  className="block aspect-video w-full border object-cover"
                  aria-label="Os Ressurgentes: apresentação para homens e mulheres, 30 segundos"
                  aria-describedby="video-caption"
                >
                  <source src="/media/os-ressurgentes-misto-30s.mp4" type="video/mp4" />
                  <track
                    kind="subtitles"
                    src="/media/os-ressurgentes-misto.vtt"
                    srcLang="pt-BR"
                    label="Português"
                  />
                  Seu navegador não reproduz este vídeo.{" "}
                  <a href="/media/os-ressurgentes-misto-30s.mp4">Abra o vídeo da Travessia</a>.
                </video>
                <figcaption
                  id="video-caption"
                  className="mt-3 text-xs leading-relaxed"
                  style={{ color: "var(--sand)" }}
                >
                  Filme ilustrativo com imagens geradas por IA, animação e locução sintética em
                  português.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ============ PARA QUEM É ============ */}
        <section
          id="limbo"
          className="scroll-mt-24 py-20 md:py-28"
          style={{ backgroundColor: "var(--forest)" }}
        >
          <div className="container-editorial">
            <div className="max-w-2xl reveal">
              <Eyebrow>para quem está começando uma nova fase</Eyebrow>
              <SectionTitle>A vida segue. Você quer voltar a fazer parte dela.</SectionTitle>
            </div>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                [
                  "Decisões adiadas",
                  "Você sabe que precisa mudar algo, mas continua deixando para depois.",
                ],
                [
                  "Padrões que se repetem",
                  "Você percebe os mesmos impasses nas suas escolhas e relações.",
                ],
                [
                  "Falta de direção",
                  "Você quer organizar o próximo passo e assumir um compromisso com ele.",
                ],
              ].map(([title, body]) => (
                <li
                  key={title}
                  className="reveal border-t pt-6"
                  style={{ borderColor: "var(--gold)" }}
                >
                  <h3 className="serif text-2xl">{title}</h3>
                  <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--sand)" }}>
                    {body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============ A TRAVESSIA ============ */}
        <section
          id="travessia"
          className="scroll-mt-24 py-20 md:py-28"
          style={{ backgroundColor: "var(--ink)" }}
        >
          <div className="container-editorial">
            <div className="max-w-3xl reveal">
              <Eyebrow>como funciona</Eyebrow>
              <SectionTitle>Três etapas. Um próximo passo concreto.</SectionTitle>
              <p className="mt-6 text-lg leading-relaxed" style={{ color: "var(--sand)" }}>
                Você começa com uma entrevista individual. Depois, participa do Jogo do Herói em um
                grupo misto de quatro pessoas e constrói, com o grupo, um plano coletivo de ação.
                São seis horas de encontros por participante e apoio de IA por 30 dias.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-base reveal">
              {[
                "Entrevista individual",
                "Grupo misto de 4 pessoas",
                "6 horas de encontros + 30 dias de IA",
              ].map((label) => (
                <span
                  key={label}
                  className="border px-4 py-2"
                  style={{ borderColor: "var(--border)", color: "var(--sand)" }}
                >
                  {label}
                </span>
              ))}
            </div>
            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Encarar",
                  time: "60 min · entrevista individual",
                  body: "Uma etapa individual de escuta para compreender seu momento e identificar o desafio que você deseja trabalhar. Sua história não precisa ser exposta ao grupo.",
                  focus: "Foco: clareza sobre o ponto de partida.",
                },
                {
                  title: "Romper",
                  time: "240 min · Jogo do Herói coletivo misto",
                  body: "Quatro participantes, homens e mulheres, em uma experiência guiada de perguntas, reflexão e novas possibilidades de ação. Compartilhe apenas o que desejar.",
                  focus: "Foco: reconhecer padrões e considerar outras escolhas.",
                },
                {
                  title: "Reescrever",
                  time: "60 min · plano coletivo",
                  body: "Construir com o grupo um plano coletivo, com próximos passos e compromissos de ação. Cada pessoa escolhe como aplicar as reflexões à própria rotina.",
                  focus: "Foco: transformar reflexão em ações na sua rotina.",
                },
              ].map(({ title, time, body, focus }, i) => (
                <li
                  key={title}
                  className="reveal border p-6 md:p-8"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--forest)" }}
                >
                  <span className="serif text-4xl" style={{ color: "var(--gold)" }}>
                    0{i + 1}
                  </span>
                  <h3 className="serif mt-5 text-3xl">{title}</h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--gold)" }}>
                    {time}
                  </p>
                  <p className="mt-6 text-base leading-relaxed" style={{ color: "var(--sand)" }}>
                    {body}
                  </p>
                  <p
                    className="mt-6 border-t pt-5 text-base leading-relaxed"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {focus}
                  </p>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex flex-col items-start gap-5 reveal">
              <p className="max-w-2xl text-base leading-relaxed" style={{ color: "var(--sand)" }}>
                A entrevista é individual. O jogo e o plano de ação são coletivos. O apoio de IA por
                30 dias complementa a experiência; não representa 30 dias de atendimento humano.
              </p>
              <a
                href={CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ds-btn ds-btn-primary"
              >
                Solicitar entrevista
              </a>
            </div>
          </div>
        </section>

        <section
          id="inscricao"
          className="scroll-mt-24 py-20 md:py-28"
          style={{ backgroundColor: "var(--forest)" }}
        >
          <div className="container-editorial grid gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>o próximo passo</Eyebrow>
              <SectionTitle>
                Quatro pessoas.
                <br />
                Novas perspectivas.
              </SectionTitle>
              <p className="mt-6 text-lg leading-relaxed" style={{ color: "var(--sand)" }}>
                Uma entrevista individual para compreender seu momento. Depois, uma experiência em
                grupo misto de quatro pessoas para ampliar perspectivas e construir um plano
                coletivo de ação.
              </p>
              <p className="mt-6 text-base leading-relaxed" style={{ color: "var(--sand)" }}>
                Depois dos encontros, são 30 dias de apoio de IA para continuar refletindo e
                organizar seus próximos passos. Você escolhe o que compartilhar e mantém a
                responsabilidade pelas próprias decisões.
              </p>
            </div>
            <div className="ds-card p-8 md:p-10">
              <p className="label-eyebrow">uma conversa para começar</p>
              <h3 className="serif text-4xl">Seu momento merece escuta.</h3>
              <p className="text-base leading-relaxed" style={{ color: "var(--sand)" }}>
                Uma conversa individual de aproximadamente 20–25 minutos para compreender seu
                momento e avaliar se Os Ressurgentes faz sentido para você.
              </p>
              <ul className="space-y-3 text-base leading-relaxed" style={{ color: "var(--sand)" }}>
                <li>60 min de etapa individual</li>
                <li>240 min de Jogo do Herói em grupo misto</li>
                <li>60 min de plano coletivo de ação</li>
                <li>30 dias de apoio de IA</li>
              </ul>
              <p
                className="border-t pt-5 text-base leading-relaxed"
                style={{ color: "var(--sand)" }}
              >
                Solicite a entrevista e conheça a agenda, o investimento e as condições da Travessia
                antes de decidir participar.
              </p>
              <a
                href={CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ds-btn ds-btn-primary"
              >
                Quero conversar sobre meu próximo passo
              </a>
              <p className="text-xs leading-relaxed" style={{ color: "var(--sand)" }}>
                O botão abre o WhatsApp para solicitar informações e combinar a entrevista. Esse
                contato não confirma agendamento, reserva ou contratação.
              </p>
            </div>
          </div>
        </section>

        {/* ============ MINHA TRAVESSIA ============ */}
        <section className="py-32 md:py-40" style={{ backgroundColor: "var(--ink)" }}>
          <div className="container-editorial grid gap-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-24">
            <div className="reveal">
              <div className="sticky top-32">
                <img
                  src={mentorPortrait.url}
                  alt="Fotografia de o.gentólogo"
                  className="w-full object-cover"
                  loading="lazy"
                  width={1024}
                  height={1024}
                />
                <p className="serif mt-6 text-lg italic" style={{ color: "var(--sand)" }}>
                  o.gentólogo
                </p>
              </div>
            </div>
            <div>
              <div className="reveal">
                <Eyebrow>minha travessia</Eyebrow>
                <SectionTitle>Também atravesso.</SectionTitle>
              </div>
              <div
                className="serif mt-10 space-y-8 text-lg md:text-xl leading-relaxed reveal"
                style={{ color: "rgba(240,234,223,0.85)" }}
              >
                <p>
                  Por muito tempo achei que faltava conhecimento. Estudei, li, ensinei, ajudei
                  muitos — e mesmo assim, quando a porta se fechava, sempre a mesma pergunta:
                  <span className="italic block mt-4" style={{ color: "var(--gold)" }}>
                    se eu sei tanto, por que ainda estou preso?
                  </span>
                </p>
                <p>
                  Foi aí que entendi: o Limbo não é falta de inteligência. É um lugar silencioso
                  onde o ser humano funciona por fora — trabalha, entrega, cuida — enquanto por
                  dentro uma vida inteira espera para começar.
                </p>
                <p>
                  Conheço o peso do adiar. A culpa de saber o caminho e não caminhar. As Correntes
                  Invisíveis que fazem crer no amanhã enquanto se repete o hoje.
                </p>
                <p>
                  Minha Travessia não começou quando encontrei respostas. Começou quando parei de
                  fugir das minhas Sombras — e entendi que coragem
                  <span className="italic" style={{ color: "var(--ivory)" }}>
                    {" "}
                    não é ausência de medo, é atravessar carregando o medo.
                  </span>
                </p>
                <p>
                  Os Ressurgentes nasceram disso. Não caminho à frente porque sou melhor.
                  <span className="block mt-3" style={{ color: "var(--gold)" }}>
                    Caminho ao lado porque também continuo atravessando.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PERGUNTAS FREQUENTES ============ */}
        <section
          id="duvidas"
          className="scroll-mt-24 py-20 md:py-28"
          style={{ backgroundColor: "var(--forest)" }}
        >
          <div className="container-editorial max-w-3xl">
            <div className="reveal">
              <Eyebrow>antes de começar</Eyebrow>
              <SectionTitle>Dúvidas práticas.</SectionTitle>
            </div>
            <div className="mt-10 reveal">
              {[
                [
                  "Quem pode participar?",
                  "Homens e mulheres que buscam desenvolvimento pessoal para uma nova fase. As rodadas são mistas, com quatro participantes.",
                ],
                [
                  "Como funciona a conversa inicial?",
                  "É uma conversa individual de aproximadamente 20–25 minutos para conhecer seu momento, esclarecer suas dúvidas e avaliar se a experiência faz sentido para você. As condições completas serão apresentadas antes de qualquer contratação.",
                ],
                [
                  "O que é individual e o que é coletivo?",
                  "A entrevista de 60 minutos é individual. O Jogo do Herói de 240 minutos e o plano de ação de 60 minutos são coletivos, com o mesmo grupo de quatro pessoas.",
                ],
                [
                  "Preciso conhecer o Jogo do Herói?",
                  "Não é necessário conhecer o jogo. A experiência é guiada, com perguntas e reflexões a partir dos desafios trazidos pelos participantes.",
                ],
                [
                  "Como funciona o apoio de IA?",
                  "A oferta inclui 30 dias de apoio de IA para reflexão e organização dos próximos passos. O canal, o início do período e as condições de acesso serão informados antes da compra. A IA pode errar e não substitui orientação profissional ou atendimento humano.",
                ],
                [
                  "Como conhecer o investimento e as condições?",
                  "Solicite informações pelo WhatsApp. Você receberá os detalhes da agenda, do investimento e das condições de participação antes de decidir contratar. O pedido de entrevista não constitui compra.",
                ],
                [
                  "Quando e onde acontecem os encontros?",
                  "Consulte a organização para conhecer as datas, os horários e o formato dos encontros antes de contratar.",
                ],
                [
                  "Preciso compartilhar informações pessoais com o grupo?",
                  "Você decide o que deseja compartilhar. A entrevista é individual. A participação coletiva exige respeito aos limites e à confidencialidade das histórias de outras pessoas; não há gravação autorizada por padrão.",
                ],
                [
                  "A Travessia substitui terapia?",
                  "Não. É uma proposta de desenvolvimento pessoal e não substitui acompanhamento médico, psicológico ou psiquiátrico. Não há promessa de cura ou de resultados garantidos.",
                ],
              ].map(([question, answer]) => (
                <details
                  key={question}
                  className="group border-b py-5"
                  style={{ borderColor: "var(--border)" }}
                >
                  <summary className="ds-focus cursor-pointer text-lg leading-relaxed">
                    {question}
                  </summary>
                  <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--sand)" }}>
                    {answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ============ MANIFESTO ============ */}
        <section
          id="manifesto"
          className="scroll-mt-24 py-20 md:py-28"
          style={{ backgroundColor: "var(--ink)" }}
        >
          <div className="container-editorial grid items-center gap-12 lg:grid-cols-2">
            <div className="reveal">
              <Eyebrow>o compromisso do ressurgente</Eyebrow>
              <p className="serif text-2xl md:text-3xl italic leading-snug">
                Eu deixo de me prender ao medo, assumo meu poder criador e uso minha intensidade
                para curar, prosperar e florescer.
              </p>
              <button onClick={() => setManifestoOpen(true)} className="ds-btn ds-btn-ghost mt-8">
                Ler o manifesto completo
              </button>
            </div>
            <div className="reveal-scale">
              <ReflectionNote />
            </div>
          </div>
        </section>

        {/* ============ CONVOCAÇÃO FINAL ============ */}
        <section id="convocacao" className="relative overflow-hidden py-24 md:py-32">
          <img
            src={horizon}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, var(--ink), rgba(13,15,14,0.8))" }}
          />
          <div className="container-editorial relative max-w-3xl text-center">
            <h2 className="text-display text-[clamp(2rem,5vw,4rem)] reveal">
              Vamos conversar sobre seu próximo passo?
            </h2>
            <p
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed reveal"
              style={{ color: "var(--sand)" }}
            >
              Conheça a proposta, esclareça suas dúvidas e avalie se esta Travessia faz sentido para
              sua próxima fase.
            </p>
            <a
              href={CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ds-btn ds-btn-primary mt-8 reveal"
            >
              Solicitar entrevista
            </a>
          </div>
        </section>

        <section className="py-16 border-t" aria-label="Privacidade e participação">
          <div
            className="container-editorial grid gap-10 md:grid-cols-2 text-sm leading-relaxed"
            style={{ color: "var(--sand)" }}
          >
            <div id="privacidade" className="scroll-mt-28">
              <h2 className="serif text-2xl text-ivory">Sua privacidade</h2>
              <p className="mt-4">
                Esta página não solicita relatos pessoais nem dados de pagamento. Se você iniciar
                uma conversa no WhatsApp, seu número e as informações que enviar ficarão disponíveis
                à organização para responder à sua solicitação. O WhatsApp possui suas próprias
                condições de privacidade.
              </p>
              <p className="mt-4">
                Evite enviar dados de saúde ou histórias de terceiros. Para dúvidas sobre o uso das
                informações compartilhadas ou pedidos de exclusão,{" "}
                <a className="underline ds-focus" href={CONTACT_URL}>
                  fale com a organização
                </a>
                .
              </p>
              <p className="mt-4">
                Antes das inscrições, serão apresentadas as informações completas sobre tratamento
                de dados, pagamento e apoio de IA. A entrevista individual não será enviada
                automaticamente ao grupo ou à IA.
              </p>
            </div>
            <div id="condicoes" className="scroll-mt-28">
              <h2 className="serif text-2xl text-ivory">Antes de participar</h2>
              <p className="mt-4">
                A entrevista é individual. O Jogo do Herói e o plano de ação são coletivos, em um
                grupo misto de quatro pessoas. O investimento e as condições serão apresentados
                antes da contratação.
              </p>
              <p className="mt-4">
                Antes da compra, você terá acesso às datas, ao formato, às regras de cancelamento e
                remarcação e às condições do apoio de IA. O contato pelo WhatsApp não constitui
                reserva ou compra.
              </p>
              <p className="mt-4">
                Respeite os limites e a confidencialidade do grupo. Gravações e uso de imagem ou de
                depoimentos exigem autorização específica. A proposta não garante resultados nem
                substitui cuidados de saúde.
              </p>
            </div>
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <footer
          className="border-t py-16"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--ink)" }}
        >
          <div className="container-editorial">
            <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
              <div>
                <div className="flex items-center gap-4">
                  <img
                    src={logoOriginal.url}
                    alt="Os Ressurgentes"
                    className="h-16 w-16 object-contain"
                    style={{ filter: "invert(1)" }}
                  />
                  <div>
                    <p
                      className="serif text-lg tracking-[0.24em] uppercase"
                      style={{ color: "var(--ivory)" }}
                    >
                      OS RESSURGENTES
                    </p>
                    <p className="serif mt-1 italic" style={{ color: "var(--sand)" }}>
                      o.gentólogo
                    </p>
                  </div>
                </div>
                <p
                  className="mt-6 max-w-sm text-sm leading-relaxed"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Descer ao fundo. Ressurgir transformado.
                </p>
              </div>
              <div>
                <p className="label-eyebrow mb-4">Navegar</p>
                <ul className="space-y-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
                  <li>
                    <a href="#limbo" className="hover:text-[color:var(--gold)]">
                      Para quem é
                    </a>
                  </li>
                  <li>
                    <a href="#duvidas" className="hover:text-[color:var(--gold)]">
                      Dúvidas práticas
                    </a>
                  </li>
                  <li>
                    <a href="#travessia" className="hover:text-[color:var(--gold)]">
                      Como funciona
                    </a>
                  </li>
                  <li>
                    <a href="#manifesto" className="hover:text-[color:var(--gold)]">
                      Manifesto
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="label-eyebrow mb-4">Entrar</p>
                <ul className="space-y-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
                  <li>
                    <a href={CONTACT_URL} className="hover:text-[color:var(--gold)]">
                      Solicitar entrevista
                    </a>
                  </li>
                  {launchConfig.instagram.map((account) => (
                    <li key={account.label}>
                      <a
                        href={account.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[color:var(--gold)]"
                      >
                        {account.label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="#privacidade" className="hover:text-[color:var(--gold)]">
                      Privacidade
                    </a>
                  </li>
                  <li>
                    <a href="#condicoes" className="hover:text-[color:var(--gold)]">
                      Condições de participação
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="mt-14 flex flex-col gap-4 border-t pt-8 text-xs md:flex-row md:items-center md:justify-between"
              style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
            >
              <p>
                © {new Date().getFullYear()} OS RESSURGENTES · o.gentólogo. Todos os direitos
                reservados.
              </p>
              <p className="max-w-md md:text-right">
                Este trabalho não substitui acompanhamento médico, psicológico ou psiquiátrico.
              </p>
            </div>
          </div>
        </footer>

        <ManifestoModal open={manifestoOpen} onClose={() => setManifestoOpen(false)} />
      </div>
    </div>
  );
}
