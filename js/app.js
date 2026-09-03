// =================================================================
// OMNIHISTORY - CONTROLADOR PRINCIPAL Y ENRUTADOR DE EVENTOS
// Protocolo de Resguardo y Certificación Documental (PWA)
// =================================================================

import { cambiarPantalla } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('[Omnihistory]: Inicializando controladores de interfaz...');

  // ---------------------------------------------------------------
  // 1. NAVEGACIÓN Y MENÚ HAMBURGUESA
  // ---------------------------------------------------------------
  
  // Enlaces de navegación general (Usuario Natural)
  enlazarEvento('btn-nav-metricas', () => cambiarPantalla('metricas'));
  enlazarEvento('btn-nav-archivo', () => cambiarPantalla('archivo-omnihistorico'));
  enlazarEvento('btn-nav-capsula', () => cambiarPantalla('capsula'));
  enlazarEvento('btn-nav-chat', () => cambiarPantalla('chat'));
  enlazarEvento('btn-nav-galeria', () => cambiarPantalla('galeria'));
  enlazarEvento('btn-nav-institucional', () => cambiarPantalla('institucional-bienvenida'));

  // Retorno desde Cápsula del Tiempo a Pantalla de Usuario
  enlazarEvento('btn-capsula-a-usuario', () => cambiarPantalla('usuario-inicio'));


  // ---------------------------------------------------------------
  // 2. ENTORNO DE ENTRADA INSTITUCIONAL (AUTENTICACIÓN)
  // ---------------------------------------------------------------
  
  // Botones de la Pantalla de Bienvenida Institucional
  enlazarEvento('btn-institucional-login-vista', () => cambiarPantalla('institucional-login'));
  enlazarEvento('btn-institucional-registro-vista', () => cambiarPantalla('institucional-registro'));

  // Formulario de Inicio de Sesión
  enlazarEvento('btn-institucional-login-enviar', () => {
    console.log('[Institucional]: Procesando credenciales de acceso...');
    // Redirige al panel privado tras validar credenciales
    cambiarPantalla('institucional-panel');
  });

  // Formulario de Registro (Solicitud de Convenio)
  enlazarEvento('btn-institucional-registro-enviar', () => {
    console.log('[Institucional]: Solicitud enviada. Notificando correo para confirmación...');
    alert('Se ha enviado un correo de confirmación para validar su entidad institucional.');
    cambiarPantalla('institucional-login');
  });


  // ---------------------------------------------------------------
  // 3. INTERFAZ DE USUARIO NATURAL (PANTALLA PRINCIPAL)
  // ---------------------------------------------------------------
  
  // Menú desplegable: Vínculo Filial (Compartimentos Estancos)
  enlazarEventoChange('select-vinculo-filial', (e) => {
    const vinculoSeleccionado = e.target.value;
    console.log(`[Vínculo Filial]: Asignado a compartimento: ${vinculoSeleccionado}`);
  });

  // Clip desplegable multimedia (Fotos, Videos, Audios, Docs)
  enlazarEvento('btn-usuario-clip-adjuntar', () => {
    activarSelectorArchivos('input-usuario-adjunto');
  });

  enlazarEventoChange('input-usuario-adjunto', (e) => {
    const archivos = e.target.files;
    if (archivos.length > 0) {
      const archivo = archivos[0];
      const tipo = obtenerTipoMedia(archivo.type, true);
      console.log(`[Usuario]: Archivo multimedia (${tipo}) cargado: ${archivo.name}`);
      actualizarIndicadorAdjunto('vista-previa-usuario', archivo.name, tipo);
    }
  });

  // Acciones de envío
  enlazarEvento('btn-usuario-enviar-capsula', () => {
    console.log('[Usuario]: Redirigiendo contenido a la Cápsula del Tiempo...');
  });

  enlazarEvento('btn-usuario-archivar', () => {
    console.log('[Usuario]: Archivando registro localmente...');
  });

  // Tarjeta de Asistencia e Interacción (Abajo a la Izquierda)
  enlazarEvento('card-usuario-asistencia-ia', () => {
    console.log('[IA]: Iniciando asistente de redacción y sistematización de relatos...');
  });


  // ---------------------------------------------------------------
  // 4. MÓDULO CÁPSULA DEL TIEMPO (USUARIO NATURAL)
  // ---------------------------------------------------------------
  
  // Certificación y configuración de custodia
  enlazarEvento('btn-capsula-certificar', () => {
    console.log('[Cápsula]: Iniciando proceso de certificación y asignación de teselas...');
  });

  // Tarjeta de Sistematización de Custodia (Abajo a la Derecha)
  enlazarEvento('card-capsula-sistematizacion', () => {
    console.log('[IA]: Asistiendo en la programación de apertura y beneficiarios...');
  });


  // ---------------------------------------------------------------
  // 5. INTERFAZ INSTITUCIONAL (PANEL TRAS AUTENTICARSE)
  // ---------------------------------------------------------------
  
  // Carga de Folios: Estricto filtro NO-VIDEO
  enlazarEvento('btn-institucional-adjuntar-folio', () => {
    activarSelectorArchivos('input-institucional-folio');
  });

  enlazarEventoChange('input-institucional-folio', (e) => {
    const archivos = e.target.files;
    if (archivos.length > 0) {
      const archivo = archivos[0];
      
      // Bloqueo estricto de archivos de video para evitar saturación
      if (archivo.type.startsWith('video/')) {
        alert('El entorno institucional admite exclusivamente documentos e imágenes.');
        e.target.value = '';
        return;
      }

      const tipo = obtenerTipoMedia(archivo.type, false);
      console.log(`[Institucional]: Folio (${tipo}) cargado: ${archivo.name}`);
      actualizarIndicadorAdjunto('vista-previa-institucional', archivo.name, tipo);
    }
  });

  // Acciones de auditoría y convenios
  enlazarEvento('btn-institucional-certificar', () => {
    console.log('[Institucional]: Generando certificación formal del documento...');
  });

  enlazarEvento('btn-institucional-verificar', () => {
    console.log('[Institucional]: Iniciando proceso de verificación de integridad...');
  });

  enlazarEvento('btn-institucional-convenio', () => {
    console.log('[Institucional]: Clasificando folio bajo archivo por convenio...');
  });

  // Tarjeta de Carga de Fuentes / Matrices (Abajo a la Derecha - Exclusiva)
  enlazarEvento('card-institucional-fuentes', () => {
    activarSelectorArchivos('input-institucional-folio');
  });


  // ---------------------------------------------------------------
  // 6. ARCHIVO OMNIHISTÓRICO (PREVISIÓN DE ENVÍO DEFINITIVO)
  // ---------------------------------------------------------------
  
  // Envío del documento revisado y terminado hacia la Omnihistoria
  enlazarEvento('btn-archivo-enviar-omnihistoria', () => {
    console.log('[Omnihistoria]: Documento final transferido a la memoria colectiva.');
    alert('Documento revisado enviado con éxito a la Omnihistoria.');
  });
});


// =================================================================
// FUNCIONES AUXILIARES DE USABILIDAD Y EVENTOS
// =================================================================

function enlazarEvento(idElemento, accion) {
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.addEventListener('click', (e) => {
      e.preventDefault();
      accion();
    });
  }
}

function enlazarEventoChange(idElemento, accion) {
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.addEventListener('change', (e) => {
      accion(e);
    });
  }
}

function activarSelectorArchivos(idInputFile) {
  const inputFile = document.getElementById(idInputFile);
  if (inputFile) {
    inputFile.click();
  }
}

function obtenerTipoMedia(mimeType, permiteVideo = true) {
  if (permiteVideo && mimeType.startsWith('video/')) return '🎥 Video';
  if (mimeType.startsWith('image/')) return '🖼️ Imagen';
  if (mimeType.startsWith('audio/')) return '🎙️ Audio';
  return '📄 Documento Oficial';
}

function actualizarIndicadorAdjunto(idContenedorVista, nombreArchivo, tipoMedia) {
  const contenedor = document.getElementById(idContenedorVista);
  if (contenedor) {
    contenedor.textContent = `${tipoMedia} listo: ${nombreArchivo}`;
    contenedor.style.display = 'block';
  }
                }
