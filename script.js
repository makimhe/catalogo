// Define a URL base da API. É uma constante para facilitar a manutenção.
const API_BASE = "http://localhost:3000";

// ----------------------------------------------------------------------
// CADASTRAR FILME (Método POST)
// ----------------------------------------------------------------------
document
  // Seleciona o formulário de cadastro pelo ID
  .getElementById("form-cadastro")
  // Adiciona um 'ouvinte' para o evento de 'submit' (envio do formulário)
  .addEventListener("submit", async (e) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário (recarregar a página)

    // Coleta os valores digitados nos campos do formulário
    const titulo = document.getElementById("titulo").value;
    const diretor = document.getElementById("diretor").value;
    const ano = document.getElementById("ano").value;
    const genero = document.getElementById("genero").value;

    // Inicia a requisição assíncrona para a API
    await fetch(`${API_BASE}/filmes`, {
      method: "post", // Especifica que é uma requisição POST (criação de recurso)
      headers: { "Content-Type": "application/json" }, // Informa que o corpo da requisição é JSON
      // Transforma o objeto JavaScript com os dados em uma string JSON para o corpo da requisição
      body: JSON.stringify({ titulo, diretor, ano, genero }),
    });

    alert("Filme cadastrado com sucesso!"); // Exibe uma mensagem de sucesso
    e.target.reset(); // Limpa os campos do formulário
    // carregarFilme(); // (Opcional) Chama a função para atualizar a lista após o cadastro
  });

// ----------------------------------------------------------------------
// CARREGAR FILMES (Método GET)
// ----------------------------------------------------------------------
// Define uma função assíncrona para buscar e exibir os filmes
async function carregarFilme() {
  try {
    // Faz a requisição GET para obter a lista de filmes
    const res = await fetch(`${API_BASE}/filmes`);
    // Converte a resposta (response) da API para um objeto JavaScript (JSON)
    const filmes = await res.json();

    // Seleciona o elemento <select> (dropdown) onde os filmes serão listados
    const select = document.getElementById("filmes-select");
    // Limpa o conteúdo e adiciona a primeira opção padrão
    select.innerHTML = `<option value=""> Selecione um filme </option>`;

    // Itera sobre cada filme retornado pela API
    filmes.forEach((filme) => {
      const option = document.createElement("option"); // Cria um novo elemento <option>
      option.value = filme.id; // Define o ID do filme como o valor da opção (importante para DELETE/UPDATE)
      // Define o texto visível no dropdown: Título (Ano)
      option.textContent = `${filme.titulo} (${filme.diretor}) (${filme.genero}) (${filme.ano})`;

      select.appendChild(option); // Adiciona a nova opção ao dropdown
    });
  } catch (error) {
    // Captura e exibe qualquer erro que ocorra durante a requisição GET
    console.error("Erro ao carregar os filmes", error);
  }
}
carregarFilme(); // Chama a função para carregar os filmes assim que a página é iniciada

// ----------------------------------------------------------------------
// DELETAR FILME (Método DELETE)
// ----------------------------------------------------------------------
document
  // Seleciona o botão de exclusão
  .getElementById("btn-deletar")
  // Adiciona um 'ouvinte' para o evento de 'click' no botão
  .addEventListener("click", async () => {
    // 1. Pega o ID do filme selecionado
    const select = document.getElementById("filmes-select");
    // Obtém o valor (que é a ID do filme) do item selecionado
    const filmeId = select.value;

    // 2. Verifica se um filme foi selecionado (se o valor não for a string vazia da opção padrão)
    if (!filmeId) {
      alert("Por favor, selecione um filme para deletar.");
      return; // Interrompe a execução da função
    }

    // 3. Solicita confirmação ao usuário
    const confirmar = confirm(
      "Tem certeza que deseja deletar o filme selecionado?"
    );

    if (confirmar) {
      // Se o usuário confirmar a exclusão
      try {
        // 4. Realiza a chamada DELETE para a API
        const res = await fetch(`${API_BASE}/filmes/${filmeId}`, {
          // Constrói a URL com a ID do filme para deletar o recurso específico
          method: "DELETE", // <--- Define o método HTTP para exclusão de recurso
        });

        if (res.ok) {
          // res.ok é true se o status da resposta for 200-299
          alert("Filme deletado com sucesso!");
          // 5. Recarrega a lista de filmes para atualizar o dropdown e remover o item deletado
          carregarFilme();
        } else {
          // Trata erros de resposta da API (ex: 404 Not Found, 500 Internal Server Error)
          alert("Erro ao deletar o filme. Verifique o console para detalhes.");
          console.error("Erro na resposta da API:", res.status);
        }
      } catch (error) {
        // Trata erros de rede ou de comunicação com a API
        console.error("Erro na requisição DELETE:", error);
        alert("Erro de comunicação com a API.");
      }
    }
  });

// deletar Filme
document.getElementById("btn-deletar").addEventListener("click", async () => {
  // 1. pega o ID do filme selecionado
  const select = document.getElementById("filmes-select");
  const filmeId = select.value;

  // 2. verifica se um filme foi realmente selecionado
  if (!filmeId) {
    alert("Por favor, selecione um filme para deletar.");
    return;
  }

  // 3. confirmação do usuário
  const confirmar = confirm(
    "Tem certeza que deseja deletar o filme selecionado?"
  );

  if (confirmar) {
    try {
      // 4. realiza a chamada DELETE para a API
      const res = await fetch(`${API_BASE}/filmes/${filmeId}`, {
        method: "DELETE", // <--- É aqui que definimos o método HTTP
      });

      if (res.ok) {
        alert("Filme deletado com sucesso!");
        // 5. Recarrega a lista de filmes após a exclusão
        carregarFilme();
      } else {
        alert("Erro ao deletar o filme.");
        console.error("Erro na resposta da API:", res.status);
      }
    } catch (error) {
      console.error("Erro na requisição DELETE:", error);
      alert("Erro de comunicação com a API.");
    }
  }
});
