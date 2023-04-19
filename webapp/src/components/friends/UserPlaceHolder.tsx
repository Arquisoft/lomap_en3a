import React from "react";
import User from "../../domain/User";
import {Avatar, Box, Card, CardActionArea, CardContent, CardHeader, Typography} from "@mui/material";
import UserPage from "./UserPage";

interface UserPlaceState {
    changePage: boolean
}

interface UserPlaceHolderProps {
    user: User
    callback: (component: JSX.Element) => void
}

export default class UserPlaceHolder extends React.Component<UserPlaceHolderProps, UserPlaceState> {

    private readonly user: User;

    constructor(props: UserPlaceHolderProps) {
        super(props);
        this.user = props.user;
        this.state = {
            changePage: false
        }
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
        </Box>
            ;
    }

}