import { CLIENT_ID, OAUTH_REDIRECT } from "..";

export function getGoogleUrl(){
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const options = {
        redirect_uri : OAUTH_REDIRECT as string,
        client_id : CLIENT_ID as string,
        access_type : "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    }

    const qs = new URLSearchParams(options)
    return `${rootUrl}?${qs.toString()}`
}