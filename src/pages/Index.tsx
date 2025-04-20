import React, { useState } from "react";
import { usePersonas } from "@/hooks/usePersonas";
import { PanyeroHeader } from "@/components/PanyeroHeader";
import { PersonaSelector } from "@/components/PersonaSelector";
import { PromptForm } from "@/components/PromptForm";
import { OutputView } from "@/components/OutputView";
import { toast } from "@/hooks/use-toast";
import { getDatabase } from "@/lib/firebase";
import { ref, push } from "firebase/database";

// TODO: Move API key and endpoint to env/secrets if you publish!
const OPENAI_API_KEY = "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";
// --- Updated Model ---
const OPENAI_MODEL = "gpt-4.1-nano"; // Changed from "gpt-3.5-turbo"
const GENERATED_PATH = "panyero_generated";

export default function Index() {
  const { personas, status: personasStatus } = usePersonas();
  const [personaKey, setPersonaKey] = useState<string>("splash");
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Output
  const [output, setOutput] = useState<string>("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Derived
  const persona = personas[personaKey];

  async function handleGenerate() {
    if (!persona?.systemPrompt) return;
    setLoading(true);
    setOutput("");
    setSaved(false);
    try {
      // Replace placeholder with prompt
      const systemPrompt = persona.systemPrompt.replace("[USER PROMPT]", prompt);

      // --- Updated Request Body based on curl command ---
      const requestBody = {
        model: OPENAI_MODEL, // Now "gpt-4.1-nano"
        messages: [
          { role: "system", content: systemPrompt }
          // You might want to add { role: "user", content: prompt } here as well,
          // depending on how your systemPrompt is structured.
          // The current code embeds the user prompt *within* the system prompt.
        ],
        response_format: { type: "text" }, // Added
        temperature: 1,                   // Updated from 0.5
        max_tokens: 2048,                 // Updated from 2000 (using API standard name)
        top_p: 1,                         // Kept as 1
        frequency_penalty: 0,             // Added
        presence_penalty: 0               // Added
        // store: false, // Omitted - Not a standard parameter for this endpoint
      };
      // --- End of Updated Request Body ---

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        // Log the full error response for better debugging
        console.error("OpenAI API Error Response:", data);
        throw new Error(data?.error?.message || `OpenAI API error: ${response.statusText}`);
      }

      const result = data?.choices?.[0]?.message?.content;
      setOutput(result ?? "");

      if (!result) {
        toast({ title: "No output", description: "The model did not return any content." });
      }
    } catch (e: any) {
      console.error("Failed to generate:", e); // Log the error object
      toast({ title: "Failed to generate", description: e.message });
      setOutput("");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!output?.length) return;
    setSaving(true);
    try {
      const db = getDatabase();
      const generatedRef = ref(db, GENERATED_PATH);
      await push(generatedRef, {
        prompt,
        output,
        type: personaKey,
        title: persona?.title,
        createdAt: Date.now(),
        // Ensure the saved model info reflects the change
        llm_info: { provider: "OpenAI", model: OPENAI_MODEL },
      });
      setSaved(true);
      toast({ title: "Saved!", description: "Output saved to Firebase." });
    } catch (e: any) {
      toast({ title: "Save Failed", description: e.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2 py-10">
      <div className="w-full max-w-2xl mx-auto">
        <PanyeroHeader title="CodeHub" />
        {personasStatus?.message && (
          <div className={`rounded-lg p-3 mb-3 border ${personasStatus.type === "warning" ? "bg-yellow-50 border-yellow-300 text-yellow-800" : ""}`}>
            {personasStatus.message}
          </div>
        )}
        <PersonaSelector
          personas={personas}
          value={personaKey}
          onChange={setPersonaKey}
          disabled={loading}
        />
        <PromptForm
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          loading={loading}
          disabled={loading}
          label={persona?.label ?? "Prompt:"}
          placeholder={persona?.placeholder}
        />
        {output && (
          <OutputView
            output={output}
            heading={persona?.outputHeading || "Output"}
            filename={persona?.filename || "output.html"}
            onSave={handleSave}
            saving={saving}
            saved={saved} // Pass saved state
            onTryAgain={() => { setOutput(""); setSaved(false); }} // Reset saved state on try again
          />
        )}
      </div>
    </div>
  );
}
