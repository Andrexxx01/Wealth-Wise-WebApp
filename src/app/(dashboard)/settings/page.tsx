"use client";

import ResetDemoDataButton from "@/components/dashboard/reset-demo-data-button";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import SectionHeader from "@/components/dashboard/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { useFinance } from "@/features/finance/components/finance-provider";

export default function SettingsPage() {
  const { resetFinanceData } = useFinance();

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Settings"
        title="App settings"
        description="Manage temporary app preferences and demo data while the project is still using local browser storage."
      />

      <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
        <CardContent className="space-y-4 p-6">
          <DashboardListItem
            title="Storage"
            value="localStorage"
            meta="Current temporary persistence layer"
            className="border-none bg-slate-50 p-5"
          />

          <DashboardListItem
            title="Reset Data"
            value="Restore Demo Data"
            meta="This removes your local changes and restores the original mock data."
            className="border-none bg-slate-50 p-5"
          >
            <div className="mt-4 flex justify-end">
              <ResetDemoDataButton onReset={resetFinanceData} />
            </div>
          </DashboardListItem>
        </CardContent>
      </Card>
    </div>
  );
}
