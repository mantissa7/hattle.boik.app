import { sql } from "bun";

export const videos = async () => {
	return await sql`
		select          s.id,
						v.published_at,
						v.thumbnails,
						s.daily
		FROM        	(
							select  hs.id,
									hs.set,
									hs.daily
							from    hattle_set hs
							order   by id desc
							limit   1
						) s, 
						unnest(s.set) vid
		inner join      video v on v.id = vid::int
    `;
};

export const gen_set = async () => {
	return await sql`select generate_hattle_set();`;
};
