import { useSync } from "@tldraw/sync";
import "tldraw/tldraw.css";
import "../style.css";

import React, { useMemo, useState } from "react";
import { DefaultMainMenu, defaultShapeUtils, DefaultSharePanel, TLAssetStore, Tldraw, TLOnMountHandler, TLUserPreferences, useDialogs, useTldrawUser } from "tldraw";
import { MakeRealFunc, TldrawWCUserProps } from "../interfaces";
import { MakeRealButton } from "./make-real-button";
import { PreviewShapeUtil } from "../preview-shape/preview-shape";

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
  getUserFunc?: () => TldrawWCUserProps | undefined;
  makeRealFunc?: MakeRealFunc | undefined;
}

const shapeUtils = [PreviewShapeUtil]
const allShapes = [...defaultShapeUtils, ...shapeUtils]

export const TldrawSync: React.FC<TldrawSyncProps> = ({
  debug,
  roomId,
  serverUri,
  queryParams,
  multiplayerAssetsFunc,
  getUserFunc,
  makeRealFunc,
  onMount,
  ...props
}) => {


  const components = useMemo(() => ({
    SharePanel: () => <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 1rem",
      }}
    >
      <MakeRealButton makeRealFunc={makeRealFunc} />
      <DefaultSharePanel />
    </div>,
    MainMenu: () => (
      <DefaultMainMenu>
        {/* <DefaultMainMenuContent />
              <Links /> */}
      </DefaultMainMenu>
    ),
  }), [makeRealFunc])


  let uri = serverUri;
  if (!!roomId) {
    uri = `${serverUri}/connect/${roomId}`;
  }

  const multiplayerAssets = useMemo(
    () => multiplayerAssetsFunc?.(),
    [multiplayerAssetsFunc],
  );

  const tlUser = getUserFunc?.();
  const [userPreferences, setUserPreferences] = useState<TLUserPreferences>({
    id: tlUser?.id ?? 'user-' + Math.random(),
    name: tlUser?.name ?? 'User',
    color: tlUser?.color,
    colorScheme: tlUser?.colorScheme
  })

  const user = useTldrawUser({ userPreferences, setUserPreferences })
  const store = useSync({
    shapeUtils: allShapes,
    uri: uri,
    assets: multiplayerAssets,
    userInfo: {
      id: userPreferences.id,
      name: userPreferences.name,
    },
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
          store={store} user={user} {...props}
          components={components}
          shapeUtils={shapeUtils}
        >
          <InsideTldrawContext />
        </Tldraw>
      </div>
    </>
  );
};

function InsideTldrawContext() {
  return null
}
