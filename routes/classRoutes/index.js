const router = require("express").Router({ mergeParams: true });
const classroomRoutes = require("./classroomRoutes");

// Rotas da sala de aula
router.use("/classrooms", classroomRoutes);


module.exports = router;