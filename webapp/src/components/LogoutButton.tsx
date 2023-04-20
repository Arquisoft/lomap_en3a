//import SolidSessionManager from "../adapters/solid/SolidSessionManager";
import {logout} from "../adapters/solid/SolidSessionManager";
import React from "react";
import {Link, useNavigate} from "react-router-dom";

/**
 * It provides the style to be used by the logout button.
 */
interface LogoutButtonProps {
    style : React.CSSProperties;
}

/**
 * When clicked, it logs out of the session and redirects to the login page.
 * @param style The style of the button.
 */
const LogoutButton : React.FunctionComponent<LogoutButtonProps>  = ({style = {}}) => {

    const navigate = useNavigate();
    const logout = async () => {
        await logout();
    }
    function logoutOnClick() {
        logout().then(() => navigate("/"));
    }

    return (
        <Link style={style} to="/" onClick={logoutOnClick} className="LogoutButton">
            Log out
        </Link>
    );
}
export default LogoutButton;