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
const { addPlace, getPlaces, deletePlace, updatePlace } = require("../controller/place.controller");
const { createNews, getNews, deleteNews, updateNews } = require("../controller/news.controller");
const { addInstitute, getInstitutes, deleteInstitute, updateInstitute } = require("../controller/institiute.controller");

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
router.delete("/institute/delete/:id", authAdmin, deleteInstitute);
router.put("/institute/update", authAdmin, updateInstitute);

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
router.delete("/studentQuery/delete/:id", deleteStudentQuery);``

// student query query routes
router.post("/news/add", authAdmin, createNews);
router.post("/news/update", authAdmin, updateNews);
router.get("/news/view", getNews);
router.delete("/news/delete/:id", authAdmin, deleteNews);

// franchise Request
router.post("/franchiseRequest/create", createFranchiseRequest);
router.get("/franchiseRequest/view", getFranchiseRequests);
router.delete("/franchiseRequest/delete/:id", deleteFranchiseRequest);

module.exports = router;
