
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
            where     channel_id != 'UCj9naD1BeTO77JW1qRQKKZQ' -- ignore crumbs8 channel
            order by  random()
            LIMIT     10
        ) as x
$$
LANGUAGE SQL;