import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://rubenbebe145rt:animales123@movil.nbbw1bw.mongodb.net/?retryWrites=true&w=majority&appName=movil";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("connexion exitosa a la base de datos", MONGO_URI);
    } catch (error) {
        console.error("error al conectar", error);
        process.exit(1);
    }
};