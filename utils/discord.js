//@discord.js discord OAuth utility functions
import axios from 'axios';

const discordClientID = process.env.REACT_APP_DISCORD_CLIENT_ID;
const discordClientSecret = process.env.REACT_APP_DISCORD_CLIENT_SECRET;

//must be called once Discord OAuth has returned a single-use code
//to be converted into an access_token (post DisordLogin)
export async function retrieveDiscordOAuthIdentity(code, redirectURI) {
  //exchange OAuth Code for Short TTL access token
  var tokenURL = 'https://discord.com/api/oauth2/token';

  var payload = new URLSearchParams();
  payload.append('client_id', discordClientID);
  payload.append('client_secret', discordClientSecret);
  payload.append('grant_type', 'authorization_code');
  payload.append('code', code);
  payload.append('redirect_uri', redirectURI);

  var tokenOptions = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  //assign OAuth Token
  const tokenResponse = await axios.post(tokenURL, payload, tokenOptions);

  var bearerToken = tokenResponse.data.access_token;

  //now that we have an OAuth Token, get User Graph Info
  var userURL = 'https://discord.com/api/users/@me';
  var reqOptions = {
    headers: {
      authorization: `Bearer ${bearerToken}`,
    },
  };

  const responseObj = await axios.get(userURL, reqOptions);

  //assign response data
  var discordResponse = responseObj.data;

  return discordResponse;
}