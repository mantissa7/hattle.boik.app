import { serve } from "bun";
import index from "./client/index.html";
// import admin from "./admin/index.html";
import { daily_set, random_set, session_user, validate_guess } from "./lib/boik";
import { required } from "./lib/util";

const server = serve({
	routes: {
		"/": index, // client front-end
		// "/admin": admin, // admin front-end

		/** * * * * * * * * * * * * * * * * *
		 * 									*
		 * 				 API				*
		 * 									*
		 * * * * * * * * * * * * * * * * * **/
		"/api/me": {
			async GET(req) {
				const user = await session_user(req.headers.get("Authorization"));
				return new Response(JSON.stringify(user));
			},
		},
		"/api/set": {
			async GET(req) {
				// const user = await session_user(req.headers.get("Authorization"));
				// const type = req.params
				const type = new URL(req.url).searchParams.get("type") ?? "daily";
				const set = type === "daily" ? await daily_set() : await random_set();

				return new Response(
					JSON.stringify(
						set.map((question) => ({
							set_id: question.set_id,
							vid: question.vid,
							video_url: question.video_url,
							thumbnails: question.thumbnails,
							daily: question.daily,
						})),
					),
				);
			},
			// Submit answer
			async POST(req) {
				try {
					const fd = await req.formData();

					if (!required([fd.get("set_id"), fd.get("vid"), fd.get("month"), fd.get("year")])) {
						return new Response(
							JSON.stringify({
								error: "missing props",
							}),
							{
								status: 400,
							},
						);
					}

					const set_id = fd.get("set_id") as string;
					const vid = +(fd.get("vid") as string);
					const month = +(fd.get("month") as string);
					const year = +(fd.get("year") as string);

					const guess = await validate_guess(set_id, vid, month, year);

					return new Response(
						JSON.stringify({
							data: guess,
						}),
						{
							status: 200,
						},
					);
				} catch (error) {
					console.error(error);
					return new Response('{error: "OOPS"}', {
						status: 500,
					});
				}
			},
		},
	},

	/** * * * * * * * * * * * * * * * * *
	 * 									*
	 * 		All unhandled requests		*
	 * 									*
	 * * * * * * * * * * * * * * * * * **/
	fetch(req) {
		return new Response("Not Found", { status: 404 });
	},

	// development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);
