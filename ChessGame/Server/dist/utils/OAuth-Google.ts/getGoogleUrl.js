"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleUrl = void 0;
const __1 = require("../..");
function getGoogleUrl() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: __1.OAUTH_REDIRECT,
        client_id: __1.CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };
    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
}
exports.getGoogleUrl = getGoogleUrl;
