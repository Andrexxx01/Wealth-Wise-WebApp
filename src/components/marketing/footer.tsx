import Logo from "@/components/common/logo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Logo
            textClassName="bg-none text-white"
            wrapperClassName="items-center"
          />
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
            WealthWise helps you track income, expenses, investments, and loans
            in one clean financial dashboard.
          </p>
        </div>

        <div className="text-sm text-slate-400">
          © 2026 WealthWise. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
