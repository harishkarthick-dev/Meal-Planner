import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Check,
  Star,
  Users,
  Brain,
  ShoppingCart,
  Calendar,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Family Meal Planner Features - AI Powered & collaborative",
  description:
    "Discover the best family meal planner features: Real-time syncing, AI recipe suggestions, automated grocery lists, and drag-and-drop weekly planning.",
  alternates: {
    canonical: "https://mealplanners.vercel.app/features",
  },
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-warm-white dark:bg-background font-sans text-text-dark dark:text-foreground">
      {/* Hero */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-soft-sage to-dusty-rose">
          The Complete Toolkit for <br /> Stress-Free Family Dinners
        </h1>
        <p className="text-xl text-stone-500 dark:text-stone-400 mb-10 leading-relaxed">
          Everything you need to plan, shop, and cook for your family without
          the mental load. Simple enough for busy parents, powerful enough for
          organized households.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button className="px-8 py-6 text-lg rounded-full">
              Start Your Free Plan
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-12 px-6 max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={Calendar}
          title="Drag-and-Drop Weekly Planner"
          desc="Visually plan your week in seconds. Drag recipes to different days, swap meals when plans change, and see your whole week at a glance."
        />
        <FeatureCard
          icon={Users}
          title="Real-Time Family Sync"
          desc="Stop texting 'what's for dinner?'. Your partner sees the same plan and grocery list you do. Any change updates instantly on everyone's phone."
        />
        <FeatureCard
          icon={ShoppingCart}
          title="Automated Grocery Lists"
          desc="We read your recipes and build a categorized shopping list automatically. Check items off as you shop, organized by aisle."
        />
        <FeatureCard
          icon={Brain}
          title="AI Recipe Suggestions"
          desc="Stuck in a food rut? Ask our AI for 'healthy 15-minute kid-friendly dinners' and get instant, customized suggestions added to your plan."
        />
        <FeatureCard
          icon={Check}
          title="Zero Clutter Interface"
          desc="Designed for calmness. No ads, no popups, no distracting clutter. Just your meals, your list, and your peace of mind."
        />
        <FeatureCard
          icon={Star}
          title="Recipe Importing"
          desc="Save recipes from your favorite blogs or enter your grandma's secret pasta sauce. Keep your entire digital cookbook in one place."
        />
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center bg-soft-sage/10 mt-12">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Reclaim 5+ Hours a Week?
        </h2>
        <p className="text-lg text-stone-600 dark:text-stone-300 mb-8 max-w-2xl mx-auto">
          Join thousands of families who swapped chaos for calm. Try it
          completely free.
        </p>
        <Link href="/login">
          <Button className="px-8 py-4 rounded-full text-lg shadow-xl shadow-soft-sage/20 hover:-translate-y-1 transition-transform">
            Get Started for Free
          </Button>
        </Link>
      </section>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://mealplanners.vercel.app",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Features",
                item: "https://mealplanners.vercel.app/features",
              },
            ],
          }),
        }}
      />
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white dark:bg-card p-8 rounded-3xl border border-stone-100 dark:border-stone-800 hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 rounded-2xl bg-soft-sage/10 text-soft-sage flex items-center justify-center mb-6">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-stone-500 dark:text-stone-400 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
