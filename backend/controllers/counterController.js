import Counter from "../models/Counter.js";

export const addIn = async (req, res) => {
  try {
    const record = await Counter.create({
      type: "IN",
      userId: req.user.id,
    });

    res.json({ message: "IN recorded", data: record });
  } catch (err) {
    res.status(500).json({ message: "Error recording IN" });
  }
};

export const addOut = async (req, res) => {
  try {
    const record = await Counter.create({
      type: "OUT",
      userId: req.user.id,
    });

    res.json({ message: "OUT recorded", data: record });
  } catch (err) {
    res.status(500).json({ message: "Error recording OUT" });
  }
};
