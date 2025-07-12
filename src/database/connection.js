import mongoose from 'mongoose';
import { MONGO_URI } from '../config.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("connexion exitosa a la base de datos", MONGO_URI);
    } catch (error) {
        console.error("error al conectar", error);
        process.exit(1);
    }
};