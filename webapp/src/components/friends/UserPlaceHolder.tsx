import React from "react";
import User from "../../domain/User";
import {Avatar, Box, Card, CardActionArea, CardContent, CardHeader, Typography} from "@mui/material";
import UserPage from "./UserPage";

interface UserPlaceState {
    changePage : boolean
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
            changePage : false
        }
    }

    private getFriendInfo(user : User) {
        this.props.callback(<UserPage user={user}></UserPage>);
        this.setState({
            changePage : true
        });
    }

    render() {
        return <Box style={{
            display: "flex",
            flexWrap: "wrap",
        }}>
            <Card className="card">
                <CardActionArea onClick={() => {this.getFriendInfo(this.user)}}>
                    <CardHeader avatar={<Avatar>{this.user.getName()?.charAt(0)}</Avatar>} title={this.user.getName()}/>
                    <CardContent>
                        <Typography>Friend text</Typography>
                        <a href={this.user.getWebId()}>SOLID profile</a>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
            ;
    }

}