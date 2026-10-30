// Lista estabelecimentos PJ (CNPJ) com busca no banco (LIKE), paginação (70/página)
// e navegação para detalhes via location.state.
import estilo from "./estiloTelaEstabelecimentosCnpj.module.css";
import { AiOutlineExport, AiOutlineSearch, AiOutlineSetting } from "react-icons/ai";
import { useNavigate } from "react-router";
import api from "../../services/api";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopAppBar from "../../components/TopAppBar/TopAppBar";
import { useAuth } from "../../contexts/AuthContext";

function TelaEstabelecimentosCnpj() {
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
      .get("estabelecimentos_cnpj", {
        params: { busca: buscaAtiva, page: pagina },
      })
      .then(function (response) {
        setDados(response.data.data);
        setTotalPaginas(response.data.meta?.last_page ?? 1);
        setTotalRegistros(response.data.meta?.total ?? response.data.data.length);
      })
      .catch(function (erro) {
        console.log(erro.data);
      })
      .finally(function () {
        setGerando(false);
      });
  }, [executou, buscaAtiva, pagina]);

  // Navega para tela de detalhes passando metadados do estabelecimento via location.state.
  function detalhes(dadoId, dadoNome, cnpj, dadoCategoria, idcategoria) {
    let dados = {
      id: dadoId,
      nome: dadoNome,
      num_doc: cnpj,
      tipo: "cnpj",
      categoria: dadoCategoria,
      id_categoria: idcategoria,
    };
    nav("/informacao-estabelecimento", { state: dados });
  }

  // Navega para a página de visualização e edição dos dados cadastrais do estabelecimento PJ.
  function abrirDadosCadastrais(dd) {
    nav("/dados-estabelecimento-cnpj", {
      state: {
        id: dd.id,
        categoria: dd.categoria,
        categoria_id: dd.categoria_id,
      },
    });
  }

  // Exclui estabelecimento PJ via DELETE e força refresh da lista.
  async function deletar(e) {
    let iid = e;
    try {
      let response = await api.delete(`estabelecimentos_cnpj/${iid}`);
      setExecutou((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
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
              <div className={estilo.pageHeader}>
                <div>
                  <h1 className={estilo.pageTitle}>
                    Estabelecimentos Pessoa Jurídica - CNPJ
                  </h1>
                  <p className={estilo.pageSubtitle}>
                    Gerencie os estabelecimentos vinculados a CNPJ
                  </p>
                </div>
                {user?.nivel_acesso === 1 && (
                  <button
                    type="button"
                    className={estilo.btnGerenciarCategorias}
                    onClick={() => nav("/categorias-cnpj")}
                  >
                    <AiOutlineSetting size={18} /> Gerenciar Categorias
                  </button>
                )}
              </div>
              {gerando && (
                <div className={estilo.loadingOverlay}>
                  <span className={estilo.spinner}></span>
                </div>
              )}
              <div className={estilo.divTabela}>
                <div className={estilo.divInput}>
                  <div className={estilo.divBusca}>
                    <input
                      type="text"
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && buscar()}
                      placeholder="🔍 Buscar por nome, CNPJ ou razão social..."
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
                        <th>CNPJ</th>
                        <th>Nome do Estabelecimento</th>
                        <th>Categoria</th>
                        <th>Situação</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {dados.length > 0 &&
                        dados.map((dd) => (
                          <tr key={dd.id}>
                            <td>{dd.cnpj}</td>
                            <td
                              className={estilo.linkEstabelecimento}
                              onClick={() => abrirDadosCadastrais(dd)}
                            >
                              {dd.nome_fantasia}
                            </td>
                            {dd.categoria_id == 1 ? (
                              <td>{dd.categoria}/{dd.tipo_estb}</td>
                            ) : (
                              <td>{dd.categoria}</td>
                            )}
                            {dd.indexSit == 0 && (
                              <td className={estilo.sitPendente}>{dd.situacao}</td>
                            )}
                            {dd.indexSit == 1 && (
                              <td className={estilo.sitRegular}>{dd.situacao}</td>
                            )}
                            {dd.indexSit == 3 && (
                              <td className={estilo.sitIrregular}>{dd.situacao}</td>
                            )}
                            {dd.indexSit == 4 && (
                              <td className={estilo.sitPendente}>{dd.situacao}</td>
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
                                      dd.cnpj,
                                      dd.categoria,
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
                          <td className={estilo.emptyState} colSpan={5}>
                            Nenhum estabelecimento encontrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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

export default TelaEstabelecimentosCnpj;
