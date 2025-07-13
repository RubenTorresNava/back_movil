import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../database/models/usuario.js';
import env from 'dotenv';

// Funcion de registro de usuario
export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Usuario({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
}

// Funcion de inicio de sesión de usuario
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Usuario.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
}

//cerra sesión de usuario y elimina el token
export const logoutUser = (req, res) => {
    // Aquí podrías implementar la lógica para invalidar el token si es necesario
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
}