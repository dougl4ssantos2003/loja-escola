
const localHeader = document.querySelector("#header-container");

async function carregarHeader() {
  try {
    const resposta = await fetch("components/header.html");

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar o cabeçalho.");
    }

    const html = await resposta.text();
    localHeader.innerHTML = html;
  } catch (erro) {
    console.error("Erro ao carregar o cabeçalho:", erro);
  }
}

carregarHeader();
