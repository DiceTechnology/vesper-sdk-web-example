import './index.css';
import '@dicetechnology/vesper-sdk-web/vesper-sdk.css';

import { LoadType, PlayerManager, VesperSdk } from '@dicetechnology/vesper-sdk-web';
import React from 'react';

import { PLAYER_ID } from './constants';
import { createPlayerManager, createVesperSdk } from './vesper-sdk';

const id = process.env.REACT_APP_CONTENT_ID as string;
const isLive = process.env.REACT_APP_CONTENT_IS_LIVE === "true";

export const App: React.FC = () => {
    const sdkRef = React.useRef<VesperSdk>();
    const playerManagerRef = React.useRef<PlayerManager>();

    React.useEffect(() => {
        let sdk = sdkRef.current;

        if (!sdk) {
            const sdk = createVesperSdk();
            sdkRef.current = sdk;

            (async () => {
                const playerManager = await createPlayerManager(sdk);
                playerManagerRef.current = playerManager;

                playerManager.load({
                    id,
                    type: isLive ? LoadType.LIVE : LoadType.VOD,
                });
            })();
        }

        return () => {
            playerManagerRef.current?.unload();
        };
    }, []);

    return (
        <div className="react-sample-app">
            <header>
                <h1>Vesper SDK - React Sample App</h1>
            </header>
            <main>
                <div id={PLAYER_ID} />
            </main>
        </div>
    );
};
