/* Importing the axios library. */
const axios = require('axios');

/**
 * It takes an authorization code as a parameter, and returns an access token
 * @param {string} AUTH_CODE - The authorization code you received from the user.
 * @returns The access token is being returned.
 */
export const OAuth42_access_token = async (AUTH_CODE: string) => {
	const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
	const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
	const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

	const queryParams = "?"
	+ "grant_type=authorization_code&"
	+ "client_id=" + CLIENT_ID + "&"
	+ "client_secret=" + CLIENT_SECRET + "&"
	+ "code=" + AUTH_CODE + "&"
	+ "redirect_uri=" + REDIRECT_URI + "&"
	+ "scope=public";
	try {
		const res = await axios('https://api.intra.42.fr/oauth/token' + queryParams, {
				          method: 'POST',
				          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				        });
		return res.data.access_token;
	} catch (error) {
		return null;
	}
}

/**
 * It takes an access token as a parameter, and returns an object containing the user's name, login,
 * and avatar
 * @param {string} ACCESS_TOKEN - The access token you got from the previous step.
 * @returns An object with the user's name, login, and avatar.
 */
export const OAuth42_user = async (ACCESS_TOKEN: string) => {
	const res = await axios.get('https://api.intra.42.fr/v2/me', {
								headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN }
							});
	return ({name: res.data.displayname, login: res.data.login, avatar: res.data.image_url});
}