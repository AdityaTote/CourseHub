import jwt from "jsonwebtoken";

export const signToken = (user: any, jwtSecreteKey: string): string => {
  const payload = {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  const token = jwt.sign(payload, jwtSecreteKey);

  return token;
};

export const verifyToken = (token: string, jwtSecreteKey: string): any => {
  const tokenData = jwt.verify(token, jwtSecreteKey);

  return tokenData;
};
