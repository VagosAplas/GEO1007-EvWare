-- Table: events_all
drop table if exists events_all;
CREATE TABLE events_all
(
  gid serial NOT NULL,
  event_type text,
  event_name text,
  geom geometry(Point, 4326),
  date_start text,
  date_end text,
  save_date text,
  inside character varying,
  build_no text,
  stime text,
  etime text,
  
  CONSTRAINT events_all_pkey PRIMARY KEY (gid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE events_all
  OWNER TO postgres;

-- Function: inside()

CREATE OR REPLACE FUNCTION inside()
  RETURNS trigger AS
$BODY$BEGIN 
if (select count(*) from buildings,events_all where (ST_Contains(buildings.geom, events_all.geom)= 't' and NEW.inside is NULL and events_all.gid=NEW.gid)) >0 THEN
UPDATE events_all SET inside = 't' where inside is null ;
UPDATE events_all SET build_no = buildings.bno from buildings where inside = 't' and (ST_Contains(buildings.geom, events_all.geom)= 't');
ELSE
UPDATE events_all SET inside = 'f' where inside is null;
end if;
return NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION inside()
  OWNER TO postgres;



-- Trigger: insert_inside on events_all
CREATE TRIGGER insert_inside
  AFTER INSERT
  ON events_all
  FOR EACH ROW
  EXECUTE PROCEDURE inside();


