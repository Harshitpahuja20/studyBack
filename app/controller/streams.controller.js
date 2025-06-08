const { default: mongoose } = require("mongoose");
const upload = require("../middleware/multer.middleware");
const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");
const streamModel = require("../model/streams.model");

// Add a new stream
exports.addStream = async (req, res) => {
  // Call the upload middleware for 'image' field
  upload.single("stream")(req, res, async () => {
    try {
      const { title } = req.body;

      // Ensure title and image are provided
      if (!title || !req.file) {
        return responsestatusmessage(
          res,
          false,
          "Title and image are required."
        );
      }

      const imagePath = `${req.file.fieldname}/${req.file.generatedName}`;

      // Create a new stream document
      const newStream = new streamModel({
        title,
        image: imagePath,
      });

      await newStream.save();

      return responsestatusdata(
        res,
        true,
        "Stream added successfully",
        newStream
      );
    } catch (error) {
      console.error(error);
      return responsestatusmessage(res, false, "Something went wrong.");
    }
  });
};

// Delete a stream by ID
exports.deleteStream = async (req, res) => {
  const { id } = req.params;

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

// updateStream
exports.updateStream = async (req, res) => {
  upload.single("stream")(req, res, async () => {
    try {
      const { id, title } = req.body;

      if (!id || !title) {
        return responsestatusmessage(res, false, "ID and title are required.");
      }

      // Find the existing stream document
      const existingStream = await streamModel.findById(id);
      if (!existingStream) {
        return responsestatusmessage(res, false, "Stream not found.");
      }

      // Determine whether to use existing image or new one
      let imagePath = existingStream.image;
      if (req.file) {
        imagePath = `${req.file.fieldname}/${req.file.generatedName}`;
      }

      // Update fields
      existingStream.title = title;
      existingStream.image = imagePath;

      await existingStream.save();

      return responsestatusdata(
        res,
        true,
        "Stream updated successfully",
        existingStream
      );
    } catch (error) {
      console.error(error);
      return responsestatusmessage(res, false, "Something went wrong.");
    }
  });
};

exports.updateAttachment = async (req, res) => {
  try {
    const { streamId, University } = req.body;

    // Make sure it's an array
    if (!Array.isArray(University)) {
      return responsestatusmessage(
        res,
        false,
        'University must be an array of string ObjectIds.'
      );
    }

    // Convert valid ObjectIds
    const universityObjectIds = University
      .filter((id) => mongoose.isValidObjectId(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    const updatedStream = await streamModel.findByIdAndUpdate(
      streamId,
      { university: universityObjectIds },
      { new: true }
    );

    if (!updatedStream) {
      return responsestatusmessage(res, false, 'Stream not found');
    }

    return responsestatusdata(
      res,
      true,
      'Attachment updated successfully',
      updatedStream
    );
  } catch (error) {
    console.error('Error in updateAttachment:', error);
    return responsestatusmessage(res, false, 'Server error');
  }
};

