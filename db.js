// --- IMPORTANDO A FERRAMENTA ---
// Traz a biblioteca 'mysql2' para dentro do projeto.
// É ela que sabe "falar a língua" do banco de dados.
import mysql from 'mysql2'; 

// --- CRIANDO O CRACHÁ DE ACESSO ---
// Aqui configuramos quem vai entrar e onde.
// É como preencher o login antes de clicar em "Entrar".
const connection = mysql.createConnection({
    host: 'localhost',          // Onde está o banco? (No meu próprio computador)
    user: 'root',               // Quem é o usuário? (O admin padrão)
    password: '12345678Rafs#',  // A senha secreta (que definimos na instalação)
    database: 'filmescatalogo'  // Qual gaveta (banco) vamos abrir?
});

// --- BATENDO NA PORTA ---
// Agora sim, tentamos efetivamente conectar com as configurações acima.
connection.connect((err) => {
    
    // CENÁRIO DE ERRO:
    // Se o banco estiver desligado ou a senha errada, o 'err' vai existir.
    if (err) {
        console.error('Deu ruim! Não consegui conectar:', err);
        return; // Para o código aqui. Não adianta continuar sem banco.
    }
    
    // CENÁRIO DE SUCESSO:
    // Se passou pelo if acima, significa que entramos!
    console.log('Sucesso! Conectado ao banco de dados.');
});

// --- EXPORTANDO ---
// "Empresta" essa conexão pronta (e testada) para outros arquivos usarem.
// Assim, o 'server.js' não precisa saber a senha, ele só usa essa conexão.
export default connection;