// Configuración de Estado Global OMNIH
const OMNIH_STATE = {
  version: "1.0.0-PWA",
  networkStatus: "ÓPTIMA",
  activeNodes: 12,
  metrics: {
    storage: "1.25 TB",
    encryption: "98.7% (SHA-256)",
    monthlyLogs: "14.3K"
  },
  userSession: {
    isInvited: false,
    token: null
  }
};

// Inicialización de la Interfaz de Entrada
document.addEventListener("DOMContentLoaded", () => {
  checkWelcomeContext();
  bindSidebarEvents();
  renderPublicMetrics();
});

// 1. Evaluación del Tipo de Bienvenida (Genérica vs Invitación)
function checkWelcomeContext() {
  const urlParams = new URLSearchParams(window.location.search);
  const inviteToken = urlParams.get("invite");

  if (inviteToken) {
    OMNIH_STATE.userSession.isInvited = true;
    OMNIH_STATE.userSession.token = inviteToken;
    console.log(`[OMNIH] Bienvenida por Invitación activada. Token: ${inviteToken}`);
    displayNotification("Bienvenido a OMNIH. Token de invitación detectado.");
  } else {
    console.log("[OMNIH] Bienvenida Genérica en red pública.");
  }
}

// 2. Despliegue de Métricas Públicas
function renderPublicMetrics() {
  const metricsContainer = document.getElementById("public-metrics-container");
  if (!metricsContainer) return;

  metricsContainer.innerHTML = `
    <div class="metric-card">
      <span class="value">${OMNIH_STATE.metrics.storage}</span>
      <span class="label">(Resguardados)</span>
    </div>
    <div class="metric-card">
      <span class="value">${OMNIH_STATE.metrics.encryption}</span>
      <span class="label">Cifrado Hash</span>
    </div>
    <div class="metric-card">
      <span class="value">${OMNIH_STATE.metrics.monthlyLogs}</span>
      <span class="label">(Mes)</span>
    </div>
  `;
}

// 3. Control de la Solapa Lateral Derecha ("Entra a tu espacio privado")
function bindSidebarEvents() {
  const privateAccessBtn = document.getElementById("btn-private-access");
  const sidebarPanel = document.getElementById("private-sidebar");
  const confirmAccessBtn = document.getElementById("btn-confirm-entry");

  if (privateAccessBtn && sidebarPanel) {
    privateAccessBtn.addEventListener("click", () => {
      sidebarPanel.classList.add("active");
    });
  }

  if (confirmAccessBtn) {
    confirmAccessBtn.addEventListener("click", () => {
      redirectToPrivateDashboard();
    });
  }
}

// 4. Transición hacia la Interfaz Privada del Usuario
function redirectToPrivateDashboard() {
  console.log("[OMNIH] Términos de privacidad aceptados. Redirigiendo a entorno privado...");
  localStorage.setItem("omnih_access_granted", "true");
  
  // Ruta relativa compatible con GitHub Pages y Vercel
  window.location.href = "./privado.html";
}

function displayNotification(msg) {
  const toast = document.createElement("div");
  toast.className = "omnih-toast";
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}
