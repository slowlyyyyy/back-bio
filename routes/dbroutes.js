// routes/dbRoutes.js
const express = require('express');
const connection = require('../Data/db');

const router = express.Router();


router.post('/questionario', async (req, res) => {
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

router.post('/email', async (req, res) => {
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

router.get('/email', async (req, res) => {

  try {
    const sql = `SELECT * FROM EMAILS`;
    const [result] = await connection.execute(sql);

    res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao salvar email:', error);
    res.status(500).json({ error: 'Erro ao salvar email' });
  }
});

router.get('/questionario', async (req, res) => {
  
  try{
    const sql = `SELECT * FROM questionario`;
    const [result] = await connection.execute(sql);

    res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao salvar questionário:', error);
    res.status(500).json({ error: 'Erro ao salvar questionário' });
  }

});

module.exports = router;