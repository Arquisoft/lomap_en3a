import React from "react";
import User from "../../domain/User";
import {Avatar, Box, Card, CardActionArea, CardContent, CardHeader, Typography} from "@mui/material";

interface UserPlaceHolderProps {
    user: User
}

export default class UserPlaceHolder extends React.Component<UserPlaceHolderProps> {

    private user: User;

    constructor(props: UserPlaceHolderProps) {
        super(props);
        this.user = props.user;
    }

    render() {
        return <Box style={{
            display: "flex",
            flexWrap: "wrap",
        }}>
            <Card className="card">
                <CardActionArea onClick={() => {
                    console.log("Card clicked!")
                }}>
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