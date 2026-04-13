"use client";

import { useState } from "react";
import LoginDialog from "@/components/auth/login-dialog";
import RegisterDialog from "@/components/auth/register-dialog";
import MarketingNavbar from "@/components/marketing/navbar";
import { Button } from "@/components/ui/button";
import FeaturesSection from "@/components/marketing/features-section";
import BenefitsSection from "@/components/marketing/benefits-section";
import CtaSection from "@/components/marketing/cta-section";
import Footer from "@/components/marketing/footer";

type AuthModalType = "login" | "register" | null;

export default function LandingPageClient() {
  const [activeModal, setActiveModal] = useState<AuthModalType>(null);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <MarketingNavbar
        onOpenLogin={() => setActiveModal("login")}
        onOpenRegister={() => setActiveModal("register")}
      />

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
              Rated #1 Financial App 2026
            </div>

            <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
              Smart Money{" "}
              <span className="block text-emerald-600">Starts Here</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              The complete financial command center. Track expenses, grow
              investments, and achieve your money goals—all with stunning
              real-time insights.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                type="button"
                onClick={() => setActiveModal("register")}
                className="h-14 rounded-2xl bg-emerald-600 px-8 text-base font-semibold text-white hover:bg-emerald-700"
              >
                Start Free Trial
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveModal("login")}
                className="h-14 rounded-2xl px-8 text-base font-semibold"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="h-105 w-full rounded-[32px] border border-slate-200 bg-white shadow-xl" />
          </div>
        </section>
        <FeaturesSection />
        <BenefitsSection />
        <CtaSection
          onOpenLogin={() => setActiveModal("login")}
          onOpenRegister={() => setActiveModal("register")}
        />
      </main>

      <Footer />

      <LoginDialog
        open={activeModal === "login"}
        onOpenChange={(open) => setActiveModal(open ? "login" : null)}
        onSwitchToRegister={() => setActiveModal("register")}
      />

      <RegisterDialog
        open={activeModal === "register"}
        onOpenChange={(open) => setActiveModal(open ? "register" : null)}
        onSwitchToLogin={() => setActiveModal("login")}
      />
    </div>
  );
}
