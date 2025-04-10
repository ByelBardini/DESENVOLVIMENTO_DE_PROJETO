document.getElementById("formDiagnostico").addEventListener("submit", function(event) {
    event.preventDefault();
  
    //Adiciona dados no FormData e manda no console(por enquanto para testes)
    const formData = new FormData(formDiagnostico);
  
    for(item of formData){
      console.log(item[0], item[1])
    }
  
    const options ={
      method: 'POST',
      body: formData
    }
    //Envia pro Back
    fetch("http://localhost:5500/diagnostico", options)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });