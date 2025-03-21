import r2wc from "@r2wc/react-to-web-component";
import { TldrawSync } from "./components/tldraw-sync";
export * from './interfaces'

export const TldrawSyncWebComponent = r2wc(TldrawSync, {
  props: {
    getPropsFunc: "function",
  },
});

customElements.define("tldraw-sync-web-component", TldrawSyncWebComponent);
