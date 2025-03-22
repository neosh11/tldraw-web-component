import { Signal, TLAssetStore, TldrawProps, TLOnMountHandler, TLUserPreferences } from "tldraw";

export interface TldrawWCUserProps {
  id?: string;
  name?: string;
  color?: string;
  colorScheme?: "dark" | "light" | "system" | undefined;
}

export type TldrawWebcomponentGetPropsFunc = () => {
  tldrawProps: TldrawProps;
  tldrawUserPreferences: TLUserPreferences
  assets?: TLAssetStore;
  serverUri?: string;
};
export interface TldrawWebcomponentProps {
  getPropsFunc: TldrawWebcomponentGetPropsFunc
}
