import React, { useEffect, useState, useCallback } from "react";
import Gradebook from "../components/MaterialTables/GradebookTable.jsx";
import AssignmentsTable from "../components/MaterialTables/AssignmentTable.jsx";
import API from "../utils/API";
import history from "../history/history.jsx";
import PropTypes from "prop-types";
import { Tab, Tabs, AppBar, Box, Typography } from "@material-ui/core";

// criando um boletim de notas que é responsivo ao aluno (n)
// semelhante a um banco de dados relacional (x, y col/linha)
// talvez utilize uma caixa suspensa e/ou guias para
// alterna várias atribuições
// sempre exibe uma nota cumulativa
// incorpora charts.js npm ao modelo
// distribuição da curva de sino
// https://www.npmjs.com/chart.js
// https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/bellcurve/

const GradesTeacher = (props) => {

  const [userID, setUserID] = useState("");
  const [userType, setUserType] = useState("");
  const [classID, setClassID] = useState("");
  const [tabValue, setTabValue] = useState(" ");
  const [studentArr, setStudentArr] = useState([]);
  const [assignmentArr, setAssignmentArr] = useState([]);

  const getAndVerifyUserInfo = useCallback(() => {
    API.readAndVerifyCookie()
      .then((resp) => {
        console.log("cookie chamando resp: ", resp);
        console.log("baixando a carga: ", resp.data.payload);
        setUserType(resp.data.payload.type);
        setUserID(resp.data.payload._id);
        selectLastTab();
        //carrega as classes após o userID e userType serem recebidos do token
      })
      .catch((error) => {
        console.log(error);
        history.replace("/");
      });
  }, []);

  const loadClassInfo = useCallback(() => {
    setClassID(localStorage.getItem("classId"));

    console.log("load class ID", classID);

    API.populateByID(classID)
      .then((resp) => {
        console.log(resp.data);
        const studentsData = resp.data.students ? resp.data.students : "";
        const assignmentsData = resp.data.assignments
          ? resp.data.assignments
          : "";

        setStudentArr(studentsData);

        setAssignmentArr(assignmentsData);
      })
      .catch((err) => console.log(err));
  }, [classID]);

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  useEffect(() => {
    
    const loadInfo = async () => {
      await getAndVerifyUserInfo();
      await loadClassInfo();
    };

    loadInfo();
    
  }, [getAndVerifyUserInfo, loadClassInfo]);

  function selectLastTab() {
    const value = localStorage.getItem("tabValue");

    console.log(value);
    if (!value) {
      console.log("bem-vindo à página do boletim de notas");
    } else {
      console.log("Bem vindo de volta");
      setTabValue(value);
    }
  }

  const handleTabSelect = (event, newValue) => {
    setTabValue(newValue);
    localStorage.setItem("tabValue", newValue);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <>
      <AppBar position="static">
        <Tabs
          value={tabValue}
          onChange={handleTabSelect}
          aria-label="simple tabs example"
        >
          <Tab label="GradeBook" {...a11yProps(0)} />
          <Tab label="Assignments" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <Gradebook
          students={studentArr}
          assignments={assignmentArr}
          userInfo={userID}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <AssignmentsTable assignments={assignmentArr} />
      </TabPanel>
    </>
  );
};

export default GradesTeacher;


