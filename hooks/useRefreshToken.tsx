'use client';

import { useAuth } from '../components/AuthProvider';
import { mockAuthAPI } from '../lib/services/mockAuth';

const useRefreshToken = () => {
    const { auth, login } = useAuth();

    const refresh = async () => {
        try {
            // Use mock API instead of axios
            const response = await mockAuthAPI.refreshToken(auth?.refreshToken);

            // Update tokens in auth context
            login(response.accessToken, response.refreshToken || auth?.refreshToken || '');
            
            return response.accessToken;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            throw error;
        }
    };

    return refresh;
};

export default useRefreshToken;