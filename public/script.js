document.getElementById("form").addEventListener("submit", function(event) {
  event.preventDefault();

  const formData = new FormData(form);

  for(item of formData){
    console.log(item[0], item[1])
  }

  const options ={
    method: 'POST',
    body: formData
  }

  fetch("http://localhost:5500/sintomas", options)
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});