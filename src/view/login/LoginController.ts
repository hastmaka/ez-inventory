import {LOGIN_USER} from "@/api/action/ACTIONS.ts";
import type {Permission} from "@/types";
import {ThemeController} from "@/theme/ThemeController.ts";
import {SignalState, type SignalType} from "@/signals/SignalClass.ts";
import {
    checkRequired,
    handleInput,
    setErrors,
} from "@/signals/signalController/methods";
import {FetchApi} from "@/api/FetchApi.ts";
import {getFromSessionStore, updateSessionStore} from "@/util";
import {loginUser, type UserWithAccessToken} from "@/api/firebase/FirebaseAuth.ts";

if (!getFromSessionStore('isMobile')) updateSessionStore('isMobile', false)

type ErrorTuple = [type: string, name: string, msg: string];

export const LoginController: SignalType<any, any> = new SignalState({
    mode: 'create',
    active: 'signIn' as string,
    loginMessage: {type: '', msg: ''},
    loadingBtn: false,

    formData: {} as Record<string, any>,
    errors: {} as Record<string, any>,

    user: {} as any,
    userModules: [] as number[],
    isMobile: getFromSessionStore('isMobile'),
    activeCompanyId: null,
    activeCompanyName: null,
}, {
    handleInput: (name: string,value: any,type: string) => {
        handleInput.call(LoginController, name,value,type)
    },
    checkRequired: (type: string, fields: any) => {
        return checkRequired.call(LoginController, type, fields)
    },
    setErrors: (type: string | ErrorTuple[],name?: string,msg?: string) => {
        setErrors.call(LoginController, type,name, msg)
    },
    setUser: function (this: any, user: Record<string, any>){
        this.user = user
        this.activeCompanyId = this.user.company_company_id
        this.activeCompanyName = this.user.company.company_name

        // if (this.user.user_email === 'cluis132@yahoo.com') {
            this.user.role.permissions.push(
                {
                    "permission_id": 1,
                    "permission_name": "Dashboard",
                    "permission_description": "Grants access to Dashboard module",
                    "permission_group_permission_group_id": 1,
                    "created_at": "2025-08-26T01:49:31.000Z",
                    "updated_at": "2025-08-26T01:49:31.000Z",
                    "deleted_at": null
                },
                {
                    "permission_id": 100,
                    "permission_name": "Jewelry Module",
                    "permission_description": "Grants read only access to Jewelry module",
                    "permission_group_permission_group_id": 3,
                    "created_at": "2025-08-26T01:49:31.000Z",
                    "updated_at": "2025-08-26T01:49:31.000Z",
                    "deleted_at": null
                },
            )
        // }

        this.userModules =
            this.user.role.permissions.map((p: Permission) => p.permission_id)
        if(this.user?.user_preference) ThemeController.setTheme(this.user.user_preference)
        const currentView = window.location.pathname
        // debugger
        window.navigate(currentView === '/login'
            ? this.isMobile
            ? '/mobile-view'
            :'/app/dashboard'
            : currentView
        )
        console.log(this.user)
    },
    updateUser: async function(this: any, data: Record<string, any>): Promise<void>{
        const {user_id} = this.user
        await FetchApi(
            'v1/user',
            'PUT',
            {user_id, ...data}
        )
    },
    syncUserPreference: async function(this: any, newValues: any){
        const user_preference = {
            ...this.user.user_preference,
            ...newValues
        }
        const response = await FetchApi(
            `v1/user/update/user_preference`,
            'PUT',
            {user_preference}
        )

        if (!response.success) {
            return window.toast.E(`Something went wrong, please contact Admin.`)
        }

        ThemeController.setTheme(response.auth.user.user_preference)
    },
    handleSignIn: async function (this: any, isMobile: boolean): Promise<void> {
        window.sessionStorage.clear()
        this.isMobile = isMobile
        updateSessionStore('isMobile', isMobile)
        this.loadingBtn = true;

        try {
            const response: UserWithAccessToken | { error: number } = await loginUser(
                this.formData?.login.email,
                this.formData?.login.password
            )

            if ("error" in response) {
                const e: Record<number, string> = {
                    400: 'Invalid Credentials',
                    401: 'Too Many Requests',
                    412: 'User Not Found'
                }
                this.loginMessage = {
                    ...this.loginMessage,
                    msg: e[response.error],
                    type: 'error',
                };
                this.loadingBtn = false;
                return
            }

            await LOGIN_USER(response.accessToken!)

        } catch (e: any) {
            if(import.meta.env.DEV) console.log(e)
            LoginController.loginMessage = {
                ...LoginController.loginMessage,
                msg: 'Network Error. Please check your email.',
                type: 'error',
            };
            LoginController.loadingBtn = false;
        }
    }
}).signal