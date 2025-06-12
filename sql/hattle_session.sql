create table hattle_session(
	id uuid primary key,
	hattle_set int,
	step int,
	created_at timestamptz
);


-- drop function public.get_hattle_session(text);
CREATE or replace FUNCTION public.get_hattle_session(_id text)
RETURNS hattle_session
AS
$$
DECLARE
  ret RECORD;
BEGIN
	if _id is null then
		insert into hattle_session
		(id, created_at)
		values
		(gen_random_uuid(), now())
		returning 	id,
					0 as hattle_set,
					0 as step,
					created_at
		into ret;
	else
		select 	*
		into 	ret
		from	hattle_session
		where 	id = _id::uuid;
	end if;
	return ret;
END;
$$
LANGUAGE plpgsql;

-- select * from public.get_hattle_session(null);
-- select * from public.get_hattle_session('02d606b7-2e98-4f21-9761-9a44a6416c5e');

-- select * from hattle_session;