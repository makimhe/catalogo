// --- ÁREA DE IMPORTAÇÃO (Pegando as ferramentas) ---
import dotenv from 'dotenv';   // Ferramenta para ler o arquivo .env (onde escondemos as senhas)
import express from 'express'; // O framework que facilita criar o servidor (nosso "esqueleto")
import http from 'http';       // Ferramenta do próprio Node para criar conexões web
import cors from 'cors';       //  Dá permissão ao navegador para acessar esta API

// Importa a nossa conexão pronta com o banco de dados
// O './' significa que o arquivo está na mesma pasta que este aqui
import db from './db.js'; 

// Lê o arquivo .env agora para carregar as configurações
dotenv.config();

// Cria o nosso aplicativo/servidor
const app = express();

// --- CONFIGURAÇÕES ---
// Permite que o frontend acesse esta API sem ser bloqueado pelo navegador
app.use(cors()); 

// Essa linha ensina o servidor a ler JSON. 
// Sem isso, se alguém enviar dados de um filme novo, o servidor não entende nada.
app.use(express.json());
// Isso permite que o navegador acesse index.html, script.js, etc.
app.use(express.static('.'));


// --- ROTAS (Os caminhos do nosso site) ---

// 1. Rota Inicial (A porta de entrada)
// Quando alguém entra em "localhost:3000/"
app.get('/', (req, res) => {
    // res.send = Manda um texto simples de volta pro navegador
    res.send('servidor rodando bb'); 
});

// 2. Rota de Filmes (Onde listamos tudo)
// Quando alguém entra em "localhost:3000/filmes"
app.get('/filmes', (req, res) => {
    // Escrevemos o comando SQL numa variável (o pedido pro banco)
    const sql = 'SELECT * FROM filmes';
    
    // Mandamos a conexão (db) executar esse pedido
    db.query(sql, (err, results) => {
        
        // CENÁRIO DE ERRO: O banco falhou? (Senha errada, tabela sumiu, etc)
        if (err) {
            console.error('Deu ruim no banco:', err); // Avisa a gente no terminal
            // Avisa o usuário que deu erro 500 (Erro interno)
            return res.status(500).json({ error: 'Erro ao buscar filmes' });
        }
        
        // CENÁRIO DE SUCESSO: O banco devolveu os dados
        // Manda a lista de filmes (results) em formato JSON pro navegador
        res.json(results);
    });
});

// Rota para adicionar um novo filme (POST)
// Caminho: /filmes
app.post('/filmes', (req, res) => {
    // 1. Pega os dados que o usuário enviou no JSON (título, diretor, etc)
    const { titulo, diretor, ano, genero } = req.body;

    // 2. Cria a ordem pro banco: INSERIR UM NOVO FILME
    // O '?' garante que a inserção é segura (contra hackers)
    const sql = 'INSERT INTO filmes (titulo, diretor, ano, genero) VALUES (?, ?, ?, ?)';
    
    // 3. Manda o banco executar, passando a lista de valores
    db.query(sql, [titulo, diretor, ano, genero], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar filme:', err);
            // Avisa o cliente que deu erro interno (500)
            return res.status(500).json({ error: 'Erro ao adicionar filme no banco.' });
        }
        
        // Deu certo! Avisa o cliente (Status 201 = Criado)
        res.status(201).json({ 
            message: 'Filme adicionado com sucesso!',
            // Retorna o ID que o banco acabou de criar
            id: result.insertId 
        });
    });
});

// Rota para editar/atualizar um filme existente (PUT /filmes/:id)
app.put('/filmes/:id', (req, res) => {
    // Pega o ID do filme diretamente da URL (ex: 1 na URL /filmes/1)
    const filmeId = req.params.id;
    // Pega os dados JSON que o cliente enviou para atualizar
    const { titulo, diretor, ano, genero } = req.body;

    // Comando SQL de atualização. Atualiza o filme ONDE o ID é o que veio na URL
    const sql = 'UPDATE filmes SET titulo = ?, diretor = ?, ano = ?, genero = ? WHERE id = ?';
    
    // Passamos todos os dados, incluindo o ID por último, para o WHERE
    db.query(sql, [titulo, diretor, ano, genero, filmeId], (err, result) => {
        if (err) {
            console.error('Erro ao editar filme:', err);
            return res.status(500).json({ error: 'Erro ao editar filme.' });
        }
        
        // Verifica se alguma linha foi realmente alterada
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Filme não encontrado.' });
        }
        
        // Sucesso! Avisa o cliente
        res.status(200).json({ 
            message: 'Filme atualizado com sucesso!',
            id: filmeId 
        });
    });
});

// Rota para deletar um filme (DELETE /filmes/:id)
// Usamos o ID que vem na URL para saber quem deletar
app.delete('/filmes/:id', (req, res) => {
    // Pega o ID da URL (ex: 1 na URL /filmes/1)
    const filmeId = req.params.id;

    // Comando SQL: DELETE FROM na tabela, ONDE a ID é a que pegamos
    const sql = 'DELETE FROM filmes WHERE id = ?';
    
    // Executa a query, passando o ID para o lugar do '?'
    db.query(sql, [filmeId], (err, result) => {
        if (err) {
            console.error('Erro ao deletar filme:', err);
            return res.status(500).json({ error: 'Erro ao deletar filme.' });
        }
        
        // Verifica se alguma linha foi realmente deletada
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Filme não encontrado para exclusão.' });
        }
        
        // Sucesso! O filme foi removido
        res.status(200).json({ 
            message: 'Filme deletado com sucesso!',
            id: filmeId 
        });
    });
});

// --- LIGANDO O SERVIDOR ---

// Cria o servidor web
const server = http.createServer(app);

// Escolhe a porta: Ou pega do arquivo .env OU usa a 3000 se não achar nada
const PORT = process.env.PORTA || 3000; 

// Coloca o servidor "no ar" ouvindo nessa porta
server.listen(PORT, () => {
   console.log("ta rodando bb: http://localhost:" + PORT);
});