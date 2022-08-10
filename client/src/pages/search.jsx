import React, { useState, useEffect, useCallback } from "react";

import API from "../utils/API";

import {
  Input,
  Button,
  MenuItem,
  Select,
  Grid,
  Box,
  ListItem,
  Paper,
  Container,
  Modal,
  Typography,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import "./pageStyle/search.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

const Search = () => {
  const [userID, setUserID] = useState("");
  const [userType, setUserType] = useState("");
  const [classSearchObj, setClassSearchObj] = useState({
    selectValue: "all",
    inputValue: "",
  });
  const [apiClasses, setApiClasses] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const getAndVerifyUserInfo = useCallback(async () => {
    try {
      const { data } = await API.readAndVerifyCookie();
      const userData = data.payload;
      console.log("cookie call resp: ", data);
      console.log("dropping the load: ", userData);
      setUserType(userData.type);
      setUserID(userData._id);
      console.log(userType);
      console.log(userID);
    } catch (error) {
      console.log(error);
    }
  }, [userID, userType]);

  useEffect(() => {
    getAndVerifyUserInfo();
  }, [getAndVerifyUserInfo]);

  //Esta função é chamada quando o usuário faz o pedido para entrar no botão
   //envia as informações do usuário de volta ao banco de dados e as adiciona à classe
  async function handleJoinClass(event) {
    const requestInfo = event.currentTarget.value;
    const userInfo = {};
    userInfo.id = userID;

    try {
      const classJoinServerResp = await API.requestToJoinClass(
        requestInfo,
        userInfo
      );

      console.log(classJoinServerResp);
      if (classJoinServerResp) {
        toast.success("User was successfull added to class.", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.log(error.response);
      const errorMessage = error.response.data.msg;

      if (error.response.data.error === 1) {
        toast.error(errorMessage, { position: toast.POSITION.TOP_CENTER });
      } else if (error.response.data.error === 2) {
        toast.error(errorMessage, { position: toast.POSITION.TOP_CENTER });
      }
    }
  }

  function handleCloseModal() {
    setOpenModal(false);
  }

//Esta função o que o usuário está digitando e o que ele seleciona na lista suspensa de seleção
// Define para o estado classSearchObj
  function handleSearchChange(event) {
    console.log(event.target.name);
    console.log(event.target.value);

    const { name, value } = event.target;

    setClassSearchObj({ ...classSearchObj, [name]: value });
    console.log(classSearchObj);
  }

  async function handleSearchSubmit() {
    console.log(classSearchObj.selectValue);
    console.log(classSearchObj.inputValue);

    if (!classSearchObj.selectValue) {
      setOpenModal(true);
    } else {
      try {
        const classSearchResult = await API.searchClasses(
          classSearchObj.selectValue,
          classSearchObj.inputValue
        );
        await setApiClasses(classSearchResult.data);
      } catch {
        throw new Error("Falha ao encontrar classes com base em critérios de pesquisa");
      }
    }
  }

  return (
    <Container className="parent" alignContent="center">
      <Box className="content">
        <Paper>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3} className="dropdown">
              <Select
                className="searchbox"
                variant="outlined"
                value={classSearchObj.selectValue}
                name={"selectValue"}
                onChange={handleSearchChange}
              >
                <MenuItem value={"all"}>Todas as classes</MenuItem>
                <MenuItem value={"courseTitle"}>Título</MenuItem>
                <MenuItem value={"courseDescription"}>Descrição</MenuItem>
                <MenuItem value={"subject"}>Assunto</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6} className="searchbar">
              <Box py={2}>
                <Input
                  color="primary"
                  placeholder="procure por aulas aqui"
                  fullWidth
                  disableUnderline
                  name={"inputValue"}
                  onChange={handleSearchChange}
                />
              </Box>
            </Grid>
            <Grid item xs={2} className="searchbutton">
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={handleSearchSubmit}
              >
                <SearchIcon />
                Buscar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      <Box m={3}>
        <Paper>
          <Grid item xs={12} justifyContent="center">
            <Box m={2} p={2}>
              <ul>
                {apiClasses.length > 0 ? (
                  apiClasses.map((item, index) => {
                    return (
                      <ListItem key={index} className="addicon">
                        <Grid item xs={3}>
                          <h3>{item.courseTitle}</h3>
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            value={item.id}
                            onClick={handleJoinClass}
                          >
                            <AddIcon />
                            Pedido de adesão
                          </Button>
                        </Grid>
                        <Grid item xs={6} className="description">
                          {item.courseDescription}
                        </Grid>
                        <Grid item xs={3}>
                        Assunto do curso: <p /> <h6>{item.courseDiscipline}</h6>
                        </Grid>
                      </ListItem>
                    );
                  })
                ) : (
                  <p>Nenhuma aula encontrada</p>
                )}
              </ul>
            </Box>
          </Grid>
        </Paper>
      </Box>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
      >
        {
          <>
            <Box
              width="25%"
              height="25%"
              p={2}
              zIndex="modal"
              position="absolute"
              top="20%"
              left="35%"
            >
              <Paper elevation={6}>
                <Typography variant="h6" align="center">
                  <p id="modal-title">
                  Selecione os critérios de pesquisa no menu suspenso de seleção.
                  </p>
                </Typography>
              </Paper>
            </Box>
          </>
        }
      </Modal>
    </Container>
  );
};

export default Search;
