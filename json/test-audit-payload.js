{
  "solicitud_omnihistoria": {
    "interfaz_origen": "USUARIO_NATURAL_GENEHISTORY",
    "tipo_operacion": "AUDITORIA_INTEGRIDAD",
    "credenciales_origen": {
      "licencia_id": null,
      "usuario_id": "USR-2026-ASDRUBAL-001"
    },
    "datos_archivo": {
      "hash_sha256_local": "a591a6d40bf420404a011733cfb7b190a591a6d40bf420404a011733cfb7b190",
      "nombre_referencial": "Manuscrito_Historico_1952.pdf",
      "horizonte_meses": 0
    }
  },
  "respuesta_esperada": {
    "omnihistoria_response": {
      "interfaz_origen": "USUARIO_NATURAL_GENEHISTORY",
      "hash_evaluado": "a591a6d40bf420404a011733cfb7b190a591a6d40bf420404a011733cfb7b190",
      "veredicto": "COINCIDENCIA_EXACTA",
      "detalles": {
        "integro": true,
        "mensaje_usuario": "El documento es 100% auténtico e intacto. La huella digital coincide perfectamente con la matriz registrada.",
        "requiere_debito_folio": false,
        "costo_operacion_usd": 0.00
      },
      "timestamp_utc": "2026-08-11T09:55:00Z"
    }
  }
}
