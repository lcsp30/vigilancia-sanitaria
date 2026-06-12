// Modal de edição de dados cadastrais: carrega dados, aplica máscaras (CPF/CNPJ/CEP/telefone), valida dígitos e envia normalizados.
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./cssComponents/estiloModalEditarEstb.module.css";
import api from "../services/api";
import { useState, useEffect } from "react";
import { cpf, cnpj } from "cpf-cnpj-validator";

/**
 * @param {Object} props
 * @param {number} props.id - ID do estabelecimento
 * @param {string} props.tipoEstabelecimento - "cpf" ou "cnpj"
 * @param {Function} props.menuDoc - Callback para fechar menu dropdown pai
 */
function ModalEditarEstb({ id, tipoEstabelecimento, menuDoc }) {
  let [fechar, setFechar] = useState(false);
  let [dadosEstb, setDadosEstb] = useState({});
  const [dados, setDados] = useState({ cnpj: "", cpf: "", cep: "", telefone: "" });
  const [erroCnpj, setErroCnpj] = useState("");
  const [erroCpf, setErroCpf] = useState("");

  // Busca dados cadastrais do estabelecimento pelo ID e tipo (CPF ou CNPJ).
  function buscarDados() {
    if (tipoEstabelecimento == "cnpj") {
      api
        .get(`getEstabelecimentos_cnpj/${id}`)
        .then(function (response){
          let dados = response.data;
          setDadosEstb(dados);
          setDados({ cnpj: dados.cnpj, cpf: dados.cpf, cep: dados.cep, telefone: dados.telefone });
          console.log(dados);
        })
        .catch(function (erro) {
          console.log(erro.data);
        });
    } else if (tipoEstabelecimento == "cpf") {
      api
        .get(`getEstabelecimentos_cpf/${id}`)
        .then(function (response) {
          let dados = response.data;
          setDadosEstb(dados);
          setDados({ cnpj: dados.cnpj, cpf: dados.cpf, cep: dados.cep, telefone: dados.telefone });
          console.log(dados);
        })
        .catch(function (error) {
          console.log(error.data);
        });
    }
  }

  // Aplica máscara de CNPJ (##.###.###/####-##) removendo não-dígitos e limitando a 18 caracteres.
  const mascararCnpj = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 18);
  };

  // Aplica máscara de CPF (###.###.###-##) removendo não-dígitos e limitando a 14 caracteres.
  const mascararCpf = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .substring(0, 14);
  };

  // Aplica máscara de CEP (#####-###) removendo não-dígitos e limitando a 9 caracteres.
  const mascararCep = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 9);
  };

  // Aplica máscara de telefone ((##) #####-####) removendo não-dígitos e limitando a 15 caracteres.
  const mascararTelefone = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  };

  // Handler unificado de input: aplica máscara conforme o campo e valida dígito verificador ao atingir comprimento completo.
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

    setDados({ ...dados, [name]: valorComMascara });

    const apenasNumeros = valorComMascara.replace(/\D/g, "");

    if (name === "cnpj") {
      if (apenasNumeros.length === 14) {
        setErroCnpj(cnpj.isValid(apenasNumeros) ? "" : "CNPJ Inválido");
      } else {
        setErroCnpj("");
      }
    }

    if (name === "cpf") {
      if (apenasNumeros.length === 11) {
        setErroCpf(cpf.isValid(apenasNumeros) ? "" : "CPF Inválido");
      } else {
        setErroCpf("");
      }
    }
  };

// Envia formulário de edição CNPJ com campos normalizados (apenas dígitos) para o backend.
function enviarFormCnpj(e){
    e.preventDefault();

    let dadosForm = new FormData(e.target);
    let dadosJson = Object.fromEntries(dadosForm);

    const dadosTratados = {
      ...dadosJson,
      cnpj: dadosJson.cnpj?.replace(/\D/g, ''),
      cpf: dadosJson.cpf?.replace(/\D/g, ''),
      cep: dadosJson.cep?.replace(/\D/g, ''),
      telefone: dadosJson.telefone?.replace(/\D/g, ''),
      insc_estadual: dadosJson.insc_estadual?.replace(/\D/g, ''),
      insc_municipal: dadosJson.insc_municipal?.replace(/\D/g, '')
    };

    console.log(dadosTratados);

    api.put(`estabelecimentos_cnpj/${id}`, dadosTratados)
    .then(function(response){
        console.log(response.data);
        setFechar(false);
        menuDoc();
    })
    .catch(function(error){
        console.error(error.data);
    });
  }

