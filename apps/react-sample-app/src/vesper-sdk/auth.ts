import { AuthManager, Environment, getApiBaseUrl } from "@dicetechnology/vesper-sdk-web";

const LOCAL_STORAGE_AUTH_KEY = 'react-sample-app-authToken';
const LOCAL_STORAGE_REFRESH_KEY = 'react-sample-app-refreshToken';

// Simulate user login and save token in LocalStorage
localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, process.env.REACT_APP_AUTH_TOKEN ?? '');
localStorage.setItem(LOCAL_STORAGE_REFRESH_KEY, process.env.REACT_APP_REFRESH_TOKEN ?? '');

/**
 * **************************************************************************
 * N.B. This is a simplified example implementation. It should not be copied.
 * **************************************************************************
 */
export class VesperAuthManager implements AuthManager {

    public async getAuthToken(): Promise<string> {
        const key = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);

        if (!key) {
            throw new Error('AUTH_TOKEN not found')
        }

        return key;
    }

    public async getRefreshToken(): Promise<string> {
        const key = localStorage.getItem(LOCAL_STORAGE_REFRESH_KEY);

        if (!key) {
            throw new Error('REFRESH_TOKEN not found')
        }

        return key;
    }

    public async refreshAuthToken(authToken: string): Promise<string> {
        const token = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
        const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_KEY);
        const realm = process.env.REACT_APP_VESPER_REALM;
        const apiKey = process.env.REACT_APP_API_KEY;

        if (token && token !== authToken) {
            return token;
        }

        if (!refreshToken || !realm || !apiKey) {
            throw new Error('Credentials not found');
        }

        const request = fetch(`${getApiBaseUrl(Environment.PROD)}/token/refresh`, {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'realm': realm,
                'x-api-key': apiKey,
            }
        });

        try {
            const response = await request;

            if (response.headers.get('content-type') && response.ok) {
                const data = await response.json();
                const authToken = data.authorisationToken;
                localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, authToken);
                return authToken;
            }

            throw response;
        } catch (error) {
            console.error('Token Refresh Error', error);
            throw error;
        }
    }
}
