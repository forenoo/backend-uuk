import jwt from "jsonwebtoken";

export const generateToken = (user, role) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};
