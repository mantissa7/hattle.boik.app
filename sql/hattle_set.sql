-- drop FUNCTION hattle_set(text);
CREATE or replace FUNCTION hattle_set(_id text)
RETURNS table(set_id text, vid text, published_at text, thumbnails jsonb, daily text)
AS
$$
	select		s.id as set_id,
	        	vid,
				v.published_at,
				v.thumbnails,
				s.daily
	FROM        (
					select  hs.id,
							hs.set,
							hs.daily
					from    hattle_set hs
					where 	case when _id is null then true else hs.id = _id end
					order   by id desc
					limit   1
				) s,
				unnest(s.set) vid
	inner join  video v on v.id = vid::int;

$$
LANGUAGE SQL;


-- select * from hattle_set();
-- select * from hattle_set('0de4f804dae2db399132a2173c3f082f');