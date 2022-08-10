import React, { useState, useEffect, useCallback } from "react";
import API from "../utils/API";
import custFunc from "../utils/customFunctions";
import Container from "../components/Container/Container.jsx";
import TeacherClassCard from "../components/ClassCard/TeacherClassCard";
import StudentClassCard from "../components/ClassCard/StudentClassCard";
import Card from "@material-ui/core/Card";
import { styled } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { Button, Input, TextField } from "@material-ui/core";
import { Menu, MenuItem } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";
import history from "../history/history.jsx";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const MyCard = styled(Card)({
  background: "transparent",
  alignItems: "center",
  display: "flex",
});

const DashBoardTeacher = (props) => {
  const matches = useMediaQuery("(max-width:600px)");
  const [openDialog, setOpenDialog] = useState(false);
  const [newClassFormObj, setNewClassFormObj] = useState({});
  const [classesArr, setClassesArr] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedFile, setSelectedFile] = useState({});
  const [currentClass, setCurrentClass] = useState("");
  const [userType, setUserType] = useState("");
  const [userID, setUserID] = useState("");

  const getAndVerifyUserInfo = useCallback(() => {
    API.readAndVerifyCookie()
      .then((resp) => {
        console.log("cookie chamando resp: ", resp);
        console.log("baixando a carga: ", resp.data.payload);
        setUserType(resp.data.payload.type);
        setUserID(resp.data.payload._id);

        //carrega as classes após o userID e userType serem recebidos do token
      })
      .catch((error) => {
        console.log(error);
        history.replace("/");
      });
  }, []);

  //Esta função chama o backend e carrega todas as classes do banco de dados na página do painel
  //Eventualmente esta função irá carregar apenas as classes que o usuário tem acesso também
  const loadClasses = useCallback(() => {
    console.log(userID);
    API.getClassesbyUser(userID)
      .then((resp) => {
        console.log(resp.data);

        const newDataObj = resp.data.map((value, index) => {
          console.log(value);
          value.badgenotify = value.announcements.length;

          if (value.image) {
            console.log("exists");

            const base64flag = "data:" + value.image.contentType + ";base64,";
            const imageStr = custFunc.arrayBufferToBase64(
              value.image.data.data
            );

            value.imageBase64Str = base64flag + imageStr;
            return value;
          } else {
            console.log("Não existe");
            return value;
          }
        });

        setClassesArr(newDataObj);
      })
      .catch((err) => console.log(err));
  }, [userID]);

  useEffect(() => {
    getAndVerifyUserInfo();
    loadClasses();
  }, [getAndVerifyUserInfo, loadClasses]);

  function handleDialogClose() {
    setOpenDialog(false);
  }

  function handleCreateClass() {
    setOpenDialog(true);
  }

  function handleMenuClick(event) {
    console.log(userType);
    setMenuAnchor(event.currentTarget);
    setCurrentClass(event.currentTarget.dataset.classid);
  }

  function handleMenuClose() {
    setMenuAnchor(null);
  }

  function fileSelectHandler(event) {
    setSelectedFile(event.target.files[0]);
  }

  function updateClassImage() {
    console.log(selectedFile);
    console.log(currentClass);
    const fd = new FormData();

    fd.set("image", selectedFile, selectedFile.name);

    API.updateClassImage(currentClass, fd)
      .then((resp) => {
        console.log("imagem salva");
        console.log(resp);
      })
      .catch((err) => console.log(err));
  }

  function handleChangeTitle() {
    return <input type="email" placeholder="insira as informações do título"></input>;
  }

  //Esta função é chamada pelas tags de entrada e tags textarea no formulário dailog para o botão adicionar uma classe
  //Coloca o conteúdo que o usuário está digitando nessas tags no newClassFormObj para que possa ser enviado ao clicar no botão
  function handleInputChange(event) {
    console.log(event.target.name);
    const { name, value } = event.target;
    setNewClassFormObj({ ...newClassFormObj, [name]: value });
  }

  //Esta função é chamada pelo botão enviar no formulário de diálogo de criação de classe. Ele pega todas as informações do formulário de diálogo de classe que
   //foi atualizado e colocado em newClassFormObj por onChange e o envia para o backend por meio da função API.addclass()
  function handleDailogSubmit() {
    //Isso está sendo feito manualmente porque o modelo de usuário e a autenticação ainda estão sendo trabalhados

    newClassFormObj.userID = userID;

    console.log(newClassFormObj);
    API.addClass(newClassFormObj)
      .then((resp) => {
        loadClasses();
        handleDialogClose();
      })
      .catch((err) => console.log(err));
  }

  return (
    <Container fluid>
      <Grid align="center">
        <svg viewBox="0 0 4000 490">
          <symbol id="s-text">
            <text
              textAnchor="middle"
              x="50%"
              y="50%"
              style={{ fontSize: "14vw" }}
            >
              Painel da sala de aula
            </text>
          </symbol>

          <g className="g-ants">
            <use xlinkHref="#s-text" className="text-copy"></use>
            <use xlinkHref="#s-text" className="text-copy"></use>
            <use xlinkHref="#s-text" className="text-copy"></use>
            <use xlinkHref="#s-text" className="text-copy"></use>
            <use xlinkHref="#s-text" className="text-copy"></use>
          </g>
        </svg>
        {userType === "Teacher" ? (
          <p className="teachertext">
            Click the{" "}
            <Fab size="small" color="secondary" aria-label="add">
              <AddIcon onClick={handleCreateClass} />
            </Fab>{" "}
            <span> para criar um curso</span>
          </p>
        ) : (
          ""
        )}
      </Grid>
      <MyCard>
        <Grid
          style={matches ? { display: "block" } : {}}
          container
          spacing={5}
          align="center"
        >
          {classesArr.length > 0 ? (
            classesArr.map((item, index) => {
              if (item.teacherID.includes(userID)) {
                return (
                  <Grid key={index} item md={4} align="center">
                    <TeacherClassCard
                      key={index}
                      title={item.courseTitle}
                      subheader={item.courseDiscipline}
                      paragraph1={item.courseDescription}
                      image={item.imageBase64Str}
                      imageTitle="a"
                      imageCaption=""
                      settingsButton={handleMenuClick}
                      classID={item._id}
                      badgenotify={item.badgenotify}
                    ></TeacherClassCard>
                  </Grid>
                );
              } else {
                return (
                  <Grid key={index} item md={4} align="center">
                    <StudentClassCard
                      key={index}
                      title={item.courseTitle}
                      subheader={item.courseDiscipline}
                      paragraph1={item.courseDescription}
                      image={item.imageBase64Str}
                      imageTitle="a"
                      imageCaption=""
                      settingsButton={handleMenuClick}
                      classID={item._id}
                      badgenotify={item.badgenotify}
                    ></StudentClassCard>
                  </Grid>
                );
              }
            })
          ) : (
            <p>Nenhuma aula encontrada</p>
          )}
        </Grid>
        {/* --------------------------------------------------------------------- */}
        {/*____________ Abaixo desta linha está o menu para cartões de classe____ */}
        {/* ----------------------------------------------------------------------*/}
        <Menu
          id="simple-menu"
          anchorEl={menuAnchor}
          keepMounted
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem>
            <label>
             Adicionar imagem à classe: &nbsp;
              <input type="file" onChange={fileSelectHandler} />
            </label>
            <button onClick={updateClassImage}>ENVIAR</button>
          </MenuItem>
          <MenuItem onClick={handleChangeTitle}>Alterar título</MenuItem>
          <MenuItem onClick={handleMenuClose}>Alterar Descrição</MenuItem>
        </Menu>
      </MyCard>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Adicionar uma classe</DialogTitle>
        <DialogContent>
          <DialogContentText>
           Por favor, insira as informações da sua sala de aula abaixo ...
          </DialogContentText>
          <label>
            Titulo do Curso:
            <Input
              autoFocus
              disableUnderline
              margin="dense"
              id="title"
              name="title"
              type="text"
              fullWidth
              onChange={handleInputChange}
            />
          </label>
          <label>
            Disciplina do Curso:
            <Input
              autoFocus
              disableUnderline
              margin="dense"
              id="discipline"
              name="discipline"
              type="text"
              fullWidth
              onChange={handleInputChange}
            />
          </label>
          <TextField
            autoFocus
            margin="dense"
            id="description"
            name="description"
            label="Descrição do Curso"
            type="text"
            variant="outlined"
            multiline
            rowsMax="4"
            fullWidth
            onChange={handleInputChange}
          />
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleDailogSubmit} color="primary" type="submit">
              Enviar Curso
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default DashBoardTeacher;
