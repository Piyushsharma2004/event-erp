"use client";
import { useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage";

const useColorMode = (): [string, (value: string) => void] => {
  const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const className = "dark";
    const bodyClass = document.documentElement.classList;

    if (colorMode === "dark") {
      bodyClass.add(className);
    } else {
      bodyClass.remove(className);
    }
  }, [colorMode]);

  return [mounted ? colorMode : "light", setColorMode]; // Avoid SSR mismatch
};

export default useColorMode;
