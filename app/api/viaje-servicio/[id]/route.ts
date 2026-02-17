import { NextResponse } from 'next/server';
import { query } from '@/config/db.config';

/**
 * GET: Obtener servicios configurados para un viaje específico
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ ok: false, error: "ID de viaje no proporcionado" }, { status: 400 });
    }

    const sql = `
      SELECT 
        vs.id as relacion_id, 
        vs.servicio_id, 
        vs.valor, 
        vs.precio_extra, 
        s.nombre, 
        s.tipo_control
      FROM viaje_servicio vs
      JOIN servicios s ON vs.servicio_id = s.id
      WHERE vs.viaje_id = ?
    `;

    const rows = await query(sql, [id]) as any[];

    return NextResponse.json({ 
      ok: true, 
      resultado: rows 
    });

  } catch (err: any) {
    console.error("Error en GET viaje-servicio:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

/**
 * PUT: Sincronización total de servicios
 * Borra los existentes y añade los nuevos. 
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id: viajeId } = await params;
    const body = await req.json();
    const { servicios } = body; 

    if (!viajeId) {
      return NextResponse.json({ ok: false, error: "ID de viaje no encontrado" }, { status: 400 });
    }

    // 1. Borramos la configuración anterior para este viaje
    await query('DELETE FROM viaje_servicio WHERE viaje_id = ?', [viajeId]);

    // 2. Insertamos la lista completa enviada desde el frontend
    if (servicios && Array.isArray(servicios) && servicios.length > 0) {
      for (const s of servicios) {
        // Obtenemos el ID del servicio (soporta ambos nombres de propiedad)
        const sId = s.servicio_id || s.id;
        
        if (!sId) continue;

        // Limpieza de datos: Aseguramos que valor y precio_extra sean String
        const valorFinal = s.valor !== undefined && s.valor !== null ? String(s.valor) : "";
        
        // Mantenemos precio_extra como texto tal cual viene del front
        const precioExtraTexto = s.precio_extra !== undefined && s.precio_extra !== null ? String(s.precio_extra) : "";

        const sqlInsert = `
          INSERT INTO viaje_servicio (viaje_id, servicio_id, valor, precio_extra) 
          VALUES (?, ?, ?, ?)
        `;
        
        await query(sqlInsert, [viajeId, sId, valorFinal, precioExtraTexto]);
      }
    }

    return NextResponse.json({ 
      ok: true, 
      mensaje: "Servicios actualizados correctamente" 
    });

  } catch (err: any) {
    console.error("Error en PUT viaje-servicio:", err);
    return NextResponse.json({ 
      ok: false, 
      error: "Error en la base de datos",
      detalles: err.sqlMessage || err.message 
    }, { status: 500 });
  }
}

/**
 * DELETE: Limpiar todos los servicios de un viaje
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ ok: false, error: "ID no proporcionado" }, { status: 400 });
    }

    await query('DELETE FROM viaje_servicio WHERE viaje_id = ?', [id]);

    return NextResponse.json({ 
      ok: true, 
      mensaje: "Servicios eliminados del viaje" 
    });

  } catch (err: any) {
    console.error("Error en DELETE viaje-servicio:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}