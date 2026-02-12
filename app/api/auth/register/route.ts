import { NextResponse } from 'next/server';
import { query } from '@/config/db.config';
import bcrypt from 'bcrypt';

// POST para crear un nuevo usuario
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, nombre, email } = body;

    // 1. Validación
    if (!username || !password || !email) {
      return NextResponse.json({ ok: false, error: "Faltan datos" }, { status: 400 });
    }

    // 2. Hasheamos la contraseña que nos envian
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insertar en la tabla de usuarios
    const sqlInsert = `
      INSERT INTO usuarios (username, password, nombre, email, isAdmin) 
      VALUES (?, ?, ?, ?, 0)
    `;
    const result: any = await query(sqlInsert, [username, hashedPassword, nombre, email]);

    // 4. Devolver la respuesta limpia (sin password ni isAdmin)
    return NextResponse.json({ 
      ok: true, 
      resultado: {
        id: result.insertId,
        username,
        nombre,
        email
      },
      mensaje: "Usuario registrado con éxito" 
    });

  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ ok: false, error: "Email o usuario duplicado" }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: "Error en el servidor" }, { status: 500 });
  }
}