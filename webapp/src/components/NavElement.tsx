import React from "react";
import {Link} from "react-router-dom";

interface NavElementProps {
    url: string;
    name: string;
    icon: React.ReactNode;
}

const NavElement : React.FunctionComponent<NavElementProps> = (props) => {
    return (
        <Link to={props.url} role="button" className="NavElement">
            {props.icon}<span>{props.name}</span>
        </Link>
    );
}
export default NavElement;