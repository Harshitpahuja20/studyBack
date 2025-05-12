const upload = require("../middleware/multer.middleware");
const { responsestatusmessage, responsestatusdata } = require("../middleware/responses");
const placeModel = require("../model/place.model");

// Add a new place
exports.addPlace = async (req, res) => {
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

      // Create a new place document
      const newPlace = new placeModel({
        title,
        image: imagePath,
      });

      await newPlace.save();

      return responsestatusdata(res, true, "Place added successfully", newPlace);
    } catch (error) {
      console.error(error);
      return responsestatusmessage(res, false, "Something went wrong.");
    }
  });
};

// Delete a place by ID
exports.deletePlace = async (req, res) => {
  const { id } = req.body;

  try {
    const deletedPlace = await placeModel.findByIdAndDelete(id);
    if (!deletedPlace) {
      return responsestatusmessage(res, false, "Place not found.");
    }
    return responsestatusmessage(res, true, "Deleted Successfully");
  } catch (error) {
    return responsestatusmessage(res, false, "Error deleting place.");
  }
};

// Get all places
exports.getPlaces = async (req, res) => {
  try {
    const places = await placeModel.find({});
    return responsestatusdata(res, true, "Fetched Successfully", places);
  } catch (error) {
    return responsestatusmessage(res, false, "Error fetching places");
  }
};
