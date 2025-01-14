import 'tldraw/tldraw.css';
import React from "react";
import { TLAssetStore, TLOnMountHandler, TLUser } from "tldraw";
interface TldrawSyncProps {
    roomId: string;
    /** The uri without a trailing '/'. E.g http://localhost:5858 */
    serverUri: string;
    multiplayerAssetsFunc?: () => TLAssetStore;
    debug?: boolean;
    queryParams?: Record<string, string>;
    /** This function must return TLAssetStore type */
    autoFocus?: boolean | undefined;
    forceMobile?: boolean | undefined;
    hideUi?: boolean | undefined;
    inferDarkMode?: boolean | undefined;
    onMount?: TLOnMountHandler | undefined;
    defaultName?: string | undefined;
    initialState?: string | undefined;
    licenseKey?: string | undefined;
    maxAssetSize?: number | undefined;
    maxImageDimension?: number | undefined;
    sessionId?: string | undefined;
    getUser?: () => (TLUser | undefined);
}
export declare const TldrawSync: React.FC<TldrawSyncProps>;
export {};
