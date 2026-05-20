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
import BarraNavegação from "../../components/BarraNavegacao";
import { BiLogOut } from "react-icons/bi";
import ModalEditarEstb from "../../components/ModalEditarEstb";
import ModalProtocolo from "../../components/ModalProtocolo";

function TelaDocumentosEstabelecimento(){
    let dd = useLocation().state;
    let [documentosPendentes, setDocumentosPendentes] = useState([]);
    let [documentosAnexados, setDocumentosAnexados] = useState([]);
    let [documentos, setDocumentos] = useState([]);
    let [execultar, setExecultar] = useState(false);
    let [constatacao, setConstatacao] = useState([]);
    let [intimacao, setIntimacao] = useState([]);
    let [valorBtnLicenca, setValorBtnLicenca] = useState(true);
    let [menu, setMenu] = useState('none');
    let [docsMenu, setDocsMenu] = useState([]);
    let nav = useNavigate();
    let [gerando, setGerando] = useState(false);
    let [docsAtivos, setDocsAtivos] = useState([]);

    useEffect(() => {
        console.log(dd);
        setGerando(true);
    api.get('doc', {
        params: {
            id: dd.id,
            tipo: dd.tipo,
            ano: dd.ano
        }
    })
    .then(function (response){
        let dados = response.data.doc;
        let docPendetes = response.data.docPendentes;
        let docAnexados = response.data.docAnexados;
        let constatacaoDado = response.data.constatacao;
        let intimacaoDado = response.data.intimacao;
        let licenca = response.data.licenca;
        let docAtivos = response.data.docAtivos;
        console.log(response.data);

        let docMenu = dados.filter((doc) => doc.doc_local == null);
        console.log(docMenu);
        setDocsMenu(docMenu);

        if(docAnexados.length >= docAtivos.length){
            setValorBtnLicenca(false);

            if(licenca.doc_local == null){
             console.log(licenca);
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
        
        setDocsAtivos(docAtivos);
        setDocumentos(dados);
        setDocumentosPendentes(docPendetes);
        setDocumentosAnexados(docAnexados);
        setConstatacao(constatacaoDado);
        setIntimacao(intimacaoDado);

        console.log(docAnexados);
    })
    .catch(function (error){
        console.error(error);
        console.log(error);
    })
    .finally(function(){
        setGerando(false);
    });

    },[execultar]);

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
            console.log(response.data);
            setExecultar(prev => !prev);
        }).catch(function(error){
            console.error(error);
        });
    }

    function downloadArquivo(docUrl, docNome){
        api.get('download', {
            params:{
                url:docUrl
            },
            responseType: 'blob',
        })
        .then(function (response){
            let nomeArquivo = docNome;
            
            const url = window.URL.createObjectURL(response.data);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', nomeArquivo);
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        })
        .catch(function(error){
            console.error(error);
        });
    }

     function downloadLicenca(){
        api.get('licenca', {
            params:{
                id:dd.id,
                tipo: 'licenca'
            },
            responseType: 'blob',
        })
        .then(function (response){
            let nomeArquivo = "Licença" + dd.id;
            
            const url = window.URL.createObjectURL(response.data);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', nomeArquivo);
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        })
        .catch(function(error){
            console.error(error);
        });
    }

    function visualizarDoc(url){
        window.open(url, "_blank");
    }

    function finalizarIntimacaoConstatacao(id){
        api.post('intimacao_constatacao', {
            'id': id,
            'finalizar': 1,
            'tipoEstabelecimento' : dd.tipo
        })
        .then(function(response){
            console.log(response.data);
            setExecultar(prev => !prev);
        })
        .catch(function(error){
            console.error(error);
        })
    }

    function gerarLicenca(){
        if(documentosPendentes.length > 0){
            alert("A Licença não pode ser criada, documentação pendente!!");
        }else if(constatacao.status == 1){
            alert ("A Licença não pode ser criada, Um Auto de Constatação e Advertência em Aberto!!!");
        }
    }

    function formatarData(data) {
          if (!data) return "-";

    // Divide a string "2026-03-26" em partes individuais
    const [ano, mes, dia] = data.split('-');

    // Retorna no padrão brasileiro manualmente (Dia/Mês/Ano)
    return `${dia}/${mes}/${ano}`;
    }

    function menuDoc(){
        if(menu == 'none'){
            setMenu(null);
        }else{
            setMenu('none');
        }
    }

    function voltar(){
        nav(-1);
    }

    return(
        <div className={estilo.divLarguraTotal}>
            <BarraNavegação/>
            {gerando && <div className={estilo.loadingOverlay}><span className={estilo.spinner}></span></div>}
             <div className={estilo.divPrincipal}>
            <BiLogOut className={estilo.iconeVoltar} size={35} onClick={voltar}/>
            <div className={estilo.divTitulo}>
                <div>
                    <h2>Documentação do Estabelecimento</h2>
                    <p>{dd.nome} / {dd.num_doc}</p>
                </div>
            </div>

            <div className={estilo.conteinerDividido}>

                <div className={estilo.divConteinerGeral}>
            <div style={{position: "relative" , userSelect: 'none'}}>
                <div className={estilo.tituloConteiner}>
                    <h3>Gerenciamento de Documentos</h3>
                    <AiOutlineMenu size={20} style={{cursor: "pointer"}} onClick={menuDoc}/>
                </div>
                <div className={estilo.menuDoc} style={{display: menu}}>
                    <ModalMenuDoc docs={docsMenu} menuDoc={menuDoc} tipoEstabelecimento={dd.tipo} setExecultar={setExecultar}/>
                    <ModalEditarEstb id={dd.id} tipoEstabelecimento={dd.tipo} menuDoc={menuDoc}/>
                </div>
            </div>

            {documentosPendentes.length != 0 &&
                <div className={estilo.divPendentes}>
                <div className={estilo.divTituloPendentes}>
                    <div className={estilo.iconeAtencao}>
                        <AiFillWarning size={15}/>
                    </div>
                    <h4>Atenção: Documentos Pendentes</h4>
                </div>
                <div className={estilo.caixaPendenciasDivididas}>

                {documentosPendentes.map((doc) => 
                    <div key={doc.id_documento} className={`${estilo.documentosPendentes} ${doc.status == 1 ? estilo.docPendenteInativa: ''}`}>
                        <div className={estilo.listaParteNome}>
                            <div className={estilo.iconeDocumento}>
                                <AiFillFileText size={20} />
                           </div>
                            <p>{doc.nome_doc}</p>
                        </div>

                        <label htmlFor={doc.id_documento} className={estilo.divIconeUpload}>
                            <AiOutlineUpload size={23}/>
                        </label>
                        <input id={doc.id_documento} type="file" onChange={uploadArquivo} style={{display:"none"}}/>
                    </div>
                )}
                </div>
            </div>
            }
            {documentosAnexados.length != 0 && 
                <div className={estilo.divLista}>
                <div className={estilo.tituloLista}>
                     <AiOutlineCheckCircle style={{color: '#2f5d50'}}/>
                     <h4>Documentos Já Anexados.</h4>
                </div>
                <div className={estilo.lista}>
                <ul>
                    {documentosAnexados.map((doc) => 

                    <li key={doc.id_documento}>
                        <div className={estilo.listaParteNome} onClick={() => visualizarDoc(doc.url)}>
                           <div className={estilo.iconeDocumento}>
                                <AiFillFileText size={20} />
                           </div>
                            <div className={estilo.nomeData}>
                                <p>{doc.nome_doc}</p>
                                <p style={{fontSize: "11px", marginTop:"1px"}}>{formatarData(doc.data_doc)}</p>
                            </div>
                        </div>
                        <div className={estilo.acoesIcones}>
                             <AiOutlineDownload size={23} style={{cursor:"pointer"}} onClick={() => downloadArquivo(doc.doc_local, doc.nome_doc)}/>
                             <ModalApagarDoc id={doc.id_documento} tipo={dd.tipo} url={doc.doc_local} setExecultar={setExecultar}/>
                        </div>
                    </li>
                    )}

                </ul>
                </div>
            </div>
            }

            </div>

            <div className={estilo.caixaGeralLicenca}>
                <div className={estilo.conteinerLicenca}>
                    <div className={estilo.tituloLicenca}>
                        <h3>Gerador de Licenciamento</h3>
                    </div>
                    
                    <div className={estilo.caixaBtn} >
                        <ModalLicenca idDado={dd.id} ano={dd.ano} tipoEstabelecimento={dd.tipo} categoria={dd.categoria} nomeEstb={dd.nome} valorBtnLicenca={valorBtnLicenca}/>
                        <div>
                            <p>Documentos Obrigatórios:  <b>{documentosAnexados.length}/{docsAtivos.length}</b></p>
                        </div>
                    </div>
                    
                </div>
                <div className={estilo.conteinerLicenca}>
                    <div className={estilo.tituloLicenca}>
                        <h3>Requerimento</h3>
                    </div>
                    <div className={estilo.caixaBtn}>
                        <ModalRequerimento idDado={dd.id} categoriaDado={dd.categoria} tipoEstabelecimento={dd.tipo}/>
                    </div>
                    
                </div>

                <div className={estilo.conteinerLicenca}>
                    <div className={estilo.tituloLicenca}>
                        <h3>Protocolo</h3>
                    </div>
                    <div className={estilo.caixaBtn}>
                        <ModalProtocolo idDado={dd.id} tipoEstabelecimento={dd.tipo} nomeEstb={dd.nome}/>
                    </div>
                    
                </div>
            </div>
            </div>
            
            <div className={estilo.conteinerNotificacoes}>
                <div className={estilo.divNot}>
                    <div className={estilo.divIntimacao}>
                        <h4>Termo de Intimação</h4>
                        <ModalIntimacao id={dd.id} ano={dd.ano} tipo={dd.tipo} setExecultar={setExecultar}/>  
                    </div>

                    <div>
                        <table className={estilo.tabelaIntimacao}>
                            <thead>
                                <tr>
                                    <th>Data Intimação</th>
                                    <th>Data de Expiração</th>
                                    <th>Descrição</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {intimacao.length > 0 && 
                                    intimacao.map((dado) =>
                                    <tr key={dado.id_intimacao_constatacao}>
                                    <td>{dado.data_inicial}</td>
                                    <td>{dado.data_expiracao}</td>
                                    <td>{dado.descricao}</td>
                                    <td className={estilo.tdBtnFinalizar}>
                                        <button onClick={() => finalizarIntimacaoConstatacao(dado.id_intimacao_constatacao)}>Finalizar</button>
                                    </td>
                                    </tr>
                                    )
                                    }
                                    {intimacao.length == 0 && 
                                     <tr>
                                        <td colSpan={4}>Nenhuma Intimação!</td>
                                     </tr>
                                     }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={estilo.divNot}>
                    <div className={estilo.divIntimacao}>
                         <h4>Auto de Constatação e Advertência</h4>
                         <ModalConstatacaoAdvertencia id={dd.id} ano={dd.ano} tipo={dd.tipo} setExecultar={setExecultar}/>
                    </div>
                   
                    <div>
                        <table className={estilo.tabelaIntimacao}>
                            <thead>
                                <tr>
                                    <th>Data da Advertência</th>
                                    <th>Data de Expiração</th>
                                    <th>Descrição</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {constatacao.length > 0 &&
                                    constatacao.map((dado) => 
                                <tr key={dado.id_intimacao_constatacao}>
                                    <td>{dado.data_inicial}</td>
                                    <td>{dado.data_expiracao}</td>
                                    <td>{dado.descricao}</td>
                                    <td className={estilo.tdBtnFinalizar}>
                                        <button onClick={() => finalizarIntimacaoConstatacao(dado.id_intimacao_constatacao)}>Finalizar</button>
                                    </td>
                                </tr>
                                    ) 
                                }
                                {constatacao.length == 0 && 
                                <tr>
                                    <td colSpan={4}>Nenhuma Constatação e Advertência!</td>
                                </tr>
                                }
                                
                                </tbody>
                            </table>
                    </div>
                </div>

            </div>
           
        </div>

        </div>
         
       
    );
}

export default TelaDocumentosEstabelecimento;