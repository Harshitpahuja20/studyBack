const express = require("express");
const {
  createFooterOption,
  getFooters,
  deleteFooter,
} = require("../controller/footer.controller");
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
const { addFranchise, loginFranchise, getFranchises, getCurrentRole } = require("../controller/franchise.controller");
const { getUser } = require("../middleware/auth.middleWare");

const router = express.Router();

// franchise as user
router.post("/franchise/create", addFranchise);
router.post("/login", loginFranchise);
router.get("/franchise/view", getFranchises);
router.get("/getCurrentRole",getUser, getCurrentRole);

// footer routes
router.post("/footer/create", createFooterOption);
router.get("/footer/view", getFooters);
router.delete("/footer/delete", deleteFooter);

// contact query routes
router.post("/contact/create", createContact);
router.get("/contact/view", getContact);
router.delete("/contact/delete", deleteContact);

// student query query routes
router.post("/studentQuery/create", createStudentQuery);
router.get("/studentQuery/view", getStudentQuery);
router.delete("/studentQuery/delete", deleteStudentQuery);

// student query query routes
router.post("/news/create", createStudentQuery);
router.get("/news/view", getStudentQuery);
router.delete("/news/delete", deleteStudentQuery);

// franchise Request
router.post("/franchiseRequest/create", createFranchiseRequest);
router.get("/franchiseRequest/view", getFranchiseRequests);
router.delete("/franchiseRequest/delete", deleteFranchiseRequest);

module.exports = router;
