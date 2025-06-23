const { createBonus, getBonus } = require("../services/pointBonusService");

const createPointBonus = async (req, res) => {
  try {
    const { type, note } = req.body;
    const userId = req.user.id;

    if (!type) {
      return res.status(400).json({ error: "Missing required field: type" });
    }

    const result = await createBonus({ userId, type, note });
    return res.status(201).json(result);
  } catch (error) {
    console.error("Create PointBonus error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const getPointBonus = async (req, res) => {
  try {
    const userId = req.user.id;
    const bonuses = await getBonus(userId);
    return res.status(200).json(bonuses);
  } catch (error) {
    console.error("Get PointBonuses error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPointBonus,
  getPointBonus,
};
