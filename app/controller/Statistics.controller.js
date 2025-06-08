const { responsestatusdata } = require("../middleware/responses");
const ContactModel = require("../model/contact.model");
const franchiseModel = require("../model/franchise.model");
const franchiseRequestModel = require("../model/franchiseRequest.model");
const InstituteModel = require("../model/institute.model");
const mainCourseModel = require("../model/mainCourse.model");
const newsModel = require("../model/news.model");
const placeModel = require("../model/place.model");
const streamModel = require("../model/streams.model");
const studentMarksModel = require("../model/studentMarks.model");
const studentQueryModel = require("../model/studentQuery.model");
const studentModel = require("../model/studentsSchema");
const subCourseModel = require("../model/subCourse.model");
const VocationalCourseModel = require("../model/VocationCourse.model");

exports.getAdminStatistics = async (req, res) => {
  try {
    const [
      totalNews,
      totalStreams,
      totalPlaces,
      totalFranchiseRequests,
      totalStudentRequests,
      totalMainCourses,
      totalSubCourses,
      totalUniversities,
      totalColleges,
      totalITIs,
      totalContacts
    ] = await Promise.all([
      newsModel.countDocuments(),
      streamModel.countDocuments(),
      placeModel.countDocuments(),
      franchiseRequestModel.countDocuments(),
      studentQueryModel.countDocuments(),
      mainCourseModel.countDocuments(),
      subCourseModel.countDocuments(),
      InstituteModel.countDocuments({ role: "University" }),
      InstituteModel.countDocuments({ role: "Collage" }), // 'Collage' used based on your code
      InstituteModel.countDocuments({ role: "ITI" }),
      ContactModel.countDocuments(),
    ]);

    const statistics = {
      totalNews: totalNews || 0,
      totalStreams: totalStreams || 0,
      totalPlaces: totalPlaces || 0,
      totalFranchiseRequests: totalFranchiseRequests || 0,
      totalStudentRequests: totalStudentRequests || 0,
      totalMainCourses: totalMainCourses || 0,
      totalSubCourses: totalSubCourses || 0,
      totalUniversities: totalUniversities || 0,
      totalColleges: totalColleges || 0,
      totalITIs: totalITIs || 0,
      totalContacts: totalContacts || 0,
    };

    return responsestatusdata(
      res,
      true,
      "Statistics fetched successfully",
      statistics
    );
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error fetching statistics");
  }
};

exports.getAdminHomeStatistics = async (req, res) => {
  try {
    const [
      totalFranchise,
      totalStudents,
      totalCourses,
      totalResults,
    ] = await Promise.all([
      franchiseModel.countDocuments(),
      studentModel.countDocuments(),
      VocationalCourseModel.countDocuments(),
      studentMarksModel.countDocuments(),
    ]);

    const statistics = {
      totalFranchise : totalFranchise || 0,
      totalStudents : totalStudents || 0,
      totalCourses : totalCourses || 0,
      totalResults : totalResults || 0,
    };

    return responsestatusdata(
      res,
      true,
      "Statistics fetched successfully",
      statistics
    );
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error fetching statistics");
  }
};
