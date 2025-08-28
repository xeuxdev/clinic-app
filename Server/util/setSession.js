import jwt from "jsonwebtoken";

export const setSession = (res, userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT key not provided");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });

  const cookieName = "HealthCare_session";

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    domain: new URL(process.env.FRONTEND_URL).hostname,
  };

  res.cookie(cookieName, token, cookieOptions);

  return token;
};
