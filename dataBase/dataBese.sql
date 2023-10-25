-- Active: 1697426326784@@localhost@5432@cosumodata@public
CREATE TABLE tbl_camisas(
    id SERIAL NOT NULL,
    equipo character varying(100),
    talla character varying(20),
    PRIMARY KEY(id)
);

CREATE TABLE tbl_carrusel(
    id SERIAL NOT NULL,
    foto bytea,
    PRIMARY KEY(id)
);