const upload = require("../middleware/multer.middleware");
const { responsestatusmessage, responsestatusdata } = require("../middleware/responses");
const streamModel = require("../model/stream.model");

// Add a new stream
exports.addStream = async (req, res) => {
  // Call the upload middleware for 'image' field
  upload.single("image")(req, res, async () => {
    try {
      const { title } = req.body;
      console.log(title, req.file);

      // Ensure title and image are provided
      if (!title || !req.file) {
        return responsestatusmessage(res, false, "Title and image are required.");
      }

      const imagePath = `${req.file.fieldname}/${req.file.generatedName}`;

      // Create a new stream document
      const newStream = new streamModel({
        title,
        image: imagePath,
      });

      await newStream.save();

      return responsestatusdata(res, true, "Stream added successfully", newStream);
    } catch (error) {
      console.error(error);
      return responsestatusmessage(res, false, "Something went wrong.");
    }
  });
};

// Delete a stream by ID
exports.deleteStream = async (req, res) => {
  const { id } = req.body;

  try {
    const deletedStream = await streamModel.findByIdAndDelete(id);
    if (!deletedStream) {
      return responsestatusmessage(res, false, "Stream not found.");
    }
    return responsestatusmessage(res, true, "Deleted Successfully");
  } catch (error) {
    return responsestatusmessage(res, false, "Error deleting stream.");
  }
};

// Get all streams
exports.getStreams = async (req, res) => {
  try {
    const streams = await streamModel.find({});
    return responsestatusdata(res, true, "Fetched Successfully", streams);
  } catch (error) {
    return responsestatusmessage(res, false, "Error fetching streams");
  }
};
