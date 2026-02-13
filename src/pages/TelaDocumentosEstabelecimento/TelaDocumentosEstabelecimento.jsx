import estilo from "./estiloTelaDocumentosEstabelecimento.module.css";
import { AiTwotoneDelete ,AiFillFileText, AiOutlineDownload, AiOutlineUpload, AiOutlineCheckCircle, AiFillWarning } from "react-icons/ai";


function TelaDocumentosEstabelecimento(){
    function uploadArquivo(e){
        let arquivo = e.target.files[0];

        if(arquivo){
            
            console.log(arquivo);
        }
    }


    return(
        <div className={estilo.divPrincipal}>
            <div className={estilo.divTitulo}>
                <div>
                    <h2>Documentação Estabelecimento</h2>
                    <p>Nome Estabelecimento / CNPJ</p>
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
                    <div className={estilo.documentosPendentes}>
                        <div className={estilo.listaParteNome}>
                            <div className={estilo.iconeDocumento}>
                                <AiFillFileText size={20} />
                           </div>
                            <p>Nome do Documento</p>
                        </div>

                        <label htmlFor="rg" className={estilo.divIconeUpload}>
                            <AiOutlineUpload size={23}/>
                        </label>
                        <input id="rg" type="file" onChange={uploadArquivo} style={{display:"none"}}/>

                    </div>
                    <div className={estilo.documentosPendentes}>
                        <div className={estilo.listaParteNome}>
                            <div className={estilo.iconeDocumento}>
                                <AiFillFileText size={20} />
                           </div>
                            <p>Nome do Documento</p>
                        </div>
                        
                        <label htmlFor="cpf" className={estilo.divIconeUpload}>
                            <AiOutlineUpload size={23}/>
                        </label>
                        <input id="cpf" type="file" onChange={uploadArquivo} style={{display:"none"}}/>
                    </div>
                </div>
            </div>

            <div className={estilo.divLista}>
                <div className={estilo.tituloLista}>
                     <AiOutlineCheckCircle />
                     <h4>Documentos Já Anexados.</h4>
                </div>
                <div className={estilo.lista}>
                <ul>
                    <li>
                        <div className={estilo.listaParteNome}>
                           <div className={estilo.iconeDocumento}>
                                <AiFillFileText size={20} />
                           </div>
                            <div className={estilo.nomeData}>
                                <p>Nome do Documento</p>
                                <p style={{fontSize: "11px", marginTop:"1px"}}> 16/03/2025</p>
                            </div>
                        </div>
                        <div className={estilo.acoesIcones}>
                             <AiOutlineDownload size={23} style={{cursor:"pointer"}}/>
                             <AiTwotoneDelete size={23} style={{cursor:"pointer"}}/>
                        </div>
                    </li>
                    <li>
                        <div className={estilo.listaParteNome}>
                           <div className={estilo.iconeDocumento}>
                                <AiFillFileText size={20} />
                           </div>
                            <div className={estilo.nomeData}>
                                <p>Nome do Documento</p>
                                <p style={{fontSize: "11px", marginTop:"1px"}}> 16/03/2025</p>
                            </div>
                        </div>
                        <div className={estilo.acoesIcones}>
                             <AiOutlineDownload size={23} style={{cursor:"pointer"}}/>
                             <AiTwotoneDelete size={23} style={{cursor:"pointer"}}/>
                        </div>
                    </li>
                    <li>
                        <div className={estilo.listaParteNome}>
                           <div className={estilo.iconeDocumento}>
                                <AiFillFileText size={20} />
                           </div>
                            <div className={estilo.nomeData}>
                                <p>Nome do Documento</p>
                                <p style={{fontSize: "11px", marginTop:"1px"}}> 16/03/2025</p>
                            </div>
                        </div>
                        <div className={estilo.acoesIcones}>
                             <AiOutlineDownload size={23} style={{cursor:"pointer"}}/>
                             <AiTwotoneDelete size={23} style={{cursor:"pointer"}}/>
                        </div>
                    </li>
                </ul>
                </div>
            </div>

            </div>

            <div className={estilo.conteinerLicenca}>
                <div>
                    <div className={estilo.tituloLicenca}>
                        <h3>Gerador de Licenciamento</h3>
                    </div>
                    
                    <div className={estilo.caixaBtn}>
                        <button>Gerar Licença</button>
                        <div>
                            <p>Documentos Obrigatórios:  <b>3/8</b></p>
                        </div>
                    </div>
                    
                </div>
            </div>

            </div>
            
           
        </div>
    );
}

export default TelaDocumentosEstabelecimento;