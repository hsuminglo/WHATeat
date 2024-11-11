import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import cors from 'cors';

const app = express();
const port = 3000;

const execAsync = promisify(exec);

// 啟用 CORS
app.use(cors());

app.get('/api/restaurant', async (req, res) => {
  try {
    console.log('Received request for restaurant data');
    const { stdout, stderr } = await execAsync('python3 generate_restaurant_data.py');
    if (stderr) {
      console.error('Python script error:', stderr);
      return res.status(500).json({ error: 'Python script error', details: stderr });
    }
    console.log('Python script output:', stdout);
    const restaurantData = JSON.parse(stdout);
    res.json(restaurantData);
  } catch (error) {
    console.error('Error generating restaurant data:', error);
    res.status(500).json({ error: 'Failed to generate restaurant data', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Server details:', server.address());
});

// 錯誤處理
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});