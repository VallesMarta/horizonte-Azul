import { NextResponse } from 'next/server';
import { query } from '@/config/db.config';

// Definimos los tipos para que TypeScript no se queje
type RouteParams = { params: Promise<{ usuario_id?: string; id?: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    
    // Intentamos pillar el ID de usuario de cualquier variante posible
    const uid = resolvedParams.usuario_id || resolvedParams.id;

    // Si sigue siendo undefined, lanzamos un error claro antes de ir a SQL
    if (!uid) {
      return NextResponse.json({ 
        ok: false, 
        error: "No se pudo identificar el ID del usuario en la URL" 
      }, { status: 400 });
    }

    const sql = `
      SELECT v.* 
      FROM viajes v
      INNER JOIN wishlist w ON v.id = w.viaje_id
      WHERE w.usuario_id = ?
    `;
    
    // Ahora uid nunca será undefined aquí
    const favoritos = await query(sql, [uid]);

    return NextResponse.json({ 
      ok: true, 
      resultado: favoritos 
    });

  } catch (err: any) {
    console.error("Error en wishlist:", err.message);
    return NextResponse.json({ 
      ok: false, 
      error: "Error interno",
      sqlError: err.message 
    }, { status: 500 });
  }
}