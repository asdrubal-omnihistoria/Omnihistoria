// OMNIH - Validador de Licencias Institucionales por Convenio
const OMNIH_LICENSE_VALIDATOR = {
  // 1. Ingesta y Validación de Estructura de Licencia
  validateInstitutionalLicense(licenseObject, clientIP) {
    const lic = licenseObject.licencia_institucional;
    if (!lic) {
      return { valido: false, error: "ESTRUCTURA_LICENCIA_INVALIDA" };
    }

    // 2. Verificación de Estado del Convenio y Fechas
    const ahora = new Date();
    const fechaInicio = new Date(lic.condiciones_operativas.fecha_inicio_convenio);
    const fechaVencimiento = new Date(lic.condiciones_operativas.fecha_vencimiento_convenio);

    if (lic.institucion.estado_convenio !== "ACTIVO") {
      return { valido: false, error: "CONVENIO_INACTIVO_O_SUSPENDIDO" };
    }

    if (ahora < fechaInicio || ahora > fechaVencimiento) {
      return { valido: false, error: "CONVENIO_FUERA_DE_VIGENCIA" };
    }

    // 3. Control de Seguridad por Whitelist IP (Si aplica)
    if (clientIP && lic.seguridad_criptografica.ip_whitelist.length > 0) {
      const ipPermitida = lic.seguridad_criptografica.ip_whitelist.includes(clientIP);
      if (!ipPermitida) {
        return { valido: false, error: "IP_NO_AUTORIZADA_EN_WHITELIST" };
      }
    }

    console.log(`[OMNIH] Licencia validada con éxito: ${lic.licencia_id} (${lic.institucion.nombre_oficial})`);
    
    return {
      valido: true,
      licenciaId: lic.licencia_id,
      hashLicencia: lic.seguridad_criptografica.hash_licencia_institucion,
      limiteMensual: lic.condiciones_operativas.limite_certificaciones_mensuales
    };
  }
};
