const express = require('express');
const mysql = require('mysql2');

const app = express();
const porta = process.env.PORT || 3000;

// Middleware para permitir JSON no req.body
app.use(express.json());

// 📌 Configuração da conexão com o banco de dados MySQL
const conexao = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'biblioteca'
});

conexao.connect(error => {
  if (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
  } else {
    console.log('✅ Conectado ao banco de dados!');
  }
});

// 📚 Rota para cadastrar um livro
app.post('/cadastrar-livro', (req, res) => {
  const { titulo, autor, categoria } = req.body;

  if (!titulo || !autor || !categoria) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios!' });
  }

  const sql = 'INSERT INTO livros (titulo, autor, categoria) VALUES (?, ?, ?)';
  conexao.query(sql, [titulo, autor, categoria], (error, results) => {
    if (error) {
      return res.status(500).json({ erro: 'Erro ao cadastrar livro' });
    }
    res.status(201).json({ mensagem: '📖 Livro cadastrado com sucesso!', id: results.insertId });
  });
});

// 🎓 Rota para cadastrar um aluno
app.post('/cadastrar-aluno', (req, res) => {
  const { nome, matricula, turma } = req.body;

  if (!nome || !matricula || !turma) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios!' });
  }

  const sql = 'INSERT INTO alunos (nome, matricula, turma) VALUES (?, ?, ?)';
  conexao.query(sql, [nome, matricula, turma], (error, results) => {
    if (error) {
      return res.status(500).json({ erro: 'Erro ao cadastrar aluno' });
    }
    res.status(201).json({ mensagem: '🧑‍🎓 Aluno cadastrado com sucesso!', id: results.insertId });
  });
});

// 📖 Rota para cadastrar um empréstimo
app.post('/cadastrar-emprestimo', (req, res) => {
  const { aluno_id, livro_id, dataEmprestimo, dataDevolucao } = req.body;

  if (!aluno_id || !livro_id || !dataEmprestimo || !dataDevolucao) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios!' });
  }

  const sql = 'INSERT INTO emprestimos (aluno_id, livro_id, dataEmprestimo, dataDevolucao) VALUES (?, ?, ?, ?)';
  conexao.query(sql, [aluno_id, livro_id, dataEmprestimo, dataDevolucao], (error, results) => {
    if (error) {
      return res.status(500).json({ erro: 'Erro ao cadastrar empréstimo' });
    }
    res.status(201).json({ mensagem: '📚 Empréstimo cadastrado com sucesso!', id: results.insertId });
  });
});

// 🔎 Rota para buscar todos os alunos cadastrados
app.get('/alunos', (req, res) => {
  conexao.query('SELECT * FROM alunos', (error, results) => {
    if (error) {
      return res.status(500).json({ erro: 'Erro ao buscar alunos' });
    }
    res.json(results);
  });
});

// 📖 Rota para buscar todos os livros
app.get('/livros', (req, res) => {
  const sql = 'SELECT * FROM livros';

  conexao.query(sql, (error, results) => {
    if (error) {
      console.error('❌ Erro ao buscar livros:', error);
      return res.status(500).json({ erro: 'Erro ao buscar livros' });
    }
    res.json(results); // Retorna todos os livros cadastrados no formato JSON
  });
});
app.get('/livros/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM livros WHERE id = ?';
  
    conexao.query(sql, [id], (error, results) => {
      if (error) {
        console.error('❌ Erro ao buscar livro:', error);
        return res.status(500).json({ erro: 'Erro ao buscar livro' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ mensagem: 'Livro não encontrado' });
      }
  
      res.json(results[0]); // Retorna o livro encontrado
    });
  });
  app.get('/emprestimos', (req, res) => {
  const sql = `
    SELECT e.id, a.nome AS aluno, l.titulo AS livro, e.dataEmprestimo, e.dataDevolucao
    FROM emprestimos e
    JOIN alunos a ON e.aluno_id = a.matricula
    JOIN livros l ON e.livro_id = l.id
  `;

  conexao.query(sql, (error, results) => {
    if (error) {
      console.error('❌ Erro ao buscar empréstimos:', error);
      return res.status(500).json({ erro: 'Erro ao buscar empréstimos' });
    }
    res.json(results); // Retorna todos os empréstimos no formato JSON
  });
});

// 🔥 Inicia o servidor (depois de todas as rotas serem registradas)
app.listen(porta, () => {
  console.log(`🚀 Servidor rodando na porta ${porta}`);
});
