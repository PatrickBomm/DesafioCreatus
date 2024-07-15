const express = require('express');
const userRoutes = require('./src/routes/userRoute');
const connectDB = require('./src/config/db');
require('dotenv').config();
const app = express();

app.use(express.json());
connectDB();

app.use('/creatus', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
