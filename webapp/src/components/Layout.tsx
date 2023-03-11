import React from "react";
import Header from "./Header";
import {Outlet} from "react-router-dom";


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