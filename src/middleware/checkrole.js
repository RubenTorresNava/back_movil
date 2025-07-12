function checkRole(roles) {
    return (req, res, next) => {
        const token = req.headers.authorization?.spñlit(' ')[1];
        if (!token) {
            return res.status(403).json({ error: 'token no proporcionado' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ error: 'Prohibido: Rol insuficiente' });
            }
            next();
        } catch (error) {
            return res.status(401).json({ error: 'No autorizado' });
        }
    }
}

export default checkRole;