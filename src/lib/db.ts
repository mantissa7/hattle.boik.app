import { Database } from "bun:sqlite";

// https://bun.sh/docs/api/sqlite

export interface User {
	id: string;
	username: string;
	alias: string | null;
	avatar: string | null;
	is_admin: 0 | 1;
}

export type NewUser = Omit<User, "is_admin">;

export interface Session {
	id: string;
	user_id: string;
	discord_auth_header: string;
	discord_refresh_token: string;
	created: string | null;
	deleted: string | null;
}

export class Store {
	#db: Database;

	constructor() {
		this.#db = new Database(Bun.env.db_path ?? "./fingles.sqlite", {
			strict: true,
		});
	}
	// Initialise the SQLite database for the first time.
	public async init() {
		this.#db.run(`
            CREATE TABLE IF NOT EXISTS user (
                id text NOT NULL UNIQUE,
                username text,
                alias text,
                avatar text,
                created text not null,
                deleted text
            );

            CREATE TABLE IF NOT EXISTS admin (
                id text NOT NULL UNIQUE,
                created text not null,
                deleted text
            );

            CREATE TABLE IF NOT EXISTS session (
                id text NOT NULL UNIQUE,
                user_id text,
                discord_auth_header text, 
                discord_refresh_token text,
                created text not null,
                deleted text
            );
        `);
	}

	// Add admin
	public add_admin(id: string) {
		return this.#db
			.query(`
                insert into admin
                (id, created)
                values
                (?, datetime())
            `)
			.run(id);
	}

	public auth_user(token: string) {
		return this.#db
			.query(`
                select      u.id,
                            u.username,
                            u.alias,
                            u.avatar,
                            a.id is not null as is_admin
                from        user u 
                left join   admin a on u.id = a.id
                inner join  session s on u.id = s.user_id
                where       s.id = $id
                and         (u.deleted is null or u.deleted > datetime())
                and         (s.deleted is null or s.deleted > datetime())
            `)
			.get({
				id: token,
			}) as User & { is_admin: boolean };
	}

	// public get_user (id: number) {
	// 	return this.#db
	// 		.query(`
	//             select      u.*,
	//                         IIF(a.id is not null, true, false) as is_admin
	//             from        user u
	//             left join   admin a on u.id = a.id
	//             where       u.id = ?
	//         `)
	// 		.get(id) as User;
	// };

	public set_session(id: string, user_id: string, discord_auth_header: string, discord_refresh_token: string) {
		return this.#db
			.prepare(`
                insert into session
                (id, user_id, discord_auth_header, discord_refresh_token, created)
                values
                ($id, $user_id, $discord_auth_header, $discord_refresh_token, datetime())
            `)
			.run({
				id,
				user_id,
				discord_auth_header,
				discord_refresh_token,
			});
	}

	public upsert_user(user: NewUser) {
		return this.#db
			.prepare(`
                insert into user
                (id, username, alias, avatar, created)
                values
                ($id, $username, $alias, $avatar, datetime())
                on conflict (id)
                do update set   username = $username,
                                alias = $alias,
                                avatar = $avatar
            `)
			.run({
				...user,
			});
	}


}

export const store = new Store();
