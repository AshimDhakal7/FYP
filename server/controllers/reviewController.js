import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Ground from "../models/Ground.js";

const getUserId = (req) => req.user?._id || req.user?.id;

const updateGroundRatingStats = async (groundId) => {
  const stats = await Review.aggregate([
    {
      $match: {
        cricsal: groundId,
      },
    },
    {
      $group: {
        _id: "$cricsal",
        averageRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  await Ground.findByIdAndUpdate(groundId, {
    averageRating: Number(stats[0]?.averageRating || 0).toFixed(1),
    numReviews: stats[0]?.numReviews || 0,
  });
};

// CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { bookingId, rating, comment } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!bookingId || !rating) {
      return res.status(400).json({
        message: "bookingId and rating are required",
      });
    }

    const numericRating = Number(rating);

    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const booking = await Booking.findById(bookingId).populate(
      "cricsal",
      "name averageRating numReviews"
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (String(booking.user) !== String(userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Current app uses confirmed/cancelled flow
    if (booking.status !== "confirmed") {
      return res.status(400).json({
        message: "Only confirmed bookings can be reviewed",
      });
    }

    const alreadyReviewed = await Review.findOne({ booking: bookingId });
    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You have already reviewed this booking",
      });
    }

    const review = await Review.create({
      user: userId,
      cricsal: booking.cricsal?._id || booking.cricsal,
      booking: booking._id,
      rating: numericRating,
      comment: comment || "",
    });

    await updateGroundRatingStats(booking.cricsal?._id || booking.cricsal);

    const populatedReview = await Review.findById(review._id).populate(
      "user",
      "name"
    );

    return res.status(201).json(populatedReview);
  } catch (err) {
    console.error("CREATE REVIEW ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET REVIEWS BY GROUND
export const getGroundReviews = async (req, res) => {
  try {
    const { groundId } = req.params;

    const reviews = await Review.find({ cricsal: groundId })
      .sort({ createdAt: -1 })
      .populate("user", "name");

    const averageRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
            reviews.length
          ).toFixed(1)
        : "0.0";

    return res.json({
      averageRating: Number(averageRating),
      numReviews: reviews.length,
      reviews,
    });
  } catch (err) {
    console.error("GET GROUND REVIEWS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// CHECK IF USER CAN REVIEW BOOKING
export const canReviewBooking = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { bookingId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (String(booking.user) !== String(userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const existing = await Review.findOne({ booking: bookingId });

    return res.json({
      canReview: booking.status === "confirmed" && !existing,
      alreadyReviewed: !!existing,
      status: booking.status,
    });
  } catch (err) {
    console.error("CAN REVIEW BOOKING ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET OWNER REVIEWS
export const getOwnerReviews = async (req, res) => {
    try {
      const ownerId = req.user?._id || req.user?.id;
  
      // First get owner's grounds
      const grounds = await Ground.find({ ownerId }).select("_id name");
  
      const groundIds = grounds.map((g) => g._id);
  
      // Then get only reviews for those grounds
      const reviews = await Review.find({
        cricsal: { $in: groundIds },
      })
        .populate("user", "name")
        .populate("cricsal", "name")
        .sort({ createdAt: -1 });
  
      return res.json(reviews);
    } catch (err) {
      console.error("GET OWNER REVIEWS ERROR:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };
  // REPLY TO REVIEW
  export const replyToReview = async (req, res) => {
    try {
      const { id } = req.params;
      const { reply } = req.body;
  
      const review = await Review.findById(id);
  
      if (!review) return res.status(404).json({ message: "Review not found" });
  
      review.ownerReply = reply;
      await review.save();
  
      res.json(review);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  // GET ALL REVIEWS FOR ADMIN
export const getAdminReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("user", "name email")
      .populate("cricsal", "name location ownerId")
      .sort({ createdAt: -1 });

    return res.json(reviews);
  } catch (err) {
    console.error("GET ADMIN REVIEWS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// TOGGLE REVIEW VISIBILITY
export const toggleReviewVisibility = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.isHidden = !review.isHidden;
    await review.save();

    return res.json(review);
  } catch (err) {
    console.error("TOGGLE REVIEW VISIBILITY ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// SAVE ADMIN NOTE
export const saveAdminReviewNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNote } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.adminNote = adminNote || "";
    await review.save();

    return res.json(review);
  } catch (err) {
    console.error("SAVE ADMIN REVIEW NOTE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};