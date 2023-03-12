import React from "react";
import * as NavIcon from "react-icons/fa";
import '../styles/navmenu.css';
import NavElement from "./NavElement";

/**
 * The navigation menu.
 */
const NavMenu: React.FunctionComponent = () => {
    return (
        <div className='NavMenu'>
            <NavElement url={"/home"} name={"Home"} icon={<NavIcon.FaHome/>}/>
            <NavElement url={"/personal"} name={"My places"} icon={<NavIcon.FaUser/>}/>
            <NavElement url={"/friends"} name={"Friends"} icon={<NavIcon.FaUserFriends/>}/>
            <NavElement url={"/public"} name={"Public map"} icon={<NavIcon.FaGlobeAmericas/>}/>
        </div>
    )
}
export default NavMenu;