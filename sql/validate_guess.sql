CREATE or replace FUNCTION validate_guess(_set_id text, _question_num int, _month int, _year int)
RETURNS bool
AS 
$$
	select 	case when x.month = _month and x.year = _year then true else false end
	from (
		select			date_part('month', v.published_at::timestamptz) as month,
								date_part('year', v.published_at::timestamptz) as year
		FROM				hattle_set hs
		inner join  video v on v.id = hs.set[_question_num]::int
		where 			hs.id = _set_id
	) x

$$
LANGUAGE SQL;


-- select * from validate_guess('0de4f804dae2db399132a2173c3f082f', 1, 8, 2019);
-- select * from hattle_set('0de4f804dae2db399132a2173c3f082f');