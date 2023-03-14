import {getDefaultSession, ISessionInfo, Session} from "@inrupt/solid-client-authn-browser";


/**
 * Manages the POD provider's login and session.
 */
export default class SolidSessionManager {
    private session: Session;
    private static instance: SolidSessionManager = new SolidSessionManager();

    private constructor() {
        this.session = getDefaultSession();
        this.restoreSession();
    }

    private restoreSession(): void {
        let str : string|null =localStorage.getItem('solid-session');

        if (str !== null && str !== '') {
            let storedInfo: ISessionInfo = JSON.parse(str) as ISessionInfo;
            Object.assign(this.session.info, storedInfo); 
        }
    }

    private saveSession(): void {
        localStorage.setItem('solid-session', JSON.stringify(this.session.info));
    }

    public static getManager(): SolidSessionManager {
        return this.instance;
    }

    /**
     * Redirect to the POD provider login page.
     */
    public async login(url: string): Promise<void> {
        await this.session.login(
            {
                oidcIssuer: url,
                redirectUrl: window.location.href
            }
        );
    }

    /**
     * Log out from the app.
     */
    public async logout(): Promise<boolean> {
        await this.session.logout();
        this.saveSession(); 
        return this.session.info.isLoggedIn;
    }

    /**
     * Complete login after the user comes back from the redirect.
     */
    public async fetchUserData(): Promise<void> {
        await this.session.handleIncomingRedirect();
        this.saveSession(); 
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
        return this.session.info.isLoggedIn;
    }

}