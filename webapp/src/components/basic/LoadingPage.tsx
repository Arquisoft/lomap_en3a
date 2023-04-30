import React from "react";
import {CircularProgress} from "@mui/material";

interface LoadingPageProps {
    style?: {},
    size?: number
}

/**
 * Just a simple loading page, arguments can be passed to style it as needed.
 *
 * @param {{}} [style=[{position: "fixed",top: "50%",left: "45%"}]]
 * @param {number} [size=200]
 * @constructor
 */
export default class LoadingPage extends React.Component<LoadingPageProps, any> {

    constructor(props: LoadingPageProps) {
        super(props);
    }

    render() {
        return <div style={this.props.style || {
            position: "fixed",
            top: "50%",
            left: "45%"
        }}><CircularProgress size={this.props.size || 200}></CircularProgress></div>;
    }
}
