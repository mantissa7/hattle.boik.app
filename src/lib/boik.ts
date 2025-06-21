import { sql } from "bun";

export type Session = {
	id: string;
	hattle_set: number;
	step: number;
	created_at: string; // iso8601 timestamp
};

type Thumbnail = {
	url: string;
	width: number;
	height: number;
};

type Thumbnails = {
	default: Thumbnail;
	medium: Thumbnail;
	high: Thumbnail;
	standard: Thumbnail;
	maxres: Thumbnail;
};

export type HattleVid = {
	set_id: string;
	vid: number;
	published_at: string; // iso8601 timestamp
	thumbnails: Thumbnails;
	daily: string; // iso8601 timestamp
};

export type ValidatedGuess = {
	correct: boolean;
	month: boolean;
	year: boolean;
};

export const session_user = async (id: string | null): Promise<Session> => {
	const [row] = await sql`
		select * from get_hattle_session(${id});
    `.values();

	return row[0];
};

export const daily_set = async (): Promise<HattleVid[]> => {
	return await sql`
		select * from hattle_set(null);
    `;
};

export const random_set = async (): Promise<HattleVid[]> => {
	return await sql`
		select * from hattle_practice_set();
    `;
};

export const validate_guess = async (id: string, vid: number, month: number, year: number) => {
	const [guess] = await sql`
		select 	*
		from 	validate_guess(${id}, ${vid}, ${month}, ${year});
    `;

	return guess as ValidatedGuess;
};

export const gen_set = async () => {
	return await sql`select generate_hattle_set();`;
};
