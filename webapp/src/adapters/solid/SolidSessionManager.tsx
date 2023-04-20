import {getDefaultSession, Session} from "@inrupt/solid-client-authn-browser";
import {useSession} from "@inrupt/solid-ui-react";
import {SessionInfo} from "@inrupt/solid-ui-react/dist/src/hooks/useSession";
import {useState} from "react";

export function isLoggedIn(){
    const { session } = useSession();
    return session.info.isLoggedIn
}

export async function login(url: string) {
    const { session } = useSession();
    localStorage.setItem('solid-provider', url);
    localStorage.setItem('session-state', "login");
    await session.login(
        {
            oidcIssuer: url,
            redirectUrl: window.location.href
        }
    );
}

/**
 * Log out from the app.
 */
export async function logout(): Promise<boolean> {
    const { session } = useSession();
    localStorage.setItem('session-state', "logout");
    await session.logout();
    return session.info.isLoggedIn;
}

/**
 * Complete login after the user comes back from the redirect.
 */
export async function fetchUserData(): Promise<void> {
    const { session } = useSession();
    switch (localStorage.getItem('session-state')) {

        case "login":
            localStorage.setItem('session-state', "handle-redirect");
            break;

        case "handle-redirect":
            localStorage.setItem('session-state', "logged");
            break;

        case "logged":
            await restoreSession();
            break;

        case "logout":
            localStorage.setItem('session-state', "finished");
            session.info.isLoggedIn = false;
            break;

        default:
            break;
    }
}

export async function restoreSession(): Promise<void> {
    const { session } = useSession();
    let provider: string | null = localStorage.getItem('solid-provider');
    if (!session.info.isLoggedIn && provider !== null) {
        console.log("login from restore")
        await login(provider);

    }
}

/**
 * @returns {string} the web ID of the logged user
 */
export function getWebID(): string {
    const { session } = useSession();
    if (session.info.isLoggedIn !== undefined) {
        return session.info.webId as string;
    } else {
        return "Not logged in";
    }
}

/**
 * Fetch from an authenticated session
 * */
export function getSessionFetch() {
    const { session } = useSession();
    return session.fetch;
}

// /**
//  * Manages the POD provider's login and session.
//  */
// export default class SolidSessionManager {
//     private session: SessionInfo;
//     private static instance: SolidSessionManager = new SolidSessionManager();
//
//     private constructor() {
//         this.session = useSession();
//     }
//
//     public static getManager(): SolidSessionManager {
//         return this.instance;
//     }
//
//     /**
//      * Redirect to the POD provider login page.
//      */
//     public async login(url: string): Promise<void> {
//         localStorage.setItem('solid-provider', url);
//         localStorage.setItem('session-state', "login");
//         this.session.session.onLogin(() => this.session.session.info.isLoggedIn = true);
//         await this.session.login(
//             {
//                 oidcIssuer: url,
//                 redirectUrl: window.location.href
//             }
//         );
//     }
//
//     /**
//      * Log out from the app.
//      */
//     public async logout(): Promise<boolean> {
//         localStorage.setItem('session-state', "logout");
//         await this.session.logout();
//         return this.session.session.info.isLoggedIn;
//     }
//
//     /**
//      * Complete login after the user comes back from the redirect.
//      */
//     public async fetchUserData(): Promise<void> {
//         switch (localStorage.getItem('session-state')) {
//
//             case "login":
//                 localStorage.setItem('session-state', "handle-redirect");
//                 break;
//
//             case "handle-redirect":
//                 localStorage.setItem('session-state', "logged");
//                 break;
//
//             case "logged":
//                 await this.restoreSession();
//                 break;
//
//             case "logout":
//                 localStorage.setItem('session-state', "finished");
//                 this.session.session.info.isLoggedIn = false;
//                 break;
//
//             default:
//                 break;
//         }
//     }
//
//     public async restoreSession(): Promise<void> {
//         let provider: string | null = localStorage.getItem('solid-provider');
//         if (!this.isLoggedIn() && provider !== null) {
//             console.log("login from restore")
//             await this.login(provider);
//
//         }
//     }
//
//     /**
//      * @returns {string} the web ID of the logged user
//      */
//     public getWebID(): string {
//         if (this.session.session.info.isLoggedIn !== undefined) {
//             return this.session.session.info.webId as string;
//         } else {
//             return "Not logged in";
//         }
//     }
//
//     /**
//      * @returns {boolean} whether the user is logged in
//      */
//     public isLoggedIn(): boolean {
//         return this.session.session.info.isLoggedIn;
//     }
//
//     /**
//      * Fetch from an authenticated session
//      * */
//     public getSessionFetch() {
//         return this.session.fetch;
//     }
// }