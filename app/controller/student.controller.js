const { default: mongoose } = require("mongoose");
const upload = require("../middleware/multer.middleware");
const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");
const studentMarksModel = require("../model/studentMarks.model");
const studentModel = require("../model/studentsSchema");
const transactionModel = require("../model/transaction.model");

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

      // Find last student sorted by enrollmentId descending
      const lastStudent = await studentModel
        .findOne({ enrollmentId: { $regex: /^JBS\d+$/ } })
        .sort({ enrollmentId: -1 })
        .lean();

      // Get the last number and increment
      let newSerial = 1000000; // default starting serial number
      if (lastStudent && lastStudent.enrollmentId) {
        const lastSerial = parseInt(
          lastStudent.enrollmentId.replace("JBS", ""),
          10
        );
        if (!isNaN(lastSerial)) {
          newSerial = lastSerial + 1;
        }
      }

      const enrollmentId = `JBS${newSerial}`;

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
        enrollmentId,
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

    return responsestatusdata(
      res,
      true,
      "Student Details Fetched",
      studentData
    );
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
          enrollmentId: 1,
          result: 1,
          "franchise._id": 1,
          "franchise.userName": 1,
          "franchise.role": 1,
          "vocationalCourse.duration": 1,
          "vocationalCourse.name": 1,
          "vocationalCourse.code": 1,
          "vocationalCourse._id": 1,
        },
      },
    ]);

    return responsestatusdata(res, true, "Fetched Successfully", students);
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error fetching students.");
  }
};

// Get all students for results
exports.getStudentsForResults = async (req, res) => {
  const user = req?.user;
  console.log(user)
  try {
    const students = await studentModel.aggregate([
      {
        $match: 
            {
              $or: [
                { franchiseId: new mongoose.Types.ObjectId(user?._id) , result : {$ne : "done"}}, // Match if _id equals logged-in user's ID
                { result: "apply" }, // OR result is 'apply'
              ],
        },
      },
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
          enrollmentId: 1,
          result: 1,
          "franchise._id": 1,
          "franchise.userName": 1,
          "franchise.role": 1,
          "vocationalCourse.duration": 1,
          "vocationalCourse.name": 1,
          "vocationalCourse.code": 1,
          "vocationalCourse._id": 1,
        },
      },
    ]);

    return responsestatusdata(res, true, "Fetched Successfully", students);
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error fetching students.");
  }
};

exports.getFranchiseStudents = async (req, res) => {
  try {
    const { type } = req.query;
    const user = req.user;
    let filter = { franchiseId: new mongoose.Types.ObjectId(user?._id) };
    if (type && type === "pending") {
      filter = { ...filter, result: type };
    }
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
          enrollmentId: 1,
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

// get student result
exports.studentResult = async (req, res) => {
  const { enrollmentId, duration } = req.body;
  console.log(enrollmentId, duration);
  const student = await studentModel
    .findOne({ enrollmentId: Number(enrollmentId) })
    .populate("course", "name duration");

  if (!student) {
    return responsestatusmessage(
      res,
      false,
      "Please check the Enrollment number again"
    );
  }

  if (student?.course?.duration !== duration) {
    return responsestatusmessage(res, false, "No Result Found!");
  }
  console.log(student?._id);

  const studentMarks = await studentMarksModel.findOne({
    studentId: new mongoose.Types.ObjectId(student?._id),
  });

  if (!studentMarks) {
    return responsestatusmessage(res, false, "No Result Found!");
  }

  return responsestatusdata(res, true, "Result Found!", {
    student,
    studentMarks,
  });
};

exports.applyResult = async (req, res) => {
  const user = req.user;
  const { id } = req.body;

  try {
    // Fetch the student data
    const student = await studentModel
      .findOne({ _id: new mongoose.Types.ObjectId(id) })
      .populate("course", "_id name duration amount");

    if (!student) {
      return responsestatusmessage(res, false, "Student not found.");
    }

    if (Number(user?.balance) < student?.course?.amount) {
      return responsestatusmessage(res, false, "Insufficient Balance!");
    }

    // Generate transaction ID (TXID + sequential number)
    const lastTransaction = await transactionModel
      .findOne()
      .sort({ transactionId: -1 }); // Sort in descending order to get the latest one

    let newTransactionId = "TXID1000"; // Default starting ID
    if (lastTransaction) {
      // Extract the number from the last transaction ID
      const lastTransactionId = lastTransaction.transactionId;
      const lastNumber = parseInt(lastTransactionId.replace("TXID", ""), 10);
      newTransactionId = `TXID${lastNumber + 1}`; // Increment the number
    }

    // Prepare the transaction data
    const data = {
      enrollmentId: student?.enrollmentId,
      name: student?.studentName,
      fatherName: student.fatherName,
      dob: student?.dob,
      fee: student?.course?.amount,
      course: student?.course?.name,
      duration: student?.course?.duration,
      studentId: new mongoose.Types.ObjectId(id),
      franchiseId: new mongoose.Types.ObjectId(user?._id),
      courseId: new mongoose.Types.ObjectId(student?.course?._id),
      transactionId: newTransactionId, // Use the generated transaction ID
    };

    // Create the transaction in the database
    await transactionModel.create(data);
    student.result = "apply";
    user.balance = Number(user.balance) - Number(student?.course?.amount);
    await student.save();
    await user.save();

    return responsestatusmessage(res, true, "Result Applied!");
  } catch (error) {
    console.error("Error applying result:", error);
    return responsestatusmessage(res, false, "Error applying result.");
  }
};
