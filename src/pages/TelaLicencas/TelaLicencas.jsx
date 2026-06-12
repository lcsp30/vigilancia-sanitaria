// Exibe licenças sanitárias agrupadas por divisão técnica (DCQA, DCSEP, DCDM, DCSHT) — cada uma com sua própria tabela.
import estilo from "./estiloTelaLicencas.module.css";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import TopAppBar from "../../components/TopAppBar/TopAppBar";

function TelaLicencas() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let nav = useNavigate();
  let [dcqa, setDcqa] = useState([]);
  let [dcsep, setDcsep] = useState([]);
  let [dcdm, setDcdm] = useState([]);
  let [dcsht, setDcsht] = useState([]);

  useEffect(() => {
    api
      .get("getLicencas")
      .then(function (response) {
        console.log(response.data);
        setDcqa(response.data.DCQA);
        setDcsep(response.data.DCSEP);
        setDcdm(response.data.DCDM);
        setDcsht(response.data.DCSHT);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  const mascararCnpj = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 18);
  };

  const mascararCpf = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .substring(0, 14);
  };

  function voltar() {
    nav(-1);
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
                  <h1 className={estilo.pageTitle}>Licenças</h1>
                  <p className={estilo.pageSubtitle}>
                    Visualize as licenças por divisão técnica
                  </p>
                </div>
              </div>

              {/* Loading State */}
              {dcqa.length === 0 && dcsep.length === 0 && dcdm.length === 0 && dcsht.length === 0 && (
                <div className={estilo.loadingState}>
                  {/* <div className={estilo.spinner}></div> */}
                  {/* <span className={estilo.loadingText}>Carregando licenças...</span> */}
                  <span className={estilo.loadingText}>Nenhuma Licença encontrada!</span>
                </div>
              )}

              {/* DCQA */}
              {dcqa.length > 0 && (
                <div className={estilo.divTabela}>
                  <div className={estilo.tituloSecao}>
                    DCQA — Divisão de Controle de Qualidade e Alimentos
                  </div>
                  <div className={estilo.divTabelaScroll}>
                    <table className={estilo.tabelaLicencas}>
                      <thead>
                        <tr>
                          <th>Nº Licença</th>
                          <th>CPF/CNPJ</th>
                          <th>Estabelecimento</th>
                          <th>Categoria</th>
                          <th>Ano</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dcqa
                          .filter((dd) => dd.cpf == null)
                          .map((dd, index) => (
                            <tr key={`dcqa-cnpj-${index}`}>
                              <td>{dd.numero_licenca}</td>
                              <td>{mascararCnpj(dd.cnpj)}</td>
                              <td>{dd.nome_fantasia_cnpj}</td>
                              {dd.categoria_id_cnpj == 1 && (
                                <td>
                                  {dd.categoria_cnpj}/{dd.tipo_estb_cnpj}
                                </td>
                              )}
                              {dd.categoria_id_cnpj != 1 && (
                                <td>{dd.categoria_cnpj}</td>
                              )}
                              <td><span className={estilo.anoBadge}>{dd.ano}</span></td>
                            </tr>
                          ))}
                        {dcqa
                          .filter((dd) => dd.cnpj == null)
                          .map((dd, index) => (
                            <tr key={`dcqa-cpf-${index}`}>
                              <td>{dd.numero_licenca}</td>
                              <td>{mascararCpf(dd.cpf)}</td>
                              <td>{dd.nome_fantasia}</td>
                              <td>
                                {dd.categoria_cpf}/{dd.tipo_estb_cpf}
                              </td>
                              <td><span className={estilo.anoBadge}>{dd.ano}</span></td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* DCSEP */}
              {dcsep.length > 0 && (
                <div className={estilo.divTabela}>
                  <div className={estilo.tituloSecao}>
                    DCSEP — Divisão de Controle de Serviços e Produtos
                  </div>
                  <div className={estilo.divTabelaScroll}>
                    <table className={estilo.tabelaLicencas}>
                      <thead>
                        <tr>
                          <th>Nº Licença</th>
                          <th>CPF/CNPJ</th>
                          <th>Estabelecimento</th>
                          <th>Categoria</th>
                          <th>Ano</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dcsep
                          .filter((dd) => dd.cpf == null)
                          .map((dd, index) => (
                            <tr key={`dcsep-cnpj-${index}`}>
                              <td>{dd.numero_licenca}</td>
                              <td>{mascararCnpj(dd.cnpj)}</td>
                              <td>{dd.nome_fantasia_cnpj}</td>
                              {dd.categoria_id_cnpj == 1 && (
                                <td>
                                  {dd.categoria_cnpj}/{dd.tipo_estb_cnpj}
                                </td>
                              )}
                              {dd.categoria_id_cnpj != 1 && (
                                <td>{dd.categoria_cnpj}</td>
                              )}
                              <td><span className={estilo.anoBadge}>{dd.ano}</span></td>
                            </tr>
                          ))}
                        {dcsep
                          .filter((dd) => dd.cnpj == null)
                          .map((dd, index) => (
                            <tr key={`dcsep-cpf-${index}`}>
                              <td>{dd.numero_licenca}</td>
                              <td>{mascararCpf(dd.cpf)}</td>
                              <td>{dd.nome_fantasia}</td>
                              <td>
                                {dd.categoria_cpf}/{dd.tipo_estb_cpf}
                              </td>
                              <td><span className={estilo.anoBadge}>{dd.ano}</span></td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* DCDM */}
              {dcdm.length > 0 && (
                <div className={estilo.divTabela}>
                  <div className={estilo.tituloSecao}>
                    DCDM — Divisão de Controle de Medicamentos
                  </div>
                  <div className={estilo.divTabelaScroll}>
                    <table className={estilo.tabelaLicencas}>
                      <thead>
                        <tr>
                          <th>Nº Licença</th>
                          <th>CPF/CNPJ</th>
                          <th>Estabelecimento</th>
                          <th>Categoria</th>
                          <th>Ano</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dcdm
                          .filter((dd) => dd.cpf == null)
                          .map((dd, index) => (
                            <tr key={`dcdm-cnpj-${index}`}>
                              <td>{dd.numero_licenca}</td>
                              <td>{mascararCnpj(dd.cnpj)}</td>
                              <td>{dd.nome_fantasia_cnpj}</td>
                              {dd.categoria_id_cnpj == 1 && (
                                <td>
                                  {dd.categoria_cnpj}/{dd.tipo_estb_cnpj}
                                </td>
                              )}
                              {dd.categoria_id_cnpj != 1 && (
                                <td>{dd.categoria_cnpj}</td>
                              )}
                              <td><span className={estilo.anoBadge}>{dd.ano}</span></td>
                            </tr>
                          ))}
                        {dcdm
                          .filter((dd) => dd.cnpj == null)
                          .map((dd, index) => (
                            <tr key={`dcdm-cpf-${index}`}>
                              <td>{dd.numero_licenca}</td>
                              <td>{mascararCpf(dd.cpf)}</td>
                              <td>{dd.nome_fantasia}</td>
                              <td>
                                {dd.categoria_cpf}/{dd.tipo_estb_cpf}
                              </td>
                              <td><span className={estilo.anoBadge}>{dd.ano}</span></td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* DCSHT */}
              {dcsht.length > 0 && (
                <div className={estilo.divTabela}>
                  <div className={estilo.tituloSecao}>
                    DCSHT — Divisão de Controle de Saúde e Higiene no Trabalho
                  </div>
                  <div className={estilo.divTabelaScroll}>
                    <table className={estilo.tabelaLicencas}>
                      <thead>
                        <tr>
                          <th>Nº Licença</th>
                          <th>CPF/CNPJ</th>
                          <th>Estabelecimento</th>
                          <th>Categoria</th>
                          <th>Ano</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dcsht
                          .filter((dd) => dd.cpf == null)
                          .map((dd, index) => (
                            <tr key={`dcsht-cnpj-${index}`}>
                              <td>{dd.numero_licenca}</td>
                              <td>{mascararCnpj(dd.cnpj)}</td>
                              <td>{dd.nome_fantasia_cnpj}</td>
                              {dd.categoria_id_cnpj == 1 && (
                                <td>
                                  {dd.categoria_cnpj}/{dd.tipo_estb_cnpj}
                                </td>
                              )}
                              {dd.categoria_id_cnpj != 1 && (
                                <td>{dd.categoria_cnpj}</td>
                              )}
                              <td><span className={estilo.anoBadge}>{dd.ano}</span></td>
                            </tr>
                          ))}
                        {dcsht
                          .filter((dd) => dd.cnpj == null)
                          .map((dd, index) => (
                            <tr key={`dcsht-cpf-${index}`}>
                              <td>{dd.numero_licenca}</td>
                              <td>{mascararCpf(dd.cpf)}</td>
                              <td>{dd.nome_fantasia}</td>
                              <td>
                                {dd.categoria_cpf}/{dd.tipo_estb_cpf}
                              </td>
                              <td><span className={estilo.anoBadge}>{dd.ano}</span></td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
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

export default TelaLicencas;
