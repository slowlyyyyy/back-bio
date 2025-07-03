require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const connection = require('./Data/db'); // arquivo que exporta a conexão mysql

const app = express();
app.use(cors());
app.use(express.json());

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


app.get('/', async (req, res) => {

  try {

    res.status(201).json('Teste');
  } catch (error) {
    console.error('Erro ao salvar email:', error);
    res.status(500).json({ error: 'Erro ao salvar email' });
  }
});

app.get('/sales/history', async (req, res) => {
  const { transaction_status } = req.query;
  const { BASIC_AUTH } = process.env;

  console.log(BASIC_AUTH)

  try {
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

app.post('/sales/history', async (req, res) => {
  const respostas = req.body.email;
  const { BASIC_AUTH } = process.env;

  console.log(BASIC_AUTH)

  try {
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

    const emailBuscado = respostas; // Ex: "ccrauth@gmail.com"
    const vendas = salesResponse.data.items;

    const emailExiste = vendas.some(item => item.buyer.email === emailBuscado);

    if (emailExiste) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }

  } catch (error) {
    console.error('Erro ao buscar histórico de vendas:', error.message);
    res.status(500).json({ error: 'Erro ao obter histórico de vendas' });
  }
});

app.post('/questionario', async (req, res) => {
  const respostas = req.body;

  try {
    const campos = Object.keys(respostas).map(chave => `${chave}`).join(', ');
    const valores = Object.values(respostas);
    const placeholders = valores.map(() => '?').join(', ');

    const sql = `INSERT INTO questionario (${campos}) VALUES (${placeholders})`;
    const [result] = await connection.execute(sql, valores);

    res.status(201).json({ message: 'Respostas registradas com sucesso', id: result.insertId });
  } catch (error) {
    console.error('Erro ao salvar questionário:', error);
    res.status(500).json({ error: 'Erro ao salvar questionário' });
  }
});

app.post('/email', async (req, res) => {
  const email = req.body.email;

  console.log('Recebido:', email);

  try {
    const sql = 'INSERT INTO emails (email) VALUES (?)';
    const [result] = await connection.execute(sql, [email]);

    res.status(201).json({ message: 'Email salvo com sucesso', id: result.insertId });
  } catch (error) {
    console.error('Erro ao salvar email:', error);
    res.status(500).json({ error: 'Erro ao salvar email' });
  }
});

app.get('/email', async (req, res) => {

  try {
    const sql = `SELECT * FROM EMAILS`;
    const [result] = await connection.execute(sql);

    res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao salvar email:', error);
    res.status(500).json({ error: 'Erro ao salvar email' });
  }
});

app.get('/questionario', async (req, res) => {
  
  try{
    const sql = `SELECT * FROM questionario`;
    const [result] = await connection.execute(sql);

    res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao salvar questionário:', error);
    res.status(500).json({ error: 'Erro ao salvar questionário' });
  }

});



const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
