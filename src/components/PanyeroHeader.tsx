
import { Plus, Settings } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
};

export function PanyeroHeader({ title = "CodeHub" }: Props) {
  return (
    <header className="mb-6 relative flex items-center justify-between px-2 pt-4 pb-2">
      <h1 className={cn("text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent inline-block bg-gradient-to-tr from-indigo-500 via-purple-500 to-fuchsia-500")}>
        {title}
      </h1>
      {/* Settings/Add Icon */}
      <a
        href="/settings"
        title="Add Persona"
        className="text-2xl p-2 rounded-lg bg-white/80 hover:bg-white shadow hover:shadow-lg transition text-gray-700 hover:text-indigo-500"
      >
        <Plus />
        <span className="sr-only">Settings</span>
      </a>
    </header>
  );
}
