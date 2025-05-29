import { serve } from "bun";
import index from "./client/index.html";
// import admin from "./admin/index.html";
import { store, type User } from "./lib/db";
import { videos } from "./lib/boik";

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
				const v = await videos();
				console.log(v);
				
				return new Response(JSON.stringify(v));
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
