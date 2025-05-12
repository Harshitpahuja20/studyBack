const ContactModel = require("../model/contact.model");

const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");

exports.createContact = async (req, res) => {
  const { fullName, subject, comment, phoneNumber, email } = req.body; // Adjust to match your schema

  try {
    const newContact = await ContactModel.create({
      fullName,
      subject,
      comment,
      phoneNumber,
      email,
    });

    return responsestatusdata(res, true, "Created Successfully", newContact);
  } catch (error) {
    return responsestatusmessage(res, false, "Error creating footer option", error.message);
  }
};

exports.deleteContact = async (req, res) => {
  const { id } = req.params; // Use `req.params.id` to get the id from URL parameters

  try {
    const deletedContact = await ContactModel.findByIdAndDelete(id);

    if (!deletedContact) {
      return responsestatusmessage(res, false, "Contact not found");
    }

    return responsestatusmessage(res, true, "Deleted Successfully");
  } catch (error) {
    return responsestatusmessage(res, false, "Error deleting footer", error.message);
  }
};

exports.getContact = async (req, res) => {
  try {
    const categories = await ContactModel.find({});
    return responsestatusdata(res, true, "Fetched Successfully", categories);
  } catch (error) {
    return responsestatusmessage(res, false, "Error fetching footers", error.message);
  }
};
