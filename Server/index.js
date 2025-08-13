import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './Database/connectDB.js'
import cors from 'cors'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 6000

app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.get('/', (req, res) => {
  res.send('✅ API is active ')
})
const start_server = async () => {
  try {
    console.log('🔄 Starting server...')
    console.log('🔄 Initializing database connection...');
    await connectDB()
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error.message);
  }
}
start_server();