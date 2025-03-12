document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault();

    const pdfInput = document.getElementById("inputPdf");
    const sintomasInput = document.getElementById("inputSintomas");

    const pdf = fileInput.files[0];
    const sintomas = sintomasInput.value;

    const formData = new FormData();
    formData.append("pdf", pdf);
    formData.append("sintomas", sintomas);

    fetch("http://localhost:5500/src/app.js", {
      method: "POST",
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log("Dados enviados com sucesso:", data);
      })
      .catch(error => {
        console.error("Erro ao enviar os dados:", error);
      });
  });