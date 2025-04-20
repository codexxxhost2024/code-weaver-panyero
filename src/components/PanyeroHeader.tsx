
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  generatorType: string;
};

const gradient =
  "bg-gradient-to-tr from-indigo-500 via-purple-500 to-fuchsia-500";

export function PanyeroHeader({ generatorType }: Props) {
  return (
    <header className="mb-6 relative text-center">
      <h1 className={cn("text-4xl font-extrabold", gradient, "bg-clip-text text-transparent inline-block")}>
        Panyero <span className="block text-lg font-semibold text-indigo-500 bg-none">
          {generatorType}
        </span>
        <a
          href="/settings"
          title="Add/Manage Personas"
          className="absolute top-1 right-2 text-xl duration-150 opacity-60 hover:opacity-100 text-gray-700 hover:text-indigo-500"
        >
          <span className="sr-only">Settings</span>
          <ArrowRight className="inline ml-1" />
        </a>
      </h1>
    </header>
  );
}
