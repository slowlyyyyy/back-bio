require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para obter o token de acesso
app.post('/token', async (req, res) => {
  const { BASIC_AUTH } = process.env;

  try {
    const response = await axios.post(
      'https://api-sec-vlc.hotmart.com/security/oauth/token?grant_type=client_credentials',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': BASIC_AUTH,
        }
      }
    );

    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error('Erro ao buscar token Hotmart:', error.message);
    res.status(500).json({ error: 'Erro ao obter token da Hotmart' });
  }
});

// Novo endpoint para obter o histórico de vendas
app.get('/sales/history', async (req, res) => {
  const { transaction_status } = req.query;
  const { BASIC_AUTH } = process.env;

  console.log(BASIC_AUTH)

  try {
    // Primeiro obtemos o token
    const tokenResponse = await axios.post(
      'https://api-sec-vlc.hotmart.com/security/oauth/token?grant_type=client_credentials',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': BASIC_AUTH,
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const agora = new Date();
    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(agora.getMonth() - 6);

    const data = seisMesesAtras.getTime(); // em milissegundos
    console.log(seisMesesAtras); // timestamp

    // Agora fazemos a requisição para o histórico de vendas
    const salesResponse = await axios.get(
      `https://developers.hotmart.com/payments/api/v1/sales/history`,
      {
        params: {
          start_date: data,
          end_date: new Date().getTime()
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    res.json(salesResponse.data);
  } catch (error) {
    console.error('Erro ao buscar histórico de vendas:', error.message);
    res.status(500).json({ error: 'Erro ao obter histórico de vendas' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});