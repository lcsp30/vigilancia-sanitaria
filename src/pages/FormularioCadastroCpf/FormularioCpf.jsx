import estilo from "./estiloFormularioCpf.module.css";
import { useState } from "react";

function FormularioCpf(){

 let [selecionado, setSelecionado] = useState("");

 let [chave, setChave] = useState(true);
 function valorSelect(e){
    let valor = e.target.value;
    setSelecionado(valor);
    if(valor != ""){
        setChave(false);
    }else{
        setChave(true);
    }
 }

    return(
        <div className={estilo.divPrincipal}>

            <div className={estilo.formCpf}>
                <form action="" className={estilo.formInterno}>
                    <div className={estilo.divTitulo}>
                        {selecionado == "" && <h2>Cadastro</h2>}
                        {selecionado == "liberal" && <h2>Cadastro Profissional Liberal</h2>}
                        {selecionado == "autonomo" && <h2>Cadastro Requerente Autônomo</h2>}
                    </div>
            <div className={estilo.caixaCategoria}>
                <div>
                <label htmlFor="categoria" >Categoria: </label>
                  <select name="categoria" id="" value={selecionado} onChange={valorSelect}>
                    <option value="">Selecione a Categoria</option>
                    <option value="liberal">Profissional Liberal</option>
                    <option value="autonomo">Autônomo</option>
                  </select>
                </div>
            </div>
            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="nome">Nome:</label>
                    <input name="nome" type="text" style={{width:"25vw"}} disabled={chave}/>
                </div>

                <div>
                    <label htmlFor="cpf">CPF: </label>
                    <input name="cpf" type="number" disabled={chave}/>
                </div>
            </div>
            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="rg">RG:</label>
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
            {selecionado == "liberal" && 
            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="escolaridade">Escolaridade: </label>
                    <input name="escolaridade" type="text" disabled={chave}/>
                </div>
                <div>
                    <label htmlFor="formacao">Formação Profissional: </label>
                    <input name="formacao" type="text" disabled={chave}/>
                </div>
            </div>}
            {selecionado == "liberal" && 
            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="registroConselho">Registro no Conselho: </label>
                    <input name="registroConselho" type="text" disabled={chave}/>
                </div>
                <div>
                    <label htmlFor="especializacao"> Especialização: </label>
                    <input name="especializacao" type="text" disabled={chave}/>
                </div>
            </div>}
            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="nomeFantasia">Nome Fantasia: </label>
                    <input name="nomeFantasia" type="text" style={{width:"25vw"}} disabled={chave}/>
                </div>
                <div>
                    <label htmlFor="dataInicioFuncionamento"> Data de Início de Funcionamento: </label>
                    <input name="dataInicio" type="date" disabled={chave}/>
                </div>
            </div>
            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="endereco">Endereço: </label>
                    <input name="endereco" type="text" style={{width:"25vw"}} disabled={chave}/>
                </div>

                <div>
                    <label htmlFor="numero">Número: </label>
                    <input name="numero"  type="number" disabled={chave}/>
                </div>
                
                <div>
                    <label htmlFor="bairro">Bairro: </label>
                    <input name="bairro" type="text" disabled={chave}/>
                </div>
            </div>
            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="municipio">Município: </label>
                    <input name="municipio" type="text" style={{width:"25vw"}} disabled={chave}/>
                </div>

                <div>
                    <label htmlFor="cep">CEP: </label>
                    <input name="cep" type="text" disabled={chave}/>
                </div>
            </div>
            <div className={estilo.caixaInput}>
                <div>
                     <label htmlFor="telefone">Telefone: </label>
                     <input type="text" disabled={chave}/>
                </div>

                <div>
                    <label htmlFor="email">E-mail: </label>
                    <input type="text" disabled={chave}/>
                </div>
                
            </div>

            <div className={estilo.caixaObs}>
                <div>
                    <label htmlFor="obs">Observações:</label>
                    <textarea name="" id=""  disabled={chave}></textarea>
                </div>
            </div>

            <div className={estilo.caixaBtn}>
                <button type="submit">Cadastrar</button>
            </div>
        </form>
            </div>
        </div>
    );
}

export default FormularioCpf;