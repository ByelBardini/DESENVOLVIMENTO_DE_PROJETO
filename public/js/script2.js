window.envia = (event) => {
  diagnostico = document.getElementById("diagnostico").value;

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
        div.textContent = IIRFilterNode.diagnostico;

        //Ao clicar, adiciona o texto no campo de texto
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
