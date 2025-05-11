'use client';

import { axiosPrivate } from '../app/api/axios';
import useRefreshToken from './useRefreshToken';
import { useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';

const useAxiosPrivate = () => {
    const refreshToken = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            (config) => {
                if (!config.headers['Authorization'] && auth?.accessToken) {
                    config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    try {
                        console.log('Token expired, attempting refresh...');
                        const newAccessToken = await refreshToken();
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest);
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        // If refresh token is invalid, redirect to login
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [auth, refreshToken]);

    return axiosPrivate;
};

export default useAxiosPrivate;