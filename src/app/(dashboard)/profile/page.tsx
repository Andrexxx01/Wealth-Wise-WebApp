import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import SectionHeader from "@/components/dashboard/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { mockUserProfile } from "@/lib/mock-data/user";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Profile"
        title="Your profile"
        description="This is a temporary profile page. Later, this can be connected to authentication and profile update features."
      />

      <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
        <CardContent className="space-y-4 p-6">
          <DashboardListItem
            title="Full Name"
            value={mockUserProfile.fullName}
            className="border-none bg-slate-50 p-5"
          />

          <DashboardListItem
            title="Account Type"
            value="Demo Account"
            className="border-none bg-slate-50 p-5"
          />

          <DashboardListItem
            title="Data Source"
            value="Local Browser Storage"
            className="border-none bg-slate-50 p-5"
          />
        </CardContent>
      </Card>
    </div>
  );
}
