"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { PlusCircle, Loader2 } from "lucide-react";

export default function CategoryForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  // Jab admin naam type karega, slug apne aap ban jayega (e.g. "Ice Cream" -> "ice-cream")
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, iconUrl: "" }), // Abhi iconUrl blank bhej rahe hain
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message); // Mast hara popup aayega
        setName("");
        setSlug("");
      } else {
        toast.error(data.error); // Lal popup aayega agar error hui
      }
    } catch (error) {
      toast.error("Kuch gadbad ho gayi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8 max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <PlusCircle className="text-blue-600" />
        Add New Category
      </h2>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Dhabas"
            // Yahan text-gray-900 add kiya hai taaki text black dikhe
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug (Auto-generated)</label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. dhabas"
            // Yahan bhi text-gray-900 add kiya hai
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-gray-50 text-gray-900"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Saving..." : "Save Category"}
      </button>
    </form>
  );
}