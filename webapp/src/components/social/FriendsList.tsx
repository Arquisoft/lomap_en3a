import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import User from "../../domain/User";

export default function FriendsList(props: { users: User[] }) {
    return (
        <List sx={{
            width: '100%',
            maxWidth: 360,
            border: "0.05em solid black",
            borderRadius: "1em",
            margin: "0.3em 0 0.5em 0",
            overflow: "scroll"
        }}>
            {props.users.map((user) => (
                <>
                <div className='members-list'>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={user.getName() || user.getWebId()} src={user.photo}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={user.getName() || user.getWebId()}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{display: 'inline'}}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {user.organization}
                                    </Typography>
                                    {user.note == null ? " - No note" : " - " + user.note}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    <Divider variant="inset" component="li"/>
                </div>
                </>
            ))}
        </List>
    );
}