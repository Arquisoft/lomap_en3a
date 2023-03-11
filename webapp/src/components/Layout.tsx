import React from "react";
import Header from "./Header";
import {Outlet} from "react-router-dom";


const Layout : React.FunctionComponent = () => {
    return (
        <div>
            <Header/>
            <div className="content">
                <Outlet/>
            </div>
        </div>
    )
}
export default Layout;