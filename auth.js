// auth.js — Sistema de Autenticação Seguro

// Simples hash SHA256 para senhas (compatível com browsers)
async function hashSenha(senha) {
  const encoder = new TextEncoder();
  const data = encoder.encode(senha);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Inicializar com um usuário padrão na primeira vez
function inicializarUsuarios() {
  if (!localStorage.getItem('fz_usuarios')) {
    const usuariosPadrao = [
      {
        id: 1,
        email: 'admin@fzaquarismo.com',
        senha: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', // hash de "123456"
        nome: 'Administrador FZ',
        criadoEm: new Date().toISOString()
      }
    ];
    localStorage.setItem('fz_usuarios', JSON.stringify(usuariosPadrao));
  }
}

// Obter todos os usuários
function obterUsuarios() {
  const usuarios = localStorage.getItem('fz_usuarios');
  return usuarios ? JSON.parse(usuarios) : [];
}

// Salvar usuários
function salvarUsuarios(usuarios) {
  localStorage.setItem('fz_usuarios', JSON.stringify(usuarios));
}

// Verificar se email já existe
function emailJaExiste(email) {
  const usuarios = obterUsuarios();
  return usuarios.some(u => u.email.toLowerCase() === email.toLowerCase());
}

// Cadastrar novo usuário
async function cadastrarUsuario(email, senha, nome) {
  if (!email || !senha || !nome) {
    return { sucesso: false, erro: 'Todos os campos são obrigatórios' };
  }

  if (senha.length < 6) {
    return { sucesso: false, erro: 'Senha deve ter pelo menos 6 caracteres' };
  }

  if (emailJaExiste(email)) {
    return { sucesso: false, erro: 'Este email já está cadastrado' };
  }

  const senhaHash = await hashSenha(senha);
  const usuarios = obterUsuarios();

  const novoUsuario = {
    id: Math.max(0, ...usuarios.map(u => u.id)) + 1,
    email: email.toLowerCase(),
    senha: senhaHash,
    nome: nome,
    criadoEm: new Date().toISOString()
  };

  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);

  return { sucesso: true, usuario: novoUsuario };
}

// Fazer login
async function fazerLogin(email, senha) {
  if (!email || !senha) {
    return { sucesso: false, erro: 'Email e senha são obrigatórios' };
  }

  const senhaHash = await hashSenha(senha);
  const usuarios = obterUsuarios();
  const usuario = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!usuario || usuario.senha !== senhaHash) {
    return { sucesso: false, erro: 'Email ou senha incorretos' };
  }

  // Salvar sessão
  sessionStorage.setItem('fz_usuario_logado', JSON.stringify({
    id: usuario.id,
    email: usuario.email,
    nome: usuario.nome
  }));

  return { sucesso: true, usuario: { id: usuario.id, nome: usuario.nome } };
}

// Obter usuário logado
function obterUsuarioLogado() {
  const usuario = sessionStorage.getItem('fz_usuario_logado');
  return usuario ? JSON.parse(usuario) : null;
}

// Fazer logout
function fazerLogout() {
  sessionStorage.removeItem('fz_usuario_logado');
}

// Alterar senha
async function alterarSenha(email, senhaAtual, novaSenha) {
  if (!email || !senhaAtual || !novaSenha) {
    return { sucesso: false, erro: 'Todos os campos são obrigatórios' };
  }

  if (novaSenha.length < 6) {
    return { sucesso: false, erro: 'Nova senha deve ter pelo menos 6 caracteres' };
  }

  const senhaAtualHash = await hashSenha(senhaAtual);
  const usuarios = obterUsuarios();
  const usuario = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!usuario || usuario.senha !== senhaAtualHash) {
    return { sucesso: false, erro: 'Senha atual incorreta' };
  }

  if (senhaAtualHash === await hashSenha(novaSenha)) {
    return { sucesso: false, erro: 'Nova senha deve ser diferente da atual' };
  }

  const novaSenhaHash = await hashSenha(novaSenha);
  usuario.senha = novaSenhaHash;
  salvarUsuarios(usuarios);

  return { sucesso: true, mensagem: 'Senha alterada com sucesso' };
}

// Inicializar ao carregar
inicializarUsuarios();
