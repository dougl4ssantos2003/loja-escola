
const formProduto = document.querySelector("#formProduto");
const quantidade = document.querySelector("#quantidade");
const feedback = document.querySelector("#produtoFeedback");

const params = new URLSearchParams(window.location.search);
const idProduto = Number(params.get("id"));

let produtoAtual = null;

async function carregarProduto() {
  try {
    const resposta = await fetch("data/produtos.json");

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar o catálogo.");
    }

    const produtos = await resposta.json();

    produtoAtual = produtos.find((produto) => produto.id === idProduto);

    if (!produtoAtual) {
      document.querySelector("#conteudo").innerHTML = `
        <h1>Produto não encontrado</h1>
        <p>Não encontramos esse produto em nossa loja mágica.</p>
        <a class="btn btn-dark" href="index.html">Voltar à vitrine</a>
      `;
      return;
    }

    document.title = `${produtoAtual.nome} | Gemialidades Weasley`;

    document.querySelector(".breadcrumb-item.active").textContent =
      produtoAtual.nome;

    const imagemProduto = document.querySelector(
      ".product-detail-illustration"
    );

    imagemProduto.innerHTML = `<img src="${produtoAtual.imagem}" alt="${produtoAtual.nome}">`;

    document.querySelector(".product-detail-illustration").setAttribute(
      "aria-label",
      `Ilustração de ${produtoAtual.nome}`
    );

    document.querySelector(".eyebrow").textContent = produtoAtual.categoria;
    document.querySelector("h1").textContent = produtoAtual.nome;
    document.querySelector(".lead").textContent = produtoAtual.descricao;

    document.querySelector(".price-large").textContent =
      produtoAtual.preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });

    document.querySelector("#detalhesProduto").textContent =
      produtoAtual.descricao;

    document.querySelector("#regraCriativaProduto").textContent =
      produtoAtual.fraseRegra || produtoAtual.regraCriativa;

  } catch (erro) {
    console.error("Erro ao carregar produto:", erro);
    feedback.textContent =
      "Não foi possível carregar o produto. Tente atualizar a página.";
  }
}

formProduto?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!produtoAtual) {
    feedback.textContent = "Aguarde o carregamento do produto.";
    return;
  }

  const quantidadeEscolhida = Number(quantidade.value);

  if (
    !Number.isInteger(quantidadeEscolhida) ||
    quantidadeEscolhida < 1 ||
    quantidadeEscolhida > 10
  ) {
    feedback.textContent = "Escolha uma quantidade inteira entre 1 e 10.";
    quantidade.focus();
    return;
  }

  sessionStorage.setItem("produtoId", String(produtoAtual.id));
  sessionStorage.setItem("quantidade", String(quantidadeEscolhida));

  window.location.href = "checkout.html";
});

carregarProduto();
