document.getElementById("formSintomas").addEventListener("submit", function(event) {
  event.preventDefault();

  //Adiciona dados no FormData e manda no console(por enquanto para testes)
  const formData = new FormData(formSintomas);

  for(item of formData){
    console.log(item[0], item[1])
  }

  const options ={
    method: 'POST',
    body: formData
  }
  //Envia pro Back
  fetch("http://localhost:5500/sintomas", options)
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});