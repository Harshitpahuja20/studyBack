const upload = require("../middleware/multer.middleware");
const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");
const categoryModel = require("../model/category.model");

exports.addCategory = async (req, res) => {
  // Call the upload middleware for 'category' field
  upload.single("image")(req, res, async () => {
    try {
      const { title } = req.body;
      console.log(title, req.file);
      if (!title || !req.file) {
        return responsestatusmessage(
          res,
          false,
          "Name and image are required."
        );
      }

      const imagePath = `${req.file.fieldname}/${req.file.generatedName}`;

      const newCategory = new categoryModel({
        title,
        image: imagePath,
      });

      await newCategory.save();

      return responsestatusdata(
        res,
        true,
        "Category added successfully",
        newCategory
      );
    } catch (error) {
      console.error(error);
      return responsestatusmessage(res, false, "Something went wrong.");
    }
  });
};

exports.deleteFooter = async (req, res) => {
  const { id } = req.body;

  await categoryModel.findByIdAndDelete(id);

  return responsestatusmessage(res, true, "Deleted Successfully");
};

exports.getFooters = async (req, res) => {
  const categories = await footerModel.find({});

  // Example: return them in response
  return responsestatusdata(res, true, "Fetched Successfully", categories);
};
