import { Environment, PlayerManager, VesperSdk, VesperSdkConfig } from "@dicetechnology/vesper-sdk-web";

import { PLAYER_ID } from "../constants";
import { VesperAuthManager } from "./auth";

export interface VesperSdkManagers {
    vesperSdk: VesperSdk;
    playerManager: PlayerManager;
}

export const createVesperSdk = () => {
    const config: VesperSdkConfig = {
        apiConfig: {
            apiKey: process.env.REACT_APP_API_KEY!,
            environment: Environment.PROD,
            realm: process.env.REACT_APP_VESPER_REALM!,
        },
        authManager: new VesperAuthManager(),
    };

    return new VesperSdk(config);
};

export const createPlayerManager = async (sdk: VesperSdk) => {
    return await sdk.createPlayerManager({
        parent: PLAYER_ID,
        userInterfaceConfig: {
            mountUserInterface: true,
            userInterfaceControls: {
                playbackSpeed: false
            }
        }
    });
};
