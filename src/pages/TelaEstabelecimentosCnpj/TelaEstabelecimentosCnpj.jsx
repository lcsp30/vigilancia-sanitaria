// Lista estabelecimentos PJ (CNPJ) com busca frontend (useMemo) e navegação para detalhes via location.state.
// A busca é feita no frontend porque o volume de CNPJs no município é baixo — evita requisições a cada tecla.
import estilo from "./estiloTelaEstabelecimentosCnpj.module.css";
import { AiTwotoneDelete, AiOutlineExport } from "react-icons/ai";
import { useNavigate } from "react-router";
import api from "../../services/api";
import { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import TopAppBar from "../../components/TopAppBar/TopAppBar";

function TelaEstabelecimentosCnpj() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let nav = useNavigate();
  const [executou, setExecutou] = useState(false);
  let [dados, setDados] = useState([]);
  let [gerando, setGerando] = useState(false);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    setGerando(true);
    api.get("estabelecimentos_cnpj").then(function (response) {
      const dados = response.data; setDados(dados.data);
    }).catch(function (erro) { console.log(erro.data); }).finally(function () { setGerando(false); });
  }, [executou]);

  // Navega para tela de detalhes passando metadados do estabelecimento via location.state.
  function detalhes(dadoId, dadoNome, cnpj, dadoCategoria, idcategoria) {
    let dados = { id: dadoId, nome: dadoNome, num_doc: cnpj, tipo: "cnpj", categoria: dadoCategoria, id_categoria: idcategoria };
    nav("/informacao-estabelecimento", { state: dados });
  }

  // Exclui estabelecimento PJ via DELETE e força refresh da lista.
  async function deletar(e) { let iid = e;
    try { let response = await api.delete(`estabelecimentos_cnpj/${iid}`); setExecutou((prev) => !prev); } catch (error) { console.error(error); }
  }

  // Filtra estabelecimentos localmente com useMemo para evitar re-filtragem a cada render.
  const dadosExibir = useMemo(() => { if (!busca) return dados; return dados.filter((dd) => dd.nome_fantasia.toLowerCase().includes(busca)); }, [busca, dados]);
  function buscar(e) { setBusca(e.target.value.toLowerCase()); }

  return (
    <div className={estilo.page}><TopAppBar /><div className={estilo.principal}>
        <div className={`${estilo.sidebarWrapper} ${sidebarOpen ? estilo.sidebarOpen : ""}`}><Sidebar /></div>
        <div className={estilo.divCentro}><main className={estilo.main}><div className={estilo.container}>
              <div className={estilo.pageHeader}><div><h1 className={estilo.pageTitle}>Estabelecimentos Pessoa Jurídica - CNPJ</h1><p className={estilo.pageSubtitle}>Gerencie os estabelecimentos vinculados a CNPJ</p></div></div>
              {gerando && (<div className={estilo.loadingOverlay}><span className={estilo.spinner}></span></div>)}
              <div className={estilo.divTabela}><div className={estilo.divInput}><input type="text" placeholder="🔍 Buscar Estabelecimento..." onChange={buscar} /></div>
                <div className={estilo.divTabelaScroll}><table className={estilo.tabelaEstabelecimnetos}><thead><tr><th>CNPJ</th><th>Nome do Estabelecimento</th><th>Categoria</th><th>Situação</th><th></th></tr></thead>
                  <tbody>{dadosExibir.length > 0 && dadosExibir.map((dd) => (<tr key={dd.id}><td>{dd.cnpj}</td><td>{dd.nome_fantasia}</td>
                    {dd.categoria_id == 1 ? (<td>{dd.categoria}/{dd.tipo_estb}</td>) : (<td>{dd.categoria}</td>)}
                    {dd.indexSit == 0 && (<td className={estilo.sitPendente}>{dd.situacao}</td>)}{dd.indexSit == 1 && (<td className={estilo.sitRegular}>{dd.situacao}</td>)}{dd.indexSit == 3 && (<td className={estilo.sitIrregular}>{dd.situacao}</td>)}{dd.indexSit == 4 && (<td className={estilo.sitPendente}>{dd.situacao}</td>)}
                    <td><div className={estilo.tdAcao}><AiOutlineExport size={25} className={estilo.iconeAcao} onClick={() => detalhes(dd.id, dd.nome_fantasia, dd.cnpj, dd.categoria, dd.categoria_id)} /></div></td></tr>))}
                    {dadosExibir.length == 0 && (<tr><td className={estilo.emptyState} colSpan={5}>Nenhum estabelecimento encontrado.</td></tr>)}</tbody></table></div></div>
        </div></main></div></div></div>
  );
}

export default TelaEstabelecimentosCnpj;