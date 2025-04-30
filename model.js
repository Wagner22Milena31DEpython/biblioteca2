// 📌 Importação das bibliotecas necessárias
const express = require('express');
const cors = require('cors');

// 🔥 Inicializa o aplicativo Express
const app = express();
const porta = process.env.PORT || 3000;

// 🚀 Middleware para permitir JSON e evitar problemas de CORS
app.use(cors());
app.use(express.json());

// 📌 Importação da conexão com o banco de dados
const conexao = require('./repertory');

// 📚 Cadastrar um livro
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

// 🧑‍🎓 Cadastrar um aluno
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

// 📚 Cadastrar um empréstimo
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

// ✏️ Atualizar um livro por ID
app.put('/livros/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, autor, categoria } = req.body;
  const sql = 'UPDATE livros SET titulo = ?, autor = ?, categoria = ? WHERE id = ?';
  conexao.query(sql, [titulo, autor, categoria, id], (error, results) => {
    if (error) return res.status(500).json({ erro: 'Erro ao atualizar livro' });
    res.json({ mensagem: '📖 Livro atualizado com sucesso!' });
  });
});

// 🗑️ Deletar um livro por ID
app.delete('/livros/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM livros WHERE id = ?';
  conexao.query(sql, [id], (error, results) => {
    if (error) return res.status(500).json({ erro: 'Erro ao deletar livro' });
    res.json({ mensagem: '📖 Livro deletado com sucesso!' });
  });
});

// ✏️ Atualizar um aluno por matrícula
app.put('/alunos/:matricula', (req, res) => {
  const { matricula } = req.params;
  const { nome, turma } = req.body;
  const sql = 'UPDATE alunos SET nome = ?, turma = ? WHERE matricula = ?';
  conexao.query(sql, [nome, turma, matricula], (error, results) => {
    if (error) return res.status(500).json({ erro: 'Erro ao atualizar aluno' });
    res.json({ mensagem: '🧑‍🎓 Aluno atualizado com sucesso!' });
  });
});

// 🗑️ Deletar um aluno por matrícula
app.delete('/alunos/:matricula', (req, res) => {
  const { matricula } = req.params;
  const sql = 'DELETE FROM alunos WHERE matricula = ?';
  conexao.query(sql, [matricula], (error, results) => {
    if (error) return res.status(500).json({ erro: 'Erro ao deletar aluno' });
    res.json({ mensagem: '🧑‍🎓 Aluno deletado com sucesso!' });
  });
});

// 🔎 Buscar todos os alunos
app.get('/alunos', (req, res) => {
  conexao.query('SELECT * FROM alunos', (error, results) => {
    if (error) return res.status(500).json({ erro: 'Erro ao buscar alunos' });
    res.json(results);
  });
});

// 📖 Buscar todos os livros
app.get('/livros', (req, res) => {
  conexao.query('SELECT * FROM livros', (error, results) => {
    if (error) return res.status(500).json({ erro: 'Erro ao buscar livros' });
    res.json(results);
  });
});

// 📚 Buscar todos os empréstimos
app.get('/emprestimos', (req, res) => {
  const sql = `
    SELECT e.id, a.nome AS aluno, l.titulo AS livro, e.dataEmprestimo, e.dataDevolucao
    FROM emprestimos e
    JOIN alunos a ON e.aluno_id = a.matricula
    JOIN livros l ON e.livro_id = l.id
  `;
  conexao.query(sql, (error, results) => {
    if (error) return res.status(500).json({ erro: 'Erro ao buscar empréstimos' });
    res.json(results);
  });
});

// 🔥 Inicializa o servidor na porta definida
app.listen(porta, () => {
  console.log(`🚀 Servidor rodando na porta ${porta}`);
});
