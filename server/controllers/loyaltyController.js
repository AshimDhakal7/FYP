import LoyaltyTransaction from "../models/LoyaltyTransaction.js";

const getUserId = (req) => req.user?._id || req.user?.id;

export const getMyLoyaltySummary = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const transactions = await LoyaltyTransaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const totalEarned = transactions
      .filter((t) => t.direction === "credit")
      .reduce((sum, t) => sum + Number(t.points || 0), 0);

    const totalSpent = transactions
      .filter((t) => t.direction === "debit")
      .reduce((sum, t) => sum + Number(t.points || 0), 0);

    return res.json({
      loyaltyPoints: Number(req.user?.loyaltyPoints || 0),
      totalEarned,
      totalSpent,
      recentTransactions: transactions,
    });
  } catch (err) {
    console.error("GET MY LOYALTY SUMMARY ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyLoyaltyHistory = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const history = await LoyaltyTransaction.find({ user: userId })
      .populate("booking", "date startTime endTime totalPrice status")
      .sort({ createdAt: -1 });

    return res.json(history);
  } catch (err) {
    console.error("GET MY LOYALTY HISTORY ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};