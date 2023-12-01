import jwt from "jsonwebtoken";
const SECRET = "MultiChessGame"

export function mySignJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, SECRET, { ...(options && options)});
}