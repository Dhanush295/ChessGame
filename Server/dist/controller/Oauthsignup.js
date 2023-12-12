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
exports.Oauthsignup = void 0;
const getGoogleUrl_1 = require("../utils/OAuth-Google.ts/getGoogleUrl");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function Oauthsignup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const googleAuthUrl = (0, getGoogleUrl_1.getGoogleUrl)();
        res.send(`<a href="${googleAuthUrl}">Authenticate with Google</a>`);
    });
}
exports.Oauthsignup = Oauthsignup;
;
