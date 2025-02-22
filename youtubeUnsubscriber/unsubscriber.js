// Función para esperar un tiempo determinado (en milisegundos)
function waitForTimeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para esperar a que un selector aparezca en el DOM antes de interactuar con él
async function waitForSelector(selector, timeout = 5000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const element = document.querySelector(selector);
        if (element) return element; // Retorna el elemento si se encuentra
        await waitForTimeout(100); // Espera 100ms antes de volver a buscar
    }
    throw new Error(`No se encontró el elemento: ${selector} en ${timeout}ms`);
}

// Función principal para cancelar suscripciones
async function cancelarSuscripciones() {
    let i = 0;
    let suscriptoButtons = document.querySelectorAll("ytd-subscribe-button-renderer button.yt-spec-button-shape-next--icon-leading-trailing");
    let total = suscriptoButtons.length;
    while (i < total) {
        try {
            // Obtener el botón "Suscripto"
            let suscriptoButton = suscriptoButtons[i];
            if (!suscriptoButton) {
                console.log("No quedan más suscripciones.");
                break;
            }

            // Hacer clic en "Suscripto"
            suscriptoButton.click();
            await waitForTimeout(500); // Esperar a que el menú se abra

            // Asegurar que el menú no esté oculto (solución a aria-hidden)
            let dropdown = document.querySelector("tp-yt-iron-dropdown");
            if (dropdown) {
                dropdown.removeAttribute("aria-hidden");
            }

            // Esperar a que aparezca el botón "Anular suscripción"
            let anularButton = await waitForSelector("tp-yt-paper-listbox > ytd-menu-service-item-renderer:nth-child(4n)", 3000);

            // Mover el foco antes de hacer clic para evitar conflictos
            anularButton.focus();
            await waitForTimeout(100);

            // Hacer clic en "Anular suscripción"
            anularButton.click();
            await waitForTimeout(500);

            // Hacer clic en "Confirmar"
            let confirmButton = await waitForSelector("#confirm-button > yt-button-shape > button", 3000);
            
            // Asegurar que el foco está en el botón de confirmación antes de hacer clic
            confirmButton.focus();
            await waitForTimeout(100);
            confirmButton.click();

            console.log("Desuscripción completada.");

            // Esperar antes de pasar a la siguiente suscripción
            await waitForTimeout(2000);
            i++;
        } catch (error) {
            console.log("Error o no hay más suscripciones:", error);
            break;
        }
    }
}

// Llamar a la función
cancelarSuscripciones();
