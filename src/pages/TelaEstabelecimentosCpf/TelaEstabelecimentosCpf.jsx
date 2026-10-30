// Lista estabelecimentos PF (CPF) com busca no banco (LIKE), paginação (70/página)
// e navegação para detalhes via location.state.
import estilo from "./estiloTelaEstabelecimentosCpf.module.css";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router";
import { AiOutlineExport, AiOutlineSearch, AiOutlineSetting } from "react-icons/ai";
import Sidebar from "../../components/Sidebar";
import TopAppBar from "../../components/TopAppBar/TopAppBar";
import { useAuth } from "../../contexts/AuthContext";

function TelaEstabelecimentosCpf() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  let nav = useNavigate();
  const [executou, setExecutou] = useState(false);
  let [dados, setDados] = useState([]);
  let [gerando, setGerando] = useState(false);

  // Busca: valor digitado vs. valor efetivado (enviado à API)
  const [busca, setBusca] = useState("");
  const [buscaAtiva, setBuscaAtiva] = useState("");

  // Paginação
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);

  useEffect(() => {
    setGerando(true);
    api
      .get("estabelecimentos_cpf", {
        params: { busca: buscaAtiva, page: pagina },
      })
      .then(function (response) {
        setDados(response.data.data);
        setTotalPaginas(response.data.meta?.last_page ?? 1);
        setTotalRegistros(response.data.meta?.total ?? response.data.data.length);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setGerando(false);
      });
  }, [executou, buscaAtiva, pagina]);

  function detalhes(dadoId, dadoNome, dadoCategoria, cpf, idcategoria) {
    let dados = {
      id: dadoId,
      nome: dadoNome,
      categoria: dadoCategoria,
      num_doc: cpf,
      tipo: "cpf",
      id_categoria: idcategoria,
    };
    nav("/informacao-estabelecimento", { state: dados });
  }

  function abrirDadosCadastrais(dd) {
    nav("/dados-estabelecimento-cpf", {
      state: {
        id: dd.id,
        categoria: dd.categoria,
        categoria_id: dd.categoria_id,
      },
    });
  }

  async function deletar(e) {
    let iid = e;
    try {
      let response = await api.delete(`estabelecimentos_cpf/${iid}`);
      console.log(response);
      setExecutou((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  }

  function voltar() {
    nav(-1);
  }

  // Botão de busca: efetiva a busca no banco e volta para a página 1
  function buscar() {
    setBuscaAtiva(busca.trim());
    setPagina(1);
  }

  function limparBusca() {
    setBusca("");
    setBuscaAtiva("");
    setPagina(1);
  }

  function paginaAnterior() {
    if (pagina > 1) setPagina(pagina - 1);
  }

  function proximaPagina() {
    if (pagina < totalPaginas) setPagina(pagina + 1);
  }

  return (
    <div className={estilo.page}>
      {/* Topbar */}
      <TopAppBar />

      <div className={estilo.principal}>
        {/* Sidebar */}
        <div
          className={`${estilo.sidebarWrapper} ${
            sidebarOpen ? estilo.sidebarOpen : ""
          }`}
        >
          <Sidebar />
        </div>

        {/* Conteúdo */}
        <div className={estilo.divCentro}>
          <main className={estilo.main}>
            <div className={estilo.container}>
              {/* Page Header */}
              <div className={estilo.pageHeader}>
                <div>
                  <h1 className={estilo.pageTitle}>
                    Estabelecimentos Pessoa Física - CPF
                  </h1>
                  <p className={estilo.pageSubtitle}>
                    Gerencie os estabelecimentos vinculados a CPF
                  </p>
                </div>
                {user?.nivel_acesso === 1 && (
                  <button
                    type="button"
                    className={estilo.btnGerenciarCategorias}
                    onClick={() => nav("/categorias-cpf")}
                  >
                    <AiOutlineSetting size={18} /> Gerenciar Categorias
                  </button>
                )}
              </div>

              {/* Loading */}
              {gerando && (
                <div className={estilo.loadingOverlay}>
                  <span className={estilo.spinner}></span>
                </div>
              )}

              {/* Tabela */}
              <div className={estilo.divTabela}>
                <div className={estilo.divInput}>
                  <div className={estilo.divBusca}>
                    <input
                      type="text"
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && buscar()}
                      placeholder="🔍 Buscar por nome, CPF ou proprietário..."
                    />
                    <button
                      type="button"
                      className={estilo.btnBuscar}
                      onClick={buscar}
                      disabled={gerando}
                    >
                      <AiOutlineSearch size={16} /> Buscar
                    </button>
                    {buscaAtiva !== "" && (
                      <button
                        type="button"
                        className={estilo.btnLimpar}
                        onClick={limparBusca}
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </div>
                <div className={estilo.divTabelaScroll}>
                  <table className={estilo.tabelaEstabelecimnetos}>
                    <thead>
                      <tr>
                        <th>CPF</th>
                        <th>Nome do Estabelecimento</th>
                        <th>Nome do Proprietario</th>
                        <th>Categoria</th>
                        <th>Situação</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {dados.length > 0 &&
                        dados.map((dd) => (
                          <tr key={dd.id}>
                            <td>{dd.cpf}</td>
                            <td
                              className={estilo.linkEstabelecimento}
                              onClick={() => abrirDadosCadastrais(dd)}
                            >
                              {dd.nome_fantasia}
                            </td>
                            <td>{dd.nome}</td>
                            <td>
                              {dd.categoria}/{dd.tipo_estb}
                            </td>
                            {dd.indexSit == 0 && (
                              <td className={estilo.sitPendente}>
                                {dd.situacao}
                              </td>
                            )}
                            {dd.indexSit == 1 && (
                              <td className={estilo.sitRegular}>
                                {dd.situacao}
                              </td>
                            )}
                            {dd.indexSit == 3 && (
                              <td className={estilo.sitIrregular}>
                                {dd.situacao}
                              </td>
                            )}
                            {dd.indexSit == 4 && (
                              <td className={estilo.sitPendente}>
                                {dd.situacao}
                              </td>
                            )}
                            <td>
                              <div className={estilo.tdAcao}>
                                <AiOutlineExport
                                  size={25}
                                  className={estilo.iconeAcao}
                                  onClick={() =>
                                    detalhes(
                                      dd.id,
                                      dd.nome_fantasia,
                                      dd.categoria,
                                      dd.cpf,
                                      dd.categoria_id
                                    )
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      {dados.length == 0 && (
                        <tr>
                          <td className={estilo.emptyState} colSpan={6}>
                            Nenhum estabelecimento encontrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Paginação */}
                <div className={estilo.paginacao}>
                  <button
                    type="button"
                    onClick={paginaAnterior}
                    disabled={pagina <= 1 || gerando}
                  >
                    Anterior
                  </button>
                  <span>
                    Página {pagina} de {totalPaginas} · {totalRegistros}{" "}
                    registro(s)
                  </span>
                  <button
                    type="button"
                    onClick={proximaPagina}
                    disabled={pagina >= totalPaginas || gerando}
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default TelaEstabelecimentosCpf;
