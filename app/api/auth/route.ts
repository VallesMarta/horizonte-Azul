import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: number;
  isAdmin: boolean; 
}

export function verifyToken(request: Request): TokenPayload | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    // Verificamos el token con nuestra clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    
    return decoded;
  } catch (error) {
    return null;
  }
}