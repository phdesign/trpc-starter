import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

new EventSource("/esbuild").addEventListener("change", () => location.reload());

createRoot(document.getElementById("root")!).render(<App />);
