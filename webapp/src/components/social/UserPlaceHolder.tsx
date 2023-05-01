import React from "react";
import User from "../../domain/User";
import {Avatar, Box, Card, CardActionArea, CardContent, CardHeader, Typography} from "@mui/material";
import UserPage from "./UserPage";
import {Tooltip} from "@mui/joy";

interface UserPlaceState {
    changePage: boolean
}

interface UserPlaceHolderProps {
    user: User
    callback: (component: JSX.Element) => void
}

/**
 * A placeholder to preview the user, if clicked it shows the full UserPage of the user.
 * @param {User} user - The user to be previewed
 * @param {(component:JSX.Element)=>void} callback - a callback function to present the UserPage over
 *                                                   the Social element.
 * @author UO283069
 */
export default class UserPlaceHolder extends React.Component<UserPlaceHolderProps, UserPlaceState> {

    /**
     * The user that is being represented
     * @readonly
     * @private
     */
    private readonly user: User;

    constructor(props: UserPlaceHolderProps) {
        super(props);
        this.user = props.user;
        this.state = {
            changePage: false
        }
        console.log(this.user);
    }

    private getFriendInfo(user: User) {
        this.props.callback(<UserPage user={user}></UserPage>);
        this.setState({
            changePage: true
        });
    }

    render() {
        return <Box style={{
            display: "flex",
            flexWrap: "wrap",
        }}>
            <Tooltip title={"See " + (this.props.user.getName() || "Unknwon") + "'s profile"} variant={"soft"} enterDelay={500} arrow>
                <Card className="card">
                    <CardActionArea sx={{height: "100%"}} className="card" onClick={() => {
                        this.getFriendInfo(this.user)
                    }}>
                        <CardHeader sx={{height: 70, marginTop: 5, paddingTop: 0, marginLeft:"15%"}} avatar={<Avatar alt="User avatar"
                                                                                                   src={this.user.photo}
                                                                                                   sx={{
                                                                                                       backgroundColor: "#B2CCEB",
                                                                                                       width: 100,
                                                                                                       height: 100
                                                                                                   }}>{this.user.getName()?.charAt(0)}</Avatar>}
                        />
                        <CardContent sx={{paddingTop: 0}}>
                            <h3 style={{fontSize: "x-large", marginBottom: 0}}>{this.user.getName() || "Unknown friend"}</h3>
                            <h4 style={{color: "#2D2D2D", marginTop: 0, marginBottom: 0}}>{this.user.organization}</h4>
                            <h5 style={{color: "#505050", marginTop: 0, marginBottom: 0}}>{this.user.role}</h5>
                            <p style={{marginTop: 0}}>{this.user.note}</p>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Tooltip>
        </Box>
            ;
    }

}