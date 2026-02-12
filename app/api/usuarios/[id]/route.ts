import { NextResponse } from 'next/server';
import { query } from '@/config/db.config';
import bcrypt from 'bcrypt';

type RouteParams = { params: Promise<{ id: string }> };

// 1. GET: Obtener un usuario específico
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const rows = await query('SELECT id, username, nombre, email, isAdmin, created_at FROM usuarios WHERE id = ?', [id]) as any[];

    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    // Forzamos el booleano real para el frontend
    const usuario = {
      ...rows[0],
      isAdmin: rows[0].isAdmin === 1
    };

    return NextResponse.json({ ok: true, resultado: usuario });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error en el servidor" }, { status: 500 });
  }
}

// 2. PUT: Actualizar usuario
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // 1. Buscamos los datos actuales para no perder lo que no se envía
    const rows = await query('SELECT * FROM usuarios WHERE id = ?', [id]) as any[];
    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Usuario no existe" }, { status: 404 });
    }
    const usuarioActual = rows[0];

    // 2. Usar el dato que viene en el body o mantener el que ya está en la DB
    const username = body.username ?? usuarioActual.username;
    const nombre = body.nombre ?? usuarioActual.nombre;
    const email = body.email ?? usuarioActual.email;
    const isAdmin = body.isAdmin !== undefined ? body.isAdmin : usuarioActual.isAdmin;
    
    let finalPassword = usuarioActual.password;
    if (body.password && body.password.length > 0) {      
      finalPassword = await bcrypt.hash(body.password, 10);
    }

    const sql = `
      UPDATE usuarios 
      SET username = ?, nombre = ?, email = ?, isAdmin = ?, password = ?
      WHERE id = ?
    `;

    await query(sql, [
      username, 
      nombre, 
      email, 
      isAdmin ? 1 : 0, 
      finalPassword,
      id
    ]);

    return NextResponse.json({ ok: true, mensaje: "Usuario actualizado correctamente" });
  } catch (err) {
    console.error("Error API PUT:", err);
    return NextResponse.json({ ok: false, error: "Error al actualizar los datos" }, { status: 400 });
  }
}

// 3. DELETE: Eliminar usuario
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // 1. Evitar borrar al Administrador principal (ID 1)
    if (id === "1") {
      return NextResponse.json(
        { ok: false, error: "No se puede eliminar el administrador principal" }, 
        { status: 403 }
      );
    }

    // 2. Ejecutar la eliminación
    // Nota: Al tener ON DELETE CASCADE en la tabla, si este usuario 
    // tiene una wishlist o reservas, se borrarán automáticamente.
    const result: any = await query('DELETE FROM usuarios WHERE id = ?', [id]);

    // 3. Verificar si el usuario existía
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { ok: false, error: "El usuario con ese ID no existe" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      ok: true, 
      mensaje: `Usuario con ID ${id} eliminado correctamente` 
    });

  } catch (err: any) {
    console.error("Error al eliminar usuario:", err);
    return NextResponse.json(
      { ok: false, error: "Error interno al intentar eliminar el usuario" }, 
      { status: 500 }
    );
  }
}