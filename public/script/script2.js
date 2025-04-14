window.envia = (event) => {
  
    diagnostico = document.getElementById('diagnostico').value
  
    const options ={
      method: 'POST',
      headers: {
          'Content-Type': 'application/json', // Adicionando o cabeçalho correto
      },
      body: JSON.stringify({diagnostico})
    }
    //Envia pro Back
    fetch("http://localhost:3030/diagnostico", options)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }