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
} = require("../controller/franchise.controller");
const { getUser, authAdmin } = require("../middleware/auth.middleWare");
const {
  addStream,
  getStreams,
  deleteStream,
  updateStream,
} = require("../controller/streams.controller");
const { addPlace, getPlaces, deletePlace, updatePlace } = require("../controller/place.controller");

const router = express.Router();

// franchise as user
router.post("/franchise/create", addFranchise);
router.post("/login", loginFranchise);
router.get("/franchise/view", getFranchises);
router.get("/getCurrentRole", getUser, getCurrentRole);

// stream routes
router.post("/stream/create", authAdmin, addStream);
router.get("/stream/view", getStreams);
router.delete("/stream/delete/:id", authAdmin, deleteStream);
router.put("/stream/update", authAdmin, updateStream);

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
router.post("/news/create", createStudentQuery);
router.get("/news/view", getStudentQuery);
router.delete("/news/delete", deleteStudentQuery);

// franchise Request
router.post("/franchiseRequest/create", createFranchiseRequest);
router.get("/franchiseRequest/view", getFranchiseRequests);
router.delete("/franchiseRequest/delete/:id", deleteFranchiseRequest);

module.exports = router;
