// Asegúrate de importar jwt al inicio del archivo
import jwt from 'jsonwebtoken';

export const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                 req.headers?.authorization?.replace('Bearer ', '') ||
                 req.cookies?.token;

    if (!token) {
        return res.status(401).json({ 
            success: false,
            error: 'Token no proporcionado',
            details: 'Incluye el token en el header Authorization: Bearer <token>' 
        });
    }

    try {
        // Verifica que JWT_SECRET esté configurado
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET no está configurado en las variables de entorno');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.clienteId = decoded.id;
        next();
    } catch (error) {
        
        let errorMessage = 'Token inválido';
        if (error.name === 'TokenExpiredError') {
            errorMessage = 'Token expirado';
        } else if (error.name === 'JsonWebTokenError') {
            errorMessage = 'Token malformado';
        }

        res.status(401).json({ 
            success: false,
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};