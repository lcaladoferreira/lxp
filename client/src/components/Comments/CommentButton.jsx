import React, { useState, useRef } from 'react';
import {Grid, Box, Tooltip, Fab, TextField, Button} from '@material-ui/core';
import CommentIcon from '@material-ui/icons/Comment';


const  CommentButton = (props) => {

    const [visible, setVisible] = useState(false)
    const visibleEl = useRef(null)

    const makeComment = () => {

        if (visible) {
            setVisible(false);
        } else {
            setVisible(true)
        }
        
    }

    return (
        <>
        <Box p={1} alignItems='center'>
        <Grid item xs={2}>
            <Tooltip title="Comentário sobre o anúncio" aria-label="comment">
                    <Fab size="small" color="primary" aria-label='comment' >
                        <CommentIcon onClick={makeComment} />
                    </Fab>
            </Tooltip>
        </Grid>
        </Box>
        <Grid item xs={10}>
            <Box ref={visibleEl} visibility={ visible ? 'visible' : 'hidden'}>
                <TextField 
                variant='outlined' 
                placeholder='Digite o comentário aqui, envie pressionando enter' 
                fullWidth 
                multiline 
                rows='2' 
                margin='dense'
                onChange={props.inputComment}
                onKeyUp={props.submitComment}/>
            </Box>
        </Grid>
        </>
 )

}

export default CommentButton;
