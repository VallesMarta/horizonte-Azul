import { NextResponse } from 'next/server';
import { query } from '@/config/db.config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // 1. Validación de entrada
    if (!username || !password) {
      return NextResponse.json({ ok: false, error: "Usuario y contraseña requeridos" }, { status: 400 });
    }

    // 2. Buscar al usuario en la base de datos
    // Traemos todo para poder validar la contraseña y el rol
    const sql = 'SELECT * FROM usuarios WHERE username = ?';
    const rows = await query(sql, [username]) as any[];

    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "El usuario no existe" }, { status: 401 });
    }

    const usuario = rows[0];

    // 3. Verificar si la contraseña coincide con el Hash
    const esValida = await bcrypt.compare(password, usuario.password);

    if (!esValida) {
      return NextResponse.json({ ok: false, error: "Contraseña incorrecta" }, { status: 401 });
    }

    // 4. Generar el Token JWT
    // Guardamos el ID y si es admin para usarlo en el /Auth
    const token = jwt.sign(
      { 
        id: usuario.id, 
        isAdmin: Boolean(usuario.isAdmin) 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // 5. Respuesta exitosa
    return NextResponse.json({
      ok: true,
      token,
      usuario: {
        id: usuario.id,
        username: usuario.username,        
        nombre: usuario.nombre,
        isAdmin: Boolean(usuario.isAdmin)
      }
    });

  } catch (error: any) {
    console.error("Error en Login:", error.message);
    return NextResponse.json({ ok: false, error: "Error interno del servidor" }, { status: 500 });
  }
}