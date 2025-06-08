const { default: mongoose } = require("mongoose");
const upload = require("../middleware/multer.middleware");
const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");
const studentMarksModel = require("../model/studentMarks.model");
const studentModel = require("../model/studentsSchema");

// Add a new student
exports.addStudent = async (req, res) => {
  upload.single("studentProfile")(req, res, async () => {
    try {
      const {
        studentName,
        fatherName,
        motherName,
        dob,
        gender,
        mobile,
        category,
        email,
        course,
        session,
        registrationYear,
        address,
      } = req.body;

      if (
        !studentName ||
        !fatherName ||
        !motherName ||
        !dob ||
        !gender ||
        !mobile ||
        !category ||
        !email ||
        !course ||
        !session ||
        !registrationYear ||
        !address ||
        !req.file
      ) {
        return responsestatusmessage(res, false, "All fields are required.");
      }

      const imagePath = req.file
        ? `${req.file.fieldname}/${req.file.filename}`
        : null;

      const newStudent = new studentModel({
        studentName,
        fatherName,
        motherName,
        dob,
        gender,
        mobile,
        category,
        email,
        course,
        session,
        registrationYear,
        address,
        image: imagePath,
        franchiseId: req.user ? req.user._id : null,
        enrollmentId: Number(Date.now()),
      });

      await newStudent.save();

      return responsestatusdata(
        res,
        true,
        "Student added successfully",
        newStudent
      );
    } catch (error) {
      console.error(error);
      return responsestatusmessage(res, false, "Something went wrong.");
    }
  });
};

// Delete a student by ID
exports.getSingleStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const [student, result] = await Promise.all([
      studentModel
        .findById(id)
        .populate("franchiseId", "franchiseName _id")
        .populate("course", "name duration"),
      studentMarksModel.findOne({
        studentId: new mongoose.Types.ObjectId(id),
      }),
    ]);

    if (!student) {
      return responsestatusmessage(res, false, "Student not found.");
    }

    const studentData = {
      ...student._doc,
      studentResultId: result ? result._id : null,
    };

    return responsestatusdata(res, true, "Student Details Fetched", studentData);
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error fetching student.");
  }
};

// Get all students
exports.getStudents = async (req, res) => {
  try {
    const { franchiseId } = req.query;
    const filter = franchiseId ? { franchiseId } : {};
    const students = await studentModel.aggregate([
      { $match: filter }, // Apply your dynamic filters
      {
        $lookup: {
          from: "franchises", // collection name in MongoDB (usually plural and lowercase)
          localField: "franchiseId",
          foreignField: "_id",
          as: "franchise",
        },
      },
      {
        $unwind: {
          path: "$franchise",
          preserveNullAndEmptyArrays: true, // In case some students don't have franchiseId
        },
      },
      {
        $lookup: {
          from: "vocationalcourses", // collection name in MongoDB (usually plural and lowercase)
          localField: "course",
          foreignField: "_id",
          as: "vocationalCourse",
        },
      },
      {
        $unwind: {
          path: "$vocationalCourse",
          preserveNullAndEmptyArrays: true, // In case some students don't have franchiseId
        },
      },
      {
        $project: {
          studentName: 1,
          fatherName: 1,
          motherName: 1,
          dob: 1,
          gender: 1,
          mobile: 1,
          category: 1,
          email: 1,
          course: 1,
          session: 1,
          registrationYear: 1,
          address: 1,
          image: 1,
          franchiseId: 1,
          createdAt: 1,
          "franchise._id": 1,
          "franchise.fullName": 1,
          "franchise.role": 1,
          "vocationalCourse.duration": 1,
          "vocationalCourse.name": 1,
          "vocationalCourse.code": 1,
        },
      },
    ]);

    return responsestatusdata(res, true, "Fetched Successfully", students);
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error fetching students.");
  }
};

// Update a student
exports.updateStudent = async (req, res) => {
  upload.single("studentProfile")(req, res, async () => {
    try {
      const {
        _id,
        studentName,
        fatherName,
        motherName,
        dob,
        gender,
        mobile,
        category,
        email,
        course,
        session,
        registrationYear,
        address,
      } = req.body;

      if (!_id) {
        return responsestatusmessage(res, false, "Student ID is required.");
      }

      const existingStudent = await studentModel.findById(_id);
      if (!existingStudent) {
        return responsestatusmessage(res, false, "Student not found.");
      }

      const imagePath = req.file
        ? `${req.file.fieldname}/${req.file.filename}`
        : existingStudent.image;

      Object.assign(existingStudent, {
        studentName,
        fatherName,
        motherName,
        dob,
        gender,
        mobile,
        category,
        email,
        course,
        session,
        registrationYear,
        address,
        image: imagePath,
      });

      await existingStudent.save();

      return responsestatusdata(
        res,
        true,
        "Student updated successfully",
        existingStudent
      );
    } catch (error) {
      console.error(error);
      return responsestatusmessage(res, false, "Something went wrong.");
    }
  });
};

// delete student
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await studentModel.findByIdAndDelete(id);
    if (!deleted) {
      return responsestatusmessage(res, false, "Student not found.");
    }
    return responsestatusmessage(res, true, "Student deleted successfully.");
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error deleting Student.");
  }
};

// student verificaation

exports.studentVerification = async (req, res) => {
  const { enrollmentId, dob } = req.body;

  console.log(enrollmentId, dob);

  if (!enrollmentId || !dob) {
    return responsestatusmessage(res, false, "Both fields are reuired");
  }

  const student = await studentModel.findOne({ enrollmentId, dob });

  if (!student) {
    return responsestatusmessage(
      res,
      false,
      "No Student found with this enrollemnt id and dob!"
    );
  }

  return responsestatusdata(res, true, "Student details fetched", student);
};
