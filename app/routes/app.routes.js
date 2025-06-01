const express = require("express");
const {
  createContact,
  getContact,
  deleteContact,
} = require("../controller/contact.controller");
const {
  createStudentQuery,
  getStudentQuery,
  deleteStudentQuery,
} = require("../controller/studentquery.controller");
const {
  createFranchiseRequest,
  getFranchiseRequests,
  deleteFranchiseRequest,
} = require("../controller/franchiseRequest.controller");
const {
  addFranchise,
  loginFranchise,
  getFranchises,
  getCurrentRole,
  getSingleFranchise,
  deleteFranchise,
  updateFranchise,
  addBalance,
} = require("../controller/franchise.controller");
const { getUser, authAdmin } = require("../middleware/auth.middleWare");
const {
  addStream,
  getStreams,
  deleteStream,
  updateStream,
} = require("../controller/streams.controller");
const {
  addPlace,
  getPlaces,
  deletePlace,
  updatePlace,
} = require("../controller/place.controller");
const {
  createNews,
  getNews,
  deleteNews,
  updateNews,
} = require("../controller/news.controller");
const {
  addInstitute,
  getInstitutes,
  deleteInstitute,
  updateInstitute,
} = require("../controller/institiute.controller");
const {
  addStudent,
  getStudents,
  updateStudent,
  getSingleStudent,
  deleteStudent,
  studentVerification,
} = require("../controller/student.controller");
const {
  addMainCourse,
  getMainCourses,
  deleteMainCourse,
  updateMainCourse,
} = require("../controller/mainCourse.controller");
const {
  addSubCourse,
  getSubCourses,
  deleteSubCourse,
  updateSubCourse,
  getSubCoursesbyId,
} = require("../controller/SubCourse.controller");
const {
  addVocationalCourse,
  getVocationalCourses,
  deleteVocationalCourse,
  updateVocationalCourse,
  getFranchiseVocationalCourse,
} = require("../controller/vocationalCourse.controller");
const {
  addSubject,
  getSubjectsByCourseId,
  deleteSubject,
  updateSubject,
} = require("../controller/subject.controller");
const { getAdminStatistics } = require("../controller/Statistics.controller");

const router = express.Router();

// franchise as user
router.post("/franchise/add", addFranchise);
router.post("/login", loginFranchise);
router.get("/franchise/view", getFranchises);
router.get("/franchise/:id", getSingleFranchise);
router.put("/franchise/update", updateFranchise);
router.put("/franchise/delete", deleteFranchise);
router.put("/franchise/addBalance", addBalance);
router.get("/getCurrentRole", getUser, getCurrentRole);

// stream routes
router.post("/stream/create", authAdmin, addStream);
router.get("/stream/view", getStreams);
router.delete("/stream/delete/:id", authAdmin, deleteStream);
router.put("/stream/update", authAdmin, updateStream);

// institute routes
router.post("/institute/add", authAdmin, addInstitute);
router.get("/institute/view", getInstitutes);
router.delete("/institute/view/:id", authAdmin, getSingleStudent);
router.put("/institute/update", authAdmin, updateInstitute);

// student routes
router.post("/student/add", authAdmin, addStudent);
router.get("/student/view", getStudents);
router.delete("/student/delete/:id", authAdmin, deleteStudent);
router.get("/student/view/:id", authAdmin, getSingleStudent);
router.put("/student/update", authAdmin, updateStudent);
router.post("/student/studentVerification", studentVerification);

// main course routes
router.post("/mainCourse/add", authAdmin, addMainCourse);
router.get("/mainCourse/view", getMainCourses);
router.delete("/mainCourse/delete/:id", authAdmin, deleteMainCourse);
router.put("/mainCourse/update", authAdmin, updateMainCourse);

// sub courses
router.post("/subCourse/add", authAdmin, addSubCourse);
router.get("/subCourse/view", getSubCourses);
router.get("/subCourse/view/:id", getSubCoursesbyId);
router.delete("/subCourse/delete/:id", authAdmin, deleteSubCourse);
router.put("/subCourse/update", authAdmin, updateSubCourse);

// vocational courses
router.post("/vocationalCourse/add", authAdmin, addVocationalCourse);
router.get("/vocationalCourse/view", getVocationalCourses);
router.get(
  "/vocationalCourse/franchise/view",
  authAdmin,
  getFranchiseVocationalCourse
);
router.delete(
  "/vocationalCourse/delete/:id",
  authAdmin,
  deleteVocationalCourse
);
router.put("/vocationalCourse/update", authAdmin, updateVocationalCourse);

// subject routes
router.post("/subject/add", authAdmin, addSubject);
router.get("/subject/view/:id", getSubjectsByCourseId);
router.delete("/subject/delete/:id", authAdmin, deleteSubject);
router.put("/subject/update", authAdmin, updateSubject);

// place routes
router.post("/place/create", authAdmin, addPlace);
router.get("/place/view", getPlaces);
router.delete("/place/delete/:id", authAdmin, deletePlace);
router.put("/place/update", authAdmin, updatePlace);

// contact query routes
router.post("/contactQuery/create", createContact);
router.get("/contactQuery/view", getContact);
router.delete("/contactQuery/delete/:id", deleteContact);

// student query query routes
router.post("/studentQuery/create", createStudentQuery);
router.get("/studentQuery/view", getStudentQuery);
router.delete("/studentQuery/delete/:id", deleteStudentQuery);

// student query query routes
router.post("/news/add", authAdmin, createNews);
router.post("/news/update", authAdmin, updateNews);
router.get("/news/view", getNews);
router.delete("/news/delete/:id", authAdmin, deleteNews);

// franchise Request
router.post("/franchiseRequest/create", createFranchiseRequest);
router.get("/franchiseRequest/view", getFranchiseRequests);
router.delete("/franchiseRequest/delete/:id", deleteFranchiseRequest);

// statistics
router.get("/statistics/admin", authAdmin, getAdminStatistics);

module.exports = router;
