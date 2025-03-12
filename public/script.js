document.getElementById("form").addEventListener("submit", function(event) {
  event.preventDefault();

  const pdfInput = document.getElementById("inputPdf");
  const sintomasInput = document.getElementById("inputSintomas");

  const pdf = pdfInput.files[0];
  const sintomas = sintomasInput.value;

  const formData = new FormData();
  formData.append("pdf", pdf);
  formData.append("sintomas", sintomas);

  fetch("http://localhost:5500/api/upload", {
    method: "POST",
    body: formData,
  })
  .then(response => response.json()) // Converter a resposta para JSON
  .then(data => {
    console.log("Dados enviados com sucesso: ", data);
  })
  .catch(error => {
    console.error("Erro ao enviar os dados: ", error);
  });
});
