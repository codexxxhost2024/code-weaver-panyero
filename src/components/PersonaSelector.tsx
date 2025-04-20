
import React from "react";

type PersonaRecord = {
  key: string;
  title: string;
};

type Props = {
  personas: Record<string, any>;
  value: string; // Must be any string, not restricted to union types
  onChange: (key: string) => void;
  disabled?: boolean;
};

export function PersonaSelector({ personas, value, onChange, disabled }: Props) {
  // Group into default & custom
  const defaultKeys = Object.keys(personas).filter((k) => k === "splash" || k === "component");
  const customKeys = Object.keys(personas).filter((k) => !defaultKeys.includes(k));

  return (
    <div>
      <label htmlFor="persona" className="block text-sm font-medium mb-1 text-gray-800">
        Select Persona
      </label>
      <select
        id="persona"
        className="w-full rounded-lg border-2 border-gray-200 px-4 py-2 mb-2 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer text-base"
        value={value}
        onChange={(e) => onChange(e.target.value as string)}
        disabled={disabled}
      >
        <optgroup label="Default Generators">
          {defaultKeys.map((k) => (
            <option key={k} value={k}>
              {personas[k]?.title}
            </option>
          ))}
        </optgroup>
        {customKeys.length > 0 && (
          <optgroup label="Custom Personas">
            {customKeys.map((k) => (
              <option key={k} value={k}>
                {personas[k]?.title}
              </option>
            ))}
          </optgroup>
        )}
      </select>
    </div>
  );
}
