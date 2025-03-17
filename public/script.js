import { response } from "express";

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

  fetch("localhost:5500/sintomas", options)
    .then(console.log(response))
  }

);
