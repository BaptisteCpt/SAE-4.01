--
-- PostgreSQL database dump
--

\restrict gejG9aiLAodHaKj1KZTb3Infe43yLyRxbSz1D4BDSHwQSjbi7kmYka5q05Ez3pp

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.7 (Ubuntu 17.7-3.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Bati_Parti; Type: SCHEMA; Schema: -; Owner: coupatb
--

CREATE SCHEMA "Bati_Parti";


ALTER SCHEMA "Bati_Parti" OWNER TO coupatb;

--
-- Name: add_appel(); Type: FUNCTION; Schema: Bati_Parti; Owner: coupatb
--

CREATE FUNCTION "Bati_Parti".add_appel() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	v_montanttotalreel appel.montantappel%type;
	v_appel1 appel.montantappel%type;
	v_appel2 appel.montantappel%type;
BEGIN
	/*calcul du montant total sans compter les étapes réservée */
	SELECT SUM(montanttheoriquefacture + reducsuppl) INTO v_montanttotalreel FROM etape_chantier WHERE nochantier = NEW.nochantier AND reservee = FALSE;
	
	/* récupération du montant de l'appel 1 */
	SELECT montantappel	INTO v_appel1 FROM appel WHERE nochantier = NEW.nochantier AND noappel = 1;

	/* 2e appel de fonds */
	IF NEW.noetape = 6 THEN
		IF NEW.datefin IS NULL THEN
			DELETE FROM appel WHERE nochantier = NEW.nochantier AND noappel = 2;
		ELSE
			IF NOT EXISTS (SELECT 1 FROM appel WHERE nochantier = NEW.nochantier AND noappel = 2) THEN
				INSERT INTO appel (nochantier, noappel, dateappel, montantappel) VALUES (NEW.nochantier,2,CURRENT_DATE,v_montanttotalreel * 0.50);
			END IF;
		END IF;
	END IF;

	/* 3e appel de fonds */
	IF NEW.noetape = (SELECT MAX(noetape) FROM etape_chantier WHERE nochantier = NEW.nochantier) THEN
		IF NEW.datefin IS NULL THEN
			DELETE FROM appel WHERE nochantier = NEW.nochantier AND noappel = 3;
		ELSE
			IF NOT EXISTS (	SELECT 1 FROM appel	WHERE nochantier = NEW.nochantier  AND noappel = 3) THEN
				SELECT montantappel	INTO v_appel2 FROM appel WHERE nochantier = NEW.nochantier AND noappel = 2;

				INSERT INTO appel (nochantier, noappel, dateappel, montantappel) VALUES (NEW.nochantier,3,CURRENT_DATE,(v_montanttotalreel - COALESCE(v_appel1,0) - COALESCE(v_appel2,0)));
			END IF;
		END IF;
	END IF;

	RETURN NEW;
END;
$$;


ALTER FUNCTION "Bati_Parti".add_appel() OWNER TO coupatb;

--
-- Name: appelfonds1(integer); Type: PROCEDURE; Schema: Bati_Parti; Owner: coupatb
--

CREATE PROCEDURE "Bati_Parti".appelfonds1(IN p_nochantier integer)
    LANGUAGE plpgsql
    AS $$
declare
	v_montantappel appel.montantappel%type = (select sum(montanttheoriquefacture) from etape_chantier where nochantier = p_nochantier)*0.20;
begin
	
	insert into appel(nochantier,noappel,dateappel,montantappel) values(p_nochantier, 1, NOW(),v_montantappel);
end
$$;


ALTER PROCEDURE "Bati_Parti".appelfonds1(IN p_nochantier integer) OWNER TO coupatb;

--
-- Name: checkdatefin(); Type: FUNCTION; Schema: Bati_Parti; Owner: coupatb
--

CREATE FUNCTION "Bati_Parti".checkdatefin() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	v_montanttotalreel appel.montantappel%type := (select sum(montanttheoriquefacture+reducsuppl) from etape_chantier where nochantier = new.nochantier and reservee = false);
	v_appel1 appel.montantappel%type := (select montantappel from appel where noappel = 1 and nochantier = new.nochantier);
BEGIN

	/* Verif 1 */
	if (new.datefin is null) then
		if exists (select * from etape_chantier where datefin is not null and noetape > new.noetape and nochantier = new.nochantier) then
			raise exception 'Tentative de suppression de date alors que l`étape suivante est terminée';
		end if;
	end if;

	/* Verif 2 */
	if exists (select * from etape_chantier where datefin is null and noetape < new.noetape and nochantier = new.nochantier) then
		raise exception 'Tentative d`ajout d`une date alors que l`étape précédente n`est pas terminée';
	end if;

	/* Appel de fonds 2 */
	if (new.noetape = 6 ) then
		/* Date supprimé alors */
		if(new.datefin is null) then
			delete from appel where noappel = 2 and nochantier = new.nochantier;
		else
			insert into appel(nochantier,noappel,dateappel,montantappel) values(new.nochantier, 2, NOW(),(v_montanttotalreel)*0.50);
		end if;
	end if;

	/* Appel de fonds 3 */
	if (new.noetape = (select MAX(noetape) from etape_chantier where nochantier = new.nochantier)) then
		/* Date supprimé alors */
		if(new.datefin is null) then
			delete from appel where noappel = 3 and nochantier = new.nochantier;
		else
			insert into appel(nochantier,noappel,dateappel,montantappel) values(new.nochantier, 3, NOW(),v_montanttotalreel-(v_montanttotalreel*0.50)-(v_appel1));
		end if;
	end if;

	return new;
END;
$$;


ALTER FUNCTION "Bati_Parti".checkdatefin() OWNER TO coupatb;

--
-- Name: newchantier(); Type: FUNCTION; Schema: Bati_Parti; Owner: coupatb
--

CREATE FUNCTION "Bati_Parti".newchantier() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

	insert into etape_chantier(noetape,nochantier,montanttheoriquefacture) select noetape, new.nochantier, montantfacture from construire where nomodele = new.nomodele ;

	update etape_chantier set datedebut = NOW(), datefin = NOW() where noetape = 1 and nochantier = new.nochantier; 

	return null;
END
$$;


ALTER FUNCTION "Bati_Parti".newchantier() OWNER TO coupatb;

--
-- Name: premier_appel_fond(); Type: FUNCTION; Schema: Bati_Parti; Owner: coupatb
--

CREATE FUNCTION "Bati_Parti".premier_appel_fond() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	IF (new.noappel = 1)
	THEN
		UPDATE appel set montantappel = (SELECT SUM(montanttheoriquefacture) * 0.20 FROM etape_chantier WHERE nochantier = NEW.nochantier) where nochantier = NEW.nochantier and noappel = 1;
	END IF;

	RETURN NEW;
END;
$$;


ALTER FUNCTION "Bati_Parti".premier_appel_fond() OWNER TO coupatb;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: User; Type: TABLE; Schema: Bati_Parti; Owner: coupatb
--

CREATE TABLE "Bati_Parti"."User" (
    id integer NOT NULL,
    login text NOT NULL,
    mot_de_passe text NOT NULL,
    role text NOT NULL,
    nom text NOT NULL,
    prenom text NOT NULL,
    mail character varying NOT NULL,
    resettoken character varying
);


ALTER TABLE "Bati_Parti"."User" OWNER TO coupatb;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: Bati_Parti; Owner: coupatb
--

CREATE SEQUENCE "Bati_Parti"."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "Bati_Parti"."User_id_seq" OWNER TO coupatb;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: Bati_Parti; Owner: coupatb
--

ALTER SEQUENCE "Bati_Parti"."User_id_seq" OWNED BY "Bati_Parti"."User".id;


--
-- Name: appel; Type: TABLE; Schema: Bati_Parti; Owner: coupatb
--

CREATE TABLE "Bati_Parti".appel (
    nochantier integer NOT NULL,
    noappel integer NOT NULL,
    dateappel date,
    montantappel numeric(8,2) NOT NULL,
    datereglappel date,
    CONSTRAINT appel_check CHECK ((datereglappel >= dateappel)),
    CONSTRAINT appel_montantappel_check CHECK ((montantappel > (0)::numeric)),
    CONSTRAINT appel_noappel_check CHECK (((noappel >= 1) AND (noappel <= 3)))
);


ALTER TABLE "Bati_Parti".appel OWNER TO coupatb;

--
-- Name: artisan; Type: TABLE; Schema: Bati_Parti; Owner: coupatb
--

CREATE TABLE "Bati_Parti".artisan (
    noartisan integer NOT NULL,
    nomartisan character varying NOT NULL,
    prenomartisan character varying,
    adresseartisan character varying,
    cpartisan character varying,
    villeartisan character varying,
    login character varying
);


ALTER TABLE "Bati_Parti".artisan OWNER TO coupatb;

--
-- Name: client; Type: TABLE; Schema: Bati_Parti; Owner: coupatb
--

CREATE TABLE "Bati_Parti".client (
    noclient integer NOT NULL,
    nomclient character varying NOT NULL,
    prenomclient character varying,
    adresseclient character varying NOT NULL,
    cpclient character varying NOT NULL,
    villeclient character varying NOT NULL
);


ALTER TABLE "Bati_Parti".client OWNER TO coupatb;

--
-- Name: autoincrement; Type: SEQUENCE; Schema: Bati_Parti; Owner: coupatb
--

CREATE SEQUENCE "Bati_Parti".autoincrement
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "Bati_Parti".autoincrement OWNER TO coupatb;

--
-- Name: autoincrement; Type: SEQUENCE OWNED BY; Schema: Bati_Parti; Owner: coupatb
--

ALTER SEQUENCE "Bati_Parti".autoincrement OWNED BY "Bati_Parti".client.noclient;


--
-- Name: chantier; Type: TABLE; Schema: Bati_Parti; Owner: coupatb
--

CREATE TABLE "Bati_Parti".chantier (
    nochantier integer NOT NULL,
    adressechantier character varying NOT NULL,
    cpchantier character varying NOT NULL,
    villechantier character varying NOT NULL,
    datecreation date DEFAULT CURRENT_DATE NOT NULL,
    nomoe integer NOT NULL,
    noclient integer NOT NULL,
    nomodele integer NOT NULL,
    isperso boolean NOT NULL
);


ALTER TABLE "Bati_Parti".chantier OWNER TO coupatb;

--
-- Name: construire; Type: TABLE; Schema: Bati_Parti; Owner: coupatb
--

CREATE TABLE "Bati_Parti".construire (
    nomodele integer NOT NULL,
    noetape integer NOT NULL,
    montantfacture numeric(8,2) NOT NULL,
    coutsoustraitant numeric(8,2) NOT NULL,
    nbjoursrealisation integer NOT NULL,
    CONSTRAINT construire_coutsoustraitant_check CHECK ((coutsoustraitant >= (0)::numeric)),
    CONSTRAINT construire_montantfacture_check CHECK ((montantfacture > (0)::numeric)),
    CONSTRAINT construire_nbjoursrealisation_check CHECK ((nbjoursrealisation > 0))
);


ALTER TABLE "Bati_Parti".construire OWNER TO coupatb;

--
-- Name: etape; Type: TABLE; Schema: Bati_Parti; Owner: coupatb
--

CREATE TABLE "Bati_Parti".etape (
    noetape integer NOT NULL,
    nometape character varying NOT NULL,
    reservable boolean DEFAULT false NOT NULL
);


ALTER TABLE "Bati_Parti".etape OWNER TO coupatb;

--
-- Name: etape_chantier; Type: TABLE; Schema: Bati_Parti; Owner: coupatb
--

CREATE TABLE "Bati_Parti".etape_chantier (
    nochantier integer NOT NULL,
    noetape integer NOT NULL,
    montanttheoriquefacture numeric(8,2) NOT NULL,
    reservee boolean DEFAULT false NOT NULL,
    reducsuppl numeric(8,2) DEFAULT 0 NOT NULL,
    descriptionreducsuppl character varying(250),
    datedebuttheorique date,
    datedebut date,
    datefin date,
    noartisan integer,
    CONSTRAINT etape_chantier_check CHECK ((abs(reducsuppl) <= (0.3 * montanttheoriquefacture))),
    CONSTRAINT etape_chantier_check1 CHECK ((datefin >= datedebut)),
    CONSTRAINT etape_chantier_montanttheoriquefacture_check CHECK ((montanttheoriquefacture > (0)::numeric))
);


ALTER TABLE "Bati_Parti".etape_chantier OWNER TO coupatb;

--
-- Name: etre_qualifie_pour; Type: TABLE; Schema: Bati_Parti; Owner: coupatb
--

CREATE TABLE "Bati_Parti".etre_qualifie_pour (
    noetape integer NOT NULL,
    noartisan integer NOT NULL
);


ALTER TABLE "Bati_Parti".etre_qualifie_pour OWNER TO coupatb;

--
-- Name: facture_artisan; Type: TABLE; Schema: Bati_Parti; Owner: coupatb
--

CREATE TABLE "Bati_Parti".facture_artisan (
    nofacture integer NOT NULL,
    datefacture date NOT NULL,
    montantfacture numeric(8,2) NOT NULL,
    nbjourstravail integer NOT NULL,
    datereglfacture date,
    nochantier integer NOT NULL,
    noetape integer NOT NULL,
    CONSTRAINT facture_artisan_check CHECK ((datereglfacture >= datefacture)),
    CONSTRAINT facture_artisan_montantfacture_check CHECK ((montantfacture > (0)::numeric)),
    CONSTRAINT facture_artisan_nbjourstravail_check CHECK ((nbjourstravail > 0))
);


ALTER TABLE "Bati_Parti".facture_artisan OWNER TO coupatb;

--
-- Name: maitre_oeuvre; Type: TABLE; Schema: Bati_Parti; Owner: coupatb
--

CREATE TABLE "Bati_Parti".maitre_oeuvre (
    nomoe integer NOT NULL,
    nommoe character varying NOT NULL,
    prenommoe character varying,
    login text
);


ALTER TABLE "Bati_Parti".maitre_oeuvre OWNER TO coupatb;

--
-- Name: modele; Type: TABLE; Schema: Bati_Parti; Owner: coupatb
--

CREATE TABLE "Bati_Parti".modele (
    nomodele integer NOT NULL,
    nommodele character varying NOT NULL,
    descriptionmodele character varying(250)
);


ALTER TABLE "Bati_Parti".modele OWNER TO coupatb;

--
-- Name: User id; Type: DEFAULT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti"."User" ALTER COLUMN id SET DEFAULT nextval('"Bati_Parti"."User_id_seq"'::regclass);


--
-- Name: client noclient; Type: DEFAULT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".client ALTER COLUMN noclient SET DEFAULT nextval('"Bati_Parti".autoincrement'::regclass);


--
-- Data for Name: User; Type: TABLE DATA; Schema: Bati_Parti; Owner: coupatb
--

COPY "Bati_Parti"."User" (id, login, mot_de_passe, role, nom, prenom, mail, resettoken) FROM stdin;
58	tajeri	$2b$12$uTZV2EYqdUdWSX6C6jVJ5u4dHlyHUy/EiTk9UlcBxtY8T/K.tW71O	admin	TAJER	Ilyess	pandaexe26@gmail.com	f3c9a9c85e465e88d024f595d3d1cdfcaca7eb7d9c4f98a37bc7ead0415a442c
100	moreaua	$2b$10$iISiFw3z.JqAX3zmdJb3UusL704wgNwUIuShpOoKLD2YqYR3xJ2Du	admin	MOREAU	Alice	alice.moreau@bati-parti.fr	\N
101	garciac	$2b$10$YscG.qHsBtwJyjCYLN//ruqlhytIogxJK73KOIunEuL59jiOC9VM.	commercial	GARCIA	Clara	clara.garcia@bati-parti.fr	\N
57	admin	$2b$12$bI0rclMTrBA.JldM1xzQE.n9mRDtAI6TWpUGzXBgzw/uKg1L7wb.y	admin	ADMIN	Admin	admin@gmail.com	\N
47	coupatb	$2b$12$k2N4QsNbnx4.eX/OpomHq.1BRQr0VjpMzZY9IJc0S6zSRLB3N2nFa	commercial	COUPAT	Baptiste	baptiste@gmail.com	\N
102	petitr	$2b$10$jYHW3NLxmGPUmiFjcNCL.etUmPO/u0jZwEi/tC65H7grnIRwZD8We	commercial	PETIT	Remi	remi.petit@bati-parti.fr	\N
103	vasseurh	$2b$10$EJBX83Og7WGA9vtDw40GxeLVhQureDd/u2S0dBycozWOSBuu4Zb3C	maitre Oeuvre	VASSEUR	Hugo	hugo.vasseur@bati-parti.fr	\N
104	mercierl	$2b$10$JEH7r4re1gOSDdHim2U1O.h58tAZrQgh23u8dBbzRibsQynKzltfy	artisan	MERCIER	Lucas	lucas.mercier@bati-parti.fr	\N
105	dubreuils	$2b$10$TP5oK5S0rMipfNrw6XkX7.VPrPhLPSd/k7eKZvQI1.SRyFRj6vE8q	artisan	DUBREUIL	Sarah	sarah.dubreuil@bati-parti.fr	\N
106	renoirj	$2b$10$McWyWldkAdg3/zw/Yjf4re1arggEr/B7s1TeQxCxWNNW8m1gebYre	artisan	RENOIR	Julien	julien.renoir@bati-parti.fr	\N
56	moellonp	$2b$10$xnj5ujKaF1FD0WBxjdELPezf21XTqQmeo/d0AFDnXcOw1eKcYBg0K	maitre Oeuvre	MOELLON	Pascal	pascal@gmail.com	\N
48	barriols	$2b$12$XnRBSTtApVuWGxumRFexsedtjMM8twUn2F/izxvLkg7vwscp9rq66	commercial	BARRIOL	Simon	simon@gmail.com	\N
50	jirart	$2b$12$vk7Gt/OJ9MuphWa1dEsi0.erOAGbs1zsJEfxqerKWPHo35gVr7tVm	commercial	JIRAR	Thomas	thomas@gmail.com	\N
52	blancm	$2b$12$pbFpc0EAzD5IAqTQb0YpCed8L/t7Q7704IPGJIyoJQZG0MF58U//a	maitre Oeuvre	BLANC	Marion	marion@gmail.com	\N
54	scanue	$2b$12$2lzGtfnhhwm/eB8G0VHJGOOx8Bn7pAu48ClEzjkYYzP6tQlhh.NHC	maitre Oeuvre	SCANU	Esteban	esteban@gmail.com	\N
49	ashtonb	$2b$12$yeYJTa5ERXuiQCU4c2TzleMBdUnhIjH7uDpU66/MV5fKOs/.sau5S	commercial	ASHTON	Benjamin	benjamin1@gmail.com	\N
62	champg	$2b$10$3ykyAjJktwgwdlbO9hQixeLdwusaPvlWuE6pUahdbRplZHO5UGJay	artisan	CHAMP	Gabin	gabin1@gmail.com	\N
51	leroys	$2b$12$HPsfu65vbyBLKJEaZjphieGrLg9JknilTyAMXr4DObS.oerwP0X6a	maitre Oeuvre	LEROY	Sophie	sam1@gmail.com	\N
68	durandp	$2b$12$sbqn8i.6a295wWqDhw41RemWFcv7zdK6xKRs3MMU6x7mtQ8p8XEou	artisan	DURAND	Paul	duran@gmail.com	\N
70	fontainee	$2b$12$AXAoBcAghMVVQrTJydZf3uI2hWKXC8rygn9RJlA6h0DZCb1DSCy2e	artisan	FONTAINE	Emilie	femilie@gmail.com	\N
69	dupontm	$2b$12$sSHv86.2f7ptvQwK1Qrrn.6VXad8H.Tso8TkkLA.bGFlsDvmkwYC.	artisan	DUPONT	Martin	martin@gmail.com	\N
73	roussela	$2b$12$XSlQEWW0QNG5EsaRupOCCO0bwBls4quvxj3nXyXAgu5ySSg.LkBuy	artisan	ROUSSEL	Alain	alain@gmail.com	\N
71	petitc	$2b$12$pOaqG3LIgb09k/yZpFDZRuVN8JrsF0i8KeVEbQtZmHhFzPh5pbtem	artisan	PETIT	Camille	camillepetit@gmail.com	\N
72	lemoinen	$2b$12$VvMeJAdfDq.iXIPdsyULeeCf2S4AmjXeUcOIU2uPEkSofHXqzTHhm	artisan	LEMOINE	Nicolas	nicomoine@gmail.com	\N
55	doisyn	$2b$12$ytNMchwGKgu.7u2lrbHbb.eRiji/FhW1iWVidm4Z0s4E50WHsnGtq	maitre Oeuvre	DOISY	Noa	noa.doisy@etu.univ-grenoble-alpes.fr	
\.


--
-- Data for Name: appel; Type: TABLE DATA; Schema: Bati_Parti; Owner: coupatb
--

COPY "Bati_Parti".appel (nochantier, noappel, dateappel, montantappel, datereglappel) FROM stdin;
1	1	2024-07-16	19160.00	2026-01-08
1	2	2026-01-08	42650.00	2026-01-08
1	3	2026-01-08	23490.00	2026-01-08
2	1	2026-01-08	21160.00	\N
3	2	2026-01-08	62200.00	\N
3	1	2026-01-08	25060.00	2026-01-08
4	1	2026-01-28	25060.00	\N
20	1	2026-03-01	25060.00	2026-03-10
21	1	2026-03-12	21160.00	\N
22	1	2026-03-20	25060.00	\N
20	2	2026-03-20	63250.00	\N
\.


--
-- Data for Name: artisan; Type: TABLE DATA; Schema: Bati_Parti; Owner: coupatb
--

COPY "Bati_Parti".artisan (noartisan, nomartisan, prenomartisan, adresseartisan, cpartisan, villeartisan, login) FROM stdin;
2	CHAMP	Gabin	6 rue derodon	26000	Valence	champg
1	DURAND	Paul	10 rue des Alpes	26000	Valence	durandp
4	FONTAINE	Emilie	 17 rue du Moulin	37000	Tours	fontainee
3	DUPONT	Martin	12 rue des Lilas	44000	Nantes	dupontm
5	ROUSSEL	Alain	69 Rue de l'esclavagerie	26000	valence	roussela
6	PETIT	Camille	29 rue Pasteur	21000	Dijon	petitc
7	LEMOINE	Nicolas	14 allée des Acacias	78140	 Vélizy-Villacoublay	lemoinen
10	MERCIER	Lucas	18 rue des Freres Montgolfier	26000	VALENCE	mercierl
11	DUBREUIL	Sarah	7 allee des Bleuets	69005	LYON	dubreuils
12	RENOIR	Julien	44 chemin du Lac	74000	ANNECY	renoirj
\.


--
-- Data for Name: chantier; Type: TABLE DATA; Schema: Bati_Parti; Owner: coupatb
--

COPY "Bati_Parti".chantier (nochantier, adressechantier, cpchantier, villechantier, datecreation, nomoe, noclient, nomodele, isperso) FROM stdin;
1	320 rue faventines	26000	VALENCE	2024-07-12	1	1	1	t
2	52 chemin des Vignes	13011	MARSEILLE	2026-01-08	4	2	3	t
3	 9 rue des Écoles	86000	POITIERS	2026-01-08	3	3	2	t
4	33 rue de la Gare	62200	BOULOGNE-SUR-MER	2026-01-08	5	4	2	t
5	6 rue derodon	26000	VALENCE	2026-01-09	3	4	4	t
6	19 rue Jean-Bertin	26000	VALENCE	2026-03-23	4	6	2	f
20	18 chemin du Verger	26000	VALENCE	2026-03-01	10	20	2	f
21	42 rue des Tilleuls	69005	LYON	2026-03-12	10	21	3	t
22	7 impasse des Amandiers	38100	GRENOBLE	2026-03-20	5	22	2	f
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: Bati_Parti; Owner: coupatb
--

COPY "Bati_Parti".client (noclient, nomclient, prenomclient, adresseclient, cpclient, villeclient) FROM stdin;
1	DUTOIT	Max	10 rue des alpes	26000	VALENCE
2	Marchand	Laura	52 chemin des Vignes	13011	Marseille
3	Lefèvre	Pierre	 9 rue des Écoles	86000	Poitiers
4	Caron	Manon	33 rue de la Gare	62200	Boulogne-sur-Mer
5	Renault	Alexandre	5 quai de la Loire	45000	Orléans
6	Pichon	Julie	21 rue des Artisans	49000	Angers
7	Colmar	Maxime	18 avenue de la Liberté	68000	Colmart
8	Lefèvre	Pierre	 9 rue des Écoles	86000	Poitiers
20	BERNARD	Eva	18 chemin du Verger	26000	VALENCE
21	ROBIN	Hugo	42 rue des Tilleuls	69005	LYON
22	FAURE	Ines	7 impasse des Amandiers	38100	GRENOBLE
\.


--
-- Data for Name: construire; Type: TABLE DATA; Schema: Bati_Parti; Owner: coupatb
--

COPY "Bati_Parti".construire (nomodele, noetape, montantfacture, coutsoustraitant, nbjoursrealisation) FROM stdin;
1	1	2000.00	0.00	1
1	2	3000.00	1800.00	2
1	3	15000.00	9000.00	2
1	4	29000.00	18000.00	20
1	5	5500.00	3400.00	4
1	6	2400.00	1500.00	2
1	8	5900.00	3700.00	4
1	9	11000.00	6900.00	6
1	10	8000.00	4300.00	5
1	11	9000.00	7500.00	10
1	12	5000.00	4100.00	6
2	1	2000.00	0.00	1
2	2	3000.00	1800.00	2
2	3	15000.00	9000.00	2
2	4	29000.00	18000.00	20
2	5	5500.00	3400.00	4
2	6	2400.00	1500.00	2
2	7	7500.00	4600.00	8
2	8	5900.00	3700.00	4
2	9	11000.00	6900.00	6
2	10	8000.00	4300.00	5
2	11	9000.00	7500.00	10
2	12	5000.00	4100.00	6
2	13	22000.00	14000.00	12
3	1	2000.00	0.00	1
3	2	3000.00	1800.00	2
3	3	15000.00	9000.00	2
3	4	29000.00	18000.00	20
3	5	5500.00	3400.00	4
3	6	2400.00	1500.00	2
3	7	7500.00	4600.00	8
3	8	5900.00	3700.00	4
3	9	11000.00	6900.00	6
3	10	8000.00	4300.00	5
3	11	9000.00	7500.00	10
3	12	5000.00	4100.00	6
3	14	2500.00	1500.00	2
4	1	1.00	0.00	1
4	4	1.00	0.00	20
4	7	1.00	0.00	8
4	10	1.00	0.00	5
4	11	1.00	0.00	10
4	8	1.00	0.00	4
4	5	1.00	0.00	4
4	3	1.00	0.00	2
4	6	1.00	0.00	2
4	9	1.00	0.00	6
4	12	1.00	0.00	6
\.


--
-- Data for Name: etape; Type: TABLE DATA; Schema: Bati_Parti; Owner: coupatb
--

COPY "Bati_Parti".etape (noetape, nometape, reservable) FROM stdin;
1	Dossier	f
2	Terrassement	f
3	Fondations	f
4	Gros œuvre	f
5	Charpente	f
6	Couverture	f
11	Chauffage	t
12	Revêtements	t
13	Piscine	f
10	Sanitaire	t
14	Aire de jeux	f
8	Eau	t
9	Electricité	t
7	Cloisons	f
\.


--
-- Data for Name: etape_chantier; Type: TABLE DATA; Schema: Bati_Parti; Owner: coupatb
--

COPY "Bati_Parti".etape_chantier (nochantier, noetape, montanttheoriquefacture, reservee, reducsuppl, descriptionreducsuppl, datedebuttheorique, datedebut, datefin, noartisan) FROM stdin;
2	3	15000.00	f	0.00	\N	\N	\N	\N	\N
2	4	29000.00	f	0.00	\N	\N	\N	\N	\N
2	6	2400.00	f	0.00	\N	\N	\N	\N	\N
2	7	7500.00	f	0.00	\N	\N	\N	\N	\N
2	8	5900.00	f	0.00	\N	\N	\N	\N	\N
2	11	9000.00	f	0.00	\N	\N	\N	\N	\N
2	12	5000.00	f	0.00	\N	\N	\N	\N	\N
20	1	2000.00	f	0.00	\N	\N	2026-03-26	2026-03-26	\N
3	6	2400.00	f	0.00	\N	2026-01-27	2026-01-27	2026-01-30	5
1	11	9000.00	f	0.00	\N	2024-08-09	2024-08-10	2024-08-12	1
1	9	11000.00	t	0.00		2024-07-29	2024-08-04	2024-08-06	1
3	1	2000.00	f	0.00	\N	\N	2026-01-08	2026-01-08	\N
4	2	3000.00	f	0.00	\N	\N	\N	\N	\N
4	3	15000.00	f	0.00	\N	\N	\N	\N	\N
4	4	29000.00	f	0.00	\N	\N	\N	\N	\N
4	5	5500.00	f	0.00	\N	\N	\N	\N	\N
4	6	2400.00	f	0.00	\N	\N	\N	\N	\N
4	7	7500.00	f	0.00	\N	\N	\N	\N	\N
4	8	5900.00	f	0.00	\N	\N	\N	\N	\N
4	9	11000.00	f	0.00	\N	\N	\N	\N	\N
4	10	8000.00	f	0.00	\N	\N	\N	\N	\N
4	11	9000.00	f	0.00	\N	\N	\N	\N	\N
4	12	5000.00	f	0.00	\N	\N	\N	\N	\N
4	13	22000.00	f	0.00	\N	\N	\N	\N	\N
4	1	2000.00	f	0.00	\N	\N	2026-01-08	2026-01-08	\N
1	10	8000.00	f	0.00		2024-08-01	2024-08-05	2024-08-09	7
1	8	5900.00	f	0.00		2024-07-30	2024-08-01	2024-08-03	2
1	12	5000.00	f	0.00	\N	2024-08-10	2024-08-12	2024-08-15	5
5	7	1.00	f	0.00	\N	\N	\N	\N	\N
5	10	1.00	f	0.00	\N	\N	\N	\N	\N
5	11	1.00	f	0.00	\N	\N	\N	\N	\N
5	8	1.00	f	0.00	\N	\N	\N	\N	\N
5	5	1.00	f	0.00	\N	\N	\N	\N	\N
2	2	3000.00	f	0.00	\N	2026-01-10	2026-01-11	2026-01-12	5
5	3	1.00	f	0.00	\N	\N	\N	\N	\N
2	9	11000.00	f	250.00	Plafond Led	\N	\N	\N	\N
2	1	2000.00	f	0.00	\N	2026-01-08	2026-01-08	2026-01-08	\N
1	1	2000.00	f	0.00		2024-07-11	2024-07-12	2024-07-12	\N
5	9	1.00	f	0.00	\N	\N	\N	\N	\N
5	12	1.00	f	0.00	\N	\N	\N	\N	\N
5	1	1.00	f	0.00	\N	\N	2026-01-09	2026-01-09	\N
2	14	2500.00	f	750.00	Terrain de pétanque	\N	\N	\N	\N
1	3	15000.00	f	0.00		2024-07-15	2024-07-16	2024-07-20	1
1	4	29000.00	f	0.00	\N	2024-07-21	2024-07-21	2024-07-25	1
3	2	3000.00	f	0.00	\N	2026-01-09	2026-01-09	2026-01-12	6
21	5	5500.00	f	0.00	\N	\N	\N	\N	\N
1	5	5500.00	f	500.00	renfort charpente	2024-07-21	2024-07-26	2024-07-28	1
21	6	2400.00	f	0.00	\N	\N	\N	\N	\N
3	9	11000.00	f	100.00	Evier	\N	\N	\N	4
1	6	2400.00	f	0.00	\N	2024-07-24	2024-07-28	2024-08-01	5
3	7	7500.00	f	0.00	\N	\N	\N	\N	1
3	8	5900.00	f	0.00	\N	\N	\N	\N	2
21	7	7500.00	f	0.00	\N	\N	\N	\N	\N
2	10	8000.00	f	0.00		\N	\N	\N	\N
3	11	9000.00	f	0.00	\N	\N	\N	\N	4
3	12	5000.00	f	0.00	\N	\N	\N	\N	5
3	13	22000.00	f	0.00	\N	\N	\N	\N	3
1	2	3000.00	f	0.00	\N	2024-07-13	2024-07-14	2024-07-16	1
3	10	8000.00	f	-900.00	Salle de bain	\N	\N	\N	2
6	2	3000.00	f	0.00	\N	\N	\N	\N	\N
3	3	15000.00	f	0.00		2026-01-13	2026-01-13	2026-01-15	6
6	3	15000.00	f	0.00	\N	\N	\N	\N	\N
21	9	11000.00	f	0.00	\N	\N	\N	\N	\N
6	4	29000.00	f	0.00	\N	\N	\N	\N	\N
6	5	5500.00	f	0.00	\N	\N	\N	\N	\N
6	6	2400.00	f	0.00	\N	\N	\N	\N	\N
6	7	7500.00	f	0.00	\N	\N	\N	\N	\N
3	4	29000.00	f	0.00	\N	2026-01-19	2026-01-20	2026-01-22	2
6	8	5900.00	f	0.00	\N	\N	\N	\N	\N
6	9	11000.00	f	0.00	\N	\N	\N	\N	\N
6	10	8000.00	f	0.00	\N	\N	\N	\N	\N
6	11	9000.00	f	0.00	\N	\N	\N	\N	\N
3	5	5500.00	f	0.00	\N	2026-01-22	2026-01-23	2026-01-26	1
6	12	5000.00	f	0.00	\N	\N	\N	\N	\N
21	10	8000.00	f	0.00	\N	\N	\N	\N	\N
6	13	22000.00	f	0.00	\N	\N	\N	\N	\N
6	1	2000.00	f	0.00	\N	\N	2026-03-23	2026-03-23	\N
2	5	5500.00	f	0.00	\N	\N	\N	\N	5
5	6	1.00	f	0.00	\N	\N	\N	\N	5
5	4	1.00	f	0.00	\N	\N	\N	\N	2
20	9	11000.00	f	0.00	\N	\N	\N	\N	\N
20	10	8000.00	f	0.00	\N	\N	\N	\N	\N
20	11	9000.00	f	0.00	\N	\N	\N	\N	\N
20	12	5000.00	f	0.00	\N	\N	\N	\N	\N
20	13	22000.00	f	0.00	\N	\N	\N	\N	\N
21	11	9000.00	f	0.00	\N	\N	\N	\N	\N
21	12	5000.00	f	0.00	\N	\N	\N	\N	\N
21	14	2500.00	f	0.00	\N	\N	\N	\N	\N
21	1	2000.00	f	0.00	\N	\N	2026-03-26	2026-03-26	\N
22	3	15000.00	f	0.00	\N	\N	\N	\N	\N
22	4	29000.00	f	0.00	\N	\N	\N	\N	\N
22	5	5500.00	f	0.00	\N	\N	\N	\N	\N
22	6	2400.00	f	0.00	\N	\N	\N	\N	\N
22	7	7500.00	f	0.00	\N	\N	\N	\N	\N
22	8	5900.00	f	0.00	\N	\N	\N	\N	\N
22	9	11000.00	f	0.00	\N	\N	\N	\N	\N
22	10	8000.00	f	0.00	\N	\N	\N	\N	\N
22	11	9000.00	f	0.00	\N	\N	\N	\N	\N
22	12	5000.00	f	0.00	\N	\N	\N	\N	\N
22	13	22000.00	f	0.00	\N	\N	\N	\N	\N
22	1	2000.00	f	0.00	\N	\N	2026-03-26	2026-03-26	\N
20	2	3000.00	f	0.00	\N	2026-03-02	2026-03-02	2026-03-04	10
20	3	15000.00	f	0.00	\N	2026-03-05	2026-03-05	2026-03-08	10
20	4	29000.00	f	1200.00	Garage accole	2026-03-09	2026-03-09	2026-03-15	10
20	5	5500.00	f	0.00	\N	2026-03-16	2026-03-16	2026-03-17	10
20	6	2400.00	f	0.00	\N	2026-03-18	2026-03-18	2026-03-20	10
20	7	7500.00	f	0.00	\N	2026-03-21	2026-03-21	\N	10
20	8	5900.00	f	0.00	\N	2026-03-24	\N	\N	11
21	2	3000.00	f	0.00	\N	2026-03-13	2026-03-13	2026-03-14	10
21	3	15000.00	f	0.00	\N	2026-03-17	2026-03-17	2026-03-18	10
21	4	29000.00	f	800.00	Baie vitree atelier	2026-03-21	2026-03-21	\N	10
21	8	5900.00	f	0.00	\N	2026-03-25	\N	\N	11
22	2	3000.00	f	0.00	\N	2026-03-24	\N	\N	10
\.


--
-- Data for Name: etre_qualifie_pour; Type: TABLE DATA; Schema: Bati_Parti; Owner: coupatb
--

COPY "Bati_Parti".etre_qualifie_pour (noetape, noartisan) FROM stdin;
2	10
3	10
4	10
5	10
6	10
7	10
8	11
9	11
10	11
11	11
12	11
12	12
13	12
14	12
13	2
7	2
4	2
8	2
12	2
10	2
2	1
3	1
4	1
5	1
6	1
7	1
8	1
9	1
10	1
11	1
9	4
11	4
8	4
13	3
14	3
2	5
1	5
3	5
4	5
6	5
5	5
7	5
8	5
10	5
9	5
11	5
12	5
13	5
14	5
4	6
3	6
5	6
2	6
13	7
11	7
9	7
10	7
8	7
\.


--
-- Data for Name: facture_artisan; Type: TABLE DATA; Schema: Bati_Parti; Owner: coupatb
--

COPY "Bati_Parti".facture_artisan (nofacture, datefacture, montantfacture, nbjourstravail, datereglfacture, nochantier, noetape) FROM stdin;
1	2026-02-28	4320.80	10	\N	1	2
2	2026-03-24	5900.00	2	\N	1	8
3	2026-03-24	29000.00	2	\N	3	4
20	2026-03-04	1850.00	2	2026-03-14	20	2
21	2026-03-15	18600.00	7	\N	20	4
22	2026-03-20	1600.00	2	\N	20	6
23	2026-03-14	1900.00	2	2026-03-24	21	2
24	2026-03-18	9200.00	3	\N	21	3
\.


--
-- Data for Name: maitre_oeuvre; Type: TABLE DATA; Schema: Bati_Parti; Owner: coupatb
--

COPY "Bati_Parti".maitre_oeuvre (nomoe, nommoe, prenommoe, login) FROM stdin;
2	BLANC	Michel	blancm
1	MOELLON	Pierre	moellonp
3	Scanu	Esteban	scanue
4	Doisy	Noa	doisyn
5	Leroy	Sophie	leroys
10	VASSEUR	Hugo	vasseurh
\.


--
-- Data for Name: modele; Type: TABLE DATA; Schema: Bati_Parti; Owner: coupatb
--

COPY "Bati_Parti".modele (nomodele, nommodele, descriptionmodele) FROM stdin;
1	Basique 1	Une seule pièce
2	Standard 1	\N
3	Premium 1	\N
4	Modele 4	
\.


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: Bati_Parti; Owner: coupatb
--

SELECT pg_catalog.setval('"Bati_Parti"."User_id_seq"', 106, true);


--
-- Name: autoincrement; Type: SEQUENCE SET; Schema: Bati_Parti; Owner: coupatb
--

SELECT pg_catalog.setval('"Bati_Parti".autoincrement', 22, true);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: appel appel_pkey; Type: CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".appel
    ADD CONSTRAINT appel_pkey PRIMARY KEY (nochantier, noappel);


--
-- Name: artisan artisan_pkey; Type: CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".artisan
    ADD CONSTRAINT artisan_pkey PRIMARY KEY (noartisan);


--
-- Name: chantier chantier_pkey; Type: CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".chantier
    ADD CONSTRAINT chantier_pkey PRIMARY KEY (nochantier);


--
-- Name: client client_pkey; Type: CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".client
    ADD CONSTRAINT client_pkey PRIMARY KEY (noclient);


--
-- Name: construire construire_pkey; Type: CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".construire
    ADD CONSTRAINT construire_pkey PRIMARY KEY (nomodele, noetape);


--
-- Name: etape_chantier etape_chantier_pkey; Type: CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".etape_chantier
    ADD CONSTRAINT etape_chantier_pkey PRIMARY KEY (nochantier, noetape);


--
-- Name: etape etape_pkey; Type: CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".etape
    ADD CONSTRAINT etape_pkey PRIMARY KEY (noetape);


--
-- Name: etre_qualifie_pour etre_qualifie_pour_pkey; Type: CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".etre_qualifie_pour
    ADD CONSTRAINT etre_qualifie_pour_pkey PRIMARY KEY (noetape, noartisan);


--
-- Name: facture_artisan facture_artisan_nochantier_noetape_key; Type: CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".facture_artisan
    ADD CONSTRAINT facture_artisan_nochantier_noetape_key UNIQUE (nochantier, noetape);


--
-- Name: facture_artisan facture_artisan_pkey; Type: CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".facture_artisan
    ADD CONSTRAINT facture_artisan_pkey PRIMARY KEY (nofacture);


--
-- Name: artisan login; Type: CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".artisan
    ADD CONSTRAINT login UNIQUE (login);


--
-- Name: maitre_oeuvre maitre_oeuvre_pkey; Type: CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".maitre_oeuvre
    ADD CONSTRAINT maitre_oeuvre_pkey PRIMARY KEY (nomoe);


--
-- Name: modele modele_pkey; Type: CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".modele
    ADD CONSTRAINT modele_pkey PRIMARY KEY (nomodele);


--
-- Name: User user_unique; Type: CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti"."User"
    ADD CONSTRAINT user_unique UNIQUE (mail);


--
-- Name: User_login_key; Type: INDEX; Schema: Bati_Parti; Owner: coupatb
--

CREATE UNIQUE INDEX "User_login_key" ON "Bati_Parti"."User" USING btree (login);


--
-- Name: etape_chantier add_appel_trigger; Type: TRIGGER; Schema: Bati_Parti; Owner: coupatb
--

CREATE TRIGGER add_appel_trigger AFTER UPDATE OF datefin ON "Bati_Parti".etape_chantier FOR EACH ROW EXECUTE FUNCTION "Bati_Parti".add_appel();


--
-- Name: appel add_first_appel_trigger; Type: TRIGGER; Schema: Bati_Parti; Owner: coupatb
--

CREATE TRIGGER add_first_appel_trigger AFTER INSERT ON "Bati_Parti".appel FOR EACH ROW EXECUTE FUNCTION "Bati_Parti".premier_appel_fond();


--
-- Name: chantier createchantier; Type: TRIGGER; Schema: Bati_Parti; Owner: coupatb
--

CREATE TRIGGER createchantier AFTER INSERT ON "Bati_Parti".chantier FOR EACH ROW EXECUTE FUNCTION "Bati_Parti".newchantier();


--
-- Name: etape_chantier modifetape; Type: TRIGGER; Schema: Bati_Parti; Owner: coupatb
--

CREATE TRIGGER modifetape BEFORE UPDATE OF datefin ON "Bati_Parti".etape_chantier FOR EACH ROW EXECUTE FUNCTION "Bati_Parti".checkdatefin();


--
-- Name: appel appel_nochantier_fkey; Type: FK CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".appel
    ADD CONSTRAINT appel_nochantier_fkey FOREIGN KEY (nochantier) REFERENCES "Bati_Parti".chantier(nochantier) ON DELETE CASCADE;


--
-- Name: chantier chantier_noclient_fkey; Type: FK CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".chantier
    ADD CONSTRAINT chantier_noclient_fkey FOREIGN KEY (noclient) REFERENCES "Bati_Parti".client(noclient);


--
-- Name: chantier chantier_nomodele_fkey; Type: FK CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".chantier
    ADD CONSTRAINT chantier_nomodele_fkey FOREIGN KEY (nomodele) REFERENCES "Bati_Parti".modele(nomodele);


--
-- Name: chantier chantier_nomoe_fkey; Type: FK CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".chantier
    ADD CONSTRAINT chantier_nomoe_fkey FOREIGN KEY (nomoe) REFERENCES "Bati_Parti".maitre_oeuvre(nomoe);


--
-- Name: construire construire_noetape_fkey; Type: FK CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".construire
    ADD CONSTRAINT construire_noetape_fkey FOREIGN KEY (noetape) REFERENCES "Bati_Parti".etape(noetape);


--
-- Name: construire construire_nomodele_fkey; Type: FK CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".construire
    ADD CONSTRAINT construire_nomodele_fkey FOREIGN KEY (nomodele) REFERENCES "Bati_Parti".modele(nomodele);


--
-- Name: etape_chantier etape_chantier_noartisan_fkey; Type: FK CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".etape_chantier
    ADD CONSTRAINT etape_chantier_noartisan_fkey FOREIGN KEY (noartisan) REFERENCES "Bati_Parti".artisan(noartisan);


--
-- Name: etape_chantier etape_chantier_nochantier_fkey; Type: FK CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".etape_chantier
    ADD CONSTRAINT etape_chantier_nochantier_fkey FOREIGN KEY (nochantier) REFERENCES "Bati_Parti".chantier(nochantier) ON DELETE CASCADE;


--
-- Name: etape_chantier etape_chantier_noetape_fkey; Type: FK CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".etape_chantier
    ADD CONSTRAINT etape_chantier_noetape_fkey FOREIGN KEY (noetape) REFERENCES "Bati_Parti".etape(noetape);


--
-- Name: etre_qualifie_pour etre_qualifie_pour_noartisan_fkey; Type: FK CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".etre_qualifie_pour
    ADD CONSTRAINT etre_qualifie_pour_noartisan_fkey FOREIGN KEY (noartisan) REFERENCES "Bati_Parti".artisan(noartisan);


--
-- Name: etre_qualifie_pour etre_qualifie_pour_noetape_fkey; Type: FK CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".etre_qualifie_pour
    ADD CONSTRAINT etre_qualifie_pour_noetape_fkey FOREIGN KEY (noetape) REFERENCES "Bati_Parti".etape(noetape);


--
-- Name: facture_artisan facture_artisan_nochantier_noetape_fkey; Type: FK CONSTRAINT; Schema: Bati_Parti; Owner: coupatb
--

ALTER TABLE ONLY "Bati_Parti".facture_artisan
    ADD CONSTRAINT facture_artisan_nochantier_noetape_fkey FOREIGN KEY (nochantier, noetape) REFERENCES "Bati_Parti".etape_chantier(nochantier, noetape) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict gejG9aiLAodHaKj1KZTb3Infe43yLyRxbSz1D4BDSHwQSjbi7kmYka5q05Ez3pp

