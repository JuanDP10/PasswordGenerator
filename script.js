// Referencias a elementos del DOM
const generatedPassword = document.getElementById("generated-password");
const copyBtn = document.getElementById("copy-btn");
const generateBtn = document.getElementById("generate-btn");
const passwordLength = document.getElementById("password-length");
const sliderValue = document.getElementById("slider-value");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");

const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");

// Caracteres para generación de contraseñas
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:',.<>?/";

// Actualizar valor del slider
passwordLength.addEventListener("input", () => {
    sliderValue.textContent = passwordLength.value;
});

// Generar contraseña
function generatePassword() {
    let characters = "";
    if (uppercaseCheckbox.checked) characters += UPPERCASE;
    if (lowercaseCheckbox.checked) characters += LOWERCASE;
    if (numbersCheckbox.checked) characters += NUMBERS;
    if (symbolsCheckbox.checked) characters += SYMBOLS;

    if (characters === "") {
        generatedPassword.value = "Selecciona al menos una opción";
        return "";
    }

    // Generar contraseña asegurando la longitud seleccionada
    let password = Array.from({ length: parseInt(passwordLength.value) })
        .map(() => characters[Math.floor(Math.random() * characters.length)])
        .join('');

    return password;
}

// Mostrar contraseña generada
generateBtn.addEventListener("click", () => {
    const password = generatePassword();
    if (password) {
        generatedPassword.value = password;

        // Agregar al historial
        addToHistory(password);
    }
});

// Agregar contraseña al historial
function addToHistory(password) {
    // Remover el mensaje de "No hay contraseñas en el historial" si existe
    const emptyMessage = historyList.querySelector(".empty-message");
    if (emptyMessage) emptyMessage.remove();

    // Crear nuevo item de historial
    const historyItem = document.createElement("li");
    historyItem.className = "list-group-item d-flex justify-content-between align-items-center";

    const passwordSpan = document.createElement("span");
    passwordSpan.textContent = password; // Evitar problemas con caracteres especiales

    const copyButton = document.createElement("button");
    copyButton.className = "copy-btn btn btn-sm btn-outline-secondary";
    copyButton.innerHTML = `<i class="fa fa-clone"></i>`;

    // Evento para copiar contraseña desde el historial
    copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(password);
        showToast("Contraseña copiada: " + password);
    });

    historyItem.appendChild(passwordSpan);
    historyItem.appendChild(copyButton);

    // Insertar al inicio del historial
    historyList.insertBefore(historyItem, historyList.firstChild);

    // Limitar el historial a las últimas 8 contraseñas
    if (historyList.children.length > 8) {
        historyList.removeChild(historyList.lastElementChild); // Eliminar el elemento más antiguo
    }
}

// Copiar contraseña generada
copyBtn.addEventListener("click", () => {
    const password = generatedPassword.value;
    if (password === "" || password === "Selecciona al menos una opción") {
        showToast("Primero genera una contraseña válida");
        return;
    }
    navigator.clipboard.writeText(password);
    showToast("Contraseña copiada: " + password);
});

// Al cargar la página, mostrar mensaje si el historial está vacío
document.addEventListener("DOMContentLoaded", () => {
    if (historyList.children.length === 0) {
        historyList.innerHTML = "<li class='list-group-item text-center empty-message'>No hay contraseñas en el historial</li>";
    }
});

// Limpiar el historial
clearHistoryBtn.addEventListener("click", () => {
    historyList.innerHTML = "<li class='list-group-item text-center empty-message'>No hay contraseñas en el historial</li>";
});

// Mostrar mensaje Toast
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast align-items-center text-bg-success border-0 position-fixed top-0 end-0 m-3";
    toast.innerHTML = ` 
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>`;
    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    // Eliminar toast después de un tiempo
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
