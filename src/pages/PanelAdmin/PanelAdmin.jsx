import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import estilo from './estiloPanelAdmin.module.css';

function PanelAdmin() {
  const [abaAtiva, setAbaAtiva] = useState('cadastrar');
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Estado do formulário de cadastro/edição
  const [form, setForm] = useState({
    name: '',
    name_user: '',
    password: '',
    nivel_acesso: 2,
  });

  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  // Estado do modal de exclusão
  const [excluirId, setExcluirId] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  // Carregar usuários ao montar o componente
  const carregarUsuarios = async () => {
    setCarregando(true);
    setErro('');
    try {
      const data = await userService.getUsers();
      setUsuarios(data);
    } catch (err) {
      setErro('Erro ao carregar usuários.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  // Limpar mensagens após 3 segundos
  useEffect(() => {
    if (sucesso || erro) {
      const timer = setTimeout(() => {
        setSucesso('');
        setErro('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [sucesso, erro]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    setSucesso('');

    try {
      if (editandoId) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await userService.updateUser(editandoId, payload);
        setSucesso('Usuário atualizado com sucesso!');
      } else {
        await userService.createUser(form);
        setSucesso('Usuário cadastrado com sucesso!');
      }

      setForm({ name: '', name_user: '', password: '', nivel_acesso: 2 });
      setEditandoId(null);
      carregarUsuarios();
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao salvar usuário.');
    } finally {
      setSalvando(false);
    }
  };

  const handleEditar = (usuario) => {
    setForm({
      name: usuario.name || '',
      name_user: usuario.name_user || '',
      password: '',
      nivel_acesso: usuario.nivel_acesso || 2,
    });
    setEditandoId(usuario.id);
    setAbaAtiva('cadastrar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelarEdicao = () => {
    setForm({ name: '', name_user: '', password: '', nivel_acesso: 2 });
    setEditandoId(null);
  };

  const handleConfirmarExclusao = async () => {
    if (!excluirId) return;
    setExcluindo(true);
    setErro('');
    try {
      await userService.deleteUser(excluirId);
      setSucesso('Usuário removido com sucesso!');
      setExcluirId(null);
      carregarUsuarios();
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao remover usuário.');
    } finally {
      setExcluindo(false);
    }
  };

  const nivelLabel = (nivel) => {
    switch (nivel) {
      case 1: return 'Admin';
      case 2: return 'Técnico Visa';
      default: return `Nível ${nivel}`;
    }
  };

  const nivelClasse = (nivel) => {
    switch (nivel) {
      case 1: return `${estilo.badgeNivel} ${estilo.badgeAdmin}`;
      case 2: return `${estilo.badgeNivel} ${estilo.badgeTecnico}`;
      default: return estilo.badgeNivel;
    }
  };

  return (
    <div className={estilo.divPrincipal}>
      <div className={estilo.container}>
        <h1 className={estilo.titulo}>Painel Administrativo</h1>
        <p className={estilo.subtitulo}>Gerencie os usuários do sistema</p>

        {/* Abas */}
        <div className={estilo.abas}>
          <button
            className={`${estilo.aba} ${abaAtiva === 'cadastrar' ? estilo.abaAtiva : ''}`}
            onClick={() => setAbaAtiva('cadastrar')}
          >
            {editandoId ? 'Editar Usuário' : 'Cadastrar Usuário'}
          </button>
          <button
            className={`${estilo.aba} ${abaAtiva === 'listar' ? estilo.abaAtiva : ''}`}
            onClick={() => setAbaAtiva('listar')}
          >
            Listar Usuários
          </button>
        </div>

        {/* Mensagens */}
        {erro && <p className={estilo.erro}>{erro}</p>}
        {sucesso && <p className={estilo.sucesso}>{sucesso}</p>}

        {/* Aba Cadastrar */}
        {abaAtiva === 'cadastrar' && (
          <div className={estilo.card}>
            <h2 className={estilo.cardTitulo}>
              {editandoId ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className={estilo.formGrid}>
                <div className={estilo.campoGrupo}>
                  <label className={estilo.label} htmlFor="name">Nome</label>
                  <input
                    className={estilo.input}
                    type="text"
                    id="name"
                    placeholder="Nome completo"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className={estilo.campoGrupo}>
                  <label className={estilo.label} htmlFor="name_user">Usuário</label>
                  <input
                    className={estilo.input}
                    type="text"
                    id="name_user"
                    placeholder="Nome de usuário"
                    value={form.name_user}
                    onChange={(e) => setForm({ ...form, name_user: e.target.value })}
                    required
                  />
                </div>

                <div className={estilo.campoGrupo}>
                  <label className={estilo.label} htmlFor="password">
                    {editandoId ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
                  </label>
                  <input
                    className={estilo.input}
                    type="password"
                    id="password"
                    placeholder={editandoId ? 'Deixe em branco para manter' : 'Digite a senha'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required={!editandoId}
                  />
                </div>

                <div className={estilo.campoGrupo}>
                  <label className={estilo.label} htmlFor="nivel_acesso">Nível de Acesso</label>
                  <select
                    className={estilo.select}
                    id="nivel_acesso"
                    value={form.nivel_acesso}
                    onChange={(e) => setForm({ ...form, nivel_acesso: Number(e.target.value) })}
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>Técnico Visa</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 12, gridColumn: '1 / -1' }}>
                  <button className={estilo.btnPrimario} type="submit" disabled={salvando}>
                    {salvando ? 'Salvando...' : editandoId ? 'Atualizar' : 'Cadastrar'}
                  </button>
                  {editandoId && (
                    <button
                      type="button"
                      className={estilo.btnCancelar}
                      onClick={handleCancelarEdicao}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Aba Listar */}
        {abaAtiva === 'listar' && (
          <div className={estilo.card}>
            <h2 className={estilo.cardTitulo}>Usuários Cadastrados</h2>

            {carregando ? (
              <p className={estilo.carregando}>Carregando usuários...</p>
            ) : usuarios.length === 0 ? (
              <p style={{ color: '#6b7280' }}>Nenhum usuário encontrado.</p>
            ) : (
              <div className={estilo.tabelaWrapper}>
                <table className={estilo.tabela}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Usuário</th>
                      <th>Nível de Acesso</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>{usuario.id}</td>
                        <td>{usuario.name}</td>
                        <td>{usuario.name_user}</td>
                        <td>
                          <span className={nivelClasse(usuario.nivel_acesso)}>
                            {nivelLabel(usuario.nivel_acesso)}
                          </span>
                        </td>
                        <td>
                          <div className={estilo.botoesAcao}>
                            <button
                              className={estilo.btnEditar}
                              onClick={() => handleEditar(usuario)}
                            >
                              Editar
                            </button>
                            <button
                              className={estilo.btnExcluir}
                              onClick={() => setExcluirId(usuario.id)}
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal de confirmação de exclusão */}
        {excluirId && (
          <div className={estilo.modalOverlay} onClick={() => setExcluirId(null)}>
            <div className={estilo.modal} onClick={(e) => e.stopPropagation()}>
              <h3>Confirmar Exclusão</h3>
              <p>Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.</p>
              <div className={estilo.modalBotoes}>
                <button
                  className={estilo.btnCancelar}
                  onClick={() => setExcluirId(null)}
                  disabled={excluindo}
                >
                  Cancelar
                </button>
                <button
                  className={estilo.btnConfirmarExcluir}
                  onClick={handleConfirmarExclusao}
                  disabled={excluindo}
                >
                  {excluindo ? 'Excluindo...' : 'Confirmar Exclusão'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PanelAdmin;
