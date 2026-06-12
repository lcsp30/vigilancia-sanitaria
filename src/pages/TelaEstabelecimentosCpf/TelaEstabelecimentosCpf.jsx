// Lista estabelecimentos PF (CPF) com busca local e navegação para tela de detalhes via location.state.
import estilo from "./estiloTelaEstabelecimentosCpf.module.css";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router";
import { AiOutlineExport } from "react-icons/ai";
import Sidebar from "../../components/Sidebar";
import TopAppBar from "../../components/TopAppBar/TopAppBar";

function TelaEstabelecimentosCpf() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let nav = useNavigate();
  const [executou, setExecutou] = useState(false);
  let [dados, setDados] = useState([]);
  let [gerando, setGerando] = useState(false);
  let [dadosExibir, setDadosExibir] = useState([]);

  useEffect(() => {
    setGerando(true);
    api
      .get("estabelecimentos_cpf")
      .then(function (response) {
        const dados = response.data;
        setDados(dados.data);
        setDadosExibir(dados.data);
        console.log(dados.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setGerando(false);
      });
  }, [executou]);

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

  async function deletar(e) {
    let iid = e;
    console.log(iid);

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

  function buscar(e) {
    let valor = e.target.value.toLowerCase();
    console.log(valor);
    if (valor != "") {
      let buscados = dados.filter((dd) =>
        dd.nome_fantasia.toLowerCase().includes(valor)
      );
      setDadosExibir(buscados);
      console.log(buscados);
    } else {
      setDadosExibir(dados);
    }
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
                  <input
                    type="text"
                    onChange={buscar}
                    placeholder="🔍 Buscar Estabelecimento..."
                  />
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
                      {dadosExibir.length > 0 &&
                        dadosExibir.map((dd) => (
                          <tr key={dd.id}>
                            <td>{dd.cpf}</td>
                            <td>{dd.nome_fantasia}</td>
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
                      {dadosExibir.length == 0 && (
                        <tr>
                          <td className={estilo.emptyState} colSpan={6}>
                            Nenhum estabelecimento encontrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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
