const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.status(200).send("Server is awake and healthy!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});