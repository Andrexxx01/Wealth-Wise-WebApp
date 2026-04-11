import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Expense Tracking",
    description:
      "Record daily spending with clear categories and a clean overview of where your money goes.",
  },
  {
    title: "Income Management",
    description:
      "Track salary, freelance payments, and other income sources in one organized place.",
  },
  {
    title: "Investment Overview",
    description:
      "Monitor portfolio growth, current value, and long-term progress with simple visuals.",
  },
  {
    title: "Loan Monitoring",
    description:
      "Keep an eye on your debts, payment progress, and total obligations without confusion.",
  },
  {
    title: "Smart Analytics",
    description:
      "Understand your financial habits through charts, summaries, and useful trends.",
  },
  {
    title: "Financial Insights",
    description:
      "Get a clearer picture of your financial health with actionable and easy-to-read insights.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Powerful Features
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Everything you need to manage your money better
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            WealthWise helps you track income, expenses, investments, and loans
            in one clean dashboard designed to make financial decisions easier.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="rounded-[28px] border-slate-200 bg-slate-50 shadow-none transition-transform duration-200 hover:-translate-y-1"
            >
              <CardContent className="p-7">
                <div className="mb-5 h-12 w-12 rounded-2xl bg-emerald-100" />

                <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
