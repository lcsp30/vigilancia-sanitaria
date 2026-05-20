import * as Dialog from "@radix-ui/react-dialog";
import styles from "./cssComponents/estiloModalEditarEstb.module.css";
import api from "../services/api";
import { useState, useEffect } from "react";
import { cpf, cnpj } from "cpf-cnpj-validator";

function ModalEditarEstb({ id, tipoEstabelecimento, menuDoc }) {
  let [fechar, setFechar] = useState(false);
  let [dadosEstb, setDadosEstb] = useState({});
  const [dados, setDados] = useState({ cnpj: "", cpf: "", cep: "", telefone: "" });
  const [erroCnpj, setErroCnpj] = useState("");
  const [erroCpf, setErroCpf] = useState("");

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
        .catch(function (error) {
          console.log(error.data);
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

  const mascararCnpj = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 18);
  };

  const mascararCpf = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .substring(0, 14);
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
                <div>
                  <label htmlFor="razao_social">Razão Social:</label>
                  <input
                    name="razao_social"
                    defaultValue={dadosEstb.razao_social}
                    style={{ width: "33vw" }}
                    type="text"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cnpj">CNPJ: </label>
                  <input
                    name="cnpj"
                    type="text"
                    value={dados.cnpj}
                    style={{ width: "33vw" }}
                    onChange={handleInputChange}
                    required
                  />
                  {erroCnpj && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "12px",
                        position: "absolute",
                      }}
                    >
                      {erroCnpj}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.divInput}>
                <div>
                  <label htmlFor="nome_fantasia">Nome Fantasia: </label>
                  <input
                    name="nome_fantasia"
                    defaultValue={dadosEstb.nome_fantasia}
                    type="text"
                    style={{ width: "33vw" }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="atividade_principal">Atividade Principal: </label>
                  <input
                    type="text"
                    name="atividade_principal"
                    defaultValue={dadosEstb.atividade_principal}
                    style={{ width: "33vw" }}
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div>
                  <label htmlFor="divisao_tecnica">Divisão Técnica: </label>
                  <select
                    name="divisao_tecnica"
                    defaultValue={dadosEstb.divisao_tecnica}
                    style={{ width: "33vw" }}
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
                <div>
                  <label htmlFor="insc_estadual">Insc.Estadual:</label>
                  <input
                    name="insc_estadual"
                    defaultValue={dadosEstb.insc_estadual}
                    type="text"
                    style={{ width: "21.7vw" }}
                  />
                </div>

                <div>
                  <label htmlFor="insc_municipal">Insc.Municipal: </label>
                  <input
                    name="insc_municipal"
                    defaultValue={dadosEstb.insc_municipal}
                    type="text"
                    style={{ width: "21.7vw" }}
                  />
                </div>

                <div>
                  <label htmlFor="cnes">CNES (Estabel. de Saúde): </label>
                  <input
                    name="cnes"
                    defaultValue={dadosEstb.cnes}
                    type="text"
                    style={{ width: "21.7vw" }}
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div>
                  <label htmlFor="endereco">Endereço: </label>
                  <input
                    name="endereco"
                    defaultValue={dadosEstb.endereco}
                    type="text"
                    style={{ width: "21.7vw" }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="numero_endereco">Número: </label>
                  <input
                    name="numero_endereco"
                    defaultValue={dadosEstb.numero_endereco}
                    type="text"
                    style={{ width: "21.7vw" }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="bairro">Bairro: </label>
                  <input
                    name="bairro"
                    defaultValue={dadosEstb.bairro}
                    type="text"
                    style={{ width: "21.7vw" }}
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div>
                  <label htmlFor="localidade">Localidade: </label>
                  <input
                    name="localidade"
                    defaultValue={dadosEstb.localidade}
                    type="text"
                    placeholder="Ex: Zona Rural, Gleba 13"
                    style={{ width: "21.7vw" }}
                  />
                </div>

                <div>
                  <label htmlFor="municipio">Município: </label>
                  <input
                    name="municipio"
                    defaultValue={dadosEstb.municipio}
                    type="text"
                    style={{ width: "21.7vw" }}
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div>
                  <label htmlFor="cep">CEP: </label>
                  <input
                    name="cep"
                    type="text"
                    value={dados.cep || ''}
                    onChange={handleInputChange}
                    style={{ width: "33vw" }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="telefone">Telefone: </label>
                  <input
                    name="telefone"
                    type="text"
                    value={dados.telefone || ''}
                    onChange={handleInputChange}
                    style={{ width: "33vw" }}
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div>
                  <label htmlFor="email">E-mail: </label>
                  <input
                    name="email"
                    defaultValue={dadosEstb.email}
                    type="text"
                    style={{ width: "33vw" }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="data_inicio_funcionamento">
                    Início de Funcionamento:{" "}
                  </label>
                  <input
                    name="data_inicio_funcionamento"
                    defaultValue={dadosEstb.data_inicio_funcionamento}
                    type="date"
                    style={{ width: "33vw" }}
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div>
                  <label htmlFor="natureza_juridica">Natureza Jurídica: </label>
                  <select
                    name="natureza_juridica"
                    defaultValue={dadosEstb.natureza_juridica}
                    style={{ width: "33vw" }}
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

                <div>
                  <label htmlFor="nome_responsavel">Nome:</label>
                  <input
                    name="nome_responsavel"
                    defaultValue={dadosEstb.nome_responsavel}
                    type="text"
                    style={{ width: "33vw" }}
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div>
                  <label htmlFor="cpf">CPF: </label>
                  <input
                    name="cpf"
                    value={dados.cpf}
                    onChange={handleInputChange}
                    type="text"
                    style={{ width: "21.7vw" }}
                    required
                  />
                  {erroCpf && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "12px",
                        position: "absolute",
                      }}
                    >
                      {erroCpf}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="rg">RG:</label>
                  <input
                    name="rg"
                    defaultValue={dadosEstb.rg}
                    type="number"
                    style={{ width: "21.7vw" }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="orgao_expedidor">Órgão Expedidor: </label>
                  <input
                    name="orgao_expedidor"
                    defaultValue={dadosEstb.orgao_expedidor}
                    type="text"
                    style={{ width: "21.7vw" }}
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div>
                  <label htmlFor="data_expedicao_rg">Data da Expedição: </label>
                  <input
                    name="data_expedicao_rg"
                    defaultValue={dadosEstb.data_expedicao_rg}
                    type="date"
                    style={{ width: "21.7vw" }}
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div>
                  <label htmlFor="obs">Observações:</label>
                  <textarea
                    name="obs"
                    defaultValue={dadosEstb.obs}
                    style={{ width: "67vw", height: "40px" }}
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
                <div>
                  <label htmlFor="categoria_id">Categoria: </label>
                  <select
                    name="categoria_id"
                    defaultValue={dadosEstb.categoria_id}
                    style={{ width: "33vw" }}
                    required
                  >
                    <option value="">Selecione a Categoria</option>
                    <option value="1">Profissional Liberal</option>
                    <option value="2">Autônomo</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tipo_estabelecimento">Tipo Estabelecimento:</label>
                  <input
                    name="tipo_estabelecimento"
                    defaultValue={dadosEstb.tipo_estabelecimento}
                    placeholder="Ex:Padaria"
                    type="text"
                    style={{ width: "33vw" }}
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div>
                  <label htmlFor="nome">Nome:</label>
                  <input
                    name="nome"
                    type="text"
                    defaultValue={dadosEstb.nome}
                    style={{ width: "33vw" }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cpf">CPF: </label>
                  <input
                    name="cpf"
                    type="text"
                    value={dados.cpf}
                    onChange={handleInputChange}
                    style={{ width: "33vw" }}
                    required
                  />
                  {erroCpf && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "12px",
                        position: "absolute",
                      }}
                    >
                      {erroCpf}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.divInput}>
                <div>
                  <label htmlFor="rg">RG:</label>
                  <input name="rg" type="number" style={{ width: "21.7vw" }} defaultValue={dadosEstb.rg} required />
                </div>

                <div>
                  <label htmlFor="orgao_expedidor">Órgão Expedidor: </label>
                  <input
                    name="orgao_expedidor"
                    defaultValue={dadosEstb.orgao_expedidor}
                    type="text"
                    style={{ width: "21.7vw" }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="data_expedicao_rg">Data da Expedição: </label>
                  <input
                    name="data_expedicao_rg"
                    defaultValue={dadosEstb.data_expedicao_rg}
                    type="date"
                    style={{ width: "21.7vw" }}
                    required
                  />
                </div>
              </div>
              {dadosEstb.categoria_id == 1 && (
                <div className={styles.divInput}>
                  <div>
                    <label htmlFor="escolaridade">Escolaridade: </label>
                    <input
                      name="escolaridade"
                      defaultValue={dadosEstb.escolaridade}
                      type="text"
                      style={{ width: "33vw" }}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="formacao_profissional">
                      Formação Profissional:{" "}
                    </label>
                    <input
                      name="formacao_profissional"
                      defaultValue={dadosEstb.formacao_profissional}
                      type="text"
                      style={{ width: "33vw" }}
                      required
                    />
                  </div>
                </div>
              )}
              {dadosEstb.categoria_id == 1 && (
                <div className={styles.divInput}>
                  <div>
                    <label htmlFor="registro_conselho">
                      Registro no Conselho:{" "}
                    </label>
                    <input
                      name="registro_conselho"
                      defaultValue={dadosEstb.registro_conselho}
                      type="text"
                      style={{ width: "33vw" }}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="especializacao">Especialização: </label>
                    <input
                      name="especializacao"
                      defaultValue={dadosEstb.especializacao}
                      type="text"
                      style={{ width: "33vw" }}
                      required
                    />
                  </div>
                </div>
              )}
              <div className={styles.divInput}>
                <div>
                  <label htmlFor="nome_fantasia">Nome Fantasia: </label>
                  <input
                    name="nome_fantasia"
                    defaultValue={dadosEstb.nome_fantasia}
                    type="text"
                    style={{ width: "21.7vw" }}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="data_inicio_funcionamento">
                    Início de Funcionamento:
                  </label>
                  <input
                    name="data_inicio_funcionamento"
                    defaultValue={dadosEstb.data_inicio_funcionamento}
                    type="date"
                    style={{ width: "21.7vw" }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="atividade_principal">Atividade Principal: </label>
                  <input
                    type="text"
                    name="atividade_principal"
                    defaultValue={dadosEstb.atividade_principal}
                    style={{ width: "21.7vw" }}
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div>
                  <label htmlFor="divisao_tecnica">Divisão Técnica: </label>
                  <select
                    name="divisao_tecnica"
                    defaultValue={dadosEstb.divisao_tecnica}
                    style={{ width: "33vw" }}
                    required
                  >
                    <option value="">Selecione a Divisão</option>
                    <option value="DCQA">DCQA</option>
                    <option value="DCSEP">DCSEP</option>
                    <option value="DCDM">DCDM</option>
                    <option value="DCSHT">DCSHT</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="endereco">Endereço: </label>
                  <input
                    name="endereco"
                    defaultValue={dadosEstb.endereco}
                    type="text"
                    style={{ width: "33vw" }}
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div>
                  <label htmlFor="numero_endereco">Número: </label>
                  <input
                    name="numero_endereco"
                    defaultValue={dadosEstb.numero_endereco}
                    type="number"
                    style={{ width: "21.7vw" }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="bairro">Bairro: </label>
                  <input name="bairro" defaultValue={dadosEstb.bairro} type="text" style={{ width: "21.7vw" }} required />
                </div>

                <div>
                  <label htmlFor="localidade">Localidade: </label>
                  <input
                    name="localidade"
                    defaultValue={dadosEstb.localidade}
                    type="text"
                    placeholder="Ex: Zona Rural, Gleba 13"
                    style={{ width: "21.7vw" }}
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div>
                  <label htmlFor="complemento_endereco">Complemento: </label>
                  <input
                    name="complemento_endereco"
                    defaultValue={dadosEstb.complemento_endereco}
                    type="text"
                    style={{ width: "21.7vw" }}
                  />
                </div>
                <div>
                  <label htmlFor="municipio">Município: </label>
                  <input
                    name="municipio"
                    defaultValue={dadosEstb.municipio}
                    type="text"
                    style={{ width: "21.7vw" }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cep">CEP: </label>
                  <input
                    name="cep"
                    type="text"
                    value={dados.cep || ''}
                    onChange={handleInputChange}
                    style={{ width: "21.7vw" }}
                    required
                  />
                </div>
              </div>

              <div className={styles.divInput}>
                <div>
                  <label htmlFor="telefone">Telefone: </label>
                  <input
                    name="telefone"
                    type="text"
                    value={dados.telefone || ''}
                    onChange={handleInputChange}
                    style={{ width: "33vw" }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email">E-mail: </label>
                  <input name="email" defaultValue={dadosEstb.email} type="text" style={{ width: "33vw" }} required />
                </div>
              </div>

              <div className={styles.divInput}>
                <div>
                  <label htmlFor="obs">Observações:</label>
                  <textarea name="obs" defaultValue={dadosEstb.obs} style={{ width: "67vw", height: "40px" }}></textarea>
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
