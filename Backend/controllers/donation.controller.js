const errorHandler = require("express-async-handler");
const Donation = require("../Models/donation.model");
const ReceiverRequest = require("../Models/request.model");
const Transaction = require("../Models/transaction.model");

// Post a donation to a specific receiver request
const postDonation = errorHandler(async (req, res) => {
  const { foodItems, quantity, requestId, shelfLife, picture } = req.body;
  const user = req.user;
  const donorId = req.user._id;
  const donarName = user.name;
  const location = user.location;

  // Image validation (optional)
  // You can add checks for supported image formats and size limits

  let newDonation;

  if (requestId === 0) {
    newDonation = new Donation({
      donorId,
      location,
      donarName,
      foodItems,
      quantity,
      shelfLife,
      misc: true,
      picture: {
        data: Buffer.from(picture, 'base64'), // Assuming picture is sent as base64 string
        contentType: req.body.contentType || 'image/unknown', // Set default content type
      },
    });
  } else {
    const request = await ReceiverRequest.findById(requestId);
    const receiverId = request.receiverId;
    newDonation = new Donation({
      donorId,
      location,
      donarName,
      foodItems,
      quantity,
      shelfLife,
      requestId,
      receiverId,
      status: "taken",
      picture: {
        data: Buffer.from(picture, 'base64'), // Assuming picture is sent as base64 string
        contentType: req.body.contentType || 'image/unknown', // Set default content type
      },
    });
    const updatedRequest = await ReceiverRequest.findByIdAndUpdate(requestId, {
      status: "taken",
    });
    const donation = await newDonation.save();

    // Create a transaction (optional) - similar to the existing logic

  }

  const savedDonation = await newDonation.save();
  res.status(201).json(savedDonation);
});

const getDonation = errorHandler(async (req, res) => {
  const donations = await Donation.find();
  res.json(donations);
});

module.exports = {
  postDonation,
  getDonation,
};
