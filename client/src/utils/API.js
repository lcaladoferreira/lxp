import axios from "axios";

export default {
  // obtém o cookie, verifica usando o segredo, decodifica a carga útil
  readAndVerifyCookie: () => {
    return axios.get("/users/getcookie");
  },
  //pega todos os usuários
  users: function () {
    return axios.get("/users");
  },
  // login de usuário
  userLogin: function (userObj) {
    return axios.post("/users/login", userObj);
  },
  // autorização do usuário => clique em sair => hora do token efêmero => redirecionar para "/"
  userAuthLogout: function (id) {
    return axios.get(`/users/logout/${id}`);
  },
  // cadastro do usuário
  userRegister: function (userObj) {
    return axios.post("/users/register", userObj);
  },
  // obtém a autenticação do usuário e digita por id
  userAuthAndType: function (userObj) {
    return axios.get("/users/:id", userObj);
  },
  // logout do usuário
  userLogout: function (userObj) {
    return axios.get("/users/logout", userObj);
  },
  // informações de atualização do usuário
  userUpdate: function (userObj) {
    return axios.put("/users/:id", userObj);
  },
  // pegando usuário por id
  getUserbyId: function (id) {
    return axios.get("/users/" + id);
  },

  //pega as aulas
  getClasses: function () {
    return axios.get("/api/classrooms");
  },
  addClass: function (newClass) {
    return axios.post("/api/classrooms", newClass);
  },
  updateClass: function (id, updateObj) {
    return axios.post("/api/classrooms/" + id, updateObj);
  },
  deleteClassById: function (id) {
    return axios.delete("/api/classrooms/" + id);
  },
  searchClasses: async function (selectValue, inputValue) {
    return axios.get(
      "/api/classrooms/?select=" + selectValue + "&input=" + inputValue
    );
  },


  updateClassImage: function (id, image) {
    return axios.post("/api/classrooms/image/" + id, image, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getClassImage: function (id) {
    return axios.get("/api/classrooms/image/" + id);
  },
  requestToJoinClass: async function (requestInfo, user) {
    return await axios.post(
      "/api/classrooms/" + requestInfo + "/addStudent",
      user
    );
  },
  populateByID: function (id) {
    return axios.get("/api/classrooms/populate/" + id);
  },
  getClassesbyUser: function (id) {
    return axios.get("/api/classrooms/user/" + id);
  },
  deleteAnnouncementById: function (id) {
    return axios.delete("/api/classrooms/announcement/" + id);
  },
  createAnnouncement: function (id, obj) {
    return axios.post("/api/classrooms/announcement/" + id, obj);
  },
  getAnnouncementByClass: function (id) {
    return axios.get("/api/classrooms/announcement/" + id);
  },
  deleteCommentById: function (id) {
    return axios.delete("/api/classrooms/announcement/comment/" + id);
  },
  createComment: function (idOne, commentInfo) {
    return axios.post(
      "/api/classrooms/announcement/comment/" + idOne,
      commentInfo
    );
  },

  findAuthorByID: function (id) {
    return axios.get("/api/classrooms/findAuthor/comment/" + id);
  },

  createAssignment: function (id, obj) {
    return axios.post("/api/classrooms/assignments/" + id, obj);
  },

  deleteAssignment: function (id) {
    return axios.delete("/api/classrooms/assignments/" + id);
  },
  addGrade: function (id, data, userID) {
    return axios.post("/api/classrooms/addGrade/" + id + "/" + userID, data);
  },
  getGrade: function (id, data, userID) {
    return axios.get("/api/classrooms/addGrade/" + id + "/" + userID, data);
  },
};
