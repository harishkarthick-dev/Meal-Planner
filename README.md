# 🍽️ Meal Planner

> **Never ask "What's for dinner?" again!** Your family's new favorite meal planning companion is here. 🎉

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Test Coverage](https://img.shields.io/badge/coverage-75%25-brightgreen)](https://github.com/harishkarthick-dev/mealplan)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)](https://nextjs.org)
[![Deployed with Vercel](https://img.shields.io/badge/Deployed%20with-Vercel-black)](https://vercel.com)

---

## 🌟 Why You'll Love This

Imagine having **your entire family's meal plan** in one beautiful app that works on _every device_ you own. No more scattered sticky notes, forgotten grocery lists, or dinner-time panic! Whether you're meal prepping for the week or planning tonight's dinner, we've got your back.

### ✨ Features That Make Life Easier

- 📅 **Smart Planning Views** - Think big picture with month view, zoom into week view, or focus on today. Your choice!
- 👨‍👩‍👧‍👦 **Real Family Collaboration** - Everyone sees updates _instantly_. Dad adds tacos for Tuesday? Mom knows immediately!
- 🤖 **AI-Powered Nutrition** - Just enter a meal name, and boom! Automatic nutrition data from USDA + Google Gemini magic ✨
- 📱 **True Progressive Web App** - Install it like a native app, use it offline, sync when you're back online. It just works!
- 🔥 **Live Updates** - Firebase under the hood means zero refresh buttons. Everything syncs in real-time!
- ✅ **Task Tracking** - Check off completed meals, track what's done, celebrate small victories!
- 🎨 **Beautiful & Fast** - Modern design that feels good to use, with dark mode for those late-night planning sessions

## 🚀 The Tech Behind the Magic

We built this with the best tools in modern web development:

- **Next.js 16** - The React framework that makes everything blazingly fast
- **Firebase** - Real-time database + authentication that "just works"
- **Google Gemini AI** - Smart nutrition data that understands what you're cooking
- **Tailwind CSS + shadcn/ui** - Because your meal planner should look as good as it works
- **Zustand** - Simple, powerful state management
- **Vitest** - Battle-tested with **78% code coverage** (we take quality seriously!)

## 🏃‍♂️ Get Started in 60 Seconds

```bash
# 1. Grab the code
git clone https://github.com/harishkarthick-dev/mealplan.git
cd mealplan

# 2. Install the goodies
npm install

# 3. Add your secrets (Firebase keys, API keys)
cp .env.local.example .env.local
# Edit .env.local with your credentials

# 4. Fire it up! 🚀
npm run dev
```

Head to [http://localhost:3000](http://localhost:3000) and start planning! 🎯

## 🔑 Environment Setup

You'll need a few API keys (all free to get started):

```env
# Firebase (get from console.firebase.google.com)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# API Keys for the smart features
NEXT_PUBLIC_USDA_API_KEY=your_usda_key        # Free from fdc.nal.usda.gov
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key    # Free from ai.google.dev
```

## 🧪 Testing? We're Serious About It!

We've got **>75% code coverage** because your data matters! Run the tests yourself:

```bash
npm test              # Quick test run
npm run test:coverage # See that beautiful coverage report
npm run test:ui       # Visual test interface (it's actually pretty cool!)
```

**Fun fact**: Every push to GitHub _must_ pass all tests with at least 75% coverage. No exceptions! 💪

## 🛠️ Developer Commands

```bash
npm run dev          # Start dev server (with hot reload goodness)
npm run build        # Build for production (optimized & fast)
npm run start        # Run production build locally
npm run lint         # Check code quality
npm run lint:fix     # Auto-fix ESLint issues (magic!)
npm run format       # Make code pretty with Prettier
npm run verify       # Run ALL checks (the pre-push gauntlet)
```

## 🎯 Quality Guaranteed

We've set up automatic quality gates with Husky:

**When you commit:**

- ✨ Auto-formats your code
- 🔍 Checks for common issues
- ⚡ Lightning fast (only checks changed files)

**When you push:**

- 🎨 Verifies formatting across the project
- 🧪 Runs the full test suite
- 📊 Ensures 75%+ code coverage
- ❌ **Blocks the push** if anything fails (tough love!)

Your code quality is protected on autopilot. Pretty neat, right?

## 🏗️ How It's Organized

```
mealplan/
├── app/                    # Next.js 16 app directory (the new hotness)
│   ├── (auth)/            # Login & signup pages
│   ├── (onboarding)/      # Family setup flow
│   └── (routes)/          # Main app (today, week, month views)
├── components/
│   ├── meals/             # MealCard, MealEditor, the good stuff
│   ├── ui/                # Beautiful shadcn/ui components
│   └── providers/         # Auth & theme providers
├── lib/
│   ├── hooks/             # Custom React hooks (useAuth, useMeals, etc.)
│   ├── services/          # AI nutrition service
│   └── store/             # Zustand state management
└── types/                 # TypeScript definitions (type-safe all the way!)
```

## 🤝 Contribution Guidelines

We love contributors! ❤️ Whether you're fixing a typo, adding a feature, or just improving documentation, we're glad you're here.

### 🛠️ How to Contribute

1. **Fork the Repo** - Click that button at the top right!
2. **Clone your Fork** - `git clone https://github.com/YOUR-USERNAME/mealplan.git`
3. **Install Dependencies** - `npm install` (We use standard npm)
4. **Create a Branch** - `git checkout -b feature/amazing-idea`
5. **Code Away!** - Make your changes.
6. **Verify Your Work** - Run `npm run verify` to check linting, formatting, and tests.
   > **Note:** We use `husky` to automatically run checks before you commit and push. If something fails, the commit will be blocked until it's fixed. This keeps our codebase squeaky clean! 🧼
7. **Commit** - `git commit -m "feat: added an amazing idea"` (We like conventional commits!)
8. **Push** - `git push origin feature/amazing-idea`
9. **Open a PR** - Go to the original repo and click "New Pull Request".

### 📋 Pull Request Checklist

Before submitting, please check:

- [ ] `npm run verify` passes locally
- [ ] You've added tests for any new features (aim for 90% coverage!)
- [ ] Your code follows the project's style (Prettier handles this for you)
- [ ] You've updated the README if you added new environment variables

### 🐛 Found a Bug?

Please [open an issue](https://github.com/harishkarthick-dev/mealplan/issues) describing:

- What happened
- What you expected to happen
- Steps to reproduce
- Screenshots (if applicable)

## 📄 License

MIT License - use it, modify it, make it yours! See [LICENSE](LICENSE) for the legal stuff.

## 👨‍💻 Built With ❤️ By

**Harish Karthick S**  
🔗 GitHub: [@harishkarthick-dev](https://github.com/harishkarthick-dev)

_"Making meal planning less stressful, one commit at a time."_

## 🙌 Shoutouts

Huge thanks to the amazing open-source community:

- [Next.js](https://nextjs.org/) - For making React development a joy
- [Firebase](https://firebase.google.com/) - Real-time magic without the headaches
- [shadcn/ui](https://ui.shadcn.com/) - Components that just _feel_ right
- [Vercel](https://vercel.com/) - Deploy with zero config
- [USDA FoodData Central](https://fdc.nal.usda.gov/) - Nutrition data goldmine
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI that understands food

---

**Ready to transform your family's meal planning?** Star the repo ⭐ and let's cook something great together!

Questions? Ideas? Found a bug? [Open an issue](https://github.com/harishkarthick-dev/mealplan/issues) - we'd love to hear from you! 💬
