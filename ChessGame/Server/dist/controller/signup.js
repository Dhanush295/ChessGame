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
exports.signup = void 0;
const client_1 = require("@prisma/client");
const hash_1 = require("../utils/HashPassword/hash");
const prisma = new client_1.PrismaClient();
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userData = req.body;
        const userexist = yield prisma.user.findUnique({
            where: {
                email: userData.email
            }
        });
        if (!userexist) {
            if (userData.password) {
                const hashedPassword = (0, hash_1.hashPassword)(userData.password);
                const userCreated = yield prisma.user.create({
                    data: {
                        email: userData.email,
                        password: hashedPassword,
                        name: userData.name
                    }
                });
                if (!userCreated)
                    return res.sendStatus(400).json({ message: " USer Not Cerated " });
                return res.status(200).json({ message: "User Created Successfully! " });
            }
            else {
                const userCreated = yield prisma.user.create({
                    data: {
                        email: userData.email,
                        name: userData.name
                    }
                });
                if (!userCreated)
                    return res.sendStatus(400).json({ message: " USer Not Cerated " });
                return res.status(200).json({ message: "User Created Successfully! " });
            }
        }
        else {
            return res.sendStatus(400).json({ message: "User Already Exist! " });
        }
    });
}
exports.signup = signup;
