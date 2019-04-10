--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2
-- Dumped by pg_dump version 11.1

-- Started on 2019-04-10 12:57:42 MDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 7 (class 2615 OID 16385)
-- Name: html; Type: SCHEMA; Schema: -; Owner: htmlAdmin
--

CREATE SCHEMA html;

DROP SCHEMA public;

ALTER SCHEMA html OWNER TO "htmlAdmin";

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 196 (class 1259 OID 24577)
-- Name: job_results; Type: TABLE; Schema: html; Owner: htmlAdmin
--

CREATE TABLE html.job_results (
    job_return character varying(10485760),
    job_id bigint
);


ALTER TABLE html.job_results OWNER TO "htmlAdmin";

--
-- TOC entry 197 (class 1259 OID 24676)
-- Name: jobs; Type: TABLE; Schema: html; Owner: htmlAdmin
--

CREATE TABLE html.jobs (
    id bigint NOT NULL,
    site character varying(10485760),
    status character varying
);


ALTER TABLE html.jobs OWNER TO "htmlAdmin";

--
-- TOC entry 2768 (class 2606 OID 24683)
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: html; Owner: htmlAdmin
--

ALTER TABLE ONLY html.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- TOC entry 2766 (class 1259 OID 32774)
-- Name: fki_job_id_to_jobs_id; Type: INDEX; Schema: html; Owner: htmlAdmin
--

CREATE INDEX fki_job_id_to_jobs_id ON html.job_results USING btree (job_id);


--
-- TOC entry 2769 (class 2606 OID 32801)
-- Name: job_results job_id_to_jobs_id; Type: FK CONSTRAINT; Schema: html; Owner: htmlAdmin
--

ALTER TABLE ONLY html.job_results
    ADD CONSTRAINT job_id_to_jobs_id FOREIGN KEY (job_id) REFERENCES html.jobs(id);


-- Completed on 2019-04-10 12:57:46 MDT

--
-- PostgreSQL database dump complete
--

