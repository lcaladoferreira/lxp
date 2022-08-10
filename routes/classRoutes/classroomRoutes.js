const router = require("express").Router({ mergeParams: true });
const classroomController = require("../../controllers/classroomController");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' })
 
// Corresponde a "/api/classrooms"
router.route("/")
      .get(classroomController.findAll)
      .post(classroomController.create);

// Corresponde a "/api/classrooms/:id"
router.route("/:id")
      .get(classroomController.findById)
      .post(classroomController.update)
      .delete(classroomController.remove);
      
// Corresponde a "/api/classroom/user/:id"
router.route('/user/:id')
      .get(classroomController.findClassesByUser)

router.route('/:id/addStudent')
      .post(classroomController.AddStudentToClass)

router.route("/populate/:id")
      .get(classroomController.findByIdandPopulate);

router.route("/image/:id")
      .get(classroomController.findImgByClassId)
      .post(upload.single('image'), classroomController.updateClassImage)
 
router.route("/announcement/")
      

router.route("/announcement/:id")
      .get(classroomController.findAnnouncementsByClassId)
      .post(classroomController.createAnnouncement)
      .delete(classroomController.removeAnnouncement)

router.route("/announcement/comment/:id")
      .post(classroomController.createComment)
      .delete(classroomController.removeComment)

router.route('/findAuthor/comment/:id')
      .get(classroomController.findAuthorById)

router.route('/assignments/:id')
      .post(classroomController.createAssignment)
      // .delete(classroomController)

router.route('/addGrade/:classID/:userID')
      .post(classroomController.addGrade)
      .get(classroomController.getGrades)

module.exports = router;