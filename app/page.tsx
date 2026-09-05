import LandingPageClient from "@/components/landing/LandingPageClient";

// SEO Metadata for Landing Page
export const metadata = {
  title: "Plately - A shared meal plan for real life",
  description:
    "Plan the week, build one shared grocery list, and keep your household in sync with a calmer way to organize dinner.",
  alternates: {
    canonical: "https://mealplanners.vercel.app",
  },
};

export default function LandingPage() {
  return (
    <>
      {/* Schema.org FAQPage (Server-side rendering favored for SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is this easier than a paper planner?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Plately keeps your weekly plan and grocery list together, and invited household members can see updates from their own devices.",
                },
              },
              {
                "@type": "Question",
                name: "Can I use my own recipes?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Add the meals your household already loves, save recipes, and reuse them in future weeks.",
                },
              },
              {
                "@type": "Question",
                name: "Is there a free version?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You can create an account and start planning for free. No credit card is required to get started.",
                },
              },
            ],
          }),
        }}
      />
      <LandingPageClient />
    </>
  );
}
