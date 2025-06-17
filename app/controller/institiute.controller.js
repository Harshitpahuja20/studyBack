const upload = require("../middleware/multer.middleware"); // Multer for file uploads
const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");
const instituteModel = require("../model/institute.model"); // Updated model for Institutes

// Add a new institute
exports.addInstitute = async (req, res) => {
  // Call the upload middleware for 'instituteLogo' field
  upload.single("instituteLogo")(req, res, async () => {
    try {
      const {
        instituteName,
        address,
        approvedBy,
        city,
        state,
        instituteType,
        description,
        role,
      } = req.body;

      // Ensure required fields and logo are provided
      if (!instituteName || !description || !req.file) {
        return responsestatusmessage(
          res,
          false,
          "All required fields and logo are required."
        );
      }

      const logoPath = `${req.file.fieldname}/${req.file.filename}`; // Construct logo path

      // Create a new institute document
      const newInstitute = new instituteModel({
        instituteName,
        address,
        approvedBy,
        city,
        state,
        instituteType,
        instituteLogo: logoPath, // Store the logo path
        description,
        role,
      });

      await newInstitute.save();

      return responsestatusdata(
        res,
        true,
        "Institute added successfully",
        newInstitute
      );
    } catch (error) {
      console.error(error);
      return responsestatusmessage(res, false, "Something went wrong.");
    }
  });
};

// Delete an institute by ID
exports.deleteInstitute = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedInstitute = await instituteModel.findByIdAndDelete(id);
    if (!deletedInstitute) {
      return responsestatusmessage(res, false, "Institute not found.");
    }
    return responsestatusmessage(res, true, "Deleted Successfully");
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error deleting institute.");
  }
};

// Get all institutes
exports.getInstitutes = async (req, res) => {
  try {
    const { role } = req.query;
    let matches = {};
    if (role) {
      matches.role = role;
    } // Build aggregation pipeline dynamically

    const pipeline = [{ $match: matches }];

    if (role === "University") {
      pipeline.push(
        {
          $lookup: {
            from: "streams",
            let: { instituteId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$$instituteId", "$university"] },
                },
              },
              {
                $project: { _id: 1, title: 1 },
              },
            ],
            as: "linkedStreams",
          },
        }
      );
    } // Project final fields: always include _id, title, and linkedStreams if present

    const institutes = await instituteModel.aggregate(pipeline);

    return responsestatusdata(res, true, "Fetched Successfully", institutes);
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error fetching institutes.");
  }
};

// Update an institute
exports.updateInstitute = async (req, res) => {
  upload.single("instituteLogo")(req, res, async () => {
    try {
      const {
        id,
        instituteName,
        instituteUrl,
        address,
        approvedBy,
        city,
        state,
        instituteType,
        description,
        role,
      } = req.body;

      if (!id || !instituteName || !instituteUrl || !description) {
        return responsestatusmessage(
          res,
          false,
          "ID, Name, URL, and Description are required."
        );
      }

      // Find the existing institute document
      const existingInstitute = await instituteModel.findById(id);
      if (!existingInstitute) {
        return responsestatusmessage(res, false, "Institute not found.");
      }

      // Determine whether to use existing logo or new one
      let logoPath = existingInstitute.instituteLogo;
      if (req.file) {
        logoPath = `${req.file.fieldname}/${req.file.filename}`; // Use new logo path if provided
      }

      // Update fields
      existingInstitute.instituteName = instituteName;
      existingInstitute.instituteUrl = instituteUrl;
      existingInstitute.address = address;
      existingInstitute.approvedBy = approvedBy;
      existingInstitute.city = city;
      existingInstitute.state = state;
      existingInstitute.instituteType = instituteType;
      existingInstitute.instituteLogo = logoPath; // Update logo path
      existingInstitute.description = description;
      existingInstitute.role = role;

      await existingInstitute.save();

      return responsestatusdata(
        res,
        true,
        "Institute updated successfully",
        existingInstitute
      );
    } catch (error) {
      console.error(error);
      return responsestatusmessage(res, false, "Something went wrong.");
    }
  });
};
