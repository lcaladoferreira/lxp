import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <div className= {classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <h2>Carregue seu programa de estudos:</h2>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper className={classes.paper}>
            <h5>Classe 1</h5>
            <h6>terças/quartas 14:00-16:00</h6>
            <h6>28 alunos</h6>
            <Button
                variant="contained"
                color="default"
                href="..."
                className={classes.button}
                startIcon={<CloudUploadIcon />}>
                Carregar programa de estudos
            </Button>
            <h7>placeholder, transformá-los em cartões</h7>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper className={classes.paper}>
            <h5>Classe 1</h5>
            <h6>terças/quartas 14:00-16:00</h6>
            <h6>28 alunos</h6>
            <Button
                variant="contained"
                color="default"
                href="..."
                className={classes.button}
                startIcon={<CloudUploadIcon />}>
                Carregar programa de estudos
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper className={classes.paper}>
                Classe 3
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper className={classes.paper}>
                Classe 4
          </Paper>
        </Grid>
      </Grid>  
    </div>
  );
}
