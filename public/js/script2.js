window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("sugestoes-diagnostico");
  const data = JSON.parse(localStorage.getItem("diagnostico"));

  if (!data) return;

  const lista = Array.isArray(data) ? data : [data];

  lista.forEach((item) => {
    console.log("Diagnóstico: " + item);
    const div = document.createElement("div");
    div.classList.add("sugestao");
    div.innerHTML = `<strong>${item.diagnostico}</strong><br><small>${item.descricao || item["descrição"]}</small>`;

    div.addEventListener("click", () => {
      document.getElementById("diagnostico").value = item.diagnostico;
      container.innerHTML = ""; // limpa sugestões
    });

    container.appendChild(div);
  });
});

window.envia = () => {
  const diagnostico = document.getElementById("diagnostico").value;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ diagnostico }),
  };

  fetch("http://localhost:3030/diagnostico", options)
    .then((response) => response.json())
    .then((data) => {
      // Armazena medicações recebidas
      localStorage.setItem("medicacoes", JSON.stringify(data));
      // Vai para index3
      window.location.href = 'C:/Users/Victor - TI/Documents/Victor/projetos-faculdade/DESELVOLVIMENTO_DE_PROJETO/public/html/index3.html'
    })
    .catch((error) => {
      console.error("Erro ao enviar diagnóstico:", error);
    });
};
