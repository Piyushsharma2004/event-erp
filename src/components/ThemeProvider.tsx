"use client";
import { useEffect, useLayoutEffect } from "react";
import useColorMode from "@/hook/useColorMode";

import { ReactNode } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorMode] = useColorMode();

  useLayoutEffect(() => {
    // Ensure the dark class is applied immediately
    const htmlElement = document.documentElement;
    if (colorMode === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }, [colorMode]);

  return children;
}
