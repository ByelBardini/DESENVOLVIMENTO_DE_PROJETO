const medicamentosSelecionados = [];
const prescricoesSelecionadas = [];

window.addEventListener("DOMContentLoaded", () => {
    const data = JSON.parse(localStorage.getItem("medicacoes"));
    const container = document.getElementById("lista-medicacao");
    console.log("DADOS:", data)

    if (!data || !Array.isArray(data)) {
        console.warn("Nenhum dado encontrado ou formato inválido.");
        return;
    }

    data.forEach((item) => {
        const div = document.createElement("div")
        div.classList.add("sugestao")

        div.innerHTML = `<strong>${item.medicacao}</strong><br><small>${item.prescricao}</small>`

        div.addEventListener("click", () => {
            if (item.medicacao && item.prescricao) {
                medicamentosSelecionados.push(item.medicacao)
                prescricoesSelecionadas.push(item.prescricao)
                atualizarLista()
            } else {
                console.warn("Item com dados inválidos:", item)
            }
        })
        console.log("Medicamento:", item.medicacao, "| Prescrição:", item.prescricao)
        

        container.appendChild(div);
    })

})

function atualizarLista() {
    const ul = document.getElementById("medicacoesSelecionadas")
    ul.innerHTML = ""

    medicamentosSelecionados.forEach((med, index) => {
        const li = document.createElement("li")
        li.textContent = `${med}`

        const btn = document.createElement("button")
        btn.textContent = "Remover"
        btn.style.marginLeft = "10px"
        btn.onclick = () => {
            medicamentosSelecionados.splice(index, 1)
            prescricoesSelecionadas.splice(index, 1)
            atualizarLista()
        }

        li.appendChild(btn)
        ul.appendChild(li)
    })
}

function gerarPDF() {
    const nome = document.getElementById('nome').value;

    const medicacaoCompleta = medicamentosSelecionados.map((med, index) => {
        const presc = prescricoesSelecionadas[index];
        if (typeof presc === "string" && presc.trim() !== "" && med) {
            return `${med}\n${presc}`;
        } else {
            return null;
        }
    }).filter(item => item !== null).join("\n\n");

    if (!medicacaoCompleta) {
        alert("Selecione ao menos uma medicação e prescrição antes de gerar o PDF.");
        return;
    }

    fetch('http://localhost:3030/gerarpdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome: nome,
            medicacao: medicacaoCompleta,
            prescricao: "",
        })
    })
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
    localStorage.clear()
    window.location.href = './../html/index.html'
})