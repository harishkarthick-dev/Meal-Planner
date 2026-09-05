"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Menu,
  Plus,
  ShoppingBasket,
  Sparkles,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";

import { useAuth } from "@/components/providers/AuthProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils/cn";

const EASE = [0.19, 1, 0.22, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const NAV = [
  { label: "Why Plately", href: "#why" },
  { label: "How it works", href: "#how" },
  { label: "Questions", href: "#faq" },
];

const TICKER = [
  "Taco Tuesdays",
  "Sheet-pan Sundays",
  "Leftovers, remixed",
  "One shared list",
  "Meatless Mondays",
  "Weeknight 30-min",
  "Pantry, not panic",
  "Everyone in the loop",
];

const WEEK = [
  {
    day: "Mon",
    meal: "Lemon herb pasta",
    time: "25 min",
    tone: "bg-[#EAF0E4]",
  },
  {
    day: "Tue",
    meal: "Black bean tacos",
    time: "30 min",
    tone: "bg-[#F6E9D6]",
  },
  {
    day: "Wed",
    meal: "Coconut lentil soup",
    time: "35 min",
    tone: "bg-[#E7EEEA]",
  },
];

const CHIPS = [
  { label: "🍅 tomatoes", className: "left-[-3%] top-[14%]", delay: 0 },
  { label: "🧄 garlic", className: "right-[-4%] top-[6%]", delay: 0.6 },
  { label: "🌿 basil", className: "right-[2%] bottom-[16%]", delay: 1.2 },
  { label: "🥥 coconut milk", className: "left-[-6%] bottom-[8%]", delay: 1.8 },
];

function handleAnchor(
  event: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  after?: () => void,
) {
  if (!href.startsWith("#")) return;
  event.preventDefault();
  after?.();
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  window.history.pushState(null, "", href);
}

function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid h-9 w-9 place-items-center rounded-[0.85rem] bg-[#1F3A2E] text-[#F4EEDF]">
        <UtensilsCrossed className="h-[18px] w-[18px]" strokeWidth={2.2} />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#E0632E] ring-2 ring-[#F3EEE3] dark:ring-[#12201A]" />
      </span>
      <span className="font-display text-[1.55rem] font-semibold leading-none tracking-[-0.03em] text-[#1B3226] dark:text-[#F1ECDD]">
        Plately
      </span>
    </span>
  );
}

function Cta({
  href,
  children,
  variant = "solid",
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-7 text-[15px] font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0632E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3EEE3] dark:focus-visible:ring-offset-[#12201A]",
        variant === "solid" &&
          "bg-[#1F3A2E] text-[#F4EEDF] shadow-[0_1px_0_#2c5040,0_18px_36px_-16px_rgba(31,58,46,0.6)] hover:-translate-y-0.5 hover:bg-[#173025] dark:bg-[#E0632E] dark:text-[#1a0d06] dark:hover:bg-[#e97440]",
        variant === "ghost" &&
          "text-[#3a4a41] hover:text-[#1B3226] dark:text-[#C7D2C9] dark:hover:text-white",
        className,
      )}
    >
      {children}
      <ArrowRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

