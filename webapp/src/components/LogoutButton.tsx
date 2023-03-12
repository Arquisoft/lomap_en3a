import SolidSessionManager from "../adapters/solid/SolidSessionManager";
import React from "react";
import {Link, useNavigate} from "react-router-dom";

interface LogoutButtonProps {
    style : React.CSSProperties;
}
const LogoutButton : React.FunctionComponent<LogoutButtonProps>  = ({style = {}}) => {

    const navigate = useNavigate();
    const logout = async () => {
        await SolidSessionManager.getManager().logout();
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