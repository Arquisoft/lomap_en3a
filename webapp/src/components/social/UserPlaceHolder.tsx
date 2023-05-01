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
            <Tooltip title={"See " + this.props.user.getName() + "'s profile"} variant={"soft"} enterDelay={500} arrow>
                <Card className="card">
                    <CardActionArea sx={{height: "100%"}} className="card" onClick={() => {
                        this.getFriendInfo(this.user)
                    }}>
                        <CardHeader avatar={<Avatar alt="User avatar"
                                                    sx={{
                                                        backgroundColor: "#B2CCEB",
                                                        width: 60,
                                                        height: 60
                                                    }}>{this.user.getName()?.charAt(0)}</Avatar>}
                        />
                        <CardContent>
                            <h3>{this.user.getName()}</h3>
                            <Typography>Friend text</Typography>
                            <a href={this.user.getWebId()}>SOLID profile</a>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Tooltip>
        </Box>
            ;
    }

}