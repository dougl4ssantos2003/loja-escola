
const mensagemCliente = document.querySelector("#mensagemCliente");
const numeroPedido = document.querySelector("#numeroPedido");

const nome = sessionStorage.getItem("clienteNome");
const pedido = sessionStorage.getItem("pedidoNumero");
const total = sessionStorage.getItem("pedidoTotal");
const produtoId = sessionStorage.getItem("produtoId");

if (!nome || !pedido || !total || !produtoId) {
  window.location.replace("index.html");
} else {
  mensagemCliente.textContent =
    `${nome}, sua compra simulada foi concluída com sucesso!`;

  numeroPedido.textContent = pedido;

  const resumo = document.createElement("p");
  resumo.className = "lead mt-3";
  resumo.textContent = `Total da compra: ${Number(total).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  )}`;

  numeroPedido.closest(".order-data").after(resumo);
}
