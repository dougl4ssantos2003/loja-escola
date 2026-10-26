
const listaProdutos = document.querySelector("#listaProdutos");
const inputFiltro = document.querySelector("#filtroProduto");
const mensagemFiltro = document.querySelector("#mensagemFiltro");

let produtos = [];

async function carregarProdutos() {
  try {
    const resposta = await fetch("data/produtos.json");

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar os produtos.");
    }

    produtos = await resposta.json();

    mostrarProdutos(produtos);
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);

    listaProdutos.innerHTML = `
      <p class="text-danger">
        Não foi possível carregar os produtos. Atualize a página e tente novamente.
      </p>
    `;
  }
}

function mostrarProdutos(lista) {
  listaProdutos.innerHTML = "";

  lista.forEach((produto) => {
    const card = document.createElement("article");

    card.className = "col-sm-6 col-lg-4 product-item";

    card.innerHTML = `
      <div class="card h-100 product-card">
        <div class="product-illustration" aria-hidden="true">
          ${produto.emoji}
        </div>

        <div class="card-body">
          <p class="small text-secondary mb-1">
            ${produto.categoria}
          </p>

          <h3 class="h5 card-title">${produto.nome}</h3>

          <p class="card-text">${produto.descricao}</p>

          <p class="small">${produto.regraCriativa}</p>

          <p class="price">
            ${produto.preco.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
            })}
          </p>

          <a
            class="btn"
            href="produto.html?id=${produto.id}"
          >
            Ver detalhes
          </a>
        </div>
      </div>
    `;

    listaProdutos.appendChild(card);
  });

  if (inputFiltro.value.trim()) {
    mensagemFiltro.textContent =
      `${lista.length} produto(s) encontrado(s).`;
  } else {
    mensagemFiltro.textContent = "";
  }
}

function filtrarProdutos() {
  const termo = inputFiltro.value.trim().toLowerCase();

  const produtosFiltrados = produtos.filter((produto) => {
    return (
      produto.nome.toLowerCase().includes(termo) ||
      produto.categoria.toLowerCase().includes(termo) ||
      produto.regraCriativa.toLowerCase().includes(termo)
    );
  });

  mostrarProdutos(produtosFiltrados);

  if (termo && produtosFiltrados.length === 0) {
    mensagemFiltro.textContent = "Nenhum produto encontrado.";
  }
}

inputFiltro.addEventListener("input", filtrarProdutos);

carregarProdutos();
