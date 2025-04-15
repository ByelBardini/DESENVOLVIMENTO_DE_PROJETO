window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("sugestoes-diagnostico");
  const data = JSON.parse(localStorage.getItem("diagnostico"));

  if (!data) return; // Se não houver dados, não faz nada

  const lista = Array.isArray(data) ? data : [data];

  lista.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("sugestao");
    div.innerHTML = `<strong>${item.diagnostico}</strong><br><small>${item.descricao}</small>`;

    div.addEventListener("click", () => {
      document.getElementById("diagnostico").value = item.diagnostico;
      container.innerHTML = ""; // Limpa o conteúdo após selecionar
    });
    container.appendChild(div);
  });
});

window.envia = (event) => {
  event.preventDefault(); // Previne o recarregamento da página

  const diagnostico = document.getElementById("diagnostico").value;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Adicionando o cabeçalho correto
    },
    body: JSON.stringify({ diagnostico }),
  };
  //Envia pro Back
  fetch("http://localhost:3030/diagnostico", options)
    .then((response) => response.json())
    .then((data) => {
    
      const container = document.getElementById("sugestoes-diagnostico");
      container.innerHTML = ""; // Limpa o conteúdo anterior

      const lista = Array.isArray(data) ? data : [data];

      lista.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add = "sugestao";

        //Ao clicar, adiciona o texto no campo de texto
        div.innerHTML = `<strong>${item.diagnostico}</strong><br><small>${item.descrição}</small>`;

        div.addEventListener("click", () => {
          document.getElementById("diagnostico").value = item.diagnostico;
          container.innerHTML = ""; // Limpa o conteúdo após selecionar

        });
        container.appendChild(div);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
