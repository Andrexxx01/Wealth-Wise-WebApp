const stats = [
  {
    label: "Active Users",
    value: "50K+",
  },
  {
    label: "Tracked Transactions",
    value: "2M+",
  },
  {
    label: "Investment Growth Recorded",
    value: "$12M+",
  },
  {
    label: "Average Satisfaction",
    value: "98%",
  },
];

export default function StatsStrip() {
  return (
    <section className="bg-emerald-600 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center lg:text-left">
            <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
            <p className="mt-2 text-sm text-emerald-50">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
