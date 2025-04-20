
import { useState, useEffect } from "react";
import { getDatabase } from "@/lib/firebase";
import { ref, get } from "firebase/database";

// Default personas go here (in place of personas.js)
const defaultPersonaPrompts: Record<string, any> = {
  splash: {
    key: "splash",
    title: "HTML Email Splash",
    label: "Email Description:",
    placeholder: "Describe the type of email splash screen you want...",
    buttonText: "Email Splash",
    outputHeading: "Email Splash",
    filename: "email_splash.html",
    systemPrompt: "Generate a beautiful, modern HTML email splash screen. [USER PROMPT]"
  },
  component: {
    key: "component",
    title: "UI Component",
    label: "Component Description:",
    placeholder: "Describe the UI component you want in detail...",
    buttonText: "Component",
    outputHeading: "UI Component",
    filename: "component.html",
    systemPrompt: "Generate a reusable, modern React component. [USER PROMPT]"
  }
  // Add more defaults as desired
};

const CUSTOM_PERSONAS_PATH = "panyero_custom_personas";

export function usePersonas() {
  const [personas, setPersonas] = useState(defaultPersonaPrompts);
  const [status, setStatus] = useState<null | { type: string; message: string }>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchCustomPersonas() {
      try {
        const db = getDatabase();
        const personasRef = ref(db, CUSTOM_PERSONAS_PATH);
        const snapshot = await get(personasRef);
        const customData: any = snapshot.val();
        if (!customData) {
          setStatus(null);
          return;
        }
        let merged = { ...defaultPersonaPrompts };
        Object.keys(customData).forEach((key) => {
          const val = customData[key];
          if (val && val.name && val.systemPrompt) {
            merged[key] = {
              key,
              title: val.name,
              label: val.label || `${val.name}:`,
              placeholder: val.placeholder || `Describe ${val.name}...`,
              buttonText: val.buttonText || val.name,
              outputHeading: val.outputHeading || val.name,
              filename: val.filename || `${key}.html`,
              systemPrompt: val.systemPrompt,
            };
          }
        });
        if (isMounted) {
          setPersonas(merged);
          if (Object.keys(merged).length === Object.keys(defaultPersonaPrompts).length) {
            setStatus({ type: "warning", message: "No custom personas found." });
          } else {
            setStatus(null);
          }
        }
      } catch (e: any) {
        setStatus({
          type: "warning",
          message: "Custom personas failed to load (Firebase error). Using defaults.",
        });
      }
    }

    fetchCustomPersonas();
    return () => {
      isMounted = false;
    };
  }, []);

  return { personas, status };
}
