import React from "react";
import {Navigate, Outlet} from "react-router-dom";
//import SolidSessionManager from "../adapters/solid/SolidSessionManager";
import {isLoggedIn} from "../adapters/solid/SolidSessionManager";

/**
 * It contains the url to which the route redirects to.
 */
interface CustomRouteProps {
    redirectUrl: string;
}

/**
 * It redirects to the specified url if the user is not logged in.
 * @param props It contains the url to redirect if it is not logged in.
 */
const CustomRoute : React.FunctionComponent<CustomRouteProps> = (props) => {
    return (
        isLoggedIn
            ? <Outlet/>
            : <Navigate replace to={props.redirectUrl}/>
    );
}

/**
 * It redirects to the login page in case the user is not logged in.
 */
const PrivateRoute : React.FunctionComponent = () => {
    return <CustomRoute redirectUrl={"/"}/>
}
export default PrivateRoute;