// Manage authentication via discord

interface DiscordUser {
	id: string;
	username: string;
	avatar: string; // "bf4f3b73f1a72b4051d7e2acae794ac9"
	discriminator: string; // "0"
	public_flags: number; // 0
	flags: number;
	banner: string | null;
	accent_color: string | null;
	global_name: string;
	avatar_decoration_data: string | null;
	collectibles: string | null;
	banner_color: string | null;
	clan: string | null;
	primary_guild: null;
	mfa_enabled: boolean;
	locale: string; // "en-GB"
	premium_type: number;
}

interface DiscordHatUser {
	avatar: string | null;
	banner: string | null;
	communication_disabled_until: string | null;
	flags: number;
	joined_at: string; // "2022-05-09T14:43:02.800000+00:00",
	nick: string;
	pending: boolean;
	premium_since: string; // "2025-01-07T13:58:25.738000+00:00",
	roles: string[];
	unusual_dm_activity_until: string | null;
	user: DiscordUser;
	mute: false;
	deaf: false;
	bio: "";
}

interface HatUser {
	id: string;
	avatar: string | null;
	username: string;
	// roles: string[];
}

interface AuthResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
}

const BASE_URL = "https://discord.com/api";
const HAT_SERVER_ID = "104907015557513216";

// takes the code from the redirect and generates auth_token,
export const auth = async (code: string) => {
	const token_resp = await fetch(`${BASE_URL}/oauth2/token`, {
		headers: {
			Authorization: `Basic ${Buffer.from(`${Bun.env.discord_client_id}:${Bun.env.discord_client_secret}`).toString("base64")}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		method: "POST",
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code: code,
			redirect_uri: Bun.env.discord_redirect_url,
		}),
	});

	if (!token_resp.ok) {
		console.log(token_resp);
		console.log(await token_resp.text());
		return null;
	}

	return (await token_resp.json()) as AuthResponse;
};

export const hat_user = async (token: string) => {
	const headers = {
		Authorization: token,
		"User-Agent": "DiscordBot ($url, $versionNumber)",
		"Content-Type": "application/json",
	};

	const discordUserResp = await fetch(`${BASE_URL}/users/@me/guilds/${HAT_SERVER_ID}/member`, { headers });
	if (!discordUserResp.ok) {
		console.log(discordUserResp);
        return null;
	}
	const discordUser = (await discordUserResp.json()) as DiscordHatUser;

	const hatUser: HatUser = {
		id: discordUser.user.id,
		username:
			discordUser.nick ??
			discordUser.user.global_name ??
			`${discordUser.user.username}#${discordUser.user.discriminator}`,
		avatar: avatar(discordUser.user.id, discordUser.avatar ?? discordUser.user.avatar),
		// roles: discordUser.roles,
	};

	return hatUser;
};

const roles = () => {
	// /guilds/${HAT_SERVER_ID}/roles
};

const avatar = (user_id: string, avatar: string, size = 256) => {
	return `https://cdn.discordapp.com/avatars/${user_id}/${avatar}.png?size=${size}`;
};
