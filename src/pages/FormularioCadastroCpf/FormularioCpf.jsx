// Formulário de cadastro de estabelecimento Pessoa Física (CPF) com validação de dígito e campos condicionais por categoria.
import estilo from "./estiloFormularioCpf.module.css";
import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router";
import { cpf } from "cpf-cnpj-validator";
import Sidebar from "../../components/Sidebar";
import TopAppBar from "../../components/TopAppBar/TopAppBar";

function FormularioCpf() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selecionado, setSelecionado] = useState("");
  const [dados, setDados] = useState({ cpf: "", cep: "", telefone: "" });
  const [erroCpf, setErroCpf] = useState("");
  const hoje = new Date().toISOString().split("T")[0];
  const nav = useNavigate();

  const [chave, setChave] = useState(true);

  function valorSelect(e) {
    const valor = e.target.value;
    setSelecionado(valor);
    if (valor !== "") {
      setChave(false);
    } else {
      setChave(true);
    }
  }

  function voltar() {
    nav(-1);
  }

  function enviarForm(event) {
    event.preventDefault();
    const dadosForm = new FormData(event.target);
    const dadosJson = Object.fromEntries(dadosForm);

    const dadosFormatados = {
      ...dadosJson,
      cpf: dadosJson.cpf.replace(/\D/g, ""),
      cep: dadosJson.cep.replace(/\D/g, ""),
      telefone: dadosJson.telefone.replace(/\D/g, ""),
    };

    api
      .post("estabelecimentos_cpf", dadosFormatados)
      .then(function (response) {
        console.log(response.data);
        nav("/estabelecimentos-cpf");
      })
      .catch(function (error) {
        console.log("Dados do Erro:", error.response.data);
      });
  }

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

    if (name === "cpf") {
      valorComMascara = mascararCpf(value);
    } else if (name === "cep") {
      valorComMascara = mascararCep(value);
    } else if (name === "telefone") {
      valorComMascara = mascararTelefone(value);
    }

    setDados({ ...dados, [name]: valorComMascara });

    const apenasNumeros = valorComMascara.replace(/\D/g, "");

    if (name === "cpf") {
      if (apenasNumeros.length === 11) {
        setErroCpf(cpf.isValid(apenasNumeros) ? "" : "CPF Inválido");
      } else {
        setErroCpf("");
      }
    }
  };

  return (
    <div className={estilo.page}>
      {/* Topbar */}
      <TopAppBar />

      <div className={estilo.principal}>
        {/* Sidebar */}
        <div
          className={`${estilo.sidebarWrapper} ${
            sidebarOpen ? estilo.sidebarOpen : ""
          }`}
        >
          <Sidebar />
        </div>

        {/* Conteúdo */}
        <div className={estilo.divCentro}>
          <main className={estilo.main}>
            <div className={estilo.container}>
              {/* Page Header */}
              <div className={estilo.pageHeader}>
                <div>
                  <h1 className={estilo.pageTitle}>
                    Cadastro de Pessoa Física
                  </h1>
                  <p className={estilo.pageSubtitle}>
                    Preencha os dados do estabelecimento
                  </p>
                </div>
              </div>

              {/* Formulário */}
              <div className={estilo.formCpf}>
                <form onSubmit={enviarForm} className={estilo.formInterno}>
                  <div className={estilo.formContent}>
                    {/* Categoria */}
                    <div className={estilo.section}>
                      <div className={estilo.sectionTitle}>
                        Categoria
                      </div>
                      <div className={estilo.sectionBody}>
                        <div className={estilo.row}>
                          <div className={estilo.field}>
                            <select
                              name="categoria_id"
                              value={selecionado}
                              onChange={valorSelect}
                              className={estilo["w280"]}
                              required
                            >
                              <option value="">Selecione a Categoria</option>
                              <option value="1">Profissional Liberal</option>
                              <option value="2">Autônomo</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Identificação */}
                    <div className={estilo.section}>
                      <div className={estilo.sectionTitle}>
                        Identificação do Estabelecimento
                      </div>
                      <div className={estilo.sectionBody}>
                        <div className={estilo.row}>
                          <div className={estilo.field}>
                            <label htmlFor="nome_fantasia">Nome Fantasia</label>
                            <input
                              name="nome_fantasia"
                              type="text"
                              className={estilo["w280"]}
                              disabled={chave}
                              required
                            />
                          </div>
                          <div className={estilo.field}>
                            <label htmlFor="data_inicio_funcionamento">
                              Início de Funcionamento
                            </label>
                            <input
                              name="data_inicio_funcionamento"
                              type="date"
                              className={estilo["w200"]}
                              max={hoje}
                              disabled={chave}
                              required
                            />
                          </div>
                        </div>
                        <div className={estilo.row}>
                          <div className={estilo.field}>
                            <label htmlFor="atividade_principal">
                              Atividade Principal
                            </label>
                            <input
                              type="text"
                              name="atividade_principal"
                              className={estilo["w280"]}
                              disabled={chave}
                              required
                            />
                          </div>
                          <div className={estilo.field}>
                            <label htmlFor="divisao_tecnica">
                              Divisão Técnica
                            </label>
                            <select
                              name="divisao_tecnica"
                              className={estilo["w200"]}
                              disabled={chave}
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
                        <div className={estilo.row}>
                          <div className={estilo.field}>
                            <label htmlFor="tipo_estabelecimento">
                              Tipo Estabelecimento
                            </label>
                            <input
                              name="tipo_estabelecimento"
                              placeholder="Ex: Padaria"
                              type="text"
                              className={estilo["w280"]}
                              disabled={chave}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Documentos */}
                    <div className={estilo.section}>
                      <div className={estilo.sectionTitle}>Responsável</div>
                      <div className={estilo.sectionBody}>
                        <div className={estilo.row}>
                          <div className={estilo.field}>
                            <label htmlFor="nome">Nome</label>
                            <input
                              name="nome"
                              type="text"
                              className={estilo["w280"]}
                              disabled={chave}
                              required
                            />
                          </div>
                          <div className={estilo.field}>
                            <label htmlFor="cpf">CPF</label>
                            <input
                              name="cpf"
                              type="text"
                              className={estilo["w200"]}
                              value={dados.cpf}
                              onChange={handleInputChange}
                              disabled={chave}
                              required
                            />
                            {erroCpf && (
                              <p className={estilo.errorMessage}>{erroCpf}</p>
                            )}
                          </div>
                        </div>
                        <div className={estilo.row}>
                          <div className={estilo.field}>
                            <label htmlFor="rg">RG</label>
                            <input
                              name="rg"
                              type="number"
                              className={estilo["w200"]}
                              disabled={chave}
                              required
                            />
                          </div>
                          <div className={estilo.field}>
                            <label htmlFor="orgao_expedidor">
                              Órgão Expedidor
                            </label>
                            <input
                              name="orgao_expedidor"
                              type="text"
                              className={estilo["w200"]}
                              disabled={chave}
                              required
                            />
                          </div>
                          <div className={estilo.field}>
                            <label htmlFor="data_expedicao_rg">
                              Data da Expedição
                            </label>
                            <input
                              name="data_expedicao_rg"
                              type="date"
                              className={estilo["w200"]}
                              max={hoje}
                              disabled={chave}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Formação (só se Profissional Liberal) */}
                    {selecionado === "1" && (
                      <div className={estilo.section}>
                        <div className={estilo.sectionTitle}>Formação</div>
                        <div className={estilo.sectionBody}>
                          <div className={estilo.row}>
                            <div className={estilo.field}>
                              <label htmlFor="escolaridade">Escolaridade</label>
                              <input
                                name="escolaridade"
                                type="text"
                                className={estilo["w200"]}
                                disabled={chave}
                                required
                              />
                            </div>
                            <div className={estilo.field}>
                              <label htmlFor="formacao_profissional">
                                Formação Profissional
                              </label>
                              <input
                                name="formacao_profissional"
                                type="text"
                                className={estilo["w200"]}
                                disabled={chave}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Registro (só se Profissional Liberal) */}
                    {selecionado === "1" && (
                      <div className={estilo.section}>
                        <div className={estilo.sectionTitle}>Registro</div>
                        <div className={estilo.sectionBody}>
                          <div className={estilo.row}>
                            <div className={estilo.field}>
                              <label htmlFor="registro_conselho">
                                Registro no Conselho
                              </label>
                              <input
                                name="registro_conselho"
                                type="text"
                                className={estilo["w200"]}
                                disabled={chave}
                                required
                              />
                            </div>
                            <div className={estilo.field}>
                              <label htmlFor="especializacao">
                                Especialização
                              </label>
                              <input
                                name="especializacao"
                                type="text"
                                className={estilo["w200"]}
                                disabled={chave}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Endereço */}
                    <div className={estilo.section}>
                      <div className={estilo.sectionTitle}>Endereço</div>
                      <div className={estilo.sectionBody}>
                        <div className={estilo.row}>
                          <div className={estilo.field}>
                            <label htmlFor="endereco">Endereço</label>
                            <input
                              name="endereco"
                              type="text"
                              className={estilo["w280"]}
                              disabled={chave}
                              required
                            />
                          </div>
                          <div className={estilo.field}>
                            <label htmlFor="numero_endereco">Número</label>
                            <input
                              name="numero_endereco"
                              type="number"
                              className={estilo["w80"]}
                              disabled={chave}
                              required
                            />
                          </div>
                        </div>
                        <div className={estilo.row}>
                          <div className={estilo.field}>
                            <label htmlFor="bairro">Bairro</label>
                            <input
                              name="bairro"
                              type="text"
                              className={estilo["w200"]}
                              disabled={chave}
                              required
                            />
                          </div>
                          <div className={estilo.field}>
                            <label htmlFor="localidade">Localidade</label>
                            <input
                              name="localidade"
                              type="text"
                              placeholder="Ex: Zona Rural, Gleba 13"
                              className={estilo["w200"]}
                              disabled={chave}
                              required
                            />
                          </div>
                          <div className={estilo.field}>
                            <label htmlFor="complemento_endereco">
                              Complemento
                            </label>
                            <input
                              name="complemento_endereco"
                              type="text"
                              className={estilo["w200"]}
                              disabled={chave}
                              required
                            />
                          </div>
                        </div>
                        <div className={estilo.row}>
                          <div className={estilo.field}>
                            <label htmlFor="municipio">Município</label>
                            <input
                              name="municipio"
                              type="text"
                              className={estilo["w200"]}
                              disabled={chave}
                              required
                            />
                          </div>
                          <div className={estilo.field}>
                            <label htmlFor="cep">CEP</label>
                            <input
                              name="cep"
                              type="text"
                              className={estilo["w120"]}
                              value={dados.cep}
                              onChange={handleInputChange}
                              disabled={chave}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contato */}
                    <div className={estilo.section}>
                      <div className={estilo.sectionTitle}>Contato</div>
                      <div className={estilo.sectionBody}>
                        <div className={estilo.row}>
                          <div className={estilo.field}>
                            <label htmlFor="telefone">Telefone</label>
                            <input
                              name="telefone"
                              type="text"
                              className={estilo["w200"]}
                              value={dados.telefone}
                              onChange={handleInputChange}
                              disabled={chave}
                              required
                            />
                          </div>
                          <div className={estilo.field}>
                            <label htmlFor="email">E-mail</label>
                            <input
                              name="email"
                              type="text"
                              className={estilo["w240"]}
                              disabled={chave}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Observações */}
                    <div className={estilo.section}>
                      <div className={estilo.sectionTitle}>Observações</div>
                      <div className={estilo.sectionBody}>
                        <div className={estilo.caixaObs}>
                          <label htmlFor="obs">Observações</label>
                          <textarea name="obs" disabled={chave}></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Botão */}
                    <div className={estilo.caixaBtn}>
                      <button type="submit" className={estilo.btnSubmit}>
                        Cadastrar
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default FormularioCpf;
