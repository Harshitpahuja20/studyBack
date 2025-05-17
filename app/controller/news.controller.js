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

exports.updateNews = async (req, res) => {
  const { heading, shortDescription, description, id } = req.body; // Get data from the request body

  if (!id) {
    return responsestatusmessage(res, false, "News ID is required.");
  }

  try {
    // Find the existing news entry by ID
    const news = await newsModel.findById(id);

    if (!news) {
      return responsestatusmessage(res, false, "News entry not found.");
    }

    // Update the news entry with the new values
    news.heading = heading || news.heading;  // Only update if new value is provided
    news.shortDescription = shortDescription || news.shortDescription;
    news.description = description || news.description;

    // Save the updated news entry
    const updatedNews = await news.save();

    // Return the updated news entry
    return responsestatusdata(res, true, "Updated Successfully", updatedNews);
  } catch (error) {
    return responsestatusmessage(
      res,
      false,
      "Error updating news entry",
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
