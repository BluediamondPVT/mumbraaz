import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";
import BusinessForm from "@/components/admin/BusinessForm";

export default async function AdminDashboard() {
  // Current user ka data fetch karo
  const user = await currentUser();

  // Agar user nahi hai, ya uski metadata me role 'admin' nahi hai, toh bahar nikal do
  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/"); // Normal user ko home page pe phek dega
  }

  // Agar admin hai, toh dashboard dikhao
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium">Total Businesses</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">124</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium">Pending Approvals</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">12</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">850</p>
          </div>
        </div>

        {/* Dashboard Grid (Ye pehle se hai) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* ... cards ... */}
        </div>
        
        {/* Naya Form Yahan Aayega */}
        <CategoryForm />
        <BusinessForm />
        {/* Yahan baad mein hum table lagayenge jisme dukaane approve/reject hongi */}
      </div>
    </div>
  );
}