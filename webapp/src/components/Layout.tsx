import React from "react";
import Header from "./Header";
import {Outlet} from "react-router-dom";
import '../styles/layout.css';
import SolidSessionManager from "../adapters/solid/SolidSessionManager";
import Footer from "./Footer";

/**
 * The distribution of all app internal pages (everyone except login),
 * consisting of a header and the page content
 */
export default class Layout extends React.Component {
    public async componentDidMount(): Promise<void> {
        await SolidSessionManager.getManager().fetchUserData();
    }

    public render() {
        return (
            <div className="Layout">
                <Header/>
                <div className="Content">
                    <Outlet/>
                </div>
                <Footer/>
            </div>
        )
    }
}