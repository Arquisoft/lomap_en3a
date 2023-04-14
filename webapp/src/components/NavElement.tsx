import React from "react";
import {NavLink} from "react-router-dom";

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
        <NavLink style={({isActive}) => ({backgroundColor: isActive ? "blue" : "#002E66"})}
                 to={props.url} role="button" className="NavElement">
            {props.icon}<span>{props.name}</span>
        </NavLink>
    );
}
export default NavElement;