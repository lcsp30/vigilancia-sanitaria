import estilo from "./estiloFormularioCpf.module.css";
import { useState} from "react";
import api from "../../services/api";
import { useNavigate } from "react-router";
import { BiLogOut } from "react-icons/bi";
import { cpf} from 'cpf-cnpj-validator';

function FormularioCpf(){

 let [selecionado, setSelecionado] = useState("");
 const [dadoCpf, setDadoCpf] = useState('');
 const [erroCpf, setErroCpf] = useState('');
 const [dadoCep, setDadoCep] = useState('');
 const [dadoTelefone, setDadoTelefone] = useState('');
 let nav = useNavigate();

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

 function voltar(){
    nav(-1);
 }

 function enviarForm(event){
    event.preventDefault();
    let dadosForm = new FormData(event.target);
    let dadosJson = Object.fromEntries(dadosForm);
    
    let dadosFormatados = {
        ...dadosJson,
        cpf: dadosJson.cpf.replace(/\D/g, ""),
        cep: dadosJson.cep.replace(/\D/g, ""),
        telefone: dadosJson.telefone.replace(/\D/g, "")
    }

    api.post('estabelecimentos_cpf', dadosFormatados)
    .then(function(response){
        console.log(response.data);
        nav('/estabelecimentos-cpf');
    })
    .catch(function(error){
        console.log("Dados do Erro:", error.response.data);
    });
 }

 const mascararCpf = (valor) => {
    return valor
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
        .substring(0, 14); // Limita o tamanho máximo do CPF com máscara
};

function formatarCpf(e){
    let valor = e.target.value;
    let valorFormatado = mascararCpf(valor);

    setDadoCpf(valorFormatado);
    const apenasNumeros = valorFormatado.replace(/\D/g, "");

     if(apenasNumeros.length === 11) {
        setErroCpf(cpf.isValid(apenasNumeros) ? "" : "CPF Inválido");
        }else{
        setErroCpf(''); // Limpa o erro enquanto digita
        }
}

const mascararCep = (valor) => {
    return valor
        .replace(/\D/g, "")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .substring(0, 9);
};

const mascararTelefone = (valor) => {
    return valor
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .substring(0, 15);
};

function formatarCep(e){
    let valor = e.target.value;
    let valorFormatado = mascararCep(valor);
    setDadoCep(valorFormatado);
}

function formatarTelefone(e){
    let valor = e.target.value;
    let valorFormatado = mascararTelefone(valor);
    setDadoTelefone(valorFormatado);
}

    return(
        <div className={estilo.divPrincipal}>

            <div className={estilo.formCpf}>
                <form onSubmit={enviarForm} className={estilo.formInterno}>
                    <BiLogOut className={estilo.iconeVoltar} size={32} onClick={voltar}/>
                    <div className={estilo.divTitulo}>
                        <h2>Cadastro de Pessoa Física</h2>
                    </div>
            <div className={estilo.caixaCategoria}>
                <div>
                <label htmlFor="categoria_id" >Categoria: </label>
                  <select name="categoria_id" value={selecionado} onChange={valorSelect} required>
                    <option value="">Selecione a Categoria</option>
                    <option value="1">Profissional Liberal</option>
                    <option value="2">Autônomo</option>
                  </select>
                </div>
            </div>

             <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="tipo_estabelecimento">Tipo Estabelecimento:</label>
                    <input name="tipo_estabelecimento" placeholder="Ex:Padaria" type="text" style={{width:"25vw"}} disabled={chave} required/>
                </div>
            </div>

            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="nome">Nome:</label>
                    <input name="nome" type="text" style={{width:"25vw"}} disabled={chave} required/>
                </div>

                <div>
                    <label htmlFor="cpf">CPF: </label>
                    <input name="cpf" type="text" value={dadoCpf} onChange={formatarCpf} disabled={chave} required/>
                    {erroCpf && <p style={{ color: 'red', fontSize: '12px' , position:'absolute'}}>{erroCpf}</p>}
                </div>
            </div>
            
            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="rg">RG:</label>
                    <input name="rg" type="number" disabled={chave} required/>
                </div>

                <div>
                    <label htmlFor="orgao_expedidor">Órgão Expedidor: </label>
                    <input name="orgao_expedidor" type="text" disabled={chave} required/>
                </div>

                <div>
                    <label htmlFor="data_expedicao_rg">Data da Expedição: </label>
                    <input name="data_expedicao_rg" type="date" disabled={chave} required/>
                </div>
            </div>
            {selecionado == "1" && 
            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="escolaridade">Escolaridade: </label>
                    <input name="escolaridade" type="text" disabled={chave} required/>
                </div>
                <div>
                    <label htmlFor="formacao_profissional">Formação Profissional: </label>
                    <input name="formacao_profissional" type="text" disabled={chave} required/>
                </div>
            </div>}
            {selecionado == "1" && 
            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="registro_conselho">Registro no Conselho: </label>
                    <input name="registro_conselho" type="text" disabled={chave} required/>
                </div>
                <div>
                    <label htmlFor="especializacao">Especialização: </label>
                    <input name="especializacao" type="text" disabled={chave} required/>
                </div>
            </div>}
            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="nome_fantasia">Nome Fantasia: </label>
                    <input name="nome_fantasia" type="text" style={{width:"25vw"}} disabled={chave} required/>
                </div>
                <div>
                    <label htmlFor="data_inicio_funcionamento">Início de Funcionamento:</label>
                    <input name="data_inicio_funcionamento" type="date" disabled={chave} required/>
                </div>
            </div>
             <div className={estilo.caixaInput}>
                                    <div>
                                        <label htmlFor="atividade_principal">Atividade Principal: </label>
                                        <input type="text" name="atividade_principal" style={{width:"25vw"}} disabled={chave} required/>
                                    </div>

                                     <div>
                            <label htmlFor="divisao_tecnica">Divisão Técnica: </label>
                            <select name="divisao_tecnica" disabled={chave} required>
                                <option value="">Selecione a Divisão</option>
                                <option value="DCQA">DCQA</option>
                                <option value="DCSEP">DCSEP</option>
                                <option value="DCDM">DCDM</option>
                                <option value="DCSHT">DCSHT</option>
                            </select>
                    </div>
                            </div>
            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="endereco">Endereço: </label>
                    <input name="endereco" type="text" style={{width:"25vw"}} disabled={chave} required/>
                </div>

                <div>
                    <label htmlFor="numero_endereco">Número: </label>
                    <input name="numero_endereco"  type="number" disabled={chave} required/>
                </div>
            </div>
            
            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="bairro">Bairro: </label>
                    <input name="bairro" type="text" disabled={chave} required/>
                </div>

                  <div>
                        <label htmlFor="localidade">Localidade: </label>
                        <input name="localidade" type="text" placeholder="Ex: Zona Rural, Gleba 13" disabled={chave} required/>
                </div>
            </div>

            <div className={estilo.caixaInput}>
                 <div>
                    <label htmlFor="complemento_endereco">Complemento: </label>
                    <input name="complemento_endereco"  type="text" disabled={chave} required/>
                </div>
            </div>

            <div className={estilo.caixaInput}>
                <div>
                    <label htmlFor="municipio">Município: </label>
                    <input name="municipio" type="text" style={{width:"25vw"}} disabled={chave} required/>
                </div>

                <div>
                    <label htmlFor="cep">CEP: </label>
                    <input name="cep" type="text" value={dadoCep} onChange={formatarCep} disabled={chave} required/>
                </div>
            </div>
            <div className={estilo.caixaInput}>
                <div>
                     <label htmlFor="telefone">Telefone: </label>
                     <input name="telefone" type="text" value={dadoTelefone} onChange={formatarTelefone} disabled={chave} required/>
                </div>

                <div>
                    <label htmlFor="email">E-mail: </label>
                    <input name="email" type="text" disabled={chave} required/>
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