// Envia formulário de edição CPF com campos normalizados (apenas dígitos) para o backend.
function enviarFormCpf(e){
   e.preventDefault();

    let dadosForm = new FormData(e.target);
    let dadosJson = Object.fromEntries(dadosForm);

    const dadosTratados = {
      ...dadosJson,
      cpf: dadosJson.cpf?.replace(/\D/g, ''),
      cep: dadosJson.cep?.replace(/\D/g, ''),
      telefone: dadosJson.telefone?.replace(/\D/g, '')
    };

    api.put(`estabelecimentos_cpf/${id}`, dadosTratados)
    .then(function(response){
        console.log(response.data.res);
        setFechar(false);
        menuDoc();
    })
    .catch(function(error){
        console.error(error.data);
    });
}

  return (
    <Dialog.Root open={fechar} onOpenChange={setFechar}>
      <Dialog.Trigger asChild>
        <div className={styles.btnMenu} onClick={buscarDados}>
          <p>Editar Cadastro</p>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.DialogOverlay} />
        <Dialog.Content
          className={styles.DialogContent}
          aria-describedby={undefined}
          onPointerDownOutside={(event) => event.preventDefault()}
        >
          <Dialog.Title className={styles.DialogTitle}>
            Editar Cadastro do Estabelecimento
          </Dialog.Title>

          {tipoEstabelecimento == "cnpj" && (
            <form key={dadosEstb.updated_at} className={styles.formModal} onSubmit={enviarFormCnpj}>
              <div className={styles.divInput}>
                <div className={styles.inputGroup}>
                  <label htmlFor="razao_social">Razão Social:</label>
                  <input
                    name="razao_social"
                    defaultValue={dadosEstb.razao_social}
                    type="text"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="cnpj">CNPJ: </label>
                  <input
                    name="cnpj"
                    type="text"
                    value={dados.cnpj}
                    onChange={handleInputChange}
                    required
                  />
                  {erroCnpj && (
                    <p className={styles.errorMsg}>
                      {erroCnpj}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.divInput}>
                <div className={styles.inputGroup}>
                  <label htmlFor="nome_fantasia">Nome Fantasia: </label>
                  <input
                    name="nome_fantasia"
                    defaultValue={dadosEstb.nome_fantasia}
                    type="text"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="atividade_principal">Atividade Principal: </label>
                  <input
                    type="text"
                    name="atividade_principal"
                    defaultValue={dadosEstb.atividade_principal}
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div className={styles.inputGroup}>
                  <label htmlFor="divisao_tecnica">Divisão Técnica: </label>
                  <select
                    name="divisao_tecnica"
                    defaultValue={dadosEstb.divisao_tecnica}
                    required
                  >
                    <option value="">Selecione a Divisão</option>
                    <option value="DCQA">DCQA</option>
                    <option value="DCSEP">DCSEP</option>
                    <option value="DCDM">DCDM</option>
                    <option value="DCSHT">DCSHT</option>
                  </select>
                </div>
              </div>

              <div className={styles.divInput}>
                <div className={styles.inputGroup}>
                  <label htmlFor="insc_estadual">Insc.Estadual:</label>
                  <input
                    name="insc_estadual"
                    defaultValue={dadosEstb.insc_estadual}
                    type="text"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="insc_municipal">Insc.Municipal: </label>
                  <input
                    name="insc_municipal"
                    defaultValue={dadosEstb.insc_municipal}
                    type="text"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="cnes">CNES (Estabel. de Saúde): </label>
                  <input
                    name="cnes"
                    defaultValue={dadosEstb.cnes}
                    type="text"
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div className={styles.inputGroup}>
                  <label htmlFor="endereco">Endereço: </label>
                  <input
                    name="endereco"
                    defaultValue={dadosEstb.endereco}
                    type="text"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="numero_endereco">Número: </label>
                  <input
                    name="numero_endereco"
                    defaultValue={dadosEstb.numero_endereco}
                    type="text"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="bairro">Bairro: </label>
                  <input
                    name="bairro"
                    defaultValue={dadosEstb.bairro}
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div className={styles.inputGroup}>
                  <label htmlFor="localidade">Localidade: </label>
                  <input
                    name="localidade"
                    defaultValue={dadosEstb.localidade}
                    type="text"
                    placeholder="Ex: Zona Rural, Gleba 13"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="municipio">Município: </label>
                  <input
                    name="municipio"
                    defaultValue={dadosEstb.municipio}
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div className={styles.inputGroup}>
                  <label htmlFor="cep">CEP: </label>
                  <input
                    name="cep"
                    type="text"
                    value={dados.cep || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="telefone">Telefone: </label>
                  <input
                    name="telefone"
                    type="text"
                    value={dados.telefone || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">E-mail: </label>
                  <input
                    name="email"
                    defaultValue={dadosEstb.email}
                    type="text"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="data_inicio_funcionamento">
                    Início de Funcionamento:{" "}
                  </label>
                  <input
                    name="data_inicio_funcionamento"
                    defaultValue={dadosEstb.data_inicio_funcionamento}
                    type="date"
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div className={styles.inputGroup}>
                  <label htmlFor="natureza_juridica">Natureza Jurídica: </label>
                  <select
                    name="natureza_juridica"
                    defaultValue={dadosEstb.natureza_juridica}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="LTDA">LTDA</option>
                    <option value="MEI">MEI</option>
                    <option value="SLU">SLU</option>
                    <option value="EI">EI</option>
                    <option value="SA">SA</option>
                    <option value="SS">SS</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="nome_responsavel">Nome:</label>
                  <input
                    name="nome_responsavel"
                    defaultValue={dadosEstb.nome_responsavel}
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div className={styles.inputGroup}>
                  <label htmlFor="cpf">CPF: </label>
                  <input
                    name="cpf"
                    value={dados.cpf}
                    onChange={handleInputChange}
                    type="text"
                    required
                  />
                  {erroCpf && (
                    <p className={styles.errorMsg}>
                      {erroCpf}
                    </p>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="rg">RG:</label>
                  <input
                    name="rg"
                    defaultValue={dadosEstb.rg}
                    type="number"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="orgao_expedidor">Órgão Expedidor: </label>
                  <input
                    name="orgao_expedidor"
                    defaultValue={dadosEstb.orgao_expedidor}
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div className={styles.inputGroup}>
                  <label htmlFor="data_expedicao_rg">Data da Expedição: </label>
                  <input
                    name="data_expedicao_rg"
                    defaultValue={dadosEstb.data_expedicao_rg}
                    type="date"
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div className={styles.inputGroupFull}>
                  <label htmlFor="obs">Observações:</label>
                  <textarea
                    name="obs"
                    defaultValue={dadosEstb.obs}
                    className={styles.textAreaField}
                  ></textarea>
                </div>
              </div>

              <div className={styles.divBtnSalvar}>
                <button type="submit" className={styles.btnSalvar}>
                  Salvar
                </button>
              </div>
            </form>
          )}

          {tipoEstabelecimento == "cpf" && (
            <form key={dadosEstb.updated_at} className={styles.formModal} onSubmit={enviarFormCpf}>
              <div className={styles.divInput}>
                <div className={styles.inputGroup}>
                  <label htmlFor="nome">Nome:</label>
                  <input
                    name="nome"
                    type="text"
                    defaultValue={dadosEstb.nome}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="cpf">CPF: </label>
                  <input
                    name="cpf"
                    type="text"
                    value={dados.cpf}
                    onChange={handleInputChange}
                    required
                  />
                  {erroCpf && (
                    <p className={styles.errorMsg}>
                      {erroCpf}
                    </p>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="tipo_estabelecimento">Tipo Estabelecimento:</label>
                  <input
                    name="tipo_estabelecimento"
                    defaultValue={dadosEstb.tipo_estabelecimento}
                    placeholder="Ex:Padaria"
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div className={styles.inputGroup}>
                  <label htmlFor="rg">RG:</label>
                  <input name="rg" type="number" defaultValue={dadosEstb.rg} required />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="orgao_expedidor">Órgão Expedidor: </label>
                  <input
                    name="orgao_expedidor"
                    defaultValue={dadosEstb.orgao_expedidor}
                    type="text"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="data_expedicao_rg">Data da Expedição: </label>
                  <input
                    name="data_expedicao_rg"
                    defaultValue={dadosEstb.data_expedicao_rg}
                    type="date"
                    required
                  />
                </div>
              </div>
              {dadosEstb.categoria_id == 1 && (
                <div className={styles.divInput}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="escolaridade">Escolaridade: </label>
                    <input
                      name="escolaridade"
                      defaultValue={dadosEstb.escolaridade}
                      type="text"
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="formacao_profissional">
                      Formação Profissional:{" "}
                    </label>
                    <input
                      name="formacao_profissional"
                      defaultValue={dadosEstb.formacao_profissional}
                      type="text"
                      required
                    />
                  </div>
                </div>
              )}
              {dadosEstb.categoria_id == 1 && (
                <div className={styles.divInput}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="registro_conselho">
                      Registro no Conselho:{" "}
                    </label>
                    <input
                      name="registro_conselho"
                      defaultValue={dadosEstb.registro_conselho}
                      type="text"
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="especializacao">Especialização: </label>
                    <input
                      name="especializacao"
                      defaultValue={dadosEstb.especializacao}
                      type="text"
                      required
                    />
                  </div>
                </div>
              )}
              <div className={styles.divInput}>
                <div className={styles.inputGroup}>
                  <label htmlFor="nome_fantasia">Nome Fantasia: </label>
                  <input
                    name="nome_fantasia"
                    defaultValue={dadosEstb.nome_fantasia}
                    type="text"
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="data_inicio_funcionamento">
                    Início de Funcionamento:
                  </label>
                  <input
                    name="data_inicio_funcionamento"
                    defaultValue={dadosEstb.data_inicio_funcionamento}
                    type="date"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="atividade_principal">Atividade Principal: </label>
                  <input
                    type="text"
                    name="atividade_principal"
                    defaultValue={dadosEstb.atividade_principal}
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div className={styles.inputGroup}>
                  <label htmlFor="divisao_tecnica">Divisão Técnica: </label>
                  <select
                    name="divisao_tecnica"
                    defaultValue={dadosEstb.divisao_tecnica}
                    required
                  >
                    <option value="">Selecione a Divisão</option>
                    <option value="DCQA">DCQA</option>
                    <option value="DCSEP">DCSEP</option>
                    <option value="DCDM">DCDM</option>
                    <option value="DCSHT">DCSHT</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="endereco">Endereço: </label>
                  <input
                    name="endereco"
                    defaultValue={dadosEstb.endereco}
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div className={styles.inputGroup}>
                  <label htmlFor="numero_endereco">Número: </label>
                  <input
                    name="numero_endereco"
                    defaultValue={dadosEstb.numero_endereco}
                    type="number"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="bairro">Bairro: </label>
                  <input name="bairro" defaultValue={dadosEstb.bairro} type="text" required />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="localidade">Localidade: </label>
                  <input
                    name="localidade"
                    defaultValue={dadosEstb.localidade}
                    type="text"
                    placeholder="Ex: Zona Rural, Gleba 13"
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div className={styles.inputGroup}>
                  <label htmlFor="complemento_endereco">Complemento: </label>
                  <input
                    name="complemento_endereco"
                    defaultValue={dadosEstb.complemento_endereco}
                    type="text"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="municipio">Município: </label>
                  <input
                    name="municipio"
                    defaultValue={dadosEstb.municipio}
                    type="text"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="cep">CEP: </label>
                  <input
                    name="cep"
                    type="text"
                    value={dados.cep || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div className={styles.inputGroup}>
                  <label htmlFor="telefone">Telefone: </label>
                  <input
                    name="telefone"
                    type="text"
                    value={dados.telefone || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="email">E-mail: </label>
                  <input name="email" defaultValue={dadosEstb.email} type="text" required />
                </div>
              </div>

              <div className={styles.divInput}>
                <div className={styles.inputGroupFull}>
                  <label htmlFor="obs">Observações:</label>
                  <textarea
                    name="obs"
                    defaultValue={dadosEstb.obs}
                    className={styles.textAreaField}
                  ></textarea>
                </div>
              </div>

              <div className={styles.divBtnSalvar}>
                <button type="submit" className={styles.btnSalvar}>
                  Salvar
                </button>
              </div>
            </form>
          )}

          <Dialog.Close asChild>
            <div className={styles.IconButton} onClick={() => menuDoc()} aria-label="Close">
              X
            </div>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ModalEditarEstb;