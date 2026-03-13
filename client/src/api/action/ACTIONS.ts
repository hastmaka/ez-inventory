import {FetchApi} from "../FetchApi.ts";
import {LoginController} from "@/view/login/LoginController.ts";
import {logoutUser} from "@/api/firebase/FirebaseAuth.ts";
import {getModel} from "@/api/models";

export const LOGOUT_USER = async () => {
    window.toast.Progress({
        id: 'logging-out',
        title: 'Logging Out...',
        message: 'Please Wait',
    })
    return await logoutUser()
}

export const LOGIN_USER =
    async (token?: string): Promise<void> => {
        if (!token) {
            return LOGOUT_USER();
        }

        const dbUser = await FetchApi('login', 'POST');

        if (dbUser?.newUser) {
            LoginController.active = 'newUser';
            LoginController.loadingBtn = false;
            return;
        }

        if (dbUser) {
            const user = new (getModel('user'))(dbUser.auth.user);
            LoginController.setUser(user);
            LoginController.loadingBtn = false;
        } else {
            return LOGOUT_USER();
        }
    }

