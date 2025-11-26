create database filmescatalogo;

use filmescatalogo;

create table filmes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    diretor VARCHAR(255),
    ano INT,
    genero VARCHAR(100)
);

insert into filmes (titulo, diretor, ano, genero) values
('A Substancia', 'Coralie Fargeat', 2024, 'terror/ficção'),
('Demon Slayer: Kimetsu no Yaiba – Castelo Infinito', 'Haruo Sotozaki', 2025, 'anime/ação'),
('Minha Mãe É uma Peça 3', 'Susana Garcia', 2019, 'comedia');

