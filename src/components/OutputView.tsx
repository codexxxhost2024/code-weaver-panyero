
import React, { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  output: string;
  heading: string;
  filename: string;
  onSave: (() => void) | null;
  onTryAgain: () => void;
  saving: boolean;
};

export function OutputView({ output, heading, filename, onSave, saving, onTryAgain }: Props) {
  const [view, setView] = useState<"preview" | "code">("preview");

  const canPreview = output?.trim().startsWith("<!DOCTYPE html");

  // Copy & Download
  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
  }
  function handleDownload() {
    if (!output) return;
    const blob = new Blob([output], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename || "output.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl mt-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-2">{heading}</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setView("preview")}
          className={cn(
            "px-4 py-2 rounded-lg border",
            view === "preview"
              ? "bg-indigo-500 text-white border-indigo-500"
              : "bg-gray-100 text-gray-700 border-gray-200"
          )}
        >
          View Preview
        </button>
        <button
          type="button"
          onClick={() => setView("code")}
          className={cn(
            "px-4 py-2 rounded-lg border",
            view === "code"
              ? "bg-indigo-500 text-white border-indigo-500"
              : "bg-gray-100 text-gray-700 border-gray-200"
          )}
        >
          View Code
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 rounded-lg bg-green-500 text-white border border-green-500 hover:bg-green-600 ml-auto"
        >
          Copy Code
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="px-4 py-2 rounded-lg bg-yellow-400 text-white border border-yellow-400 hover:bg-yellow-500"
        >
          Download
        </button>
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-fuchsia-500 text-white border border-fuchsia-500 hover:bg-fuchsia-600"
          >
            {saving ? "Saving..." : "Save Output"}
          </button>
        )}
        <button
          type="button"
          onClick={onTryAgain}
          className="px-4 py-2 rounded-lg bg-gray-200 border border-gray-200 text-gray-500 ml-auto"
        >
          Try Again
        </button>
      </div>
      <div>
        {view === "preview" && canPreview ? (
          <iframe
            className="w-full min-h-[60vh] rounded-lg border"
            title="Output Preview"
            srcDoc={output}
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <pre className="bg-gray-950 text-white p-4 rounded-xl overflow-auto max-h-[60vh] text-sm">
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}
