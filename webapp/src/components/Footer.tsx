import React from "react";

export default class Footer extends React.Component<{ style? : React.CSSProperties | undefined }, any> {

    constructor(props: { style?: React.CSSProperties | undefined }) {
        super(props);
    }

    public render() {
        return (
            <footer className={"Footer"} style={this.props.style || {
                backgroundColor: "#002E66",
                color: "white",
                textAlign: "center",
                fontSize: "x-small",
                height: "100%"
            }}>
                <p>LoMap® is a software product developed by the lomap_en3a team</p>
                <p>Carlos Triana Fernández, David Martínez Castañon, Guillermo Dylan Carvajal Aza, Iván Menéndez Mosegui,
                    Pelayo Reguera García</p>
            </footer>
        )
    }
}