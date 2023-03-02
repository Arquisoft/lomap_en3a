import React from 'react';
import SolidSessionManager from '../adapters/solid/SolidSessionManager';
import '../styles/login.css';


/**
 * Login page.
 */
export default class Login extends React.Component {

	private sessionManager: SolidSessionManager = SolidSessionManager.getManager();
	private urls: Map<string, string> = new Map();

	/**
	 * Register provider urls
	 */
	public constructor(props: any) {
		super(props);
		this.urls.set("inrupt", "https://inrupt.net/login");
	}

	/**
	 * Returns the login function for a given provider
	 * 
	 * @param {string} provider the pod provider name
	 * @returns {Function} the login function for the provider
	 */
	private getLoginFor(provider: string) {
		let url : string = this.urls.get(provider) + "";
		return this.sessionManager.login.bind(this.sessionManager, url);
	}


	/**
	 * Complete the login after comming back from the redirect.
	 */
	public async componentDidMount(): Promise<void> {
		await this.sessionManager.fetchUserData();
		this.setState({text: this.sessionManager.getWebID()});
	}
    
	/**
	 * POD provider login menu.
	 */
    public render(): JSX.Element {
        return (
			<section className='LoginPage'>
				<h1>LoMap</h1>
				<fieldset>
					<legend>Sign in</legend>
					<section>
						<p>Select your POD provider</p>
						<input type="button" value="Inrupt.net" onClick={this.getLoginFor("inrupt")} />
					</section>
				</fieldset>		
			</section>
        );
    }
}
