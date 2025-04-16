let prescricaoselecionada = "";

window.addEventListener("DOMContentLoaded", () => {
    const data = JSON.parse(localStorage.getItem("medicacoes"));
    const container = document.getElementById("lista-medicacao");

    if (!data || !Array.isArray(data)) {
        console.warn("Nenhum dado encontrado ou formato inválido.");
        return;
    }

    data.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("sugestao");

        div.innerHTML = `<strong>${item.medicacao}</strong><br><small>${item.prescricao}</small>`;

        div.addEventListener("click", () => {
            document.getElementById("medicacao").value = item.medicacao;
            prescricaoselecionada = item.prescricao; // corrigido aqui
        });

        container.appendChild(div);
    });

    if (data.length > 0) {
        document.getElementById("medicacao").value = data[0].medicacao;
    }
});

function gerarPDF() {
    const nome = document.getElementById('nome').value;
    const medicacao = document.getElementById('medicacao').value;

    if (!prescricaoselecionada) {
        alert("Selecione uma prescrição antes de gerar o PDF.");
        return;
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome: nome,
            medicacao: medicacao,
            prescricao: prescricaoselecionada
        })
    };

    console.log({
        nome: nome,
        medicacao: medicacao,
        prescricao: prescricaoselecionada
    });

    fetch('http://localhost:3030/gerarpdf', options)
        .then(response => {
            if (response.ok) return response.blob();
            throw new Error('Erro ao gerar o PDF');
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            document.getElementById('pdfViewer').src = url;

            const a = document.createElement('a');
            a.href = url;
            a.download = 'RECEITUARIO_PREENCHIDO.pdf';
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error(error));
}