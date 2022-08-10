import React from 'react';
import { Paper, Box } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
const style = {
  background: 'repeating-radial-gradient(circle farthest-side at bottom left, rgb(255, 255, 255) 58%, rgb(97, 219, 251) 89%)',
}


function ClassBanner(props) {

  return (
    <Paper style={style} elevation={16}>
      <Box p={4}>
        <div />
        <Grid container>
          <Grid item md={6}>
            <div>
              <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                {props.title}
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                {props.desc}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

export default ClassBanner;