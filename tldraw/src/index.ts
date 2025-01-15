import r2wc from "@r2wc/react-to-web-component";
import { TldrawSync } from "./tldraw-sync";
export * from './interfaces'

export const TldrawSyncWebComponent = r2wc(TldrawSync, {
  props: {
    debug: "boolean",
    roomId: "string",
    serverUri: "string",
    queryParams: "json",
    multiplayerAssetsFunc: "function",
    autoFocus: "boolean",
    forceMobile: "boolean",
    hideUi: "boolean",
    inferDarkMode: "boolean",
    onMount: "function",
    initialState: "string",
    licenseKey: "string",
    maxAssetSize: "number",
    maxImageDimension: "number",
    getUserFunc: "function",
  },
});

customElements.define("tldraw-sync-web-component", TldrawSyncWebComponent);
