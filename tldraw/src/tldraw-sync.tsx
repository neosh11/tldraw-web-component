import { useSync } from "@tldraw/sync";
import "tldraw/tldraw.css";

import React, { useMemo, useState } from "react";
import { TLAssetStore, Tldraw, TLOnMountHandler, TLUser, TLUserPreferences, useTldrawUser } from "tldraw";

interface TldrawSyncProps {
  roomId: string;
  /** The uri without a trailing '/'. E.g http://localhost:5858 */
  serverUri: string;
  multiplayerAssetsFunc?: () => TLAssetStore; // function
  debug?: boolean;
  queryParams?: Record<string, string>; // json
  /** This function must return TLAssetStore type */

  autoFocus?: boolean | undefined;
  forceMobile?: boolean | undefined;
  hideUi?: boolean | undefined;
  inferDarkMode?: boolean | undefined;
  onMount?: TLOnMountHandler | undefined; //  function

  initialState?: string | undefined;
  licenseKey?: string | undefined;
  maxAssetSize?: number | undefined;
  maxImageDimension?: number | undefined;
  getUser?: () => {
    id?: string;
    name?: string;
    color?: string;
    colorScheme?: "dark" | "light" | "system" | undefined;
  } | undefined;
}

export const TldrawSync: React.FC<TldrawSyncProps> = ({
  debug,
  roomId,
  serverUri,
  queryParams,
  multiplayerAssetsFunc,
  getUser,
  onMount,
  ...props
}) => {
  const uri = `${serverUri}/connect/${roomId}`;
  const multiplayerAssets = useMemo(
    () => multiplayerAssetsFunc?.(),
    [multiplayerAssetsFunc],
  );

  const tlUser = getUser?.();
  const [userPreferences, setUserPreferences] = useState<TLUserPreferences>({
    id: tlUser?.id ?? 'user-' + Math.random(),
    name: tlUser?.name ?? 'User',
    color: tlUser?.color,
    colorScheme: tlUser?.colorScheme
  })
  const user = useTldrawUser({ userPreferences, setUserPreferences })
  const store = useSync({
    uri: uri,
    assets: multiplayerAssets,
  });

  if (debug) {
    console.log("Debugging is on");
    console.log("multiplayerAssets", multiplayerAssets);
    console.log("multiplayerAssetsFunc", multiplayerAssetsFunc);
  }

  if (!multiplayerAssets) {
    return (
      <>
        {debug && (
          <div>
            <div>Debug mode on.</div>
            <div>connected to {uri}</div>
            <div>Room {roomId}</div>
          </div>
        )}
        We require multiplayer assets
      </>
    );
  }

  return (
    <>
      {debug && (
        <div>
          <div>Debug mode on.</div>
          <div>connected to {uri}</div>
          <div>Room {roomId}</div>
        </div>
      )}
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Tldraw
          store={store} user={user} {...props} />
      </div>
    </>
  );
};
