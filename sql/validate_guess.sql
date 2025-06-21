-- drop FUNCTION validate_guess(text, int, int, int);
CREATE or replace FUNCTION validate_guess(_set_id text, _vid int, _month int, _year int)
RETURNS table (correct bool, month bool, year bool)
AS
$$
	select 	case when x.month = _month and x.year = _year then true else false end as correct,
	        case when x.month = _month then true else false end as month,
			case when x.year = _year then true else false end as year
	from (
		select			date_part('month', v.published_at::timestamptz) as month,
						date_part('year', v.published_at::timestamptz) as year
		FROM			hattle_set hs
		inner join  	video v on v.id = _vid
		where 			hs.id = _set_id
		and				_vid::text = any(hs.set)
	) x

$$
LANGUAGE SQL;


select * from validate_guess('0de4f804dae2db399132a2173c3f082f', 5303, 8, 2019);
-- select * from validate_guess('0de4f804dae2db399132a2173c3f082f', 5303, 1, 1);