import { Signal, TLAssetStore, TldrawProps, TLOnMountHandler, TLUserPreferences } from "tldraw";

export interface TldrawWCUserProps {
  id?: string;
  name?: string;
  color?: string;
  colorScheme?: "dark" | "light" | "system" | undefined;
}

export type MakeRealFunc = (
  developerPrompt: string,
  image: string,
  messages: { type: 'text' | 'image'; text?: string; image?: string }[],
) => Promise<string>

export type TldrawWebcomponentGetPropsFunc = () => {
  tldrawProps: TldrawProps;
  tldrawUserPreferences: TLUserPreferences
  assets: TLAssetStore;
  serverUri: string;
};
export interface TldrawWebcomponentProps {
  getPropsFunc: TldrawWebcomponentGetPropsFunc
}
