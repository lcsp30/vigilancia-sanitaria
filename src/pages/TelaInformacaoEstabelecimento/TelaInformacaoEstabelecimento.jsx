// Exibe os anos disponíveis de documentos do estabelecimento (dados recebidos via location.state). O ano mais recente é padrão.
// NOTA: A URL não é bookmarkable — ao recarregar, location.state é perdido e o estabelecimento não carrega.
import estilo from "./estiloTelaInformacaoEstabelecimento.module.css";
import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Sidebar from "../../components/Sidebar";
import TopAppBar from "../../components/TopAppBar/TopAppBar";
import ModalNovoAno from "../../components/ModalNovoAno";

function TelaInformacaoEstabelecimento() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let nav = useNavigate();
  let local = useLocation();
  let [anoAtual, setAnoAtual] = useState("");
  let [anos, setAnos] = useState([]);
  let [carregando, setCarregando] = useState(true);
  let [erroApi, setErroApi] = useState(false);
  let [execultar, setExecultar] = useState(false);
  let dd = local.state;

  useEffect(() => {
    console.log(dd);
    setCarregando(true);

    api.get(`doc/${dd.id}`, {
        params: {
          tipo: dd.tipo,
        },
      })
      .then((response) => {
          let resposta = response.data;
            if (!Array.isArray(resposta) || resposta.length === 0) {
              setErroApi("Nenhum ano encontrado para este estabelecimento.");
              return;
            }
            let atual = resposta[0];
            let outros = resposta.filter(item => atual != item);
            setAnoAtual(atual);
            setAnos(outros);
            setErroApi(false);
      })
      .catch((error) => {
        setErroApi("Erro ao carregar dados do estabelecimento.");
        console.log(error);
      })
      .finally(() => {
        setCarregando(false);
      });
  }, [execultar]);

  function pastaDocumentos(ano) {
    let dados = local.state;
    let dadosComAno = { ...dados, ano };
    nav("/documentos", { state: dadosComAno });
  }

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
                  <h1 className={estilo.pageTitle}>
                    Informações do Estabelecimento
                  </h1>
                  <p className={estilo.pageSubtitle}>
                    {local.state.nome} / {local.state.num_doc}
                  </p>
                </div>
                 <span className={estilo.btnNovoAno}>
                  <ModalNovoAno idDado={dd.id} categoriaid={dd.id_categoria} tipoEstabelecimento={dd.tipo} setExecultar={setExecultar}/>
                </span>
              </div>

              {/* Loading State */}
              {carregando && (
                <div className={estilo.loadingState}>
                  <div className={estilo.spinner}></div>
                  <span className={estilo.loadingText}>Carregando documentos...</span>
                </div>
              )}

              {/* Error State */}
              {erroApi && !carregando && (
                <div className={estilo.errorState}>
                  <div className={estilo.errorIcon}>&#9888;</div>
                  <span className={estilo.errorText}>{erroApi}</span>
                  <span className={estilo.errorHint}>
                    Verifique se o estabelecimento possui documentos cadastrados.
                  </span>
                </div>
              )}

              {/* Cards de anos */}
              {!carregando && !erroApi && anoAtual && (
                <div className={estilo.divConteiner}>
                  <div
                    className={estilo.conteiner}
                    onClick={() => pastaDocumentos(anoAtual)}
                  >
                    <h1 className={estilo.h1Ano}>{anoAtual}</h1>
                  </div>
                </div>
              )}

              {/* {!carregando && !erroApi && !anoAtual && (
                <div className={estilo.divConteiner}>
                  <div className={estilo.semAno}>
                    <p>Ano atual não foi criado para este estabelecimento.</p>
                    <ModalNovoAno id={local.state.id} tipo={local.state.tipo} />
                  </div>
                </div>
              )} */}

              {anos.length > 0 && anos.length != 0 && (
                <div className={estilo.divAnosAnteriores}>
                  <h2>Anos Anteriores</h2>
                  <div className={estilo.gridAnos}>
                    {anos
                      .filter((ano) => ano != anoAtual)
                      .map((ano) => (
                        <div
                          key={ano}
                          className={estilo.conteinerMenor}
                          onClick={() => pastaDocumentos(ano)}
                        >
                          <h2>{ano}</h2>
                        </div>
                      ))}
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

export default TelaInformacaoEstabelecimento;
