require('dotenv').config();
require('dotenv').config({ path: './env.production' });
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const dbRoutes = require('./routes/dbroutes');
const hotmart = require('./routes/hotmartroutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use(dbRoutes);
app.use(hotmart);


const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
