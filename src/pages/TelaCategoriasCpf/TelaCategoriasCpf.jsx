// Página de gerenciamento de Categorias CPF e de seus documentos (doc_categoria_cpf) — acesso restrito a Admin (nível 1).
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  AiOutlineArrowLeft,
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineSearch,
  AiOutlineFileText,
  AiOutlineFolderOpen,
} from "react-icons/ai";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import TopAppBar from "../../components/TopAppBar/TopAppBar";
import estilo from "./estiloTelaCategoriasCpf.module.css";

function TelaCategoriasCpf() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nav = useNavigate();

  // Estado das categorias e seleção ativa
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionadaId, setCategoriaSelecionadaId] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [buscaCategoria, setBuscaCategoria] = useState("");

  // Mensagens de feedback
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Criação de nova categoria
  const [novaCategoriaNome, setNovaCategoriaNome] = useState("");
  const [criandoCategoria, setCriandoCategoria] = useState(false);

  // Edição inline de nome de categoria
  const [editandoCategoriaId, setEditandoCategoriaId] = useState(null);
  const [nomeCategoriaEditado, setNomeCategoriaEditado] = useState("");
  const [salvandoCategoria, setSalvandoCategoria] = useState(false);

  // Exclusão de categoria (modal)
  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState(null);
  const [excluindoCategoria, setExcluindoCategoria] = useState(false);

  // Adição de novo documento na categoria selecionada
  const [novoDocNome, setNovoDocNome] = useState("");
  const [novoDocFixo, setNovoDocFixo] = useState(false);
  const [adicionandoDoc, setAdicionandoDoc] = useState(false);

  // Edição inline de documento da categoria
  const [docEmEdicaoOriginal, setDocEmEdicaoOriginal] = useState(null);
  const [docEditNome, setDocEditNome] = useState("");
  const [docEditFixo, setDocEditFixo] = useState(false);
  const [salvandoDoc, setSalvandoDoc] = useState(false);

  // Exclusão de documento (modal)
  const [docParaExcluir, setDocParaExcluir] = useState(null);
  const [excluindoDoc, setExcluindoDoc] = useState(false);

  // Limpa alertas automaticamente após 4 segundos
  useEffect(() => {
    if (sucesso || erro) {
      const timer = setTimeout(() => {
        setSucesso("");
        setErro("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [sucesso, erro]);

  const carregarCategorias = async (idParaSelecionar = null) => {
    setCarregando(true);
    try {
      const response = await api.get("categorias_cpf");
      const lista = response.data || [];
      setCategorias(lista);

      if (idParaSelecionar) {
        setCategoriaSelecionadaId(idParaSelecionar);
      } else if (
        categoriaSelecionadaId &&
        lista.some((c) => c.id_categoria === categoriaSelecionadaId)
      ) {
        setCategoriaSelecionadaId(categoriaSelecionadaId);
      } else if (lista.length > 0) {
        setCategoriaSelecionadaId(lista[0].id_categoria);
      } else {
        setCategoriaSelecionadaId(null);
      }
    } catch (err) {
      setErro(
        err.response?.data?.Error ||
          err.response?.data?.message ||
          "Erro ao carregar categorias CPF."
      );
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const categoriaSelecionada = categorias.find(
    (c) => c.id_categoria === categoriaSelecionadaId
  );

  const categoriasFiltradas = categorias.filter((c) =>
    (c.nome_categoria || "")
      .toLowerCase()
      .includes(buscaCategoria.trim().toLowerCase())
  );

  // Criar nova categoria CPF (já vem com Requerimento e Licença de Funcionamento do backend)
  const handleCriarCategoria = async (e) => {
    e.preventDefault();
    const nome = novaCategoriaNome.trim();
    if (!nome) return;

    setCriandoCategoria(true);
    setErro("");
    setSucesso("");

    try {
      const response = await api.post("categorias_cpf", {
        nome_categoria: nome,
      });
      const novaCat = response.data.categoria;
      setCategorias((prev) => [...prev, novaCat]);
      setCategoriaSelecionadaId(novaCat.id_categoria);
      setNovaCategoriaNome("");
      setDocEmEdicaoOriginal(null);
      setSucesso(
        `Categoria "${novaCat.nome_categoria}" criada com 'Requerimento' e 'Licença de Funcionamento'!`
      );
    } catch (err) {
      const msg =
        err.response?.data?.errors?.nome_categoria?.[0] ||
        err.response?.data?.Error ||
        err.response?.data?.message ||
        "Erro ao criar categoria.";
      setErro(msg);
    } finally {
      setCriandoCategoria(false);
    }
  };

  // Iniciar edição do nome da categoria
  const iniciarEdicaoCategoria = (cat, e) => {
    e.stopPropagation();
    setEditandoCategoriaId(cat.id_categoria);
    setNomeCategoriaEditado(cat.nome_categoria);
  };

  const cancelarEdicaoCategoria = (e) => {
    if (e) e.stopPropagation();
    setEditandoCategoriaId(null);
    setNomeCategoriaEditado("");
  };

  const salvarEdicaoCategoria = async (idCategoria, e) => {
    if (e) e.stopPropagation();
    const nome = nomeCategoriaEditado.trim();
    if (!nome) return;

    setSalvandoCategoria(true);
    setErro("");
    setSucesso("");

    try {
      const response = await api.put(`categorias_cpf/${idCategoria}`, {
        nome_categoria: nome,
      });
      const catAtualizada = response.data.categoria;
      setCategorias((prev) =>
        prev.map((c) =>
          c.id_categoria === idCategoria ? catAtualizada : c
        )
      );
      setEditandoCategoriaId(null);
      setNomeCategoriaEditado("");
      setSucesso("Nome da categoria atualizado com sucesso!");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.nome_categoria?.[0] ||
        err.response?.data?.Error ||
        err.response?.data?.message ||
        "Erro ao atualizar categoria.";
      setErro(msg);
    } finally {
      setSalvandoCategoria(false);
    }
  };

  // Confirmar exclusão de categoria
  const handleConfirmarExclusaoCategoria = async () => {
    if (!categoriaParaExcluir) return;
    setExcluindoCategoria(true);
    setErro("");
    setSucesso("");

    try {
      const idExcluido = categoriaParaExcluir.id_categoria;
      await api.delete(`categorias_cpf/${idExcluido}`);
      const novaLista = categorias.filter(
        (c) => c.id_categoria !== idExcluido
      );
      setCategorias(novaLista);
      if (categoriaSelecionadaId === idExcluido) {
        setCategoriaSelecionadaId(
          novaLista.length > 0 ? novaLista[0].id_categoria : null
        );
      }
      setCategoriaParaExcluir(null);
      setSucesso("Categoria excluída com sucesso!");
    } catch (err) {
      const msg =
        err.response?.data?.Error ||
        err.response?.data?.message ||
        "Erro ao excluir categoria.";
      setErro(msg);
      setCategoriaParaExcluir(null);
    } finally {
      setExcluindoCategoria(false);
    }
  };

  // Adicionar documento à categoria selecionada
  const handleAdicionarDocumento = async (e) => {
    e.preventDefault();
    if (!categoriaSelecionadaId) return;
    const nome = novoDocNome.trim();
    if (!nome) return;

    setAdicionandoDoc(true);
    setErro("");
    setSucesso("");

    try {
      const response = await api.post(
        `categorias_cpf/${categoriaSelecionadaId}/documentos`,
        {
          nome_doc: nome,
          fixo: novoDocFixo,
        }
      );

      const novosDocs = response.data.documentos || [];
      setCategorias((prev) =>
        prev.map((c) =>
          c.id_categoria === categoriaSelecionadaId
            ? { ...c, doc_categoria: novosDocs }
            : c
        )
      );
      setNovoDocNome("");
      setNovoDocFixo(false);
      setSucesso("Documento adicionado à categoria!");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.nome_doc?.[0] ||
        err.response?.data?.Error ||
        err.response?.data?.message ||
        "Erro ao adicionar documento.";
      setErro(msg);
    } finally {
      setAdicionandoDoc(false);
    }
  };

  // Iniciar edição de documento
  const iniciarEdicaoDoc = (doc) => {
    setDocEmEdicaoOriginal(doc.nome_doc);
    setDocEditNome(doc.nome_doc);
    setDocEditFixo(Boolean(doc.fixo));
  };

  const cancelarEdicaoDoc = () => {
    setDocEmEdicaoOriginal(null);
    setDocEditNome("");
    setDocEditFixo(false);
  };

  // Salvar edição de documento
  const salvarEdicaoDoc = async () => {
    if (!categoriaSelecionadaId || !docEmEdicaoOriginal) return;
    const nome = docEditNome.trim();
    if (!nome) return;

    setSalvandoDoc(true);
    setErro("");
    setSucesso("");

    try {
      const response = await api.put(
        `categorias_cpf/${categoriaSelecionadaId}/documentos`,
        {
          nome_doc_original: docEmEdicaoOriginal,
          nome_doc: nome,
          fixo: docEditFixo,
        }
      );

      const novosDocs = response.data.documentos || [];
      setCategorias((prev) =>
        prev.map((c) =>
          c.id_categoria === categoriaSelecionadaId
            ? { ...c, doc_categoria: novosDocs }
            : c
        )
      );
      setDocEmEdicaoOriginal(null);
      setSucesso("Documento atualizado com sucesso!");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.nome_doc?.[0] ||
        err.response?.data?.Error ||
        err.response?.data?.message ||
        "Erro ao atualizar documento.";
      setErro(msg);
    } finally {
      setSalvandoDoc(false);
    }
  };

  // Confirmar remoção de documento
  const handleConfirmarExclusaoDoc = async () => {
    if (!categoriaSelecionadaId || !docParaExcluir) return;
    setExcluindoDoc(true);
    setErro("");
    setSucesso("");

    try {
      const response = await api.delete(
        `categorias_cpf/${categoriaSelecionadaId}/documentos`,
        {
          data: { nome_doc: docParaExcluir.nome_doc },
        }
      );

      const novosDocs = response.data.documentos || [];
      setCategorias((prev) =>
        prev.map((c) =>
          c.id_categoria === categoriaSelecionadaId
            ? { ...c, doc_categoria: novosDocs }
            : c
        )
      );
      setDocParaExcluir(null);
      setSucesso("Documento removido da categoria!");
    } catch (err) {
      const msg =
        err.response?.data?.Error ||
        err.response?.data?.message ||
        "Erro ao remover documento.";
      setErro(msg);
      setDocParaExcluir(null);
    } finally {
      setExcluindoDoc(false);
    }
  };

  return (
    <div className={estilo.page}>
      <TopAppBar />

      <div className={estilo.principal}>
        <div
          className={`${estilo.sidebarWrapper} ${
            sidebarOpen ? estilo.sidebarOpen : ""
          }`}
        >
          <Sidebar />
        </div>

        <div className={estilo.divCentro}>
          <main className={estilo.main}>
            <div className={estilo.container}>
              {/* Cabeçalho */}
              <div className={estilo.pageHeader}>
                <div>
                  <h1 className={estilo.pageTitle}>
                    Categorias e Documentos - CPF
                  </h1>
                  <p className={estilo.pageSubtitle}>
                    Adicione novas categorias CPF e gerencie os documentos exigidos por cada categoria
                  </p>
                </div>
                <button
                  type="button"
                  className={estilo.btnVoltar}
                  onClick={() => nav("/estabelecimentos-cpf")}
                >
                  <AiOutlineArrowLeft size={16} /> Voltar para Estabelecimentos
                </button>
              </div>

              {/* Alertas */}
              {erro && <div className={estilo.alertaErro}>{erro}</div>}
              {sucesso && <div className={estilo.alertaSucesso}>{sucesso}</div>}

              {carregando ? (
                <div className={estilo.loadingOverlay}>
                  <span className={estilo.spinner}></span>
                </div>
              ) : (
                <div className={estilo.painelDuasColunas}>
                  {/* COLUNA ESQUERDA: LISTA E CRIAÇÃO DE CATEGORIAS */}
                  <section className={estilo.colunaCategorias}>
                    <div className={estilo.cardHeader}>
                      <h2 className={estilo.cardTitle}>
                        <AiOutlineFolderOpen size={20} /> Categorias CPF ({categorias.length})
                      </h2>
                    </div>

                    {/* Formulário rápido para nova categoria */}
                    <form
                      className={estilo.formNovaCategoria}
                      onSubmit={handleCriarCategoria}
                    >
                      <label className={estilo.labelMenor}>
                        + Nova Categoria CPF
                      </label>
                      <div className={estilo.inputRow}>
                        <input
                          type="text"
                          className={estilo.input}
                          placeholder="Ex.: Microempreendedor..."
                          value={novaCategoriaNome}
                          onChange={(e) => setNovaCategoriaNome(e.target.value)}
                          maxLength={150}
                          required
                        />
                        <button
                          type="submit"
                          className={estilo.btnPrimario}
                          disabled={criandoCategoria || !novaCategoriaNome.trim()}
                        >
                          <AiOutlinePlus size={16} />{" "}
                          {criandoCategoria ? "Criando..." : "Criar"}
                        </button>
                      </div>
                      <span className={estilo.dicaTexto}>
                        Cria automaticamente &quot;Requerimento&quot; e &quot;Licença de Funcionamento&quot;.
                      </span>
                    </form>

                    {/* Busca de categorias */}
                    <div className={estilo.buscaCategoriaBox}>
                      <AiOutlineSearch
                        size={16}
                        className={estilo.iconeBusca}
                      />
                      <input
                        type="text"
                        className={estilo.inputBusca}
                        placeholder="Filtrar categorias..."
                        value={buscaCategoria}
                        onChange={(e) => setBuscaCategoria(e.target.value)}
                      />
                    </div>

                    {/* Lista de categorias */}
                    <div className={estilo.listaCategorias}>
                      {categoriasFiltradas.length === 0 ? (
                        <p className={estilo.emptyState}>
                          Nenhuma categoria encontrada.
                        </p>
                      ) : (
                        categoriasFiltradas.map((cat) => {
                          const selecionada =
                            cat.id_categoria === categoriaSelecionadaId;
                          const emEdicao =
                            editandoCategoriaId === cat.id_categoria;
                          const qtdDocs = cat.doc_categoria?.length ?? 0;
                          const qtdEstab = cat.estabelecimentos_count ?? 0;

                          return (
                            <div
                              key={cat.id_categoria}
                              className={`${estilo.itemCategoria} ${
                                selecionada ? estilo.itemCategoriaAtiva : ""
                              }`}
                              onClick={() => {
                                setCategoriaSelecionadaId(cat.id_categoria);
                                setDocEmEdicaoOriginal(null);
                              }}
                            >
                              {emEdicao ? (
                                <div
                                  className={estilo.edicaoCategoriaBox}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="text"
                                    className={estilo.inputEdicao}
                                    value={nomeCategoriaEditado}
                                    onChange={(e) =>
                                      setNomeCategoriaEditado(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        salvarEdicaoCategoria(cat.id_categoria, e);
                                      } else if (e.key === "Escape") {
                                        cancelarEdicaoCategoria(e);
                                      }
                                    }}
                                    autoFocus
                                  />
                                  <button
                                    type="button"
                                    className={estilo.btnIconSalvar}
                                    title="Salvar nome"
                                    disabled={salvandoCategoria}
                                    onClick={(e) =>
                                      salvarEdicaoCategoria(cat.id_categoria, e)
                                    }
                                  >
                                    <AiOutlineCheck size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    className={estilo.btnIconCancelar}
                                    title="Cancelar"
                                    onClick={cancelarEdicaoCategoria}
                                  >
                                    <AiOutlineClose size={16} />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div className={estilo.infoCategoria}>
                                    <span className={estilo.nomeCategoria}>
                                      {cat.nome_categoria}
                                    </span>
                                    <div className={estilo.metaCategoria}>
                                      <span className={estilo.badgeContagem}>
                                        {qtdDocs} doc(s)
                                      </span>
                                      <span className={estilo.badgeEstab}>
                                        {qtdEstab} estab.
                                      </span>
                                    </div>
                                  </div>
                                  <div className={estilo.acoesCategoria}>
                                    <button
                                      type="button"
                                      className={estilo.btnIconAcao}
                                      title="Renomear categoria"
                                      onClick={(e) =>
                                        iniciarEdicaoCategoria(cat, e)
                                      }
                                    >
                                      <AiOutlineEdit size={17} />
                                    </button>
                                    <button
                                      type="button"
                                      className={`${estilo.btnIconExcluir} ${
                                        qtdEstab > 0
                                          ? estilo.btnIconDesabilitado
                                          : ""
                                      }`}
                                      title={
                                        qtdEstab > 0
                                          ? `Não pode ser excluída (${qtdEstab} estabelecimento(s) vinculado(s))`
                                          : "Excluir categoria"
                                      }
                                      disabled={qtdEstab > 0}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (qtdEstab === 0) {
                                          setCategoriaParaExcluir(cat);
                                        }
                                      }}
                                    >
                                      <AiOutlineDelete size={17} />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </section>

                  {/* COLUNA DIREITA: DOCUMENTOS DA CATEGORIA SELECIONADA */}
                  <section className={estilo.colunaDocumentos}>
                    {!categoriaSelecionada ? (
                      <div className={estilo.emptyStatePainel}>
                        Selecione uma categoria à esquerda ou crie uma nova para gerenciar seus documentos.
                      </div>
                    ) : (
                      <>
                        <div className={estilo.cardHeaderDireito}>
                          <div>
                            <h2 className={estilo.cardTitle}>
                              <AiOutlineFileText size={20} /> Documentos:{" "}
                              <span className={estilo.destaqueCategoria}>
                                {categoriaSelecionada.nome_categoria}
                              </span>
                            </h2>
                            <p className={estilo.cardSubtitulo}>
                              {categoriaSelecionada.doc_categoria?.length ?? 0}{" "}
                              documento(s) configurado(s) para esta categoria
                            </p>
                          </div>
                        </div>

                        {/* Formulário para adicionar novo documento à categoria */}
                        <form
                          className={estilo.formNovoDoc}
                          onSubmit={handleAdicionarDocumento}
                        >
                          <div className={estilo.campoNovoDocNome}>
                            <label className={estilo.labelMenor}>
                              Nome do Novo Documento
                            </label>
                            <input
                              type="text"
                              className={estilo.input}
                              placeholder="Ex.: CPF, RG, Alvará de Tributos, Licença do Corpo de Bombeiros..."
                              value={novoDocNome}
                              onChange={(e) => setNovoDocNome(e.target.value)}
                              maxLength={200}
                              required
                            />
                          </div>

                          <div className={estilo.campoNovoDocTipo}>
                            <label className={estilo.labelMenor}>
                              Tipo
                            </label>
                            <select
                              className={estilo.select}
                              value={novoDocFixo ? "1" : "0"}
                              onChange={(e) =>
                                setNovoDocFixo(e.target.value === "1")
                              }
                            >
                              <option value="0">
                                Anual / Renovável
                              </option>
                              <option value="1">
                                Fixo / Permanente
                              </option>
                            </select>
                          </div>

                          <div className={estilo.campoNovoDocBotao}>
                            <button
                              type="submit"
                              className={estilo.btnPrimario}
                              disabled={adicionandoDoc || !novoDocNome.trim()}
                            >
                              <AiOutlinePlus size={16} />{" "}
                              {adicionandoDoc
                                ? "Adicionando..."
                                : "Adicionar Documento"}
                            </button>
                          </div>
                        </form>

                        {/* Tabela de documentos da categoria */}
                        <div className={estilo.tabelaWrapper}>
                          <table className={estilo.tabelaDocs}>
                            <thead>
                              <tr>
                                <th>Nome do Documento</th>
                                <th className={estilo.colTipo}>Tipo</th>
                                <th className={estilo.colAcoes}>Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {!categoriaSelecionada.doc_categoria ||
                              categoriaSelecionada.doc_categoria.length === 0 ? (
                                <tr>
                                  <td colSpan={3} className={estilo.emptyState}>
                                    Nenhum documento cadastrado nesta categoria.
                                  </td>
                                </tr>
                              ) : (
                                categoriaSelecionada.doc_categoria.map(
                                  (doc, idx) => {
                                    const editandoEste =
                                      docEmEdicaoOriginal === doc.nome_doc;

                                    return (
                                      <tr key={`${doc.nome_doc}-${idx}`}>
                                        {editandoEste ? (
                                          <>
                                            <td>
                                              <input
                                                type="text"
                                                className={estilo.input}
                                                value={docEditNome}
                                                onChange={(e) =>
                                                  setDocEditNome(e.target.value)
                                                }
                                                onKeyDown={(e) => {
                                                  if (e.key === "Enter") {
                                                    salvarEdicaoDoc();
                                                  } else if (
                                                    e.key === "Escape"
                                                  ) {
                                                    cancelarEdicaoDoc();
                                                  }
                                                }}
                                                maxLength={200}
                                                autoFocus
                                              />
                                            </td>
                                            <td>
                                              <select
                                                className={estilo.select}
                                                value={docEditFixo ? "1" : "0"}
                                                onChange={(e) =>
                                                  setDocEditFixo(
                                                    e.target.value === "1"
                                                  )
                                                }
                                              >
                                                <option value="0">
                                                  Anual / Renovável
                                                </option>
                                                <option value="1">
                                                  Fixo / Permanente
                                                </option>
                                              </select>
                                            </td>
                                            <td>
                                              <div className={estilo.botoesAcao}>
                                                <button
                                                  type="button"
                                                  className={estilo.btnSalvar}
                                                  onClick={salvarEdicaoDoc}
                                                  disabled={salvandoDoc}
                                                >
                                                  {salvandoDoc
                                                    ? "Salvando..."
                                                    : "Salvar"}
                                                </button>
                                                <button
                                                  type="button"
                                                  className={estilo.btnCancelar}
                                                  onClick={cancelarEdicaoDoc}
                                                >
                                                  Cancelar
                                                </button>
                                              </div>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td className={estilo.tdNomeDoc}>
                                              {doc.nome_doc}
                                            </td>
                                            <td>
                                              <span
                                                className={
                                                  doc.fixo
                                                    ? estilo.badgeFixo
                                                    : estilo.badgeAnual
                                                }
                                              >
                                                {doc.fixo
                                                  ? "Fixo / Permanente"
                                                  : "Anual / Renovável"}
                                              </span>
                                            </td>
                                            <td>
                                              <div className={estilo.botoesAcao}>
                                                <button
                                                  type="button"
                                                  className={estilo.btnEditar}
                                                  onClick={() =>
                                                    iniciarEdicaoDoc(doc)
                                                  }
                                                >
                                                  <AiOutlineEdit size={15} />{" "}
                                                  Editar
                                                </button>
                                                <button
                                                  type="button"
                                                  className={estilo.btnExcluir}
                                                  onClick={() =>
                                                    setDocParaExcluir(doc)
                                                  }
                                                >
                                                  <AiOutlineDelete size={15} />{" "}
                                                  Remover
                                                </button>
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                    );
                                  }
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </section>
                </div>
              )}

              {/* Modal de confirmação de exclusão de categoria */}
              {categoriaParaExcluir && (
                <div
                  className={estilo.modalOverlay}
                  onClick={() => setCategoriaParaExcluir(null)}
                >
                  <div
                    className={estilo.modal}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3>Excluir Categoria CPF</h3>
                    <p>
                      Tem certeza que deseja excluir a categoria{" "}
                      <strong>{categoriaParaExcluir.nome_categoria}</strong> e
                      todos os seus documentos vinculados?
                    </p>
                    <div className={estilo.modalBotoes}>
                      <button
                        type="button"
                        className={estilo.btnCancelar}
                        onClick={() => setCategoriaParaExcluir(null)}
                        disabled={excluindoCategoria}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className={estilo.btnConfirmarExcluir}
                        onClick={handleConfirmarExclusaoCategoria}
                        disabled={excluindoCategoria}
                      >
                        {excluindoCategoria
                          ? "Excluindo..."
                          : "Confirmar Exclusão"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal de confirmação de remoção de documento */}
              {docParaExcluir && (
                <div
                  className={estilo.modalOverlay}
                  onClick={() => setDocParaExcluir(null)}
                >
                  <div
                    className={estilo.modal}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3>Remover Documento da Categoria</h3>
                    <p>
                      Tem certeza que deseja remover o documento{" "}
                      <strong>{docParaExcluir.nome_doc}</strong> da categoria{" "}
                      <strong>{categoriaSelecionada?.nome_categoria}</strong>?
                    </p>
                    <div className={estilo.modalBotoes}>
                      <button
                        type="button"
                        className={estilo.btnCancelar}
                        onClick={() => setDocParaExcluir(null)}
                        disabled={excluindoDoc}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className={estilo.btnConfirmarExcluir}
                        onClick={handleConfirmarExclusaoDoc}
                        disabled={excluindoDoc}
                      >
                        {excluindoDoc ? "Removendo..." : "Confirmar Remoção"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default TelaCategoriasCpf;

