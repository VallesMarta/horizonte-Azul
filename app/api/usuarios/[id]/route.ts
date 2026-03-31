import { UsuarioController } from "@/controllers/usuario.controller";

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Datos del usuario obtenidos con éxito.
 *       401:
 *         description: No autorizado (Token faltante o inválido).
 *       403:
 *         description: Acceso denegado (No eres Admin ni el dueño de la cuenta).
 *       404:
 *         description: Usuario no encontrado.
 * 
 *   put:
 *     summary: Actualizar datos de un usuario
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string, example: "marta_viajera" }
 *               nombre: { type: string, example: "Marta" }
 *               email: { type: string, example: "marta@email.com" }
 *               password: { type: string, description: "Opcional (si se envía se hashea)" }
 *               isAdmin: { type: boolean, example: false, description: "Solo el Administrador puede cambiar este valor" }
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: No puedes editar este perfil (No eres Admin ni el propietario).
 *       404:
 *         description: El usuario no existe en la base de datos.
 * 
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente.
 *       403:
 *         description: Prohibido (No tienes permisos de Admin o intentas borrar al Admin ID 1).
 *       404:
 *         description: El ID de usuario no existe.
 */

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: RouteParams) {
  const { id } = await params;
  return UsuarioController.obtenerUno(req, id);
}

export async function PUT(req: Request, { params }: RouteParams) {
  const { id } = await params;
  return UsuarioController.actualizar(req, id);
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const { id } = await params;
  return UsuarioController.eliminar(req, id);
}