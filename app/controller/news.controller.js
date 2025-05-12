const newsModel = require("../model/news.model");

const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");

exports.createNews = async (req, res) => {
  const { heading, shortDescription, description } = req.body; // Adjusted to match new schema

  try {
    const newNews = await newsModel.create({
      heading,
      shortDescription,
      description,
    });

    return responsestatusdata(res, true, "Created Successfully", newNews);
  } catch (error) {
    return responsestatusmessage(
      res,
      false,
      "Error creating news entry",
      error.message
    );
  }
};

exports.deleteNews = async (req, res) => {
  const { id } = req.params; // Use `req.params.id` to get the id from URL parameters

  try {
    const deletedNews = await newsModel.findByIdAndDelete(id);

    if (!deletedNews) {
      return responsestatusmessage(res, false, "News entry not found");
    }

    return responsestatusmessage(res, true, "Deleted Successfully");
  } catch (error) {
    return responsestatusmessage(
      res,
      false,
      "Error deleting news entry",
      error.message
    );
  }
};

exports.getNews = async (req, res) => {
  try {
    const newsEntries = await newsModel.find({});
    return responsestatusdata(res, true, "Fetched Successfully", newsEntries);
  } catch (error) {
    return responsestatusmessage(
      res,
      false,
      "Error fetching news entries",
      error.message
    );
  }
};
