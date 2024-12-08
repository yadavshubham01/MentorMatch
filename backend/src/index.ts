import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import userRoutes from './routes/authRoutes';
import connectionRoutes from './routes/connectionRoutes';
import notifictionRoutes from './routes/notificationRoutes';
import matchMaking from './routes/matchmakingRoutes';

config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api', notifictionRoutes);
app.use('/api', matchMaking);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});