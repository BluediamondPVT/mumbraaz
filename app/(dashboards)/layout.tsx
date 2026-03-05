import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | City Directory",
  description: "Manage your City Directory platform",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
