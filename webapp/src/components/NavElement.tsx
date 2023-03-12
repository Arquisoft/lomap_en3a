import React from "react";
import {Link} from "react-router-dom";

/**
 * It contains the url to which it goes to after being selected,
 * its name and its icon.
 */
interface NavElementProps {
    url: string;
    name: string;
    icon: React.ReactNode;
}

/**
 * An element of the navigation menu.
 * @param props It has its url, name, and icon.
 */
const NavElement : React.FunctionComponent<NavElementProps> = (props) => {
    return (
        <Link to={props.url} role="button" className="NavElement">
            {props.icon}<span>{props.name}</span>
        </Link>
    );
}
export default NavElement;