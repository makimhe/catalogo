// Define a URL base da API. É uma constante para facilitar a manutenção.
const API_BASE = "http://localhost:3000";

// ----------------------------------------------------------------------
// CADASTRAR FILME (Método POST)
// ----------------------------------------------------------------------

  // Seleciona o formulário de cadastro pelo ID
  document.getElementById("form-cadastro")
  // Escuta quando o usuário envia o formulário
  .addEventListener("submit", async (e) => {
    e.preventDefault(); // Impede o reload padrão da página

    // Pega os valores digitados nos campos
    const titulo = document.getElementById("titulo").value;
    const diretor = document.getElementById("diretor").value;
    const ano = document.getElementById("ano").value;
    const genero = document.getElementById("genero").value;

    // Envia os dados para a API usando POST
    await fetch(`${API_BASE}/filmes`, {
      method: "POST", // Criação de novo recurso
      headers: { "Content-Type": "application/json" }, // Diz que o corpo é JSON
      body: JSON.stringify({ titulo, diretor, ano, genero }), // Transforma o objeto em texto
    });

    alert("Filme cadastrado com sucesso!"); // Feedback
    e.target.reset(); // Limpa o formulário
  });

// ----------------------------------------------------------------------
// EDITAR FILME (Método PUT)
// ----------------------------------------------------------------------
document.getElementById("form-edicao") // Seleciona o form de edição
  .addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita reload

    // Pega o ID do filme selecionado no select
    const selectFilmes = document.getElementById("filmes-select");
    const filmeId = selectFilmes.value;

    if (!filmeId) {
      alert("Por favor, selecione um filme na lista para atualizar.");
      return;
    }

    // Pega os valores dos campos de edição
    const tituloedit = document.getElementById("titulo-edit").value;
    const diretoredit = document.getElementById("diretor-edit").value;
    const anoedit = document.getElementById("ano-edit").value;
    const generoedit = document.getElementById("genero-edit").value;

    // Monta o objeto com os dados atualizados
    const dadosAtualizados = {
      titulo: tituloedit,
      diretor: diretoredit,
      ano: anoedit,
      genero: generoedit,
    };

    try {
      // Envia um PUT para atualizar o filme específico
      const res = await fetch(`${API_BASE}/filmes/${filmeId}`, {
        method: "PUT", // Atualização
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAtualizados),
      });

      if (res.ok) {
        alert(`Filme "${tituloedit}" editado com sucesso!`);
        e.target.reset(); // Limpa os campos
        carregarFilme(); // Atualiza a lista
      } else {
        alert("Erro ao atualizar o filme. Verifique o console.");
      }
    } catch (error) {
      console.error("Erro na requisição PUT:", error);
      alert("Erro de comunicação com a API.");
    }
  });

// ----------------------------------------------------------------------
// CARREGAR FILMES (Método GET)
// ----------------------------------------------------------------------
async function carregarFilme() {
  try {
    // Busca os filmes na API
    const res = await fetch(`${API_BASE}/filmes`);
    const filmes = await res.json(); // Converte para objeto JS

    const select = document.getElementById("filmes-select");
    select.innerHTML = `<option value=""> Selecione um filme </option>`; // Limpa o select com uma opção padrão

    // Adiciona cada filme como <option>
    filmes.forEach((filme) => {
      const option = document.createElement("option"); // Cria opção
      option.value = filme.id; // ID do filme
      option.textContent = `${filme.titulo} (${filme.diretor}) (${filme.genero}) (${filme.ano})`; // Texto exibido
      select.appendChild(option); // Coloca no select
    });
  } catch (error) {
    console.error("Erro ao carregar os filmes", error);
  }
}

carregarFilme(); // Carrega os filmes assim que a página inicia

// ----------------------------------------------------------------------
// DELETAR FILME (Método DELETE)
// ----------------------------------------------------------------------
document
  .getElementById("btn-deletar") // Botão de deletar
  .addEventListener("click", async () => {
    const select = document.getElementById("filmes-select");
    const filmeId = select.value; // ID selecionado

    if (!filmeId) {
      alert("Por favor, selecione um filme para deletar.");
      return;
    }

    // Confirmação antes de excluir
    const confirmar = confirm("Tem certeza que deseja deletar o filme selecionado?");

    if (confirmar) {
      try {
        // Requisição DELETE para remover o filme
        const res = await fetch(`${API_BASE}/filmes/${filmeId}`, {
          method: "DELETE", // Exclusão
        });

        if (res.ok) {
          alert("Filme deletado com sucesso!");
          carregarFilme(); // Atualiza lista
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