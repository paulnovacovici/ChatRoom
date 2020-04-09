import React from 'react';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Box from '@material-ui/core/Box';
import InfoBar from '../InfoBar/InfoBar';


import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';

import "./UserContainer.css"


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  itemText: {
    margin: 'auto'
  },
  userInnerContainer: {
    overflowY: "scroll"
  }
}));

const UserContainer = ({ users }) => {
  const classes = useStyles();

  return (
    <Paper className="userOutterContainer">
      <InfoBar room={"Users in Room"} />
      <Box flex="1" className={classes.userInnerContainer}>
        <List className={classes.root}>
          {users.map(user => {
            return (
              <div key={user}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar >{user.charAt(0).toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText className={classes.itemText}
                    primary={user}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </div>
            )
          })}
        </List>
      </Box>
    </Paper >
  )
};

export default UserContainer;