export function abrirDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("lugaresDB", 1);

        // tabela 
        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains("locais")) {
                db.createObjectStore("locais", { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Erro ao abrir IndexedDB");
    });
}

export async function adicionarLocal(latitude, longitude) {
    const db = await abrirDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("locais", "readwrite");
        const store = tx.objectStore("locais");

        const novoLocal = {
            latitude,
            longitude,
            data: new Date().toLocaleString("pt-BR")
        };

        const request = store.add(novoLocal);

        request.onsuccess = () => resolve(novoLocal);
        request.onerror = () => reject("Erro ao salvar local");
    });
}


export async function listarLocais() {
    const db = await abrirDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("locais", "readonly");
        const store = tx.objectStore("locais");

        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Erro ao listar locais");
    });
}

export async function removerLocal(id) {
    const db = await abrirDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("locais", "readwrite");
        const store = tx.objectStore("locais");

        const request = store.delete(id);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject("Erro ao remover local");
    });
}