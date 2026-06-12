// Gestão de documentos do estabelecimento: upload, download, licença (bloqueada se pendências), notificações e requerimentos — orquestra 8 modais.
import estilo from "./estiloTelaDocumentosEstabelecimento.module.css";
import {AiFillFileText, AiOutlineDownload, AiOutlineUpload, AiOutlineCheckCircle, AiFillWarning, AiOutlineMenu } from "react-icons/ai";
import ModalIntimacao from "../../components/ModalIntimacao";
import ModalConstatacaoAdvertencia from "../../components/ModalConstatacaoAdvertencia";
import ModalRequerimento from "../../components/ModalRequerimento";
import ModalApagarDoc from "../../components/ModalApagarDoc";
import ModalMenuDoc from "../../components/ModalMenuDoc";
import ModalLicenca from "../../components/ModalLicenca";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import api from "../../services/api";
import ModalEditarEstb from "../../components/ModalEditarEstb";
import ModalProtocolo from "../../components/ModalProtocolo";
import TopAppBar from "../../components/TopAppBar/TopAppBar";
import Sidebar from "../../components/Sidebar";

function TelaDocumentosEstabelecimento(){
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dd = useLocation().state;
    const [documentosPendentes, setDocumentosPendentes] = useState([]);
    const [documentosAnexados, setDocumentosAnexados] = useState([]);
    const [documentos, setDocumentos] = useState([]);
    const [execultar, setExecultar] = useState(false);
    const [constatacao, setConstatacao] = useState([]);
    const [intimacao, setIntimacao] = useState([]);
    const [valorBtnLicenca, setValorBtnLicenca] = useState(true);
    const [menu, setMenu] = useState('none');
    const [docsMenu, setDocsMenu] = useState([]);
    const nav = useNavigate();
    const [gerando, setGerando] = useState(false);
    const [docsAtivos, setDocsAtivos] = useState([]);
    const [erroApi, setErroApi] = useState(false);
    const [atualAno, setAtualAno] = useState(false);

    useEffect(() => {
        setGerando(true);
    api.get('doc', {
        params: {
            id: dd.id,
            tipo: dd.tipo,
            ano: dd.ano
        }
    })
    .then(function (response){
        const dados = response.data.doc;
        const docPendetes = response.data.docPendentes;
        const docAnexados = response.data.docAnexados;
        const constatacaoDado = response.data.constatacao;
        const intimacaoDado = response.data.intimacao;
        const licenca = response.data.licenca;
        const docAtivos = response.data.docAtivos;
        const anoAtual = response.data.anoAtual;

        console.log(response.data);

        const docMenu = dados.filter((doc) => doc.doc_local == null);
        setDocsMenu(docMenu);

        if(docAnexados.length >= docAtivos.length){
            setValorBtnLicenca(false);

        if(licenca.doc_local == null){
             docPendetes.push(licenca);
            }else{
            docAnexados.push(licenca);
            }

            if(constatacaoDado.length != 0){
                setValorBtnLicenca(true);
            }

        }else{
            setValorBtnLicenca(true);
        }

        if(anoAtual == false){
            setValorBtnLicenca(true);
        }
        
        setAtualAno(anoAtual);
        setDocsAtivos(docAtivos);
        setDocumentos(dados);
        setDocumentosPendentes(docPendetes);
        setDocumentosAnexados(docAnexados);
        setConstatacao(constatacaoDado);
        setIntimacao(intimacaoDado);
    })
    .catch(function (){
        setErroApi(true);
    })
    .finally(function(){
        setGerando(false);
    });

    },[execultar]);

    // Faz upload do arquivo selecionado via multipart/form-data para o endpoint doc.
     function uploadArquivo(e){
        let arquivo = e.target.files[0];
        let id = e.target.id;
        console.log(arquivo);
        if (!e.target.files || e.target.files.length === 0){
             console.log("Seleção cancelada");
             return;
        }
        let dados = new FormData();
        dados.append("arquivo", arquivo);
        dados.append("id", id);
        dados.append("tipo", dd.tipo);
        api.post('doc', dados)
        .then(function(response){
            console.log(response);
            setExecultar(prev => !prev);
        }).catch(function(error){
            console.error(error);
        });
    }

    // Força download do arquivo via blob e criação dinâmica de elemento <a>.
    function downloadArquivo(docUrl, docNome){
        api.get('download', {
            params:{ url:docUrl },
            responseType: 'blob',
        })
        .then(function (response){
            const nomeArquivo = docNome;
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', nomeArquivo);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        })
        .catch(function(){ /* erro silencioso */ });
    }

    // Abre o documento em nova aba para visualização inline (PDF/imagem).
    function visualizarDoc(url){
        window.open(url, "_blank");
    }

    // Finaliza uma intimação ou constatação enviando finalizar=1 ao backend.
    function finalizarIntimacaoConstatacao(id){
        api.post('intimacao_constatacao', {
            'id': id,
            'finalizar': 1,
            'tipoEstabelecimento' : dd.tipo
        })
        .then(function(){ setExecultar(prev => !prev); })
        .catch(function(){ /* erro silencioso */ })
    }

    // Formata data ISO (YYYY-MM-DD) para DD/MM/YYYY.
    function formatarData(data) {
        if (!data) return "-";
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // Alterna a visibilidade do menu dropdown de ações do documento.
   function menuDoc(){
        if(menu == 'none'){ setMenu('block'); } else { setMenu('none'); }
    }

    function voltar(){ nav(-1); }

    return(
        <div className={estilo.page}>
            <TopAppBar />
            <div className={estilo.principal}>
                <div className={`${estilo.sidebarWrapper} ${sidebarOpen ? estilo.sidebarOpen : ''}`}><Sidebar /></div>
                <div className={estilo.divCentro}>
                    <main className={estilo.main}>
                        <div className={estilo.container}>
                            <div className={estilo.pageHeader}><div><h1 className={estilo.pageTitle}>Documentação do Estabelecimento</h1><p className={estilo.pageSubtitle}>{dd.nome} / {dd.num_doc}</p></div></div>
                            <div className={estilo.divPrincipal}>
                            {gerando && (<div className={estilo.loadingWrapper}><span className={estilo.spinner}></span><span className={estilo.loadingText}>Carregando documentos...</span></div>)}
                            {erroApi && !gerando && (<div className={estilo.errorState}><span className={estilo.errorIcon}>⚠</span><p className={estilo.errorTitle}>Erro ao carregar documentos</p><p className={estilo.errorHint}>Tente novamente mais tarde.</p></div>)}
                            {!gerando && !erroApi && (
                            <>
                            <div className={estilo.conteinerDividido}>
                                <div className={estilo.divConteinerGeral}>
                                    <div className={estilo.tituloConteiner}><h3>Gerenciamento de Documentos</h3>
                                            <AiOutlineMenu size={20} style={{cursor: "pointer"}} onClick={menuDoc}/>
                                    <div className={estilo.menuDoc} style={{display: menu}}>
                                        <ModalMenuDoc docs={docsMenu} menuDoc={menuDoc} tipoEstabelecimento={dd.tipo} setExecultar={setExecultar}/>
                                        <hr className={estilo.menuDivider} />
                                        <ModalEditarEstb id={dd.id} tipoEstabelecimento={dd.tipo} menuDoc={menuDoc}/>
                                    </div></div>
                                {documentosPendentes.length === 0 && documentosAnexados.length === 0 && (<div className={estilo.emptyState}><div className={estilo.emptyIcon}><AiFillFileText size={32} /></div><p className={estilo.emptyTitle}>Nenhum documento encontrado</p><p className={estilo.emptyHint}>Os documentos obrigatórios aparecerão aqui.</p></div>)}
                                {documentosPendentes.length != 0 && <div className={estilo.divPendentes}><div className={estilo.divTituloPendentes}><div className={estilo.iconeAtencao}><AiFillWarning size={15}/></div><h4>Atenção: Documentos Pendentes</h4></div><div className={estilo.caixaPendenciasDivididas}>
                                    {documentosPendentes.map((doc) => <div key={doc.id_documento} className={`${estilo.documentosPendentes} ${doc.status == 1 ? estilo.docPendenteInativa: ''}`}><div className={estilo.listaParteNome}><div className={estilo.iconeDocumento}><AiFillFileText size={20} /></div><p>{doc.nome_doc}</p></div><label htmlFor={doc.id_documento} className={estilo.divIconeUpload}><AiOutlineUpload size={20}/></label><input id={doc.id_documento} type="file" onChange={uploadArquivo} className={estilo.inputHidden} /></div>)}</div></div>}
                                {documentosAnexados.length != 0 && <div className={estilo.divLista}><div className={estilo.tituloLista}><AiOutlineCheckCircle size={16} /><h4>Documentos Já Anexados</h4></div><div className={estilo.lista}><ul>
                                        {documentosAnexados.map((doc) => <li key={doc.id_documento}><div className={estilo.listaParteNome} onClick={() => visualizarDoc(doc.url)}><div className={estilo.iconeDocumento}><AiFillFileText size={20} /></div><div className={estilo.nomeData}><p>{doc.nome_doc}</p><p className={estilo.dataDoc}>{formatarData(doc.data_doc)}</p></div></div><div className={estilo.acoesIcones}><span className={estilo.downloadIcon} onClick={() => downloadArquivo(doc.doc_local, doc.nome_doc)}><AiOutlineDownload size={20} /></span><ModalApagarDoc id={doc.id_documento} tipo={dd.tipo} url={doc.doc_local} setExecultar={setExecultar}/></div></li>)}</ul></div></div>}
                                </div>
                                <div className={estilo.caixaGeralLicenca}>
                                    <div className={estilo.conteinerLicenca}><div className={estilo.tituloLicenca}><h3>Gerador de Licenciamento</h3></div><div className={estilo.caixaBtn}><ModalLicenca idDado={dd.id} ano={dd.ano} tipoEstabelecimento={dd.tipo} categoria={dd.categoria} nomeEstb={dd.nome} anoAtual={atualAno} valorBtnLicenca={valorBtnLicenca}/><div><p>Documentos Obrigatórios: <b>{documentosAnexados.length}/{docsAtivos.length}</b></p></div></div></div>
                                    <div className={estilo.conteinerLicenca}><div className={estilo.tituloLicenca}><h3>Requerimento</h3></div><div className={estilo.caixaBtn}><ModalRequerimento idDado={dd.id} categoriaDado={dd.categoria} tipoEstabelecimento={dd.tipo}/></div></div>
                                    <div className={estilo.conteinerLicenca}><div className={estilo.tituloLicenca}><h3>Protocolo</h3></div><div className={estilo.caixaBtn}><ModalProtocolo idDado={dd.id} tipoEstabelecimento={dd.tipo} nomeEstb={dd.nome}/></div></div>
                                </div>
                            </div>
                            <div className={estilo.notificacoesSection}>
                                <section className={estilo.sectionCard}><div className={estilo.sectionHeader}><h3 className={estilo.sectionTitle}>Termo de Intimação</h3><ModalIntimacao id={dd.id} ano={dd.ano} tipo={dd.tipo} setExecultar={setExecultar}/></div><div className={estilo.tableWrapper}><table className={estilo.tableNew}><thead><tr><th>Data</th><th>Vencimento</th><th>Descrição</th><th></th></tr></thead><tbody>{intimacao.length > 0 ? intimacao.map((dado) => <tr key={dado.id_intimacao_constatacao}><td>{dado.data_inicial}</td><td>{dado.data_expiracao}</td><td>{dado.descricao}</td><td><button className={estilo.btnFinalizar} onClick={() => finalizarIntimacaoConstatacao(dado.id_intimacao_constatacao)}>Finalizar</button></td></tr>) : <tr><td className={estilo.emptyRow} colSpan={4}>Nenhuma Intimação!</td></tr>}</tbody></table></div></section>
                                <section className={estilo.sectionCard}><div className={estilo.sectionHeader}><h3 className={estilo.sectionTitle}>Auto de Constatação e Advertência</h3><ModalConstatacaoAdvertencia id={dd.id} ano={dd.ano} tipo={dd.tipo} setExecultar={setExecultar}/></div><div className={estilo.tableWrapper}><table className={estilo.tableNew}><thead><tr><th>Data</th><th>Vencimento</th><th>Descrição</th><th></th></tr></thead><tbody>{constatacao.length > 0 ? constatacao.map((dado) => <tr key={dado.id_intimacao_constatacao}><td>{dado.data_inicial}</td><td>{dado.data_expiracao}</td><td>{dado.descricao}</td><td><button className={estilo.btnFinalizar} onClick={() => finalizarIntimacaoConstatacao(dado.id_intimacao_constatacao)}>Finalizar</button></td></tr>) : <tr><td className={estilo.emptyRow} colSpan={4}>Nenhum auto de constatação registrado.</td></tr>}</tbody></table></div></section>
                            </div></>)}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default TelaDocumentosEstabelecimento;