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