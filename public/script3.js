function gerarPDF() {
    fetch('http://localhost:5500/gerarpdf')
        .then(response => {
            if (response.ok) {
                return response.blob();
            }
            throw new Error('Erro ao gerar o PDF');
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'RECEITUARIO_PREENCHIDO.pdf';
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error(error));
}