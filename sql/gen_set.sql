
CREATE FUNCTION generate_hattle_set()
RETURNS VOID
AS 
$$
        insert into hattle_set(id, set, daily)
        SELECT      md5(array_agg(x.id)::text), 
                    array_agg(x.id) as set,
                    date_trunc('day', now())
        from  (
            SELECT    v.id
            FROM      video v
            where     channel_id not in ('UCPgN4KqzELysZU0v9oTs_KA', 'UCj9naD1BeTO77JW1qRQKKZQ') -- ignore crumbs8 and HatFilmsLive channels
            order by  random()
            LIMIT     10
        ) as x
$$
LANGUAGE SQL;


-- generate date range
-- SELECT * FROM generate_series(now(), now() + interval '364 days', '1 day');





CREATE FUNCTION generate_practice_hattle_set(_rows int)
RETURNS VOID
AS
$$
        insert into hattle_set(id, set, daily)
		select md5(array_agg(x.id)::text) as id,
			   array_agg(x.id) as set,
				null as daily
		from (
			SELECT 	v.id,
					((row_number() over(order by random()) -1) / 10)::int +1 as bucket_size
			FROM video v,
			generate_series(1, 10) srs
			where channel_id not in
				  ('UCPgN4KqzELysZU0v9oTs_KA', 'UCj9naD1BeTO77JW1qRQKKZQ') -- ignore crumbs8 and HatFilmsLive channels
		) x
		group by bucket_size
		limit _rows
$$
LANGUAGE SQL;


-- select * from generate_practice_hattle_set(100);

-- select * from hattle_set