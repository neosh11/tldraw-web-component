import reactToWebComponent from "@r2wc/react-to-web-component";
import { TldrawSync } from "./tldraw-sync";

const TldrawSyncWebComponent = reactToWebComponent(TldrawSync, {
  props: {
    // Sync
    roomId: "string",
    serverUri: "string",
    queryParams: "json",
    multiplayerAssetsFunc: "function",
    // UI
    autoFocus: "boolean",
    forceMobile: "boolean",
    hideUi: "boolean",
    inferDarkMode: "boolean",
    onMount: "function",
    initialState: "string",
    licenseKey: "string",
    maxAssetSize: "number",
    maxImageDimension: "number",
    getUser: "function",
  },
});

customElements.define("tldraw-sync-wc", TldrawSyncWebComponent);
