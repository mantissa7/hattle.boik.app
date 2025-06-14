import { sql } from "bun";

export type Session = {
	id: string;
	hattle_set: number;
	step: number;
	created_at: string; // iso8601 timestamp
}

export type HattleVid = {
	set_id: string;
	vid: number;
	published_at: string; // iso8601 timestamp
	thumbnails: {
		maxres: string;
	};
	daily: string; // iso8601 timestamp
};

export const session_user = async (id: string | null): Promise<Session> => {
	const rows = await sql`
		select * from get_hattle_session(${id});
    `.values();

	return rows[0][0];
};

export const hattle_set = async (id: string | null): Promise<HattleVid[]> => {
	return await sql`
		select * from hattle_set(${id});
    `;
};

export const validate_guess = async (
	id: string,
	vid: number,
	month: number,
	year: number,
): Promise<HattleVid[]> => {
	const rows = await sql`
		select * from validate_guess(${id}, ${vid}, ${month}, ${year});
    `.values();

	return rows[0][0];
};

export const gen_set = async () => {
	return await sql`select generate_hattle_set();`;
};
