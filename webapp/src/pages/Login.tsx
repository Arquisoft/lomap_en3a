import React from 'react';
import {Navigate} from 'react-router-dom';
import SolidSessionManager from '../adapters/solid/SolidSessionManager';
import '../styles/login.css';
import PODManager from '../adapters/solid/PODManager';


/**
 * Login page.
 */
export default class Login extends React.Component<{}, { loggedIn: boolean }> {

    private sessionManager: SolidSessionManager = SolidSessionManager.getManager();
    private urls: Map<string, string> = new Map();

    /**
     * Register provider urls
     */
    public constructor(props: any) {
        super(props);
        this.state = {loggedIn: false};
        this.urls.set("inrupt", "https://inrupt.net/login");
        this.urls.set("solidcommunity", "https://solidcommunity.net/login");
    }

    /**
     * Returns the login function for a given provider
     *
     * @param {string} provider the pod provider name
     * @returns {Function} the login function for the provider
     */
    private getLoginFor(provider: string) {
        let url: string = this.urls.get(provider) + "";
        return this.sessionManager.login.bind(this.sessionManager, url);
    }


    /**
     * Complete the login after comming back from the redirect.
     */
    public async componentDidMount(): Promise<void> {
        await this.sessionManager.fetchUserData();
        this.setState({loggedIn: this.sessionManager.isLoggedIn()});
    }

    /**
     * POD provider login menu.
     */
    public render(): JSX.Element {
        if (this.state.loggedIn) {
            new PODManager().init();
            return (<Navigate to="/map/public" replace={true}/>);
        }
        return (
            <>
                <main className='LoginPage'>
                    <h1>LoMap</h1>
                    <h2>Welcome!</h2>
                    <fieldset>
                        <legend>Sign in</legend>
                        <section>
                            <p>Select your POD provider</p>
                            <input style={{marginBottom: "0.3em"}} id="login" type="button" value="Inrupt.net" onClick={this.getLoginFor("inrupt")}/>
                            <input id="loginSC" type="button" value="SolidCommunity" onClick={this.getLoginFor("solidcommunity")}/>
                        </section>
                    </fieldset>
                </main>
            </>
        );
    }
}
