import { serve } from "bun";
import index from "./client/index.html";
// import admin from "./admin/index.html";
import { store, type User } from "./lib/db";
import { hattle_set, validate_guess } from "./lib/boik";

const session_user = async (session_id: string | null): Promise<User | null> => {
	if (!session_id) {
		return null;
	}

	return await store.auth_user(session_id);
};

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
				return new Response("{}");
			},
		},
		"/api/videos": {
			async GET(req) {
				const vids = await hattle_set();

				return new Response(
					JSON.stringify(
						vids.map((vid) => ({
							id: vid.id,
							thumbnails: vid.thumbnails,
							daily: vid.daily,
						})),
					),
				);
			},
			async POST(req) {
				try {

					const fd = await req.formData();
					const id = fd.get("id") as string | undefined;
	
					if (id === null || id === undefined) {
						return new Response(
							JSON.stringify({
								error: "missing id",
							}),
							{
								status: 400,
							},
						);
					}
	
					const correct = await validate_guess(id, fd.get("question"), fd.get("month"), fd.get("year"));
	
					return new Response(
						JSON.stringify({
							result: correct,
						}),
						{
							status: 200,
						},
					);
				} catch(error) {
					console.error(error)
					return new Response('{error: "OOPS"}', {
						status: 500
					})
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
