import {
    getDefaultSession,
    handleIncomingRedirect,
    login,
    Session
} from "@inrupt/solid-client-authn-browser";


/**
 * Manages the POD provider's login and session.
 */
export default class SolidSessionManager {
    private session: Session;
    private static instance: SolidSessionManager = new SolidSessionManager();

    private constructor() {
        this.session = getDefaultSession();
    }

    public static getManager(): SolidSessionManager {
        return this.instance;
    }

    /**
     * Redirect to the POD provider login page.
     */
    public async login(url: string): Promise<void> {
        localStorage.setItem('solid-provider', url);
        localStorage.setItem('session-state', "login");
        await login(
            {
                oidcIssuer: url,
                redirectUrl: window.location.href
            }
        );
        let hola = await handleIncomingRedirect();
        let sesion = getDefaultSession();
    }

    /**
     * Log out from the app.
     */
    public async logout(): Promise<boolean> {
        localStorage.setItem('session-state', "logout");
        await this.session.logout();
        return this.session.info.isLoggedIn;
    }

    /**
     * Complete login after the user comes back from the redirect.
     */
    public async fetchUserData(): Promise<void> {
        switch (localStorage.getItem('session-state')) {

            case "login": 
                localStorage.setItem('session-state', "handle-redirect");
                let adios = await handleIncomingRedirect({restorePreviousSession: true});
                break;

            case "handle-redirect":
                localStorage.setItem('session-state', "logged");
                break;

            case "logged":
                await this.restoreSession();
                break;

            case "logout":
                localStorage.setItem('session-state', "finished");
                this.session.info.isLoggedIn = false;
                break;

            default:
                break;
        }
    }

    public async restoreSession(): Promise<void> {
        let provider: string|null = localStorage.getItem('solid-provider');
        if (!this.isLoggedIn() && provider!==null) {
            console.log("login from restore")
            await this.login(provider);

        }
    }

    /**
     * @returns {string} the web ID of the logged user
     */
    public getWebID(): string {
        if (this.session.info.webId !== undefined) {
            return this.session.info.webId;
        } else {
            return "Not logged in";
        }
    }

    /**
     * @returns {boolean} whether the user is logged in
     */
    public isLoggedIn(): boolean {
        return (getDefaultSession()).info.isLoggedIn;
    }

    /**
     * Fetch from an authenticated session
     * */
    public getSessionFetch() {
        return this.session.fetch;
    }
}