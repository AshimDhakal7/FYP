import LoyaltyTransaction from "../models/LoyaltyTransaction.js";
import User from "../models/User.js";

export const getAdminLoyaltyStats = async (req, res) => {
  try {
    const transactions = await LoyaltyTransaction.find({})
      .sort({ createdAt: 1 })
      .lean();

    const activeUsers = await User.countDocuments({
      role: "user",
      loyaltyPoints: { $gt: 0 },
    });

    const pointsIssued = transactions
      .filter((t) => t.direction === "credit")
      .reduce((sum, t) => sum + Number(t.points || 0), 0);

    const pointsRedeemed = transactions
      .filter((t) => t.type === "redeem")
      .reduce((sum, t) => sum + Number(t.points || 0), 0);

    const penaltyPoints = transactions
      .filter((t) => t.type === "penalty")
      .reduce((sum, t) => sum + Number(t.points || 0), 0);

    const discountGiven = transactions
      .filter((t) => t.type === "redeem")
      .reduce((sum, t) => sum + Number(t.amountValue || 0), 0);

    const trendMap = {};

    transactions.forEach((t) => {
      const date = new Date(t.createdAt);
      const month = date.toLocaleString("en-US", { month: "short" });

      if (!trendMap[month]) {
        trendMap[month] = {
          month,
          issued: 0,
          redeemed: 0,
        };
      }

      if (t.direction === "credit") {
        trendMap[month].issued += Number(t.points || 0);
      }

      if (t.type === "redeem") {
        trendMap[month].redeemed += Number(t.points || 0);
      }
    });

    const trend = Object.values(trendMap);

    return res.json({
      pointsIssued,
      pointsRedeemed,
      penaltyPoints,
      activeUsers,
      discountGiven,
      trend,
    });
  } catch (err) {
    console.error("GET ADMIN LOYALTY STATS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
