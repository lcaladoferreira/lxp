import React from "react";
import { Router, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./pages/home.jsx";
import dashboardTeacher from "./pages/dashboardTeacher.jsx";
import Grades from "./pages/gradesTeacher.jsx";
import Login from "./pages/login.jsx";
import Logout from "./pages/logout.jsx";
import Search from "./pages/search.jsx";
import Classroom from "./pages/Classroom.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Wrapper from "./components/Wrapper/Wrapper.jsx";
// https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Router.md
// Documentação extensa sobre histórico, seu uso e métodos personalizados
// nota: history = createBrowserHistory(); keyLength de location.key é padronizado como 6; definido para 12
// veja mais sobre as opções do BrowserRouter https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/BrowserRouter.md
import history from "./history/history.jsx";

const App = () => {

  history.listen((location, action) => {
    console.log(
      `The current URL is ${location.pathname}${location.search}${location.hash}`
    );
    console.log(`The last navigation action was ${action}`);
  });

  return (
    <Router history={history} keyLength={12}>
      {/* <RootContext.Provider value={{ userType, setUserType, userID, setUserID, classID, setClassID }}> */}
      <Navbar />
      <Wrapper>
        <React.Fragment>
          <Route exact path="/search" component={Search} />
          <Route exact path="/dashboardTeacher" component={dashboardTeacher} />
          <Route exact path="/grades" component={Grades} />
          {/* <Route exact path="/register" component={Register} /> */}
          <Route exact path="/classrooms" component={Classroom} />
          <Route exact path="/" component={Home} />
          <Route exact path="/logout" component={Logout} />
          <Route path="/login">
            <Login />
          </Route>
        </React.Fragment>
      </Wrapper>
      <Footer />
      {/* </RootContext.Provider> */}
    </Router>
  );
};

export default App;
