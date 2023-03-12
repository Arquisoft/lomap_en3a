import React from "react";
import Header from "./Header";
import {Outlet} from "react-router-dom";
import '../styles/layout.css';

/**
 * The distribution of all app internal pages (everyone except login),
 * consisting of a header and the page content
 */
const Layout : React.FunctionComponent = () => {
    return (
        <div className="Layout">
            <Header/>
            <div className="Content">
                <Outlet/>
            </div>
        </div>
    )
}
export default Layout;