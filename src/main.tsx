import { StrictMode } from "react";
import "./index.css";
import { RouterProvider } from "react-router";
import ReactDOM from "react-dom/client";
import { router } from "@/routers/routes.tsx";

const root = document.getElementById("root")!;
ReactDOM.createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
