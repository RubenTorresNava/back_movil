import jwt from 'jsonwebtoken';

function checkRole(roles) {
    return async (req, res, next) => {
        try {
            // 1. Obtener token de múltiples fuentes
            const token = req.headers.authorization?.split(' ')[1] || 
                         req.cookies?.token ||
                         req.query?.token;

            if (!token) {
                return res.status(401).json({ 
                    success: false,
                    error: 'Token no proporcionado',
                    details: 'Incluye el token en Authorization: Bearer <token>' 
                });
            }

            // 2. Verificar y decodificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET, { complete: true });

            // 3. Validar estructura del payload
            if (!decoded.payload?.role || !decoded.payload?.id) {
                throw new Error('Estructura del token inválida');
            }

            // 4. Verificar rol
            if (!roles.includes(decoded.payload.role)) {
                return res.status(403).json({ 
                    success: false,
                    error: 'Acceso prohibido',
                    details: `Rol requerido: ${roles.join(', ')}` 
                });
            }

            // 5. Adjuntar usuario al request
            req.user = {
                id: decoded.payload.id,
                role: decoded.payload.role
            };

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
}

export default checkRole;