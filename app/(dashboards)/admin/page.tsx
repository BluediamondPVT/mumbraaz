import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const revalidate = 3600; // 1 ghante ke liye ISR cache

export default async function AdminDashboard() {
  // Current user ka data fetch karo
  const user = await currentUser();

  // Agar user nahi hai, ya uski metadata me role 'admin' nahi hai, toh bahar nikal do
  if (!user || user.publicMetadata?.role !== "admin") {
    redirect("/"); // Normal user ko home page pe phek dega
  }

  // Agar admin hai, toh dashboard dikhao
  return <AdminDashboardClient />;
}