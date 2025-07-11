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
const {
  getUser,
  authAdmin,
  auth,
  authFranchise,
} = require("../middleware/auth.middleWare");
const {
  addStream,
  getStreams,
  deleteStream,
  updateStream,
  updateAttachment,
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
  getFranchiseStudents,
  updateStudent,
  getSingleStudent,
  deleteStudent,
  studentVerification,
  studentResult,
  applyResult,
  getStudentsForResults,
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
  getSubCoursebyId,
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
  getStudentwithSubjects,
} = require("../controller/subject.controller");
const {
  getAdminStatistics,
  getAdminHomeStatistics,
  getFranchiseStatistics,
} = require("../controller/Statistics.controller");
const {
  addMarks,
  getAllResults,
  getResultById,
  deleteResult,
  updateMarks,
} = require("../controller/studentMarks.controller");
const { addTopUpRequest, getFranchiseStats, getTopUpRequestsByFranchise, getAllTopUpRequests, getAllTransactions, getFranchisesForTopUp, adminAddTopUpRequest, updateTopUpStatus } = require("../controller/topupRequest.controller");

const router = express.Router();

// franchise as user
router.post("/franchise/add", addFranchise);
router.post("/login", loginFranchise);
router.get("/franchise/view", getFranchises);
router.get("/franchise/:id", getSingleFranchise);
router.put("/franchise/update", updateFranchise);
router.delete("/franchise/:id", deleteFranchise);
router.put("/franchise/addBalance", addBalance);
router.get("/getCurrentRole", getUser, getCurrentRole);

// stream routes
router.post("/stream/create", authAdmin, addStream);
router.get("/stream/view", getStreams);
router.delete("/stream/delete/:id", authAdmin, deleteStream);
router.put("/stream/update", authAdmin, updateStream);
router.put("/stream/update/attachment", authAdmin, updateAttachment);

// institute routes
router.post("/institute/add", authAdmin, addInstitute);
router.get("/institute/view", getInstitutes);
router.delete("/institute/delete/:id", authAdmin, deleteInstitute);
router.put("/institute/update", authAdmin, updateInstitute);

// student routes
router.post("/student/add", auth, addStudent);
router.get("/student/view", authAdmin, getStudents);
router.get("/student/view/getStudentsForResults", authAdmin, getStudentsForResults);
router.get("/student/franchise/view", authFranchise, getFranchiseStudents);
router.delete("/student/delete/:id", auth, deleteStudent);
router.get("/student/view/:id", auth, getSingleStudent);
router.put("/student/update", auth, updateStudent);
router.post("/student/addMarks", auth, addMarks);
router.put("/student/updateMarks", auth, updateMarks);
router.put("/student/applyResult", authFranchise, applyResult);
router.post("/student/studentVerification", studentVerification);
router.post("/student/studentResult", studentResult);

// main course routes
router.post("/mainCourse/add", authAdmin, addMainCourse);
router.get("/mainCourse/view", getMainCourses);
router.delete("/mainCourse/delete/:id", authAdmin, deleteMainCourse);
router.put("/mainCourse/update", authAdmin, updateMainCourse);

// sub courses
router.post("/subCourse/add", authAdmin, addSubCourse);
router.get("/subCourse/view", getSubCourses);
router.get("/subCourse/view/:id", getSubCoursesbyId);
router.get("/subCourse/single/:id", getSubCoursebyId);
router.delete("/subCourse/delete/:id", authAdmin, deleteSubCourse);
router.put("/subCourse/update", authAdmin, updateSubCourse);

// vocational courses
router.post("/vocationalCourse/add", auth, addVocationalCourse);
router.get("/vocationalCourse/view", auth, getVocationalCourses);
router.get(
  "/vocationalCourse/franchise/view",
  authFranchise,
  getFranchiseVocationalCourse
);
router.delete("/vocationalCourse/delete/:id", auth, deleteVocationalCourse);
router.put("/vocationalCourse/update", auth, updateVocationalCourse);

// subject routes
router.post("/subject/add", auth, addSubject);
router.get("/subject/view/:id", getSubjectsByCourseId);
router.get("/subject/view/:id/:studentId", getStudentwithSubjects);
router.delete("/subject/delete/:id", auth, deleteSubject);
router.put("/subject/update", auth, updateSubject);

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
router.get("/statistics/admin/home", authAdmin, getAdminHomeStatistics);
router.get("/statistics/franchise", authFranchise, getFranchiseStatistics);

// statistics
router.get("/admin/result/view", authAdmin, getAllResults);
router.get("/admin/result/view/:id", authAdmin, getResultById);
router.delete("/admin/result/delete/:id", authAdmin, deleteResult);

// topUp routes
router.post("/topupRequest/add", authFranchise, addTopUpRequest);
router.post("/topupRequest/adminAddTopUpRequest", authAdmin, adminAddTopUpRequest);
router.get("/topupRequest/view/franchise", authFranchise  , getTopUpRequestsByFranchise);
router.get("/topupRequest/view/admin",authAdmin, getAllTopUpRequests);
router.put("/topupRequest/update/:id", authAdmin, updateTopUpStatus);
router.get("/topupRequest/stats", authFranchise, getFranchiseStats);
router.get("/topupRequest/getAllTransactions", authFranchise, getAllTransactions);
router.get("/topupRequest/getFranchisesForTopUp", authAdmin, getFranchisesForTopUp);

module.exports = router;