function Ticker() {
  const row = [...TICKER, ...TICKER];
  return (
    <div className="marquee-mask overflow-hidden border-y border-[#1F3A2E]/12 bg-[#1F3A2E] py-3.5 dark:border-white/10">
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-lg italic text-[#F4EEDF]">
              {item}
            </span>
            <span className="text-[#E0632E]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function IllustratedPlate({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 280" className={className} aria-hidden fill="none">
      <ellipse cx="140" cy="150" rx="118" ry="108" fill="#E8D9B8" />
      <ellipse cx="140" cy="146" rx="102" ry="92" fill="#F7F1E4" />
      <ellipse
        cx="140"
        cy="146"
        rx="72"
        ry="64"
        fill="#FBF7EE"
        stroke="#D8C9A6"
      />
      <ellipse cx="128" cy="132" rx="18" ry="16" fill="#E0632E" />
      <ellipse cx="158" cy="138" rx="16" ry="14" fill="#C45A28" />
      <path
        d="M96 150c18-22 42-18 58 4 8-20 28-24 40-8"
        stroke="#5A8F6A"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="188" cy="128" r="5" fill="#5A8F6A" />
      <ellipse cx="112" cy="168" rx="22" ry="8" fill="#E8B84A" opacity="0.9" />
    </svg>
  );
}

function PlanCard() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 34, rotate: reduce ? 0 : -1.4 }}
      animate={{ opacity: 1, y: 0, rotate: reduce ? 0 : -1.4 }}
      transition={{ duration: 1, delay: 0.2, ease: EASE }}
      className="relative mx-auto w-full max-w-[540px]"
    >
      <IllustratedPlate className="pointer-events-none absolute -right-10 -top-16 w-40 opacity-90 lg:w-52" />
      {!reduce &&
        CHIPS.map((chip) => (
          <div
            key={chip.label}
            style={{ animationDelay: `${chip.delay}s` }}
            className={cn(
              "animate-floaty absolute z-20 hidden rounded-full border border-[#e3dccb] bg-[#FBF8F0] px-3.5 py-2 text-[13px] font-semibold text-[#40503f] shadow-[0_12px_28px_-14px_rgba(31,58,46,0.5)] dark:border-white/10 dark:bg-[#1c2c24] dark:text-[#d8e0d6] lg:block",
              chip.className,
            )}
          >
            {chip.label}
          </div>
        ))}

      <div className="pointer-events-none absolute -right-8 -top-10 hidden text-[#E0632E] lg:block">
        <svg width="96" height="82" viewBox="0 0 96 82" fill="none" aria-hidden>
          <path
            d="M5 74C22 50 40 62 52 40 60 26 58 14 52 4M66 72C70 50 80 40 92 34"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative overflow-hidden rounded-[1.9rem] border border-[#e3ddcd] bg-[#FCFAF3] shadow-[0_40px_90px_-40px_rgba(31,58,46,0.55)] dark:border-white/10 dark:bg-[#16241D]">
        <div className="flex items-center justify-between border-b border-[#ece6d6] px-6 py-5 dark:border-white/10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#9a9683]">
              This week
            </p>
            <p className="mt-1 font-display text-[22px] font-semibold leading-none tracking-[-0.02em] text-[#1F3A2E] dark:text-[#F1ECDD]">
              Dinner, sorted.
            </p>
          </div>
          <div className="flex -space-x-2.5">
            {[
              ["A", "bg-[#E0632E] text-white"],
              ["J", "bg-[#7fa07f] text-[#12261a]"],
              ["+2", "bg-[#ece6d6] text-[#6b6754]"],
            ].map(([label, cls]) => (
              <span
                key={label}
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full border-2 border-[#FCFAF3] text-[11px] font-bold dark:border-[#16241D]",
                  cls,
                )}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-2.5">
            {WEEK.map((item) => (
              <div
                key={item.day}
                className="group flex items-center gap-3 rounded-2xl border border-[#ece6d6] bg-white p-3 transition-colors hover:border-[#d7cdb4] dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div
                  className={cn(
                    "grid h-12 w-12 shrink-0 place-items-center rounded-xl",
                    item.tone,
                  )}
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#41523f]">
                    {item.day}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-[#22352b] dark:text-[#EDEAdd]">
                    {item.meal}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-[#8b8874]">
                    <Clock3 className="h-3 w-3" /> {item.time}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#bcb7a2] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            ))}
            <div className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#d5cbb2] py-3 text-[12px] font-semibold text-[#6c7663] dark:border-white/15 dark:text-[#9fb0a0]">
              <Plus className="h-3.5 w-3.5" /> Add Thursday
            </div>
          </div>

          <div className="rounded-2xl bg-[#1F3A2E] p-4 text-white">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50">
                  Groceries
                </p>
                <p className="mt-1 font-display text-lg font-semibold">
                  12 items
                </p>
              </div>
              <ShoppingBasket className="h-5 w-5 text-[#cdd8cb]" />
            </div>
            <div className="space-y-2.5">
              {["Tomatoes", "Black beans", "Coconut milk", "Basil"].map(
                (item, i) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "grid h-4 w-4 place-items-center rounded-full border",
                        i < 2
                          ? "border-[#E0632E] bg-[#E0632E]"
                          : "border-white/25",
                      )}
                    >
                      {i < 2 && (
                        <Check className="h-2.5 w-2.5 text-[#1F3A2E]" />
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-[12px]",
                        i < 2 ? "text-white/40 line-through" : "text-white/85",
                      )}
                    >
                      {item}
                    </span>
                  </div>
                ),
              )}
            </div>
            <p className="mt-4 border-t border-white/10 pt-3 text-[10px] leading-relaxed text-white/45">
              Synced with your household
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function WhyCard({
  index,
  icon: Icon,
  title,
  body,
  className,
}: {
  index: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <motion.article
      variants={rise}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-[1.6rem] border border-[#e3ddcd] bg-[#FCFAF3] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#d3c8ac] hover:shadow-[0_30px_60px_-38px_rgba(31,58,46,0.55)] dark:border-white/10 dark:bg-[#16241D]",
        className,
      )}
    >
      <div className="mb-10 flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1F3A2E]/8 text-[#1F3A2E] transition-colors group-hover:bg-[#E0632E] group-hover:text-white dark:bg-white/8 dark:text-[#cdd8cb]">
          <Icon className="h-5 w-5" />
        </span>
        <span className="font-mono text-[11px] tracking-widest text-[#b3ae9b]">
          {index}
        </span>
      </div>
      <div>
        <h3 className="font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-[#1B3226] dark:text-[#F1ECDD]">
          {title}
        </h3>
        <p className="mt-3 text-[14.5px] leading-7 text-[#6b7568] dark:text-[#a6b2a7]">
          {body}
        </p>
      </div>
    </motion.article>
  );
}

export default function LandingPageClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push("/today");
  }, [user, loading, router]);

  if (user) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F3EEE3] font-sans text-[#22352b] selection:bg-[#E0632E]/25 dark:bg-[#12201A] dark:text-[#EDEAdd]">
      <div className="pointer-events-none fixed inset-0 z-[1] bg-grain opacity-[0.04] mix-blend-multiply dark:opacity-[0.06] dark:mix-blend-screen" />

      {/* ---------- Nav ---------- */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#1F3A2E]/10 bg-[#F3EEE3]/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#12201A]/85">
        <div className="mx-auto flex h-[74px] max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="Plately home">
            <Wordmark />
          </Link>

          <nav
            className="hidden items-center gap-9 md:flex"
            aria-label="Main navigation"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleAnchor(e, item.href)}
                className="relative text-[14px] font-medium text-[#4c5a4f] transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-[#E0632E] after:transition-all hover:text-[#1B3226] hover:after:w-full dark:text-[#b7c2b8] dark:hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle className="border-[#d8d0bd] bg-transparent dark:border-white/15 dark:bg-transparent" />
            <Link
              href="/login"
              className="px-2 text-[14px] font-semibold text-[#3a4a41] transition-colors hover:text-[#1B3226] dark:text-[#C7D2C9] dark:hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-[#1F3A2E] px-5 py-2.5 text-[14px] font-semibold text-[#F4EEDF] transition-colors hover:bg-[#173025] dark:bg-[#E0632E] dark:text-[#1a0d06] dark:hover:bg-[#e97440]"
            >
              Start free
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle className="border-[#d8d0bd] bg-transparent dark:border-white/15 dark:bg-transparent" />
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full text-[#284034] dark:text-white"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-[#1F3A2E]/10 bg-[#F3EEE3] px-5 py-5 dark:border-white/10 dark:bg-[#12201A] md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) =>
                    handleAnchor(e, item.href, () => setMenuOpen(false))
                  }
                  className="rounded-xl px-3 py-3 text-[15px] font-medium hover:bg-[#1F3A2E]/[0.05] dark:hover:bg-white/[0.06]"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[#1F3A2E]/10 pt-4 dark:border-white/10">
                <Link
                  href="/login"
                  className="grid min-h-11 place-items-center rounded-full border border-[#d3cab3] text-sm font-semibold dark:border-white/15"
                >
                  Log in
                </Link>
                <Link
                  href="/login"
                  className="grid min-h-11 place-items-center rounded-full bg-[#1F3A2E] text-sm font-semibold text-[#F4EEDF] dark:bg-[#E0632E] dark:text-[#1a0d06]"
                >
                  Start free
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </header>

      <main className="relative z-10">
        {/* ---------- Hero ---------- */}
        <section className="relative px-5 pb-16 pt-32 sm:px-8 sm:pt-40 lg:pb-24">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(224,99,46,0.13),transparent_70%)] blur-2xl dark:bg-[radial-gradient(circle,rgba(224,99,46,0.16),transparent_70%)]"
          />
          <div className="relative mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.span
                variants={rise}
                className="inline-flex items-center gap-2.5 rounded-full border border-[#1F3A2E]/15 bg-[#FCFAF3]/70 py-1.5 pl-2 pr-4 text-[12px] font-semibold text-[#3f5044] dark:border-white/15 dark:bg-white/5 dark:text-[#c1ccc2]"
              >
                <span className="rounded-full bg-[#E0632E] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  New
                </span>
                A calmer way to answer “what’s for dinner?”
              </motion.span>

              <motion.h1
                variants={rise}
                className="mt-7 font-display text-[3.35rem] font-semibold leading-[0.95] tracking-[-0.035em] text-[#1B3226] dark:text-[#F1ECDD] sm:text-[4.25rem] lg:text-[5rem]"
              >
                Dinner,
                <br />
                <span className="relative inline-block italic text-[#E0632E]">
                  actually
                  <svg
                    className="absolute -bottom-3 left-0 w-full text-[#E0632E]"
                    viewBox="0 0 300 20"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M3 14C60 4 120 4 180 9c40 3 80 5 116-2"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                figured out.
              </motion.h1>

              <motion.p
                variants={rise}
                className="mt-8 max-w-lg text-[17px] leading-8 text-[#59665a] dark:text-[#a9b5aa]"
              >
                Plan the week, build one shared grocery list, and keep your
                whole household on the same page — without another fiddly system
                to babysit.
              </motion.p>

              <motion.div
                variants={rise}
                className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <Cta href="/login">Plan your first week</Cta>
                <Cta
                  href="#how"
                  variant="ghost"
                  onClick={(e) => handleAnchor(e, "#how")}
                >
                  See how it works
                </Cta>
              </motion.div>

              <motion.div
                variants={rise}
                className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[#6d7a6e] dark:text-[#8ea08f]"
              >
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#3f7a53]" /> Free to start
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#3f7a53]" /> No credit card
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#3f7a53]" /> Works offline
                </span>
              </motion.div>
            </motion.div>

            <PlanCard />
          </div>
        </section>

        <Ticker />

        {/* ---------- Why ---------- */}
        <section id="why" className="scroll-mt-24 px-5 py-24 sm:px-8 lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-90px" }}
            variants={stagger}
            className="mx-auto max-w-[1200px]"
          >
            <motion.div variants={rise} className="mb-14 max-w-2xl">
              <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#E0632E]">
                Why Plately
              </p>
              <h2 className="mt-4 font-display text-[2.6rem] font-semibold leading-[1.03] tracking-[-0.03em] text-[#1B3226] dark:text-[#F1ECDD] sm:text-[3.25rem]">
                The helpful parts of planning.{" "}
                <span className="italic text-[#4c6a58] dark:text-[#9fc0aa]">
                  None of the busywork.
                </span>
              </h2>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-6">
              <WhyCard
                index="01"
                icon={Sparkles}
                title="A week you can see"
                body="Lay out breakfast, lunch, or dinner at a glance and leave the rest uncluttered. No overwhelm, just this week."
                className="md:col-span-3"
              />
              <WhyCard
                index="02"
                icon={ShoppingBasket}
                title="A list that writes itself"
                body="Every planned meal rolls into one tidy grocery list you can check off from any phone at the store."
                className="md:col-span-3"
              />
              <WhyCard
                index="03"
                icon={Users}
                title="Shared, not shouldered"
                body="Invite the people you live with so deciding and shopping stop landing on one person every single night."
                className="md:col-span-2"
              />
              <WhyCard
                index="04"
                icon={UtensilsCrossed}
                title="Ideas when you're stuck"
                body="Out of inspiration? Ask for realistic meal ideas that fit your time, tastes, and what you already have."
                className="md:col-span-4"
              />
            </div>
          </motion.div>
        </section>

        {/* ---------- How it works ---------- */}
        <section
          id="how"
          className="relative scroll-mt-20 overflow-hidden bg-[#1F3A2E] px-5 py-24 text-[#F4EEDF] sm:px-8 lg:py-32"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-[#E0632E]/20 blur-3xl"
          />
          <div className="relative mx-auto max-w-[1200px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={rise}
              className="mb-16 max-w-2xl"
            >
              <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#f0a887]">
                How it works
              </p>
              <h2 className="mt-4 font-display text-[2.6rem] font-semibold leading-[1.03] tracking-[-0.03em] sm:text-[3.25rem]">
                A few minutes now.{" "}
                <span className="italic text-[#bcd3c1]">
                  Fewer decisions later.
                </span>
              </h2>
            </motion.div>

            <motion.ol
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-70px" }}
              variants={stagger}
              className="grid gap-8 md:grid-cols-3"
            >
              {[
                {
                  n: "01",
                  t: "Add a few meals",
                  d: "Drop in favourites, save a new recipe, or start from a suggestion. Ten minutes, tops.",
                },
                {
                  n: "02",
                  t: "Invite your household",
                  d: "Everyone sees the same plan and can tweak it as the week inevitably changes.",
                },
                {
                  n: "03",
                  t: "Take the list to go",
                  d: "Shop from one shared checklist, then just cook. No more “what brand of milk?” texts.",
                },
              ].map((step) => (
                <motion.li key={step.n} variants={rise} className="relative">
                  <span className="font-display text-[3.5rem] font-semibold leading-none text-[#E0632E]">
                    {step.n}
                  </span>
                  <h3 className="mt-4 font-display text-[1.55rem] font-semibold tracking-[-0.02em]">
                    {step.t}
                  </h3>
                  <p className="mt-3 max-w-xs text-[14.5px] leading-7 text-[#c4d0c5]">
                    {step.d}
                  </p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section id="faq" className="scroll-mt-20 px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[0.6fr_1.4fr]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={rise}
            >
              <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#E0632E]">
                Good to know
              </p>
              <h2 className="mt-4 font-display text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#1B3226] dark:text-[#F1ECDD]">
                A few common questions.
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="border-t border-[#1F3A2E]/12 dark:border-white/10"
            >
              {[
                [
                  "Can I use my own meals and recipes?",
                  "Absolutely. Add the meals your household already loves, save recipes, and reuse them in future weeks.",
                ],
                [
                  "Can my partner or housemate edit the plan?",
                  "Yes — Plately is built around a shared household. Invited members can plan and update the grocery list together in real time.",
                ],
                [
                  "Does it work on my phone at the store?",
                  "Yes. It installs as an app and works offline, so your list is right there in the aisle even without signal.",
                ],
                [
                  "Is Plately really free?",
                  "You can create an account and start planning for free. No credit card required to get going.",
                ],
              ].map(([q, a]) => (
                <motion.details
                  key={q}
                  variants={rise}
                  className="group border-b border-[#1F3A2E]/12 dark:border-white/10"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left font-display text-[1.3rem] font-semibold text-[#22352b] transition-colors group-open:text-[#1B3226] hover:text-[#E0632E] dark:text-[#EDEAdd] [&::-webkit-details-marker]:hidden">
                    {q}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#1F3A2E]/20 text-[#3f5044] transition-transform duration-300 group-open:rotate-45 group-open:border-[#E0632E] group-open:text-[#E0632E] dark:border-white/20 dark:text-[#c1ccc2]">
                      <Plus className="h-4 w-4" />
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-7 pr-10 text-[15px] leading-7 text-[#647063] dark:text-[#a6b2a7]">
                    {a}
                  </p>
                </motion.details>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="px-5 pb-10 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[2.2rem] border border-[#1F3A2E]/10 bg-[#FCFAF3] px-6 py-16 text-center dark:border-white/10 dark:bg-[#16241D] sm:px-12 lg:py-20"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-16 mx-auto h-56 w-56 rounded-full bg-[#E0632E]/15 blur-3xl"
            />
            <p className="relative text-[12px] font-bold uppercase tracking-[0.22em] text-[#E0632E]">
              Set the table
            </p>
            <h2 className="relative mx-auto mt-5 max-w-2xl font-display text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.03em] text-[#1B3226] dark:text-[#F1ECDD] sm:text-[3.5rem]">
              More time at the table.{" "}
              <span className="italic text-[#4c6a58] dark:text-[#9fc0aa]">
                Less at the fridge, guessing.
              </span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-lg text-[15.5px] leading-7 text-[#647063] dark:text-[#a6b2a7]">
              Your first week takes just a few minutes to set up.
            </p>
            <div className="relative mt-9 flex justify-center">
              <Cta href="/login">Start planning for free</Cta>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="relative z-10 px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 border-t border-[#1F3A2E]/12 pt-8 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <Wordmark />
          <p className="text-[13px] text-[#7a8579] dark:text-[#8b9789]">
            © 2026 Plately · Less planning around dinner, more dinner.
          </p>
          <div className="flex gap-6 text-[13px] font-medium text-[#5c6a5d] dark:text-[#a6b2a7]">
            <a
              href="mailto:hello@plately.app"
              className="transition-colors hover:text-[#E0632E]"
            >
              Contact
            </a>
            <Link
              href="/login"
              className="transition-colors hover:text-[#E0632E]"
            >
              Log in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
