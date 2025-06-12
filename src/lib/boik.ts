import { sql } from "bun";

export type HattleVid = {
	id: string;
	published_at: string; // iso8601 timestamp
	thumbnails: {
		maxres: string;
	};
	daily: string; // iso8601 timestamp
};

export const session_user = async (id?: string): Promise<HattleVid[]> => {
	const rows = await sql`
		select * from get_hattle_session(${id});
    `.values();

	return rows[0][0];
};

export const hattle_set = async (id?: string): Promise<HattleVid[]> => {
	return await sql`
		select * from hattle_set(${id});
    `;
};

export const validate_guess = async (
	id: string,
	question_num: number,
	month: number,
	year: number,
): Promise<HattleVid[]> => {
	const rows = await sql`
		select * from validate_guess(${id}, ${question_num}, ${month}, ${year});
    `.values();

	return rows[0][0];
};

export const gen_set = async () => {
	return await sql`select generate_hattle_set();`;
};
