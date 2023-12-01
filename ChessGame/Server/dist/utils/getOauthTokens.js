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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOauthTokens = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const __1 = require("..");
function getOauthTokens(_a) {
    return __awaiter(this, arguments, void 0, function* ({ code }) {
        const url = "https://oauth2.googleapis.com/token";
        const value = {
            code,
            client_id: __1.CLIENT_ID,
            client_secret: __1.CLIENT_SECRET,
            redirect_uri: __1.OAUTH_REDIRECT,
            grant_type: "authorization_code",
        };
        try {
            const response = yield axios_1.default.post(url, qs_1.default.stringify(value), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            return response.data;
        }
        catch (error) {
            console.error(error, "Failed to get Google Tokens");
            throw new Error(error.message);
        }
    });
}
exports.getOauthTokens = getOauthTokens;
