import React from 'react';
import {Navigate} from 'react-router-dom';
import SolidSessionManager from '../adapters/solid/SolidSessionManager';
import '../styles/login.css';


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
            return (<Navigate to="/home" replace={true}/>);
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
                            <input id="login" type="button" value="Inrupt.net" onClick={this.getLoginFor("inrupt")}/>
                        </section>
                    </fieldset>
                </main>
                <div className="coloredGround">
                    <section className="infoLoMap">
                        <h2>What is LoMap?</h2>
                        <p>LoMap is the ultimate social mapping application that lets you share your favorite places
                            with friends, family, and anyone in your social network.</p>
                        <p> With LoMap, you can discover new destinations, create custom maps, and connect with
                            others
                            who
                            share your interests.</p>
                        <p>LoMap features an intuitive interface that's easy to use and packed with powerful
                            features.
                            But what sets LoMap apart is the ability to share your favorite locations with others
                            using
                            PODs, with groups of friends or family members.</p>
                        <p>Whether you want to share the best coffee shops in your neighborhood, the top hiking
                            trails
                            in your area, or your favorite hidden gems in a foreign city,
                            LoMap makes it easy to create, share, and explore with others.
                        </p>
                        <p>So why wait? Start using LoMap today and discover new places, connect with friends,
                            and explore the world like never before.</p>
                    </section>
                </div>
            </>
        );
    }
}
