import LandingPageClient from "@/components/landing/LandingPageClient";

// SEO Metadata for Landing Page
export const metadata = {
  title: "MealPlan - The Calm Family Meal Planner App",
  description:
    "Stop wondering what's for dinner. A simple, collaborative meal planner for families that syncs in real-time. Try it free.",
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
                  text: "100%. A paper planner doesn’t make your grocery list for you, and you can’t share it instantly with your partner’s phone. Plus, this one fits in your pocket!",
                },
              },
              {
                "@type": "Question",
                name: "Can I use my own recipes?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Absolutely! You can add your own family favorites or import them from the web. It’s your personalized cookbook.",
                },
              },
              {
                "@type": "Question",
                name: "Is there a free version?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes! You can start for free and use the core features forever. We also have a premium plan for power-planners who want advanced features.",
                },
              },
            ],
          }),
        }}
      />
      {/* Schema.org Product (Star Ratings) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "MealPlanJoy",
            image: "https://mealplanners.vercel.app/hero-mom.png",
            description:
              "The calm, collaborative family meal planner that organizes your week and groceries in minutes.",
            brand: {
              "@type": "Brand",
              name: "MealPlan",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              ratingCount: "1248",
              bestRating: "5",
              worstRating: "1",
            },
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: "https://mealplanners.vercel.app/login",
            },
          }),
        }}
      />
      <LandingPageClient />
    </>
  );
}
