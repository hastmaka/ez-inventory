import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { signInWithCustomToken } from 'firebase/auth';
import { Center, Text } from '@mantine/core';

import { auth } from '@/api/firebase/FirebaseConfig.ts';
import { FetchApi } from '@/api/FetchApi.ts';
import { LOGIN_USER } from '@/api/action/ACTIONS.ts';
import EzLoader from '@/ezMantine/loader/EzLoader.tsx';

export default function EnRouter() {
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const userId = searchParams.get('user_id');
        const redirectUrl = searchParams.get('url') || '';

        async function verifySession() {
            try {
                const response = await FetchApi(
                    'user/verify/2fa', 'GET', null,
                    { user_code: code, user_id: userId },
                );
                if (!response?.success) {
                    setError('Verification failed');
                    return;
                }
                await signInWithCustomToken(auth, response.auth.token);
                const token = await auth.currentUser?.getIdToken();
                await LOGIN_USER(token);
                navigate(redirectUrl, { replace: true });
            } catch {
                setError('Something went wrong');
            }
        }

        verifySession().then();
    }, []);

    if (error) {
        return (
            <Center h="100vh">
                <Text c="red">{error}</Text>
            </Center>
        );
    }

    return <EzLoader h="100vh" />;
}