import estilo from "./estiloFormularioCnpj.module.css";
import { useState } from "react";

function FormularioCnpj(){
    let [chave, setChave] = useState(false);

    return(
            <div className={estilo.divPrincipal}>
                <div className={estilo.formCpf}>
                    <form action="">
                        <div className={estilo.divTitulo}>
                          <h2>Cadastro</h2>
                        </div>
                <div className={estilo.caixaInput}>
                   <label htmlFor="categoria">Categoria:</label>
                   <select name="categoria" id="">
                        <option value="">Selecione a Categoria</option>
                        <option value="liberal">Profissional Liberal</option>
                        <option value="autonomo">Autônomo</option>
                   </select>
                </div>
                <div className={estilo.caixaInput}>
                    <div>
                        <label htmlFor="razaoSocial">Razão Social: </label>
                        <input name="razaoSocial" type="text" style={{width:"30vw"}} disabled={chave}/>
                    </div>
    
                    <div>
                        <label htmlFor="cnpj">CNPJ: </label>
                        <input name="cnpj" type="number" style={{width:"15vw"}} disabled={chave}/>
                    </div>
                </div>
                <div className={estilo.caixaInput}>
                    <div>
                        <label htmlFor="nomeFantasia">Nome Fantasia: </label>
                        <input name="nomeFantasia" type="text" style={{width:"30vw"}} disabled={chave}/>
                    </div>
                </div>
                <div className={estilo.caixaInput}>
                    <div>
                        <label htmlFor="naturezaJuridica">Natureza Jurídica: </label>
                        <input name="naturezaJuridica" type="text" style={{width:"30vw"}} disabled={chave}/>
                    </div>
                    <div>
                        <label htmlFor="dataInicioFuncionamento"> Data de Início de Funcionamento: </label>
                        <input name="dataInicio" type="date" style={{width:"15vw"}} disabled={chave}/>
                    </div>
                </div>

                <div className={estilo.caixaInput}>
                    <div>
                        <label htmlFor="inscEstadual">Insc.Estadual: </label>
                        <input name="inscEstadual" type="number" disabled={chave}/>
                    </div>
    
                    <div>
                        <label htmlFor="inscMunicipal">Insc.Municipal: </label>
                        <input name="inscMunicipal" type="number" disabled={chave}/>
                    </div>
    
                    <div>
                        <label htmlFor="cnes">CNES (Estabel. de Saúde): </label>
                        <input name="cnes" type="number" disabled={chave}/>
                    </div>
                </div>
                {/* {selecionado == "liberal" && 
                <div className={estilo.caixaInput}>
                    <div>
                        <label htmlFor="escolaridade">Escolaridade: </label>
                        <input name="escolaridade" type="text" style={{width:"20vw"}} disabled={chave}/>
                    </div>
                    <div>
                        <label htmlFor="formacao">Formação Profissional: </label>
                        <input name="formacao" type="text" style={{width:"20vw"}} disabled={chave}/>
                    </div>
                </div>}
                {selecionado == "liberal" && 
                <div className={estilo.caixaInput}>
                    <div>
                        <label htmlFor="registroConselho">Registro no Conselho: </label>
                        <input name="registroConselho" type="text" style={{width:"20vw"}} disabled={chave}/>
                    </div>
                    <div>
                        <label htmlFor="especializacao"> Especialização: </label>
                        <input name="especializacao" type="text" style={{width:"20vw"}} disabled={chave}/>
                    </div>
                </div>} */}
                
                <div className={estilo.caixaInput}>
                    <div>
                        <label htmlFor="endereco">Endereço: </label>
                        <input name="endereco" type="text" disabled={chave}/>
                    </div>
    
                    <div>
                        <label htmlFor="bairro">Bairro: </label>
                        <input name="bairro" type="text" disabled={chave}/>
                    </div>
    
                    <div>
                        <label htmlFor="numero">Número: </label>
                        <input name="numero"  type="number" disabled={chave}/>
                    </div>
                    
                </div>
                <div className={estilo.caixaInput}>
                    <div>
                        <label htmlFor="municipio">Município: </label>
                        <input name="municipio" type="text" style={{width:"20vw"}} disabled={chave}/>
                    </div>
    
                    <div>
                        <label htmlFor="cep">CEP: </label>
                        <input name="cep" type="text" style={{width:"20vw"}} disabled={chave}/>
                    </div>
                </div>
                <div className={estilo.caixaInput}>
                    <div>
                         <label htmlFor="telefone">Telefone: </label>
                         <input type="text" style={{width:"20vw"}} disabled={chave}/>
                    </div>
    
                    <div>
                        <label htmlFor="email">E-mail: </label>
                        <input type="text" style={{width:"20vw"}} disabled={chave}/>
                    </div>
                </div>
                <div className={estilo.caixaInput}>
                    <div>
                        <label htmlFor="nome">Nome: </label>
                        <input name="nome" type="text" style={{width:"20vw"}} disabled={chave}/>
                     </div>
                
                     <div>
                        <label htmlFor="cpf">CPF: </label>
                        <input name="cpf" type="number" style={{width:"20vw"}} disabled={chave}/>
                     </div>
                    </div>
                    <div className={estilo.caixaInput}>
                        <div>
                            <label htmlFor="rg">RG: </label>
                            <input name="rg" type="number" disabled={chave}/>
                        </div>
                    
                        <div>
                            <label htmlFor="orgaoExpedidor">Órgão Expedidor: </label>
                            <input name="orgaoExpedidor" type="text" disabled={chave}/>
                        </div>
                    
                        <div>
                            <label htmlFor="dataExpedicao">Data da Expedição: </label>
                            <input name="dataExpedicao" type="date" disabled={chave}/>
                        </div>
                        </div>
    
                <div className={estilo.caixaInput}>
                    <label htmlFor="obs">Observações:</label>
                    <textarea name="" id="" cols={90} rows={10} disabled={chave}></textarea>
                </div>
            </form>
                </div>
            </div>
            
        );
}

export default FormularioCnpj;