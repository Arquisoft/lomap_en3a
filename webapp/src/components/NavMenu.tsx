import React, {useState} from "react";
import { Link } from "react-router-dom"
import * as NavIcon from "react-icons/fa";
import '../styles/navmenu.css';

const NavMenu: React.FunctionComponent = () => {
    const [open, setOpen] = useState(false);
    const displayMenu = () => setOpen(!open);
    return (
        <div className='NavMenu'>
            <MenuButton displayMenu={displayMenu}/>
            <NavList open={open}/>
        </div>
    )
}
export default NavMenu

interface MenuButtonProps {
    displayMenu: () => void;
}

const MenuButton: React.FunctionComponent<MenuButtonProps> = (props) => {
    const [icon, setIcon] = useState(<NavIcon.FaBars/>)
    const [menuOpened, setMenuOpened] = useState(false)
    const { displayMenu } = props;
    const openMenu = () => {
        displayMenu();
        setMenuOpened(!menuOpened);
    }
    const displayIcon = () => {
        if (menuOpened) {
            return <NavIcon.FaTimes/>;
        }
        return <NavIcon.FaBars/>;
    }
    return (
        <button onClick={openMenu} className="MenuButton">
            {displayIcon()}
        </button>
    )
}

interface NavListProps {
    open : boolean;
}

const NavList: React.FunctionComponent<NavListProps> = (props) => {
    if (props.open) {
        return (
            <div className="NavList">
                <NavElement url={"/home"} name={"Home"} icon={<NavIcon.FaHome/>}/>
                <NavElement url={"/personal"} name={"My places"} icon={<NavIcon.FaUser/>}/>
                <NavElement url={"/friends"} name={"Friends"} icon={<NavIcon.FaUserFriends/>}/>
                <NavElement url={"/public"} name={"Public map"} icon={<NavIcon.FaGlobeAmericas/>}/>
            </div>
        )
    }
    else {
        return <div></div>;
    }
}

interface NavElementProps {
    url: string;
    name: string;
    icon: React.ReactNode;
}

const NavElement : React.FunctionComponent<NavElementProps> = (props) => {
    return (
        <Link to={props.url} className="NavElement">
            {props.icon}{props.name}
        </Link>
    );
}