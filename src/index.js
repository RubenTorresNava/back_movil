import app from './app.js';
import { connectDB } from './database/connection.js';

const startServer = async () => {
    try{
        await connectDB();
        app.listen(3000, () => {
            console.log(`Server is running on port 3000`);
        });
    }catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

startServer();
