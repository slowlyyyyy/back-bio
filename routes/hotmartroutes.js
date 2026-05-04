const dotenv = require('dotenv');
const express = require('express');
const axios = require('axios');
const qs = require('qs');

const router = express.Router();


router.get('/salesKiwify', async (req, res) => {

  async function getKiwifyToken() {
  client_secret = 'cdb7d2d8bdd615ab666e083a84f3a1f70000ddef093ba33cc25e99131e3a239f'
  client_id = '8f124147-87b1-42a8-8a23-f71cf75fa032'

  console.log('teste')

  const response = await axios.post(
    'https://public-api.kiwify.com/v1/oauth/token',
    qs.stringify({
      client_id: client_id,
      client_secret: client_secret
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

    return response.data.access_token;
  }

  (async () => { 
    const tokenKiwify = await getKiwifyToken();
    const accountId = 'l6RAsDIwSX0vQS3'

      // Exemplo: últimos 30 dias
      const agora = new Date();
      const seismeses = new Date();
      seismeses.setDate(agora.getDate() - 30);

    const response = await axios.get(
      'https://public-api.kiwify.com/v1/sales',
      {
        params: {
          start_date: seismeses.toISOString(),
          end_date: agora.toISOString()
        },
        headers: {
          'Authorization': `Bearer ${tokenKiwify}`,
          'x-kiwify-account-id': accountId
        }
      }
    );

    console.log(response.data)

    res.json(response.data)
  })();


})





router.get('/sales/history', async (req, res) => {
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


// VERIFICAR EMAIL NO LOGIN

router.post('/sales/history', async (req, res) => {
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

    const emailBuscado = respostas;
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


module.exports = router