import { useSync, useSyncDemo } from "@tldraw/sync";
import "tldraw/tldraw.css";

import React, { useMemo, useState } from "react";
import { Tldraw, TLUserPreferences, useTldrawUser } from "tldraw";
import { TldrawWebcomponentProps } from "../interfaces";

export const TldrawSync: React.FC<TldrawWebcomponentProps> = ({
  getPropsFunc
}) => {
  console.log('rerendering',)
  const {
    tldrawProps = {},
    tldrawUserPreferences,
    assets,
    serverUri,
  } = useMemo(() => getPropsFunc(), []);

  const [userPreferences, setUserPreferences] = useState<TLUserPreferences>(tldrawUserPreferences);
  const user = useTldrawUser({ userPreferences, setUserPreferences })
  const store = useSync({
    uri: serverUri,
    assets: assets,
    userInfo: {
      id: userPreferences.id,
      name: userPreferences.name,
    }
  });

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Tldraw
          {...tldrawProps}
          store={store}
          user={user}
        />
      </div>
    </>
  );
};
