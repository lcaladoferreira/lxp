import React, { useEffect, useState } from 'react'
import API from '../utils/API';
import history from '../history/history.jsx';
import CustFunc from '../utils/customFunctions';
import ClassBanner from '../components/ClassBanner/ClassBanner';
import Container from '../components/Container/Container';
import Announcement from '../components/AnnouncementForm/Announcement';
import CommentButton from '../components/Comments/CommentButton';
import Expander from '../components/Comments/ExpansionDiv';
import { Card, CardActions, CardContent, IconButton } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import AssignmentCard from '../components/Assignments/AssignmentCard.jsx'




export const Classroom = (props) => {

    const [classID, setClassID] = useState('')
    const [openDialog, setOpenDialog] = useState(false)
    const [currentClassObj, setCurrentClassObj] = useState([])
    const [announcementObj, setAnnouncementObj] = useState([])
    const [userType, setUserType] = useState("");
    const [userID, setUserID] = useState("")


    useEffect(() => {
        getAndVerifyUserInfo()
        loadClassInfo()
    }, [userType, userID]);

    async function getAndVerifyUserInfo() {
        try {
            await API.readAndVerifyCookie()
                .then((resp) => {
                    console.log("cookie chamando resp: ", resp)
                    console.log("baixando os dados: ", resp.data.payload)
                    setUserType(resp.data.payload.type)
                    setUserID(resp.data.payload._id)
                    console.log(userType)
                    console.log(userID)
                })
        }
        catch (error) {
            console.log(error)
            history.replace('/')
        }
    }

    function loadClassInfo() {

        setClassID(localStorage.getItem('classId'))
        console.log(classID);
        API.populateByID(classID)
            .then(resp => {

                console.log(resp.data)
                setCurrentClassObj(resp.data)
                console.log(currentClassObj)
            })
            .catch
            (err => console.log(err))
    }

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        loadClassInfo()
    };

    function handleDialogInputChange(event) {
        const { name, value } = event.target
        setAnnouncementObj({ ...announcementObj, [name]: value })
    }

    function handleDialogSubmit() {
        if (announcementObj.title && announcementObj.body) {
            console.log('O anúncio parece bom até agora')
            API.createAnnouncement(currentClassObj._id, announcementObj)
                .then((resp) => {
                    console.log(resp)
                    loadClassInfo()
                })
                .then(() => handleDialogClose())
                .then(() => console.log(announcementObj))
                .catch(err => console.log(err))
        }
    }

    function handleDeleteAnnouncement(event, announcementID) {
        API.deleteAnnouncementById(announcementID)
            .then(resp => {
                console.log(resp)
                loadClassInfo()
            })
            .catch(err => console.log(err))
    }

    function handleDeleteComment(event, commentID) {
        API.deleteCommentById(commentID)
            .then(resp => {
                console.log(resp)
                loadClassInfo()
            })
    }

    function handleAddComment(event, announcementIndex) {
        console.log('Adicionando comentario ...')

        const commentInfo = {
            author: userID,
            body: event.target.value.split('\n', 1)[0],
        }

        console.log(announcementIndex);

        if (event.keyCode === 13) {

            API.createComment(currentClassObj.announcements[announcementIndex]._id, commentInfo)
                .then(resp => {

                    console.log(resp)
                    loadClassInfo()
                    event.target.reset()
                   
                })
                .catch(err => console.log(err))

        }
    }

    return (
        <div>
            <ClassBanner title={currentClassObj.courseTitle} desc={currentClassObj.courseDescription} />
            <Grid container>
                <Grid item xs={8}>
                    <Container>
                        <Paper elevation={1} square={false}>
                            <Box p={4} alignItems='center' justifyContent='center' display='flex'>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Paper elevation={2}>
                                            <Card>
                                                <CardContent>
                                                    <Typography /*className={classes.announcementTitle}*/ variant='h5' align='center'>
                                                        QUADRO DE ANÚNCIOS &nbsp; &nbsp;
                                                {userType === 'Teacher' ?
                                                            <Tooltip title="Add an announcement" aria-label="add">
                                                                <Fab size="small" color="primary" aria-label="add">
                                                                    <AddIcon onClick={handleDialogOpen} />
                                                                </Fab>
                                                            </Tooltip> : ''
                                                        }
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Paper>
                                    </Grid>
                                    {/* ---------------------------------------------------------------------- */}
                                    {/* ___________ Este é o início das renderizações dos anúncios_______ */}
                                    {/* ------------------------------------------------------------------------- */}
                                    {
                                        currentClassObj.announcements ? currentClassObj.announcements.map((announcement, index) => {
                                            return (
                                                <>
                                                    <Grid item xs={12}>
                                                        <Paper elevation={15}>
                                                            <Card /*className={classes.root}*/ variant="outlined">
                                                                <CardContent key={index}>

                                                                    <Typography variant="h5" component="h2">
                                                                        <Grid container spacing={2} >
                                                                            <Grid item s={10}>
                                                                                {announcement.title}
                                                                            </Grid>
                                                                            <Grid item s={2}>
                                                                                {userType === 'Teacher' ?
                                                                                    <Tooltip title="Excluir anúncio" aria-label="add">
                                                                                        <IconButton onClick={(event) => handleDeleteAnnouncement(event, announcement._id)}>
                                                                                            <DeleteOutlineIcon color='primary' />
                                                                                        </IconButton>
                                                                                    </Tooltip> : ''
                                                                                }
                                                                            </Grid>
                                                                        </Grid>

                                                                    </Typography>
                                                                    <Typography variant="body2" component="p">
                                                                        {announcement.body}
                                                                    </Typography>
                                                                </CardContent>
                                                                <CardActions>
                                                                    <Grid container spacing={2}>
                                                                        <CommentButton /*inputComment={(event) => { handleCommentChange(event, index) }}*/
                                                                            submitComment={(event) => { handleAddComment(event, index) }} />
                                                                    </Grid>
                                                                </CardActions>

                                                                {announcement.comments ?
                                                                    <Expander>
                                                                        {
                                                                            announcement.comments.map((comment, index) => {
                                                                                return (
                                                                                    <>
                                                                                        <Grid key={index} item xs={12}>
                                                                                            <Paper elevation={16}>
                                                                                                <Card>
                                                                                                    <CardContent>
                                                                                                        <Grid container spacing={2}>
                                                                                                            <Grid item xs={10}>
                                                                                                                <Grid container spacing={2}>
                                                                                                                    <Grid item s={6}>
                                                                                                                        <strong>Author:</strong> &nbsp; {comment.author.firstName + " " + comment.author.lastName}
                                                                                                                    </Grid>
                                                                                                                    <br />
                                                                                                                    <Grid item s={6}>
                                                                                                                        <strong>Postado em:</strong> &nbsp; {CustFunc.formatDate(comment.createDate)}
                                                                                                                    </Grid>
                                                                                                                    <Grid item s={12}>
                                                                                                                        {comment.body}
                                                                                                                    </Grid>
                                                                                                                </Grid>
                                                                                                            </Grid>
                                                                                                            <Grid item xs={2}>
                                                                                                                <Grid container spacing={1}>
                                                                                                                    <Grid item>
                                                                                                                        {userType === 'Teacher' ?
                                                                                                                            <Tooltip title="Excluir sequência de comentários" aria-label="add">
                                                                                                                                <IconButton onClick={(event) => handleDeleteComment(event, comment._id)}>
                                                                                                                                    <DeleteOutlineIcon color='primary' />
                                                                                                                                </IconButton>
                                                                                                                            </Tooltip> : ''
                                                                                                                        }
                                                                                                                    </Grid>
                                                                                                                </Grid>
                                                                                                            </Grid>
                                                                                                        </Grid>
                                                                                                    </CardContent>
                                                                                                </Card>
                                                                                            </Paper>
                                                                                        </Grid>
                                                                                    </>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Expander>
                                                                    : ''
                                                                }
                                                            </Card>
                                                        </Paper>
                                                    </Grid>
                                                </>
                                            )
                                        }) :
                                            <Grid item xs={12}>
                                                <Paper elevation={15}>
                                                    <Card /*className={classes.root}*/ variant="outlined">
                                                        <CardContent>
                                                            <Typography variant="h5" component="h2">
                                                               Nenhum anúncio no momento
                                                    </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Paper>
                                            </Grid>
                                    }
                                    {/* ------------------------------------------------------------------------- */}
                                    {/* ___________ Este é o fim das renderizações do anúncio________________ */}
                                    {/* ------------------------------------------------------------------------- */}
                                </Grid>
                            </Box>
                        </Paper>
                       
                    </Container>
                </Grid>
                <Grid item xs={4} spacing={3}>
                    {/* <p>é aqui que as tarefas aparecem</p> */}
                    {currentClassObj.assignments && currentClassObj.assignments.map(assignment=>(
                        <AssignmentCard
                        title={assignment.title}
                        description={assignment.description}
                        classTitle={currentClassObj.courseTitle}
                        />
                    ))}
                </Grid>
            </Grid>
            {/* ---------------------------------------------------------------------------------------- */}
            {/* ________O componente abaixo renderiza a caixa de diálogo para adicionar um anúncio______ */}
            {/* ----------------------------------------------------------------------------------------- */}
            <Announcement
                open={openDialog}
                close={handleDialogClose}
                handleInput={handleDialogInputChange}
                submitDialog={handleDialogSubmit}
            />

        </div >
    );
}

export default Classroom;