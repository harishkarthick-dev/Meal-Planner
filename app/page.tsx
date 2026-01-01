"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  ShoppingCart,
  Smile,
  Star,
  Check,
  Menu,
  X,
  ChefHat,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/components/providers/AuthProvider";
import confetti from "canvas-confetti";
import { animate } from "framer-motion";

// --- Animations ---
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// --- Components ---

function Section({
  className,
  children,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className={cn(
        "relative py-20 px-6 md:px-12 max-w-7xl mx-auto",
        className,
      )}
    >
      {children}
    </motion.section>
  );
}

function Button({
  className,
  variant = "primary",
  children,
  href,
  onClick,
}: {
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const variants = {
    primary:
      "bg-dusty-rose text-white hover:bg-dusty-rose/90 shadow-lg shadow-dusty-rose/20",
    secondary:
      "bg-soft-sage text-white hover:bg-soft-sage/90 shadow-lg shadow-soft-sage/20",
    outline: "border-2 border-soft-sage text-soft-sage hover:bg-soft-sage/10",
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center px-8 py-4 rounded-full font-bold transition-all transform hover:-translate-y-1 duration-200",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}

function BenefitCard({
  icon: Icon,
  title,
  desc,
  delay,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-card p-8 rounded-3xl shadow-xl shadow-warm-white/50 dark:shadow-none border border-stone-100 dark:border-stone-800 hover:shadow-2xl hover:shadow-soft-sage/10 transition-shadow"
      variants={fadeInUp}
      whileHover={{ y: -5 }}
    >
      <div className="w-14 h-14 rounded-2xl bg-soft-sage/20 flex items-center justify-center text-soft-sage mb-6">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-text-dark dark:text-foreground mb-3">
        {title}
      </h3>
      <p className="text-stone-500 dark:text-stone-400 leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}

function StepCard({
  number,
  title,
  desc,
  imageSrc,
}: {
  number: string;
  title: string;
  desc: string;
  imageSrc?: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className="flex flex-col items-center text-center p-6 relative group"
    >
      <div className="relative w-32 h-32 mb-6 transition-transform duration-300 group-hover:scale-105">
        {imageSrc ? (
          <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-white shadow-md">
            <Image src={imageSrc} alt={title} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-warm-white dark:bg-stone-800 border-4 border-soft-sage flex items-center justify-center text-2xl font-bold text-soft-sage z-10 relative mx-auto mt-8">
            {number}
          </div>
        )}
        {!imageSrc && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-soft-sage text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
            {number}
          </div>
        )}
        {imageSrc && (
          <div className="absolute -top-3 -right-3 w-10 h-10 bg-white dark:bg-stone-800 text-soft-sage border-4 border-soft-sage rounded-full flex items-center justify-center font-bold text-lg shadow-sm z-20">
            {number}
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold text-text-dark dark:text-foreground mb-3">
        {title}
      </h3>
      <p className="text-stone-500 dark:text-stone-400">{desc}</p>
    </motion.div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
  delay,
  imageSrc,
}: {
  quote: string;
  author: string;
  role: string;
  delay: number;
  imageSrc?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      variants={fadeInUp}
      whileHover={{ scale: 1.02 }}
      className="bg-warm-white dark:bg-card p-8 rounded-3xl border border-stone-100 dark:border-stone-800 relative"
    >
      <div className="text-dusty-rose text-6xl absolute -top-4 -left-2 opacity-20 font-serif">
        &quot;
      </div>
      <p className="text-text-dark/80 dark:text-white/90 text-lg italic mb-6 relative z-10 leading-relaxed">
        {quote}
      </p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-muted-lavender/30 flex items-center justify-center text-muted-lavender font-bold overflow-hidden relative">
          {imageSrc ? (
            <Image src={imageSrc} alt={author} fill className="object-cover" />
          ) : (
            author[0]
          )}
        </div>
        <div>
          <div className="font-bold text-text-dark dark:text-white">
            {author}
          </div>
          <div className="text-sm text-stone-500">{role}</div>
        </div>
      </div>
    </motion.div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-6 text-left"
      >
        <h3 className="font-bold text-lg text-text-dark dark:text-foreground">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <X className="w-5 h-5 text-soft-sage rotate-45" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-6 text-stone-600 dark:text-stone-400">{answer}</p>
      </motion.div>
    </div>
  );
}

function FloatingBlobs() {
  return (
    <>
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 w-72 h-72 bg-soft-sage/20 rounded-full blur-3xl -z-10"
      />
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 100, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-dusty-rose/20 rounded-full blur-3xl -z-10"
      />
    </>
  );
}

function CountUp({ from, to }: { from: number; to: number }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const controls = animate(from, to, {
      duration: 2,
      onUpdate: (value) => setCount(Math.floor(value)),
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [from, to]);

  return <span>{count.toLocaleString()}</span>;
}

// --- Page ---

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/today");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white dark:bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-soft-sage"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-warm-white dark:bg-background font-sans text-text-dark dark:text-foreground selection:bg-soft-sage/30">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 h-20 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-soft-sage flex items-center justify-center text-white shadow-md group-hover:rotate-6 transition-transform">
              <ChefHat className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-text-dark dark:text-white">
              MealPlan<span className="text-soft-sage">Joy</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#how-it-works"
              className="text-stone-500 dark:text-stone-400 hover:text-soft-sage font-medium transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" });
                window.history.pushState(null, "", "#how-it-works");
              }}
            >
              How it Works
            </Link>
            <Link
              href="#testimonials"
              className="text-stone-500 dark:text-stone-400 hover:text-soft-sage font-medium transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("testimonials")
                  ?.scrollIntoView({ behavior: "smooth" });
                window.history.pushState(null, "", "#testimonials");
              }}
            >
              Stories
            </Link>
            <Link
              href="/login"
              className="text-stone-500 dark:text-stone-400 hover:text-soft-sage font-medium transition-colors"
            >
              Log In
            </Link>
            <ThemeToggle />
            <Button href="/login" className="px-6 py-2 text-sm">
              Start Free Trial
            </Button>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text-dark dark:text-foreground p-2"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute top-20 left-0 right-0 bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800 p-6 flex flex-col gap-4 shadow-xl md:hidden origin-top"
          >
            <Link
              href="#how-it-works"
              className="py-2 text-stone-600 dark:text-stone-300"
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" });
                window.history.pushState(null, "", "#how-it-works");
              }}
            >
              How it Works
            </Link>
            <Link
              href="#testimonials"
              className="py-2 text-stone-600 dark:text-stone-300"
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                document
                  .getElementById("testimonials")
                  ?.scrollIntoView({ behavior: "smooth" });
                window.history.pushState(null, "", "#testimonials");
              }}
            >
              Stories
            </Link>
            <Link
              href="/login"
              className="py-2 text-stone-600 dark:text-stone-300"
            >
              Log In
            </Link>
            <Button href="/login" className="w-full justify-center">
              Start Free Trial
            </Button>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <div className="pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden relative">
        <FloatingBlobs />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-soft-sage/10 text-soft-sage font-bold text-sm mb-6 tracking-wide">
              👋 Hey Mama, welcome to stress-free dinners
            </span>
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 text-text-dark dark:text-foreground"
            >
              Say Goodbye to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-soft-sage to-dusty-rose">
                &quot;What&apos;s for Dinner?&quot;
              </span>{" "}
              Stress
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-stone-500 dark:text-stone-400 mb-8 leading-relaxed max-w-lg"
            >
              Planning family meals just got easier. Save time, reduce waste,
              and bring joy back to your kitchen table—all in just 5 minutes a
              week.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                href="/login"
                onClick={(e) => {
                  /* Optional: e.preventDefault() if we want to stay on page to see confetti */
                  const rect = (
                    e.target as HTMLElement
                  ).getBoundingClientRect();
                  const x = (rect.left + rect.width / 2) / window.innerWidth;
                  const y = (rect.top + rect.height / 2) / window.innerHeight;
                  confetti({
                    origin: { x, y },
                    particleCount: 100,
                    spread: 70,
                    colors: ["#8FB9AA", "#E5989B", "#FDFBF7"],
                  });
                }}
              >
                Start Your Free Week Plan{" "}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                href="#how-it-works"
                variant="outline"
                className="border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-text-dark"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" });
                  window.history.pushState(null, "", "#how-it-works");
                }}
              >
                See How It Works
              </Button>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="mt-8 flex items-center gap-4 text-sm text-stone-400"
            >
              <div className="flex -space-x-2">
                {[
                  "/avatar-sarah.png",
                  "/avatar-jessica.png",
                  "/avatar-emily.png",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative"
                  >
                    <Image
                      src={src}
                      alt="Trusted user"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p>
                Trusted by{" "}
                <span className="font-bold text-soft-sage">
                  <CountUp from={0} to={10000} />+
                </span>{" "}
                happy families
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-soft-sage/20 rounded-[3rem] rotate-6 transform translate-x-4 translate-y-4 -z-10" />
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
              {/* Using the generated image */}
              <Image
                src="/hero-mom.png"
                alt="Happy mom planning meals"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Floaties */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-card p-4 rounded-2xl shadow-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-soft-sage/20 flex items-center justify-center text-green-600 dark:text-soft-sage">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-text-dark dark:text-foreground">
                  Weekly Plan
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Done in 5 mins
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Emotional Intro */}
      <Section className="text-center max-w-4xl">
        <motion.div variants={fadeInUp}>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-text-dark dark:text-foreground">
            You Deserve a Dinnertime That{" "}
            <span className="text-dusty-rose">Doesn’t Drain You</span>
          </h2>
          <p className="text-xl text-stone-500 dark:text-stone-400 leading-relaxed mb-8">
            We know the drill. It’s 5 PM, everyone is hungry, the fridge is
            chaotic, and you have zero energy left to decide what to cook.
            <br className="hidden md:block" /> You want to feed your family
            well, but the mental load feels like a second full-time job.
          </p>
          <p className="text-xl font-medium text-soft-sage">
            It doesn’t have to be this way.
          </p>
        </motion.div>
      </Section>

      {/* Benefits */}
      <Section className="bg-white dark:bg-stone-900 rounded-[3rem] my-12 transition-colors">
        <div className="text-center mb-16">
          <motion.span
            variants={fadeInUp}
            className="text-soft-sage font-bold tracking-wider uppercase text-sm"
          >
            Why Moms Love Us
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl font-bold mt-2 text-text-dark dark:text-foreground"
          >
            Reclaim Your Evenings
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <BenefitCard
            delay={0.1}
            icon={Clock}
            title="Reclaim Your Time"
            desc="Stop spending hours scrolling for recipes. Drag, drop, and done. Plan your entire week’s menu in the time it takes to drink your coffee."
          />
          <BenefitCard
            delay={0.2}
            icon={ShoppingCart}
            title="Shop in a Snap"
            desc="Forget forgotten ingredients. We turn your meal plan into a smart grocery list automatically. One click, and you’re ready to shop."
          />
          <BenefitCard
            delay={0.3}
            icon={Smile}
            title="Cook with Calm"
            desc="No more last-minute panic. With a plan in hand, you walk into the kitchen with confidence. Turn on some music and actually enjoy cooking."
          />
        </div>
      </Section>

      {/* Features */}
      <Section>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-text-dark dark:text-foreground">
              Designed for Real Life <br /> (and Real Moms)
            </h2>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-dusty-rose/10 flex items-center justify-center text-dusty-rose flex-shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-text-dark dark:text-foreground">
                  Smart Recipe Importing
                </h3>
                <p className="text-stone-500 dark:text-stone-400">
                  Found a recipe you love on a blog? Save it to your plan in
                  seconds. No more lost bookmarks.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-cozy-clay/10 flex items-center justify-center text-cozy-clay flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-text-dark dark:text-foreground">
                  Family Sharing
                </h3>
                <p className="text-stone-500 dark:text-stone-400">
                  Sync with your partner instantly. Let them handle the store
                  run without the &quot;what brand of milk?&quot; calls.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button href="/login" variant="secondary">
                Check Out All Features
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 mt-8">
              <div className="relative rounded-2xl h-40 w-full overflow-hidden shadow-lg hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src="/feature-import.png"
                  alt="Recipe Import"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative rounded-2xl h-56 w-full overflow-hidden shadow-lg hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src="/feature-sharing.png"
                  alt="Family Sharing"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative rounded-2xl h-56 w-full overflow-hidden shadow-lg hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src="/feature-groceries.png"
                  alt="Pantry Tracker"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative rounded-2xl h-40 w-full overflow-hidden shadow-lg hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src="/feature-mom.png"
                  alt="Peace of Mind"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section
        id="testimonials"
        className="bg-warm-white dark:bg-background transition-colors"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text-dark dark:text-foreground">
            Moms Who Made the Switch
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <TestimonialCard
            delay={0.1}
            author="Sarah"
            role="Mom of 3"
            imageSrc="/avatar-sarah.png"
            quote="I used to dread 5 PM daily. Now, I have my plan done on Sunday, and I feel like a supermom all week."
          />
          <TestimonialCard
            delay={0.2}
            author="Jessica"
            role="Toddler Mom"
            imageSrc="/avatar-jessica.png"
            quote="Finally, an app that isn't complicated. It feels like it was built by someone who actually cooks for a family."
          />
          <TestimonialCard
            delay={0.3}
            author="Emily"
            role="Working Mom"
            imageSrc="/avatar-emily.png"
            quote="The peace of mind I get from knowing dinner is handled? Priceless. It’s the best thing I’ve done for my sanity."
          />
        </div>
      </Section>

      {/* How It Works */}
      <Section
        id="how-it-works"
        className="bg-white dark:bg-stone-900 rounded-[3rem] py-24 transition-colors"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text-dark dark:text-foreground">
            From Chaos to Calm in 4 Steps
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="hidden md:block absolute top-[2.5rem] left-16 right-16 h-1.5 bg-gradient-to-r from-soft-sage/50 to-dusty-rose/50 origin-left -z-0 rounded-full"
          />

          <StepCard
            number="1"
            imageSrc="/step-1.png"
            title="Tap & Plan"
            desc="Enter your favorites or explore our ideas into your calendar."
          />
          <StepCard
            number="2"
            imageSrc="/step-2.png"
            title="Auto-List"
            desc="Watch as your grocery list builds itself magically."
          />
          <StepCard
            number="3"
            imageSrc="/step-3.png"
            title="Shop & Prep"
            desc="Hit the store with a sorted list, or send it to your partner."
          />
          <StepCard
            number="4"
            imageSrc="/step-4.png"
            title="Enjoy Dinner"
            desc="Cook without stress and enjoy the extra family time."
          />
        </div>
      </Section>

      {/* FAQ */}
      <Section className="max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-text-dark dark:text-foreground">
          Questions Other Moms Ask
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "Is this easier than a paper planner?",
              a: "100%. A paper planner doesn’t make your grocery list for you, and you can’t share it instantly with your partner’s phone. Plus, this one fits in your pocket!",
            },
            {
              q: "Can I use my own recipes?",
              a: "Absolutely! You can add your own family favorites or import them from the web. It’s your personalized cookbook.",
            },
            {
              q: "Is there a free version?",
              a: "Yes! You can start for free and use the core features forever. We also have a premium plan for power-planners who want advanced features.",
            },
          ].map((item, i) => (
            <FAQItem key={i} question={item.q} answer={item.a} />
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-soft-sage text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready for Stress-Free Dinners?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of happy moms who have taken back their evenings.
            Setup takes less than 2 minutes.
          </p>
          <Button
            href="/login"
            className="bg-white text-soft-sage hover:bg-warm-white shadow-xl"
          >
            Start Your Free Week Plan
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-background py-12 px-6 border-t border-stone-100 dark:border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-soft-sage flex items-center justify-center text-white">
              <ChefHat className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-text-dark dark:text-foreground">
              MealPlan<span className="text-soft-sage">Joy</span>
            </span>
          </div>
          <div className="text-stone-400 text-sm">
            © 2026 Meal Plan App. Crafted with ❤️ for families.
          </div>
          <div className="flex gap-6 text-stone-400">
            <a href="#" className="hover:text-soft-sage">
              Privacy
            </a>
            <a href="#" className="hover:text-soft-sage">
              Terms
            </a>
            <a href="#" className="hover:text-soft-sage">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
