"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const client_1 = require("@prisma/client");
const hash_1 = require("../utils/HashPassword/hash");
const prisma = new client_1.PrismaClient();
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userData = req.body;
        const userexist = yield prisma.user.findUnique({
            where: {
                email: userData.email
            }
        });
        if (userexist) {
            if (userexist.password) {
                const isPasswordMatch = yield (0, hash_1.comparePasswords)(userData.password, userexist.password);
                if (!isPasswordMatch) {
                    return res.status(400).json({ message: "Incorrect password!" });
                }
                return res.status(200).json({ message: "USer LoggedIN Successfully! " });
            }
            return res.status(200).json({ message: "USer LoggedIN Successfully! " });
        }
        return res.status(404).json({ message: "user Not Found! " });
    });
}
exports.login = login;
