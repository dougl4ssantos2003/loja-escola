
const form = document.querySelector("#checkoutForm");
const cepInput = document.querySelector("#cep");
const buscarCepButton = document.querySelector("#buscarCep");
const cepFeedback = document.querySelector("#cepFeedback");

let produtoAtual = null;
let quantidadeAtual = 1;

function somenteNumeros(valor) {
  return valor.replace(/\D/g, "");
}

function formatarCep(valor) {
  const numeros = somenteNumeros(valor).slice(0, 8);

  if (numeros.length <= 5) return numeros;

  return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
}

function cepValido(cep) {
  return somenteNumeros(cep).length === 8;
}

async function buscarEnderecoPorCep() {
  const cep = somenteNumeros(cepInput.value);

  if (cep.length !== 8) {
    cepInput.setCustomValidity("Digite um CEP com 8 números.");
    cepInput.reportValidity();
    return;
  }

  cepInput.setCustomValidity("");
  buscarCepButton.disabled = true;
  buscarCepButton.textContent = "Buscando...";
  cepFeedback.textContent = "Consultando CEP...";

  try {
    const resposta = await fetch(
      `https://viacep.com.br/ws/${cep}/json/`
    );

    if (!resposta.ok) {
      throw new Error("Falha na consulta do CEP.");
    }

    const endereco = await resposta.json();

    if (endereco.erro) {
      cepFeedback.textContent = "CEP não encontrado. Confira os números.";
      return;
    }

    document.querySelector("#logradouro").value = endereco.logradouro || "";
    document.querySelector("#bairro").value = endereco.bairro || "";
    document.querySelector("#cidade").value = endereco.localidade || "";
    document.querySelector("#estado").value = endereco.uf || "";

    cepFeedback.textContent = "Endereço encontrado! Confira os dados.";
  } catch (erro) {
    console.error("Erro ao consultar CEP:", erro);
    cepFeedback.textContent =
      "Não foi possível consultar o CEP. Verifique sua conexão e tente novamente.";
  } finally {
    buscarCepButton.disabled = false;
    buscarCepButton.textContent = "Buscar CEP";
  }
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

async function carregarResumo() {
  const produtoId = Number(sessionStorage.getItem("produtoId"));
  quantidadeAtual = Number(sessionStorage.getItem("quantidade")) || 1;

  try {
    const resposta = await fetch("data/produtos.json");

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar os produtos.");
    }

    const produtos = await resposta.json();

    produtoAtual = produtos.find((produto) => produto.id === produtoId);

    if (!produtoAtual) {
      document.querySelector("#resumoProduto").textContent =
        "Nenhum produto selecionado";

      document.querySelector("#resumoTotal").textContent = "—";

      form.querySelector('button[type="submit"]').disabled = true;

      cepFeedback.textContent =
        "Volte à vitrine e selecione um produto antes de continuar.";

      return;
    }

    const subtotal = produtoAtual.preco * quantidadeAtual;
    const frete = 0;
    const total = subtotal + frete;

    document.querySelector("#resumoProduto").textContent =
      produtoAtual.nome;

    document.querySelector("#precoUnitario").textContent =
      formatarMoeda(produtoAtual.preco);

    document.querySelector("#resumoQuantidade").textContent =
      quantidadeAtual;

    document.querySelector("#resumoSubtotal").textContent =
      formatarMoeda(subtotal);

    document.querySelector("#resumoFrete").textContent =
      frete === 0 ? "Grátis" : formatarMoeda(frete);

    document.querySelector("#resumoTotal").textContent =
      formatarMoeda(total);
  } catch (erro) {
    console.error("Erro ao carregar resumo:", erro);

    cepFeedback.textContent =
      "Não foi possível carregar o resumo. Atualize a página e tente novamente.";

    form.querySelector('button[type="submit"]').disabled = true;
  }
}

cepInput.addEventListener("input", () => {
  cepInput.value = formatarCep(cepInput.value);
  cepInput.setCustomValidity("");
});

buscarCepButton.addEventListener("click", buscarEnderecoPorCep);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  cepInput.setCustomValidity(
    cepValido(cepInput.value) ? "" : "CEP inválido"
  );

  if (!produtoAtual) {
    cepFeedback.textContent = "Não foi possível identificar o produto.";
    return;
  }

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    form.querySelector(":invalid")?.focus();
    return;
  }

  const nome = document.querySelector("#nome").value.trim();

  sessionStorage.setItem("clienteNome", nome);
  sessionStorage.setItem(
    "pedidoNumero",
    `PED-${Math.floor(100000 + Math.random() * 900000)}`
  );

  sessionStorage.setItem("pedidoTotal", String(
    produtoAtual.preco * quantidadeAtual
  ));

  window.location.href = "sucesso.html";
});

carregarResumo();
