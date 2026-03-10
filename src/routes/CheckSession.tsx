import {LoginController} from '@/view/login/LoginController.ts';
import React, {useEffect, useState} from 'react';
import {LOGIN_USER} from '@/api/action/ACTIONS.ts';
import EzLoader from '@/ezMantine/loader/EzLoader.tsx';
import {auth} from '@/api/firebase/FirebaseConfig.ts';
import {onAuthStateChanged} from 'firebase/auth';

function CheckSession({children}: { children?: React.ReactNode }) {
    const {user} = LoginController;
    const [validSession, setValidSession] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                if (Object.keys(user).length === 0) {
                    try {
                        const token = await firebaseUser.getIdToken();
                        await LOGIN_USER(token);
                        setValidSession(true);
                    } catch {
                        window.navigate('/login');
                    }
                } else {
                    setValidSession(true);
                }
            } else {
                window.navigate('/login');
            }
        });
        return () => unsubscribe();
    }, []);

    if (!validSession) return <EzLoader h='100vh' centerProps={{flex: 1}}/>;

    return children;
}

export default CheckSession;
