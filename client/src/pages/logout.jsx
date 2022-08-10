import React, { useState, useEffect, useCallback } from "react";
import API from "../utils/API.js";
import JumbotronLogout from "../components/Jumbotron/JumbotronLogout.jsx";
import Container from "../components/Container/Container.jsx";
import history from "../history/history.jsx";

const Logout = () => {
  const [userType, setUserType] = useState("");
  const [userID, setUserID] = useState("");

  const getAndVerifyUserInfo = useCallback(() => {
    API.readAndVerifyCookie()
      .then((resp) => {
        console.log("cookie chamando resp: ", resp);
        console.table("baixando a carga: ", resp.data.payload);
        setUserType(resp.data.payload.type);
        setUserID(resp.data.payload._id);
        console.log(userType);
        console.log(userID);
      })
      .catch((error) => {
        console.log(error);
        history.replace("/");
      });
  }, [userID, userType]);

  useEffect(() => {
    getAndVerifyUserInfo();
  }, [getAndVerifyUserInfo]);

  function logoutUser() {
     // API.userLogout (por id, userID) ==> substitui o cookie contendo JWT por
     // novo cookie (mesmo nome) contendo JWT efêmero (vida útil de 1 milissegundo)
    API.userAuthLogout(userID);
    console.log("saindo");
    history.replace("/");
  }
  return (
    <Container fluid>
      <JumbotronLogout logout={logoutUser} />
    </Container>
  );
};

export default Logout;
