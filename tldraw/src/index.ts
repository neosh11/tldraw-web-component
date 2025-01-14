import r2wc from "@r2wc/react-to-web-component"
import { TldrawSync } from "./tldraw-sync"

export * from "./tldraw-sync"

const TldrawSyncWebComponent = r2wc(TldrawSync, {
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
        defaultName: "string",
        initialState: "string",
        licenseKey: "string",
        maxAssetSize: "number",
        maxImageDimension: "number",
        sessionId: "string",
        getUser: "function"
    },
})

customElements.define("tldraw-sync-web-component", TldrawSyncWebComponent)