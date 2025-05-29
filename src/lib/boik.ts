import { sql } from "bun";

export const videos = async () => {
	return await sql`
        SELECT  video_id,
                published_at,
                title,
                thumbnails 
        FROM video_duplicate
        order by random()
        LIMIT 4
    `;
};
