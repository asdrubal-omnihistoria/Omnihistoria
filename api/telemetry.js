import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

// Mapeo dinámico de las 5 métricas de OMNIH con sus respectiva ID de Google Sheet
const SHEET_IDS = {
  RECORD_CREATED: process.env.SHEET_ID_METRICA_1,        // Métrica 1: Almacenamiento / Teselas
  SYSTEM_PERFORMANCE: process.env.SHEET_ID_METRICA_2,    // Métrica 2: Reserva y Crecimiento
  RECORD_CONSOLIDATED: process.env.SHEET_ID_METRICA_3,   // Métrica 3: Inmutabilidad / Hashes
  COMMUNITY_INTERACTION: process.env.SHEET_ID_METRICA_4, // Métrica 4: Consultas / Carrusel
  DONATION_CONTRIBUTION: process.env.SHEET_ID_METRICA_5  // Métrica 5: Fondo Mutual
};

export default async function handler(req, res) {
  // Solo se admiten peticiones HTTP POST
  if (req.method !== 'POST') {
    return res.status(455).json({ error: 'Método no permitido. Utilizar POST.' });
  }

  try {
    const payload = req.body;
    const { event_category, event_data, timestamp_utc, anonymized_node_hash } = payload;

    // Validación de categoría de evento
    const sheetId = SHEET_IDS[event_category];
    if (!sheetId) {
      return res.status(400).json({ error: 'Categoría de evento no reconocida o desconfigurada.' });
    }

    // Autenticación segura con la API de Google mediante Variables de Entorno
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    // Procesamiento y adición de filas según la métrica correspondiente
    if (event_category === 'RECORD_CREATED') {
      const bytes = event_data.data_volume_bytes || 0;
      await sheet.addRow({
        'Timestamp UTC': timestamp_utc,
        'Node Hash': anonymized_node_hash,
        'Bytes': bytes,
        'MB': `=C${sheet.rowCount + 1}/1048576`,
        'GB': `=D${sheet.rowCount + 1}/1024`
      });
    } else if (event_category === 'DONATION_CONTRIBUTION') {
      const monto = event_data.contribution_amount || 0;
      await sheet.addRow({
        'Donaciones Totales': monto,
        'Costo Operativo': 50,
        'Fondo Mutual Acumulado': `=A${sheet.rowCount + 1}-B${sheet.rowCount + 1}`,
        'Meses de Preservacion': `=C${sheet.rowCount + 1}/B${sheet.rowCount + 1}`,
        'Fondo Migracion Tecnologica': `=C${sheet.rowCount + 1}*0.30`,
        'Estado de Solvencia': `=IF(D${sheet.rowCount + 1}>=12, "Optimo", "Alerta")`
      });
    } else {
      // Registro estándar para el resto de eventos
      await sheet.addRow({
        'Timestamp UTC': timestamp_utc,
        'Node Hash': anonymized_node_hash,
        'Detalles': JSON.stringify(event_data)
      });
    }

    return res.status(202).json({
      status: 'success',
      message: 'Evento OMNIH procesado e indexado correctamente en Google Sheets.',
      category: event_category
    });

  } catch (error) {
    console.error('Error en el pipeline de telemetría:', error);
    return res.status(500).json({ error: 'Error interno de sincronización con la base de datos.' });
  }
  }
