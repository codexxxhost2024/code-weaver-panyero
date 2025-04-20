
import React, { useRef, useState } from "react";
import { getDatabase } from "@/lib/firebase";
import { ref, push } from "firebase/database";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const [title, setTitle] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(null);
    if (!title.trim() || !systemPrompt.trim()) {
      setError("Both fields are required.");
      setLoading(false); return;
    }
    try {
      const db = getDatabase();
      const customRef = ref(db, "panyero_custom_personas");
      await push(customRef, { name: title.trim(), systemPrompt: systemPrompt.trim() });
      setSuccess("Persona added successfully!");
      setTitle(""); setSystemPrompt("");
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Failed to add persona.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center bg-gray-100 pt-12">
      <div className="w-full max-w-lg bg-white rounded-xl shadow px-7 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Persona</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Persona Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-indigo-500"
              placeholder="e.g. Marketing Email Generator"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">System Prompt</label>
            <textarea
              value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)}
              className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-indigo-500 min-h-[120px]"
              placeholder="Describe what this persona should generate, e.g. Generate a marketing email in HTML based on the user prompt."
              required
            />
          </div>
          <Button type="submit" variant="default" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Add Persona"}
          </Button>
        </form>
        {success && <div className="bg-green-100 text-green-700 mt-4 p-2 rounded text-center">{success}</div>}
        {error && <div className="bg-red-100 text-red-700 mt-4 p-2 rounded text-center">{error}</div>}
      </div>
    </div>
  );
}
