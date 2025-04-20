
import React from "react";

export function Loader() {
  return (
    <span className="inline-block align-middle ml-2">
      <span className="block w-5 h-5 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
      <span className="sr-only">Loading</span>
    </span>
  );
}
