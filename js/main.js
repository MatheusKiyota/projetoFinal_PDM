
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });
            console.log('Service worker registrada! 😎', reg);
        } catch (err) {
            console.log('😥 Service worker registro falhou: ', err);
        }
    });
}

import { adicionarLocal, listarLocais, removerLocal } from "./db.js";


const capturarLocalizacao = document.getElementById('localizacao');
const latitude = document.getElementById('latitude');
const longitude = document.getElementById('longitude');
const btnIr = document.getElementById('irLocalizacao');
const latInput = document.getElementById('latInput');
const longInput = document.getElementById('longInput');
const listaLocais = document.getElementById('listaLocais');


function sucesso(posicao) {
    const lat = posicao.coords.latitude;
    const long = posicao.coords.longitude;

    latitude.textContent = lat;
    longitude.textContent = long;

    const iframe = document.getElementById('gmap_canvas');
    iframe.src = `https://maps.google.com/maps?q=${lat},${long}&z=18&output=embed`;

    // salvar no banco
    adicionarLocal(lat, long).then(() => carregarLocais());
}

function erro() {
    alert("Erro ao capturar localização! Permita o GPS.");
}


capturarLocalizacao.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(sucesso, erro);
});


btnIr.addEventListener("click", () => {
    const lat = parseFloat(latInput.value);
    const long = parseFloat(longInput.value);

    if (isNaN(lat) || isNaN(long)) {
        alert("Digite valores válidos!");
        return;
    }

    const iframe = document.getElementById('gmap_canvas');
    iframe.src = `https://maps.google.com/maps?q=${lat},${long}&z=18&output=embed`;

    latitude.textContent = lat;
    longitude.textContent = long;
});



async function carregarLocais() {
    const locais = await listarLocais();
    listaLocais.innerHTML = "";

    locais.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${item.latitude}, ${item.longitude}</strong><br>
            <button onclick="mostrarNoMapa(${item.latitude}, ${item.longitude})">Ver</button>
            <button onclick="apagar(${item.id})">Excluir</button>
        `;
        listaLocais.appendChild(li);
    });
}


window.mostrarNoMapa = (lat, long) => {
    document.getElementById("gmap_canvas").src =
        `https://maps.google.com/maps?q=${lat},${long}&z=18&output=embed`;
};

window.apagar = (id) => {
    removerLocal(id).then(() => carregarLocais());
};

carregarLocais();
