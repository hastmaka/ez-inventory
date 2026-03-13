import {getFromSessionStore, updateSessionStore} from "@/util/updateLocalStore.ts";
import {LoginController} from "@/view/login/LoginController.ts";
import {SignalState, type SignalType} from "@/signals/SignalClass.ts";

if (!getFromSessionStore('theme')) {updateSessionStore('theme', 'light')}

export const ThemeController: SignalType<any, any> = new SignalState({
    primaryColor: getFromSessionStore('primaryColor') || 'blue',
    theme: getFromSessionStore('theme') || 'dark',
},{
    getLogo: function(this:any, _type: string, force = ''){
        const me = ThemeController,
            theme = force || me.theme;

        return theme === 'dark'
            ? '/ez-in_slogan.svg'
            : '/ez-in_slogan_black.svg'
    },
    toggleTheme: async function(this: any, isLocal: boolean = false){
        const theme = this.theme
        this.theme = theme === 'dark' ? 'light' : 'dark'
        if (isLocal) {
            return updateSessionStore('theme', 'light')
        }
        await LoginController.syncUserPreference({ theme: this.theme });
    },
    setTheme: function (this: any, preferences: Record<string, any>){
        this.theme = preferences.theme || 'dark'
        this.primaryColor = preferences.color || 'blue'
        updateSessionStore('theme', this.theme)
        updateSessionStore('primaryColor', this.primaryColor)
    },
    setPrimaryColor: function (this: any, color: string) {
        this.primaryColor = color
        updateSessionStore('primaryColor', color)
    },
}).signal