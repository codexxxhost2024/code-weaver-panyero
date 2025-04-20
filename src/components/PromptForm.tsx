
import React, { useState } from "react";
import { Loader } from "./ui/Loader";
import { cn } from "@/lib/utils";

type Props = {
  prompt: string;
  setPrompt: (v: string) => void;
  onGenerate: () => void;
  loading: boolean;
  disabled: boolean;
  label: string;
  placeholder?: string;
};

export function PromptForm({
  prompt,
  setPrompt,
  onGenerate,
  loading,
  disabled,
  label,
  placeholder,
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled && !loading) onGenerate();
      }}
      className="mt-2"
    >
      <label htmlFor="prompt" className="block font-medium mb-1 text-gray-800">
        {label}
      </label>
      <textarea
        id="prompt"
        className={cn(
          "w-full min-h-[100px] max-h-[220px] p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-400 mb-2 bg-white text-base resize-vertical",
          disabled && "bg-gray-100 text-gray-400"
        )}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={placeholder}
        disabled={disabled || loading}
        autoComplete="off"
      />
      <button
        type="submit"
        id="generateBtn"
        disabled={disabled || loading || !prompt.trim()}
        className={cn(
          "mt-2 w-full rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-fuchsia-500 text-white font-semibold py-3 text-lg transition-all flex justify-center items-center gap-2",
          (disabled || loading || !prompt.trim()) && "bg-gray-200 opacity-80 text-gray-500 cursor-not-allowed"
        )}
      >
        Generate
        {loading && <Loader />}
      </button>
    </form>
  );
}
