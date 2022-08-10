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
import CreateIcon from '@material-ui/icons/Create';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import TableChartIcon from '@material-ui/icons/TableChart';
import NotificationsIcon from '@material-ui/icons/Notifications';


const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "30px",
    borderColor: "#61dbfb",
    borderWidth: "12px",
    borderStyle: "double",
    width: "100%",
    height: "100%",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", 
    display: "block",
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

  const handleEnterGradebook = (event, classID) => {
    localStorage.setItem ( 'classId', classID)
    setRedirectUser('/grades')
  }

  if (redirectUser) {
   
   return <Redirect to={redirectUser}
    />
}

  return (
    <Card className={classes.root} value={props.classID}>
      <CardHeader
        data-classid={props.classID}
        avatar={<Avatar alt="Foto do Professor" src={props.teacherAvatar} />}
        action={
          <IconButton
            aria-label="settings"
            aria-controls="simple-menu"
            onClick={props.settingsButton}
            data-classid={props.classID}
          >
            <MoreVertIcon />
          </IconButton> }
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
            <IconButton aria-label="edit">
              <CreateIcon />
            </IconButton>
        <Tooltip title="Entre com a Sala de Aula" aria-label="enter">
          <IconButton onClick={(event) => handleEnterClass(event, props.classID)}>
              <MeetingRoomIcon />
          </IconButton>
        </Tooltip>
            <Tooltip title="Vá para a grade curricular" aria-label="enter">
              <IconButton onClick={(event) => handleEnterGradebook(event, props.classID)}>
                  <TableChartIcon />
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
          aria-label="mostre-me mais"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Descrição: </Typography>
          <Typography paragraph>{props.paragraph1}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
