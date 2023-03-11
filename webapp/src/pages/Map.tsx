import React from "react";
import SolidSessionManager from "../adapters/solid/SolidSessionManager";

export default class Home extends React.Component {
    private webID: string;

    public constructor(props: any) {
        super(props);
        this.webID = SolidSessionManager.getManager().getWebID();
    }
    
    public render(): JSX.Element {
        return (
            <section className='Map'>
                <h2>Hello {this.webID}</h2>
                {/*<LeafletMapAdapter map={this.data}/>*/}
            </section>
        );
    }
}