"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET = exports.OAUTH_REDIRECT = exports.CLIENT_SECRET = exports.CLIENT_ID = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const allRoutes_1 = __importDefault(require("./routes/allRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const envPath = path_1.default.resolve(__dirname, "../", ".env");
dotenv_1.default.config({ path: envPath });
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/', allRoutes_1.default);
exports.CLIENT_ID = process.env.CLIENT_ID;
exports.CLIENT_SECRET = process.env.CLIENT_SECRET;
exports.OAUTH_REDIRECT = process.env.OAUTH_REDIRECT;
exports.SECRET = process.env.SECRET;
app.listen(3000, () => console.log("Server listening on port: 3000"));