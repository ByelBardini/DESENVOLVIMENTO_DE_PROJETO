function gerarPDF() {
    const medicacao = document.getElementById('medicacao').value
    const nome = document.getElementById('nome').value

    const options ={
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Adicionando o cabeçalho correto
        },
        body: JSON.stringify({
            nome: nome,
            medicacao: medicacao
        })
      }

    fetch('http://localhost:3030/gerarpdf', options)
        .then(response => {
            if (response.ok) {
                return response.blob();
            }
            throw new Error('Erro ao gerar o PDF');
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            document.getElementById('pdfViewer').src = url
            const a = document.createElement('a');
            a.href = url;
            a.download = 'RECEITUARIO_PREENCHIDO.pdf';
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error(error));
}