const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");
const footerModel = require("../model/footer.model");

exports.createFooterOption = async (req, res) => {
  const { title, type } = req.body;

  const stream = await footerModel.create(title, type);

  return responsestatusdata(res, true, "Created Successfully", stream);
};

exports.deleteFooter = async (req, res) => {
  const { id } = req.body;

  await footerModel.findByIdAndDelete(id);

  return responsestatusmessage(res, true, "Deleted Successfully");
};

exports.getFooters = async (req, res) => {
  const [stream, university, city] = await Promise.all([
    footerModel.find({ type: "stream" }),
    footerModel.find({ type: "university" }),
    footerModel.find({ type: "city" }),
  ]);

  // Example: return them in response
  return responsestatusdata(res, true, "Fetched Successfully", {
    stream,
    university,
    city,
  });
};
