import axios from "axios";
import qs from "qs";
import { CLIENT_ID, CLIENT_SECRET, OAUTH_REDIRECT } from ".."

interface TokenResponse {
    access_token: string;
    expires_in: Number;
    refresh_token: string;
    scope: string;
    id_token : string;
}


export async function getOauthTokens({ code }: { code: string }): Promise<TokenResponse> {
    const url = "https://oauth2.googleapis.com/token";
  
    const value = {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: OAUTH_REDIRECT, 
      grant_type: "authorization_code",
    };
  
    try {
      const response = await axios.post<TokenResponse>(url, qs.stringify(value), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(error, "Failed to get Google Tokens");
      throw new Error(error.message);
    }
  }