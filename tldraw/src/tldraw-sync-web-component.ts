import reactToWebComponent from "@r2wc/react-to-web-component";
import { TldrawSync } from "./tldraw-sync";

const TldrawSyncWebComponent = reactToWebComponent(TldrawSync, {
  props: {
    roomId: "string",
    serverUri: "string",
    queryParams: "json",
    multiplayerAssetsFunc: "function",
    autoFocus: "boolean",
    forceMobile: "boolean",
    hideUi: "boolean",
    inferDarkMode: "boolean",
    onMount: "function",
    defaultName: "string",
    initialState: "string",
    licenseKey: "string",
    maxAssetSize: "number",
    maxImageDimension: "number",
    sessionId: "string",
    getUser: "function",
  },
});

customElements.define("tldraw-sync-wc", TldrawSyncWebComponent);
