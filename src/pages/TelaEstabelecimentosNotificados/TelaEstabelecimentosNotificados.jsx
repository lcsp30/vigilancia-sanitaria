// Lista estabelecimentos notificados com ações de intimação, constatação e finalização via modais.
import estilo from "./estiloTelaEstabelecimentosNotificados.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Modal from "../../components/Modal";
import ModalConstatacaoAdvertencia from "../../components/ModalConstatacaoAdvertencia";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import TopAppBar from "../../components/TopAppBar/TopAppBar";

function TelaEstabelecimentosNotificados() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let nav = useNavigate();
  let [dados, setDados] = useState([]);
  let [execultar, setExecultar] = useState(false);

  useEffect(() => {
    api.get("estabelecimentos_notificados").then(function (response) {
      let dadosBD = response.data; setDados(dadosBD);
    }).catch(function (erro) { console.error(erro); });
  }, [execultar]);

  // Finaliza uma notificação via DELETE e força refresh da lista.
  function btnFinalizar(id) {
    api.delete(`estabelecimentos_notificados/${id}`).then(function (response) {
      setExecultar((prev) => !prev);
    }).catch(function (erro) { console.error(erro.response?.data || erro); });
  }

  return (
    <div className={estilo.page}><TopAppBar /><div className={estilo.principal}>
        <div className={`${estilo.sidebarWrapper} ${sidebarOpen ? estilo.sidebarOpen : ""}`}><Sidebar /></div>
        <div className={estilo.divCentro}><main className={estilo.main}><div className={estilo.container}>
              <div className={estilo.pageHeader}><div><h1 className={estilo.pageTitle}>Estabelecimentos Notificados</h1><p className={estilo.pageSubtitle}>Gerencie os estabelecimentos que receberam notificação</p></div></div>
              <div className={estilo.divTabela}><div className={estilo.divInput}>
                  <input type="text" placeholder="🔍 Buscar estabelecimento..." />
                  <div className={estilo.acoesTopo}><Modal setExecultar={setExecultar} /></div>
                </div>
                <table className={estilo.tabelaEstabelecimnetos}><thead><tr><th>Nome do Estabelecimento</th><th>Nome do Proprietario</th><th>Contato</th><th>Dia da Notificação</th><th className={estilo.thSituacao}>Situação</th><th></th></tr></thead>
                  <tbody>{dados.length > 0 && dados.map((dd) => (<tr key={dd.id}><td>{dd.nome_estabelecimento}</td><td>{dd.nome_proprietario}</td><td>{dd.contato}</td><td>{dd.data_notificacao}</td><td>{dd.situacao}</td><td className={estilo.tdBtn}><button onClick={() => btnFinalizar(dd.id)}>Finalizar</button></td></tr>))}
                    {dados.length == 0 && (<tr><td className={estilo.emptyState} colSpan={6}>Nenhum estabelecimento notificado no momento.</td></tr>)}</tbody></table></div>
        </div></main></div></div></div>
  );
}

export default TelaEstabelecimentosNotificados;