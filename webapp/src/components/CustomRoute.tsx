import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import SolidSessionManager from "../adapters/solid/SolidSessionManager";

/**
 * It contains the url to which the route redirects to.
 */
interface CustomRouteProps {
    redirectUrl: string;
}

const CustomRoute : React.FunctionComponent<CustomRouteProps> = (props) => {
    return (
        SolidSessionManager.getManager().isLoggedIn()
            ? <Outlet/>
            : <Navigate replace to={props.redirectUrl}/>
    );
}

const PrivateRoute : React.FunctionComponent = () => {
    return <CustomRoute redirectUrl={"/"}/>
}
export default PrivateRoute;