import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import clsx from 'clsx';
import './style.css';

import { Card, CardHeader, CardMedia, CardContent, CardActions } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { red } from '@material-ui/core/colors';

import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NotificationsIcon from '@material-ui/icons/Notifications';


const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "30px",
    borderColor: "#8B0000",
    borderWidth: "12px",
    borderStyle: "double",
    width: "100%",
    height: "100%",
  },
  media: {
    height: 0,
    paddingTop: "56.25%",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function ClassCard(props) {

  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [redirectUser, setRedirectUser] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleEnterClass = (event, classID) => {
    console.log(classID)
    localStorage.setItem( 'classId', classID)
    setRedirectUser('/classrooms')
  }


  if (redirectUser) {

   return <Redirect to={redirectUser}
    />
}

  return (
    <Card className={classes.root} value={props.classID}>
      <CardHeader
        data-classid={props.classID}
        avatar={<Avatar alt="Teacher Image" src={props.teacherAvatar} />}
        title={props.title}
        subheader={props.subheader}
      />
      {props.image ? (
        <CardMedia
          className={classes.media}
          image={props.image}
          title={props.imageTitle}
          src=""
        />
      ) : (
          ""
        )}
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {props.imageCaption}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title="Enter Classroom" aria-label="enter">
          <IconButton onClick={(event) => handleEnterClass(event, props.classID)}>
              <MeetingRoomIcon />
          </IconButton>
        </Tooltip>
        <Badge badgeContent={4} color="secondary">
          <NotificationsIcon />
        </Badge>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Description: </Typography>
          <Typography paragraph>{props.paragraph1}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
