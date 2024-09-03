const jwt = require("jsonwebtoken");
const UserModel = require("../model/UserModel");

const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ Message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    const user = await UserModel.findById(decoded.user._id);

    if (!user) {
      return res.status(401).json({ Message: "User not found" });
    }

    req.user = user; // Attach the user to req
    next();
  } catch (error) {
    res.status(401).json({ Message: "Invalid token" });
  }
};

module.exports = auth;
