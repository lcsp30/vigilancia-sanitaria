import estilo from "./estiloTelaDocumentosEstabelecimento.module.css";
import { AiTwotoneDelete ,AiFillFileText, AiOutlineDownload, AiOutlineUpload, AiOutlineCheckCircle, AiFillWarning } from "react-icons/ai";
import ModalIntimacao from "../../components/ModalIntimacao";
import ModalConstatacaoAdvertencia from "../../components/ModalConstatacaoAdvertencia";
import ModalRequerimento from "../../components/ModalRequerimento";
import dados from "../teste.json";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import api from "../../services/api";


function TelaDocumentosEstabelecimento(){
    let dd = useLocation().state;
    let [documentosPendentes, setDocumentosPendentes] = useState([]);
    let [documentosAnexados, setDocumentosAnexados] = useState([]);
    let [execultar, setExecultar] = useState(false);

    useEffect(() => {
    let nCategoria = 0;
    if(dd.categoria == "Profissional Liberal"){
        nCategoria = 1;
    }else{
       nCategoria = 2;
    }
    
    api.get('doc', {
        params: {
            id: dd.id,
            categoria: nCategoria,
            ano: dd.ano
        }
    })
    .then(function (response){
        let dados = response.data;

        console.log(dados);

        // Documentso Pendentes
        let docPendetes = dados.filter((doc) => doc.valor == null);
        let docAnexados = dados.filter((doc) => doc.valor != null);

        setDocumentosPendentes(docPendetes);
        setDocumentosAnexados(docAnexados);
        console.log(docAnexados);
    })
    .catch(function (error){
        console.error(error);
    });

    },[execultar]);

    function uploadArquivo(e){
        let arquivo = e.target.files[0];
        let idInput = e.target.id;

        console.log(arquivo);
        if (!e.target.files || e.target.files.length === 0){
             console.log("Seleção cancelada");
             return;
        }

        let dados = new FormData();
        dados.append("arquivo", arquivo);
        dados.append("estabelecimento_id", dd.id);
        dados.append("ano", dd.ano);
        dados.append("nomeInput", idInput);

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

    function visualizarDoc(url){
        window.open(url, "_blank");
    }

    function deletarDocumento(){
        // Adicionar Logica
    }

    return(
        <div className={estilo.divPrincipal}>
            <div className={estilo.divTitulo}>
                <div>
                    <h2>Documentação do Estabelecimento</h2>
                    <p>{dados.data[0].nome} / {dados.data[0].cnjp}</p>
                </div>
            </div>

            <div className={estilo.conteinerDividido}>

                <div className={estilo.divConteinerGeral}>
            <div>
                <div className={estilo.tituloConteiner}>
                        <h3>Gerenciamento de Documentos</h3>
                </div>
            </div>

            <div className={estilo.divPendentes}>
                <div className={estilo.divTituloPendentes}>
                    <div className={estilo.iconeAtencao}>
                        <AiFillWarning size={15}/>
                    </div>
                    <h4>Atenção: Documentos Pendentes</h4>
                </div>
                <div className={estilo.caixaPendenciasDivididas}>

                {documentosPendentes.map((doc) => 
                
                    <div key={doc.nome} className={estilo.documentosPendentes}>
                        <div className={estilo.listaParteNome}>
                            <div className={estilo.iconeDocumento}>
                                <AiFillFileText size={20} />
                           </div>
                            <p>{doc.nome}</p>
                        </div>

                        <label htmlFor={doc.nomeInput} className={estilo.divIconeUpload}>
                            <AiOutlineUpload size={23}/>
                        </label>
                        <input id={doc.nomeInput} type="file" onChange={uploadArquivo} style={{display:"none"}}/>
                    </div>
                
                )}
                </div>
            </div>

            <div className={estilo.divLista}>
                <div className={estilo.tituloLista}>
                     <AiOutlineCheckCircle />
                     <h4>Documentos Já Anexados.</h4>
                </div>
                <div className={estilo.lista}>
                <ul>
                    {documentosAnexados.map((doc) => 

                    <li key={doc.nome}>
                        <div className={estilo.listaParteNome} onClick={() => visualizarDoc(doc.urlDoc)}>
                           <div className={estilo.iconeDocumento}>
                                <AiFillFileText size={20} />
                           </div>
                            <div className={estilo.nomeData}>
                                <p>{doc.nome}</p>
                                <p style={{fontSize: "11px", marginTop:"1px"}}>{doc.data}</p>
                            </div>
                        </div>
                        <div className={estilo.acoesIcones}>
                             <AiOutlineDownload size={23} style={{cursor:"pointer"}} onClick={() => downloadArquivo(doc.valor, doc.nome)}/>
                             <AiTwotoneDelete size={23} style={{cursor:"pointer"}}/>
                        </div>
                    </li>
                    
                    )}

                </ul>
                </div>
            </div>

            </div>

            <div className={estilo.caixaGeralLicenca}>
                <div className={estilo.conteinerLicenca}>
                    <div className={estilo.tituloLicenca}>
                        <h3>Gerador de Licenciamento</h3>
                    </div>
                    
                    <div className={estilo.caixaBtn}>
                        <button style={{cursor: "pointer"}}>Gerar Licença</button>
                        <div>
                            <p>Documentos Obrigatórios:  <b>3/8</b></p>
                        </div>
                    </div>
                    
                </div>
                <div className={estilo.conteinerLicenca}>
                    <div className={estilo.tituloLicenca}>
                        <h3>Requerimento</h3>
                    </div>
                    <div className={estilo.caixaBtn}>
                        <ModalRequerimento/>
                    </div>
                    
                </div>
            </div>

            </div>
            
            <div className={estilo.conteinerNotificacoes}>
                <div className={estilo.divNot}>
                    <div className={estilo.divIntimacao}>
                        <h4>Termo de Intimação</h4>
                        <ModalIntimacao/>  
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
                                <tr>
                                    <td>15/02/2022</td>
                                    <td>17/02/2022</td>
                                    <td>Licenciamento Vencido</td>
                                    <td className={estilo.tdBtnFinalizar}>
                                        <button>Finalizar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                        
                </div>

                <div className={estilo.divNot}>
                    <div className={estilo.divIntimacao}>
                         <h4>Auto de Constatação e Advertência</h4>
                         <ModalConstatacaoAdvertencia/>
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
                                <tr>
                                    <td>15/02/2022</td>
                                    <td>17/02/2022</td>
                                    <td>Não Compriu as medidas estabelecidas</td>
                                    <td className={estilo.tdBtnFinalizar}>
                                        <button>Finalizar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
           
        </div>
    );
}

export default TelaDocumentosEstabelecimento;