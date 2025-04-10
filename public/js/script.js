window.envia = (event) => {
    console.log("teste")
  
    //Adiciona dados num formFata e manda no console(por enquanto para testes)
    const sintomas = document.getElementById('sintomas')
    const input = document.getElementById('documento')
    const documento = input.files[0]
  
    const formData = new FormData()
    formData.append('sintomas',sintomas)
    formData.append('documento', documento)
  
    const options ={
      method: 'POST',
      body: formData
    }
    //Envia pro Back
    fetch("http://localhost:3030/sintomas", options)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };