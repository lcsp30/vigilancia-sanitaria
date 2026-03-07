import estilo from "./estiloFormularioCpf.module.css";
import { useState } from "react";
import api from "../../services/api";

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

 function enviarForm(event){
    event.preventDefault();
    let dadosForm = new FormData(event.target);
    const data = Object.fromEntries(dadosForm);
    
    api.post('estabelecimentos_cpf', data)
    .then(response => console.log(response.data))
    .catch(error => console.error(error)
    );
 }

    return(
        <div className={estilo.divPrincipal}>

            <div className={estilo.formCpf}>
                <form onSubmit={enviarForm} className={estilo.formInterno}>
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
                    <option value="Profissional Liberal">Profissional Liberal</option>
                    <option value="Autônomo">Autônomo</option>
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
                    <label htmlFor="orgao_expedidor">Órgão Expedidor: </label>
                    <input name="orgao_expedidor" type="text" disabled={chave}/>
                </div>

                <div>
                    <label htmlFor="data_expedicao_rg">Data da Expedição: </label>
                    <input name="data_expedicao_rg" type="date" disabled={chave}/>
                </div>
            </div>
            {selecionado == "liberal" && 
            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="escolaridade">Escolaridade: </label>
                    <input name="escolaridade" type="text" disabled={chave}/>
                </div>
                <div>
                    <label htmlFor="formacao_profissional">Formação Profissional: </label>
                    <input name="formacao_profissional" type="text" disabled={chave}/>
                </div>
            </div>}
            {selecionado == "liberal" && 
            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="registro_conselho">Registro no Conselho: </label>
                    <input name="registro_conselho" type="text" disabled={chave}/>
                </div>
                <div>
                    <label htmlFor="especializacao"> Especialização: </label>
                    <input name="especializacao" type="text" disabled={chave}/>
                </div>
            </div>}
            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="nome_fantasia">Nome Fantasia: </label>
                    <input name="nome_fantasia" type="text" style={{width:"25vw"}} disabled={chave}/>
                </div>
                <div>
                    <label htmlFor="data_inicio_funcionamento"> Data de Início de Funcionamento: </label>
                    <input name="data_inicio_funcionamento" type="date" disabled={chave}/>
                </div>
            </div>
            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="endereco">Endereço: </label>
                    <input name="endereco" type="text" style={{width:"25vw"}} disabled={chave}/>
                </div>

                <div>
                    <label htmlFor="numero_endereco">Número: </label>
                    <input name="numero_endereco"  type="number" disabled={chave}/>
                </div>
            </div>
            
            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="bairro">Bairro: </label>
                    <input name="bairro" type="text" disabled={chave}/>
                </div>

                 <div>
                    <label htmlFor="complemento_endereco">Complemento: </label>
                    <input name="complemento_endereco"  type="text" disabled={chave}/>
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
                     <input name="telefone" type="text" disabled={chave}/>
                </div>

                <div>
                    <label htmlFor="email">E-mail: </label>
                    <input name="email" type="text" disabled={chave}/>
                </div>
                
            </div>

            <div className={estilo.caixaObs}>
                <div>
                    <label htmlFor="obs">Observações:</label>
                    <textarea name="obs" disabled={chave}></textarea>
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