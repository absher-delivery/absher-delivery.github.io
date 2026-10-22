import { registerRootComponent } from "expo";
import { I18nManager } from "react-native";

import App from "./App";

// Absher is Arabic-first, so lay the whole app out right to left.
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

registerRootComponent(App);
