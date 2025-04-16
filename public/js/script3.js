const medicamentosSelecionados = [];
const prescricoesSelecionadas = [];

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
            medicamentosSelecionados.push(item.medicacao);
            prescricoesSelecionadas.push(item.prescricao);
            atualizarLista();
        });

        container.appendChild(div);
    });

});

function atualizarLista() {
    const ul = document.getElementById("medicacoesSelecionadas");
    ul.innerHTML = "";

    medicamentosSelecionados.forEach((med, index) => {
        const li = document.createElement("li");
        li.textContent = `${med}`;

        const btn = document.createElement("button");
        btn.textContent = "Remover";
        btn.style.marginLeft = "10px";
        btn.onclick = () => {
            medicamentosSelecionados.splice(index, 1);
            prescricoesSelecionadas.splice(index, 1);
            atualizarLista();
        };

        li.appendChild(btn);
        ul.appendChild(li);
    });
}

function gerarPDF() {
    const nome = document.getElementById('nome').value;
    let medicacaoCompleta = medicamentosSelecionados.map((med, index) => {
        const presc = prescricoesSelecionadas[index];
        if (med && presc) {
            return `${med}\n${presc}`;
        } else {
            return null;
        }
    }).filter(item => item !== null).join("\n\n");
            
    if (medicamentosSelecionados.length === 0 || prescricoesSelecionadas.length === 0) {
        alert("Selecione ao menos uma medicação e prescrição antes de gerar o PDF.");
        return;
    }
    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome: nome,
            medicacao: medicacaoCompleta,
        })
    };

    console.log({
        nome: nome,
        medicacao: medicacaoCompleta,
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

document.getElementById('voltarInicio').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = './../html/index.html';
})