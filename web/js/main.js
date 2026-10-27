
const listaProdutos = document.querySelector("#listaProdutos");
const inputFiltro = document.querySelector("#filtroProduto");
const mensagemFiltro = document.querySelector("#mensagemFiltro");

const filtroCategoria = document.querySelector("#filtroCategoria");
const filtroRegra = document.querySelector("#filtroRegra");
const ordenacaoProdutos = document.querySelector("#ordenacaoProdutos");

let produtos = [];

async function carregarProdutos() {
  try {
    const resposta = await fetch("data/produtos.json");

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar os produtos.");
    }

    produtos = await resposta.json();

    preencherOpcoes(filtroCategoria, "categoria");
    preencherOpcoes(filtroRegra, "regraCriativa");

    aplicarFiltros();
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);

    listaProdutos.innerHTML = `
      <p class="text-danger">
        Não foi possível carregar os produtos. Atualize a página e tente novamente.
      </p>
    `;
  }
}

function preencherOpcoes(select, propriedade) {
  const valores = [...new Set(
    produtos.map((produto) => produto[propriedade])
  )].sort((a, b) => a.localeCompare(b, "pt-BR"));

  valores.forEach((valor) => {
    const opcao = document.createElement("option");
    opcao.value = valor;
    opcao.textContent = valor;
    select.appendChild(opcao);
  });
}

function mostrarProdutos(lista) {
  listaProdutos.innerHTML = "";

  lista.forEach((produto) => {
    const card = document.createElement("article");

    card.className = "col-sm-6 col-lg-4 product-item";

    card.innerHTML = `
      <div class="card h-100 product-card">
      
        <div class="product-illustration">
          <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
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

          <a class="btn" href="produto.html?id=${produto.id}">
            Ver detalhes
          </a>
        </div>
      </div>
    `;

    listaProdutos.appendChild(card);
  });

  mensagemFiltro.textContent = lista.length === 0
    ? "Nenhum produto encontrado."
    : `${lista.length} produto(s) encontrado(s).`;
}

function aplicarFiltros() {
  const termo = inputFiltro.value.trim().toLowerCase();
  const categoria = filtroCategoria.value;
  const regra = filtroRegra.value;

  let resultado = produtos.filter((produto) => {
    const correspondePesquisa =
      produto.nome.toLowerCase().includes(termo) ||
      produto.categoria.toLowerCase().includes(termo) ||
      produto.regraCriativa.toLowerCase().includes(termo);

    const correspondeCategoria =
      !categoria || produto.categoria === categoria;

    const correspondeRegra =
      !regra || produto.regraCriativa === regra;

    return correspondePesquisa &&
      correspondeCategoria &&
      correspondeRegra;
  });

  switch (ordenacaoProdutos.value) {
    case "nome-asc":
      resultado.sort((a, b) =>
        a.nome.localeCompare(b.nome, "pt-BR")
      );
      break;

    case "nome-desc":
      resultado.sort((a, b) =>
        b.nome.localeCompare(a.nome, "pt-BR")
      );
      break;

    case "preco-asc":
      resultado.sort((a, b) => a.preco - b.preco);
      break;

    case "preco-desc":
      resultado.sort((a, b) => b.preco - a.preco);
      break;
  }

  mostrarProdutos(resultado);
}

inputFiltro.addEventListener("input", aplicarFiltros);
filtroCategoria.addEventListener("change", aplicarFiltros);
filtroRegra.addEventListener("change", aplicarFiltros);
ordenacaoProdutos.addEventListener("change", aplicarFiltros);

carregarProdutos();
