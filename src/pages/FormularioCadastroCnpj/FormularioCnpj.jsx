import estilo from "./estiloFormularioCnpj.module.css";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router";
import { BiLogOut } from "react-icons/bi";
import { cpf, cnpj } from 'cpf-cnpj-validator';

function FormularioCnpj(){
     let [selecionado, setSelecionado] = useState("");
     let [categorias, setCategorias] = useState([]);
    const [dados, setDados] = useState({ cnpj: '', cpf: '' });
    const [erroCnpj, setErroCnpj] = useState('');
    const [erroCpf, setErroCpf] = useState('');
     let nav = useNavigate();

useEffect(() => {
    api.get('getCategorias')
    .then(function(response){
        console.log(response.data);
        setCategorias(response.data);
    })
    .catch(function(error){
        console.error(error);
    });

}, []);
    
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

     function enviarForm(e){
        e.preventDefault();
       let dados = new FormData(e.target);
       let dadosJson  = Object.fromEntries(dados);

      const dadosTratados = {
        ...dadosJson,
        cnpj: dadosJson.cnpj.replace(/\D/g, ''),            // "48.568.872/0001-87" -> "48568872000187" (14 chars)
        cpf: dadosJson.cpf?.replace(/\D/g, ''),             // Remove pontos e traço
        cep: dadosJson.cep?.replace(/\D/g, ''),             // Remove o traço
        telefone: dadosJson.telefone?.replace(/\D/g, ''),   // Remove máscara do telefone
        insc_estadual: dadosJson.insc_estadual?.replace(/\D/g, ''),
        insc_municipal: dadosJson.insc_municipal?.replace(/\D/g, '')
    };
        console.log(dadosTratados);
        
       api.post('estabelecimentos_cnpj',dadosTratados)
       .then(function(response){
        console.log(response.data);
        nav('/estabelecimentos-cnpj');
       })
       .catch(function(error){
        console.log("Dados do Erro:", error.response.data);
        alert("Erro: " + error.response.data.error + "\nDetalhe: " + error.response.data.detail);
       });
     }

     function voltar(){
        nav(-1);
     }

    const mascararCnpj = (valor) => {
    return valor
        .replace(/\D/g, "") // Remove tudo que não é número
        .replace(/^(\d{2})(\d)/, "$1.$2") // 00.000
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3") // 00.000.000
        .replace(/\.(\d{3})(\d)/, ".$1/$2") // 00.000.000/0000
        .replace(/(\d{4})(\d)/, "$1-$2") // 00.000.000/0000-00
        .substring(0, 18); // Limita o tamanho máximo do CNPJ com máscara
};

const mascararCpf = (valor) => {
    return valor
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
        .substring(0, 14); // Limita o tamanho máximo do CPF com máscara
};

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

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    let valorComMascara = value;

    if (name === "cnpj") {
        valorComMascara = mascararCnpj(value);
    } else if (name === "cpf") {
        valorComMascara = mascararCpf(value);
    } else if (name === "cep") {
        valorComMascara = mascararCep(value);
    } else if (name === "telefone") {
        valorComMascara = mascararTelefone(value);
    }

    // Atualiza o estado com o valor já formatado
    setDados({ ...dados, [name]: valorComMascara });

    // Lógica de validação (após os 14 ou 11 números)
    const apenasNumeros = valorComMascara.replace(/\D/g, "");

    if(name === "cnpj"){
        if (name === "cnpj" && apenasNumeros.length === 14) {
            setErroCnpj(cnpj.isValid(apenasNumeros) ? "" : "CNPJ Inválido");
        }else{
            setErroCnpj(''); // Limpa o erro enquanto digita
        }
    }

    if(name === "cpf"){
         if (name === "cpf" && apenasNumeros.length === 11) {
        setErroCpf(cpf.isValid(apenasNumeros) ? "" : "CPF Inválido");
        }else{
            setErroCpf(''); // Limpa o erro enquanto digita
        }
    }

    };

        return(
            <div className={estilo.divPrincipal}>
                <div className={estilo.formCpf}>
                    <form onSubmit={enviarForm} className={estilo.formInterno}>
                        <BiLogOut className={estilo.iconeVoltar} size={32} onClick={voltar}/>
                        <div className={estilo.divTitulo}>
                            <h2>Cadastro Pessoa Jurídica</h2>
                        </div>
                <div className={estilo.caixaCategoria}>
                    <div>
                    <label htmlFor="categoria_id" >Categoria: </label>
                      <select name="categoria_id" value={selecionado} onChange={valorSelect} required>
                        <option value="">Selecione a Categoria</option>
                        {categorias.map((categoria) =>
                            <option key={categoria.id_categoria} value={categoria.id_categoria}>{categoria.nome_categoria}</option>
                        )}
                      </select>
                    </div>
                </div>
                {selecionado == 1 &&
                    <div className={estilo.caixaInput}>
                                    <div>
                                        <label htmlFor="tipo_estabelecimento">Tipo Estabelecimento:</label>
                                        <input name="tipo_estabelecimento" placeholder="Ex:Padaria" type="text" style={{width:"25vw"}} disabled={chave} required/>
                                    </div>
                    </div>
                }
                <div className={estilo.caixaInput}>
                    <div>
                        <label htmlFor="razao_social">Razão Social:</label>
                        <input name="razao_social" type="text" style={{width:"25vw"}} disabled={chave} required/>
                    </div>
    
                    <div>
                        <label htmlFor="cnpj">CNPJ: </label>
                        <input name="cnpj" type="text" value={dados.cnpj} onChange={handleInputChange}  disabled={chave} required/>
                        {erroCnpj && <p style={{ color: 'red', fontSize: '12px' , position:'absolute'}}>{erroCnpj}</p>}
                    </div>
                        
                    <div>
                        <label htmlFor="nome_fantasia">Nome Fantasia: </label>
                        <input name="nome_fantasia" type="text" style={{width:"25vw"}} disabled={chave} required/>
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
                        <label htmlFor="insc_estadual">Insc.Estadual:</label>
                        <input name="insc_estadual" type="text" disabled={chave} />
                    </div>
    
                    <div>
                        <label htmlFor="insc_municipal">Insc.Municipal: </label>
                        <input name="insc_municipal" type="text" disabled={chave} />
                    </div>

                    <div>
                        <label htmlFor="cnes">CNES (Cadastro Nacional de Estabel. de Saúde): </label>
                        <input name="cnes" type="text" disabled={chave} />
                    </div>
                </div>

                <div className={estilo.caixaInput}>
                    <div>
                        <label htmlFor="endereco">Endereço: </label>
                        <input name="endereco" type="text" style={{width:"25vw"}} disabled={chave} required/>
                    </div>

                    <div>
                        <label htmlFor="numero_endereco">Número: </label>
                        <input name="numero_endereco"  type="text" disabled={chave} required/>
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
                        <label htmlFor="municipio">Município: </label>
                        <input name="municipio" type="text" style={{width:"25vw"}} disabled={chave} required/>
                    </div>
    
                    <div>
                        <label htmlFor="cep">CEP: </label>
                        <input name="cep" type="text" value={dados.cep || ''} onChange={handleInputChange} disabled={chave} required/>
                    </div>
                </div>
                <div className={estilo.caixaInput}>
                    <div>
                         <label htmlFor="telefone">Telefone: </label>
                         <input name="telefone" type="text" value={dados.telefone || ''} onChange={handleInputChange} disabled={chave} required/>
                    </div>
    
                    <div>
                        <label htmlFor="email">E-mail: </label>
                        <input name="email" type="email" disabled={chave} required/>
                    </div>
                </div>

                <div className={estilo.caixaInput}>
                    <div>
                            <label htmlFor="data_inicio_funcionamento">Início de Funcionamento: </label>
                            <input name="data_inicio_funcionamento" type="date" disabled={chave} required/>
                    </div>
                    <div>
                            <label htmlFor="natureza_juridica">Natureza Jurídica: </label>
                            <select name="natureza_juridica" style={{width:"25vw"}} disabled={chave} required>
                                <option value="">Selecione</option>
                                <option value="LTDA">LTDA</option>
                                <option value="MEI">MEI</option>
                                <option value="SLU">SLU</option>
                                <option value="EI">EI</option>
                                <option value="SA">SA</option>
                                <option value="SS">SS</option>
                            </select>
                    </div>
                </div>

                 <div className={estilo.caixaInput}>
                                <div>
                                    <label htmlFor="nome_responsavel">Nome Responsável:</label>
                                    <input name="nome_responsavel" type="text" style={{width:"25vw"}} disabled={chave} required/>
                                </div>
                
                                <div>
                                    <label htmlFor="cpf">CPF: </label>
                                    <input name="cpf" value={dados.cpf} onChange={handleInputChange} type="text" disabled={chave} required/>
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
    
                <div className={estilo.caixaObs}>
                    <div>
                        <label htmlFor="obs">Observações:</label>
                        <textarea name="obs" id=""  disabled={chave}></textarea>
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

export default FormularioCnpj;