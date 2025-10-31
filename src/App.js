import { useMemo, useState } from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";

import GamePage from "./pages/GamePage";
import { SettingsContext } from "./context";
import useStorage from "./hooks/useStorage";
import "./styles.css";
import { darkTheme, lightTheme, withCardColors } from "./themes";
import { standardLayouts } from "./util";

function makeThemes(rawCustomCardColors) {
  let parsed;
  try {
    parsed = JSON.parse(rawCustomCardColors) || {};
  } catch (error) {
    console.log("failed to parse custom colors", error);
    parsed = {};
  }
  return {
    customCardColors: parsed,
    customLightTheme: withCardColors(lightTheme, parsed.light),
    customDarkTheme: withCardColors(darkTheme, parsed.dark),
  };
}

function makeKeyboardLayout(keyboardLayoutName, customKeyboardLayout) {
  const emptyLayout = { verticalLayout: "", horizontalLayout: "" };
  if (keyboardLayoutName !== "Custom") {
    return standardLayouts[keyboardLayoutName] || emptyLayout;
  }
  let parsed;
  try {
    parsed = JSON.parse(customKeyboardLayout);
  } catch (error) {
    console.log("failed to parse custom keyboard layout", error);
    parsed = {};
  }
  return { ...emptyLayout, ...parsed };
}

function App() {
  // Detect if device is desktop/laptop (wide screen) for default layout
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
  const defaultLayout = isDesktop ? "landscape" : "portrait";

  const [themeType, setThemeType] = useStorage("theme", "light");
  const [rawCustomCardColors, setCustomCardColors] = useStorage(
    "customColors",
    "{}"
  );
  const { customCardColors, customLightTheme, customDarkTheme } = useMemo(
    () => makeThemes(rawCustomCardColors),
    [rawCustomCardColors]
  );
  const [keyboardLayoutName, setKeyboardLayoutName] = useStorage(
    "keyboardLayout",
    "QWERTY"
  );
  const [customKeyboardLayout, setCustomKeyboardLayout] = useStorage(
    "customKeyboardLayout",
    "{}"
  );
  const keyboardLayout = useMemo(
    () => makeKeyboardLayout(keyboardLayoutName, customKeyboardLayout),
    [keyboardLayoutName, customKeyboardLayout]
  );
  const [layoutOrientation, setLayoutOrientation] = useStorage(
    "layout",
    defaultLayout
  );
  const [cardOrientation, setCardOrientation] = useStorage(
    "orientation",
    "vertical"
  );
  const [volume, setVolume] = useStorage("volume", "off");

  return (
    <ThemeProvider
      theme={themeType === "light" ? customLightTheme : customDarkTheme}
    >
      <CssBaseline />
      <SettingsContext.Provider
        value={{
          keyboardLayout,
          keyboardLayoutName,
          setKeyboardLayoutName,
          customKeyboardLayout,
          setCustomKeyboardLayout,
          themeType,
          setThemeType,
          customCardColors,
          setCustomCardColors,
          volume,
          setVolume,
          layoutOrientation,
          setLayoutOrientation,
          cardOrientation,
          setCardOrientation,
        }}
      >
        <GamePage />
      </SettingsContext.Provider>
    </ThemeProvider>
  );
}

export default App;
