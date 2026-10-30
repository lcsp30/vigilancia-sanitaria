// Página de visualização e edição dos dados cadastrais de estabelecimento Pessoa Física (CPF).
import estilo from "./estiloTelaDadosEstabelecimentoCpf.module.css";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate, useLocation } from "react-router";
import { cpf } from "cpf-cnpj-validator";
import { AiOutlineArrowLeft, AiOutlineEdit } from "react-icons/ai";
import Sidebar from "../../components/Sidebar";
import TopAppBar from "../../components/TopAppBar/TopAppBar";

function TelaDadosEstabelecimentoCpf() {
  const [sidebarOpen] = useState(false);
  const nav = useNavigate();
  const location = useLocation();
  const idEstabelecimento = location.state?.id;

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const [dadosEstb, setDadosEstb] = useState({});
  const [dadosMascarados, setDadosMascarados] = useState({
    cpf: "",
    cep: "",
    telefone: "",
  });

  const [erroCpf, setErroCpf] = useState("");
  const [erroEnvio, setErroEnvio] = useState("");
  const [sucessoMsg, setSucessoMsg] = useState("");
  const hoje = new Date().toISOString().split("T")[0];

  const mascararCpf = (valor = "") => {
    return String(valor)
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .substring(0, 14);
  };

  const mascararCep = (valor = "") => {
    return String(valor)
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 9);
  };

  const mascararTelefone = (valor = "") => {
    return String(valor)
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  };

  function carregarDados() {
    if (!idEstabelecimento) {
      nav("/estabelecimentos-cpf");
      return;
    }

    setCarregando(true);
    setErroEnvio("");

    api
      .get(`getEstabelecimentos_cpf/${idEstabelecimento}`)
      .then((response) => {
        const res = response.data;
        setDadosEstb(res);
        setDadosMascarados({
          cpf: mascararCpf(res.cpf || ""),
          cep: mascararCep(res.cep || ""),
          telefone: mascararTelefone(res.telefone || ""),
        });
        setFormKey((prev) => prev + 1);
      })
      .catch((error) => {
        console.error(error);
        setErroEnvio("Erro ao carregar os dados cadastrais do estabelecimento.");
      })
      .finally(() => {
        setCarregando(false);
      });
  }

  useEffect(() => {
    carregarDados();
  }, [idEstabelecimento]);

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

    setDadosMascarados((prev) => ({ ...prev, [name]: valorComMascara }));

    const apenasNumeros = valorComMascara.replace(/\D/g, "");

    if (name === "cpf") {
      if (apenasNumeros.length === 11) {
        setErroCpf(cpf.isValid(apenasNumeros) ? "" : "CPF Inválido");
      } else {
        setErroCpf("");
      }
    }
  };

  function habilitarEdicao() {
    setSucessoMsg("");
    setErroEnvio("");
    setEditando(true);
  }

  function cancelarEdicao() {
    setErroCpf("");
    setErroEnvio("");
    setDadosMascarados({
      cpf: mascararCpf(dadosEstb.cpf || ""),
      cep: mascararCep(dadosEstb.cep || ""),
      telefone: mascararTelefone(dadosEstb.telefone || ""),
    });
    setFormKey((prev) => prev + 1);
    setEditando(false);
  }

  function enviarForm(event) {
    event.preventDefault();
    if (erroCpf) {
      setErroEnvio("Corrija o CPF antes de salvar.");
      return;
    }

    setErroEnvio("");
    setSucessoMsg("");
    setSalvando(true);

    const dadosForm = new FormData(event.target);
    const dadosJson = Object.fromEntries(dadosForm);

    const dadosTratados = {
      ...dadosJson,
      cpf: dadosJson.cpf?.replace(/\D/g, ""),
      cep: dadosJson.cep?.replace(/\D/g, ""),
      telefone: dadosJson.telefone?.replace(/\D/g, ""),
    };

    api
      .put(`estabelecimentos_cpf/${idEstabelecimento}`, dadosTratados)
      .then(() => {
        setEditando(false);
        setSucessoMsg("Dados cadastrais atualizados com sucesso!");
        carregarDados();
      })
      .catch((error) => {
        console.error("Erro ao atualizar:", error.response?.data || error);
        const data = error.response?.data;
        const validationErrors = data?.errors;
        if (validationErrors) {
          if (validationErrors.cpf) {
            setErroCpf(validationErrors.cpf[0]);
          }
          const primeira = Object.values(validationErrors)[0]?.[0];
          setErroEnvio(primeira || "Erro ao atualizar estabelecimento.");
          return;
        }
        const msg =
          data?.detail ||
          data?.error ||
          data?.Error ||
          "Erro ao atualizar estabelecimento.";
        setErroEnvio(msg);
      })
      .finally(() => {
        setSalvando(false);
      });
  }

  return (
    <div className={estilo.page}>
      <TopAppBar />

      <div className={estilo.principal}>
        <div
          className={`${estilo.sidebarWrapper} ${
            sidebarOpen ? estilo.sidebarOpen : ""
          }`}
        >
          <Sidebar />
        </div>

        <div className={estilo.divCentro}>
          <main className={estilo.main}>
            <div className={estilo.container}>
              {/* Page Header */}
              <div className={estilo.pageHeader}>
                <div>
                  <h1 className={estilo.pageTitle}>
                    Dados do Estabelecimento - Pessoa Física
                  </h1>
                  <p className={estilo.pageSubtitle}>
                    {dadosEstb.nome_fantasia
                      ? `${dadosEstb.nome_fantasia} · CPF: ${dadosMascarados.cpf}`
                      : "Visualização e edição dos dados cadastrais"}
                  </p>
                </div>

                <div className={estilo.headerActions}>
                  <button
                    type="button"
                    className={estilo.btnVoltar}
                    onClick={() => nav("/estabelecimentos-cpf")}
                  >
                    <AiOutlineArrowLeft size={16} /> Voltar
                  </button>

                  {!carregando && !editando && (
                    <button
                      type="button"
                      className={estilo.btnHabilitarEdicao}
                      onClick={habilitarEdicao}
                    >
                      <AiOutlineEdit size={18} /> Habilitar Edição
                    </button>
                  )}

                  {editando && (
                    <span className={estilo.badgeEditando}>
                      Modo de Edição Ativo
                    </span>
                  )}
                </div>
              </div>

              {sucessoMsg && (
                <div className={estilo.alertSuccess}>{sucessoMsg}</div>
              )}

              {erroEnvio && (
                <div className={estilo.alertError}>{erroEnvio}</div>
              )}

              {carregando ? (
                <div className={estilo.loadingOverlay}>
                  <span className={estilo.spinner}></span>
                  <span>Carregando dados do estabelecimento...</span>
                </div>
              ) : (
                <div className={estilo.formCpf}>
                  <form
                    key={formKey}
                    onSubmit={enviarForm}
                    className={estilo.formInterno}
                  >
                    <div className={estilo.formContent}>
                      {/* Categoria (somente leitura) */}
                      <div className={estilo.section}>
                        <div className={estilo.sectionTitle}>Categoria</div>
                        <div className={estilo.sectionBody}>
                          <div className={estilo.row}>
                            <div className={estilo.field}>
                              <label htmlFor="categoria_id">Categoria</label>
                              <select
                                id="categoria_id"
                                value={dadosEstb.categoria_id || ""}
                                className={estilo["w280"]}
                                disabled
                              >
                                <option value="">Selecione a Categoria</option>
                                <option value="1">Profissional Liberal</option>
                                <option value="2">Autônomo</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Identificação do Estabelecimento */}
                      <div className={estilo.section}>
                        <div className={estilo.sectionTitle}>
                          Identificação do Estabelecimento
                        </div>
                        <div className={estilo.sectionBody}>
                          <div className={estilo.row}>
                            <div className={estilo.field}>
                              <label htmlFor="nome_fantasia">
                                Nome Fantasia
                              </label>
                              <input
                                id="nome_fantasia"
                                name="nome_fantasia"
                                type="text"
                                defaultValue={dadosEstb.nome_fantasia || ""}
                                className={estilo["w280"]}
                                disabled={!editando}
                                required
                              />
                            </div>
                            <div className={estilo.field}>
                              <label htmlFor="data_inicio_funcionamento">
                                Início de Funcionamento
                              </label>
                              <input
                                id="data_inicio_funcionamento"
                                name="data_inicio_funcionamento"
                                type="date"
                                defaultValue={
                                  dadosEstb.data_inicio_funcionamento || ""
                                }
                                className={estilo["w200"]}
                                max={hoje}
                                disabled={!editando}
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
                                id="atividade_principal"
                                type="text"
                                name="atividade_principal"
                                defaultValue={
                                  dadosEstb.atividade_principal || ""
                                }
                                className={estilo["w280"]}
                                disabled={!editando}
                                required
                              />
                            </div>
                            <div className={estilo.field}>
                              <label htmlFor="divisao_tecnica">
                                Divisão Técnica
                              </label>
                              <select
                                id="divisao_tecnica"
                                name="divisao_tecnica"
                                defaultValue={dadosEstb.divisao_tecnica || ""}
                                className={estilo["w200"]}
                                disabled={!editando}
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
                                id="tipo_estabelecimento"
                                name="tipo_estabelecimento"
                                defaultValue={
                                  dadosEstb.tipo_estabelecimento || ""
                                }
                                placeholder="Ex: Padaria"
                                type="text"
                                className={estilo["w280"]}
                                disabled={!editando}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Responsável */}
                      <div className={estilo.section}>
                        <div className={estilo.sectionTitle}>Responsável</div>
                        <div className={estilo.sectionBody}>
                          <div className={estilo.row}>
                            <div className={estilo.field}>
                              <label htmlFor="nome">Nome</label>
                              <input
                                id="nome"
                                name="nome"
                                type="text"
                                defaultValue={dadosEstb.nome || ""}
                                className={estilo["w280"]}
                                disabled={!editando}
                                required
                              />
                            </div>
                            <div className={estilo.field}>
                              <label htmlFor="cpf">CPF</label>
                              <input
                                id="cpf"
                                name="cpf"
                                type="text"
                                className={estilo["w200"]}
                                value={dadosMascarados.cpf}
                                onChange={handleInputChange}
                                disabled={!editando}
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
                                id="rg"
                                name="rg"
                                type="number"
                                defaultValue={dadosEstb.rg || ""}
                                className={estilo["w200"]}
                                disabled={!editando}
                                required
                              />
                            </div>
                            <div className={estilo.field}>
                              <label htmlFor="orgao_expedidor">
                                Órgão Expedidor
                              </label>
                              <input
                                id="orgao_expedidor"
                                name="orgao_expedidor"
                                type="text"
                                defaultValue={dadosEstb.orgao_expedidor || ""}
                                className={estilo["w200"]}
                                disabled={!editando}
                                required
                              />
                            </div>
                            <div className={estilo.field}>
                              <label htmlFor="data_expedicao_rg">
                                Data da Expedição
                              </label>
                              <input
                                id="data_expedicao_rg"
                                name="data_expedicao_rg"
                                type="date"
                                defaultValue={dadosEstb.data_expedicao_rg || ""}
                                className={estilo["w200"]}
                                max={hoje}
                                disabled={!editando}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Formação (só se Profissional Liberal) */}
                      {Number(dadosEstb.categoria_id) === 1 && (
                        <div className={estilo.section}>
                          <div className={estilo.sectionTitle}>Formação</div>
                          <div className={estilo.sectionBody}>
                            <div className={estilo.row}>
                              <div className={estilo.field}>
                                <label htmlFor="escolaridade">
                                  Escolaridade
                                </label>
                                <input
                                  id="escolaridade"
                                  name="escolaridade"
                                  type="text"
                                  defaultValue={dadosEstb.escolaridade || ""}
                                  className={estilo["w200"]}
                                  disabled={!editando}
                                  required
                                />
                              </div>
                              <div className={estilo.field}>
                                <label htmlFor="formacao_profissional">
                                  Formação Profissional
                                </label>
                                <input
                                  id="formacao_profissional"
                                  name="formacao_profissional"
                                  type="text"
                                  defaultValue={
                                    dadosEstb.formacao_profissional || ""
                                  }
                                  className={estilo["w200"]}
                                  disabled={!editando}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Registro (só se Profissional Liberal) */}
                      {Number(dadosEstb.categoria_id) === 1 && (
                        <div className={estilo.section}>
                          <div className={estilo.sectionTitle}>Registro</div>
                          <div className={estilo.sectionBody}>
                            <div className={estilo.row}>
                              <div className={estilo.field}>
                                <label htmlFor="registro_conselho">
                                  Registro no Conselho
                                </label>
                                <input
                                  id="registro_conselho"
                                  name="registro_conselho"
                                  type="text"
                                  defaultValue={
                                    dadosEstb.registro_conselho || ""
                                  }
                                  className={estilo["w200"]}
                                  disabled={!editando}
                                  required
                                />
                              </div>
                              <div className={estilo.field}>
                                <label htmlFor="especializacao">
                                  Especialização
                                </label>
                                <input
                                  id="especializacao"
                                  name="especializacao"
                                  type="text"
                                  defaultValue={dadosEstb.especializacao || ""}
                                  className={estilo["w200"]}
                                  disabled={!editando}
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
                                id="endereco"
                                name="endereco"
                                type="text"
                                defaultValue={dadosEstb.endereco || ""}
                                className={estilo["w280"]}
                                disabled={!editando}
                                required
                              />
                            </div>
                            <div className={estilo.field}>
                              <label htmlFor="numero_endereco">Número</label>
                              <input
                                id="numero_endereco"
                                name="numero_endereco"
                                type="number"
                                defaultValue={dadosEstb.numero_endereco || ""}
                                className={estilo["w80"]}
                                disabled={!editando}
                                required
                              />
                            </div>
                          </div>
                          <div className={estilo.row}>
                            <div className={estilo.field}>
                              <label htmlFor="bairro">Bairro</label>
                              <input
                                id="bairro"
                                name="bairro"
                                type="text"
                                defaultValue={dadosEstb.bairro || ""}
                                className={estilo["w200"]}
                                disabled={!editando}
                                required
                              />
                            </div>
                            <div className={estilo.field}>
                              <label htmlFor="localidade">Localidade</label>
                              <input
                                id="localidade"
                                name="localidade"
                                type="text"
                                defaultValue={dadosEstb.localidade || ""}
                                placeholder="Ex: Zona Rural, Gleba 13"
                                className={estilo["w200"]}
                                disabled={!editando}
                              />
                            </div>
                            <div className={estilo.field}>
                              <label htmlFor="complemento_endereco">
                                Complemento
                              </label>
                              <input
                                id="complemento_endereco"
                                name="complemento_endereco"
                                type="text"
                                defaultValue={
                                  dadosEstb.complemento_endereco || ""
                                }
                                className={estilo["w200"]}
                                disabled={!editando}
                              />
                            </div>
                          </div>
                          <div className={estilo.row}>
                            <div className={estilo.field}>
                              <label htmlFor="municipio">Município</label>
                              <input
                                id="municipio"
                                name="municipio"
                                type="text"
                                defaultValue={dadosEstb.municipio || ""}
                                className={estilo["w200"]}
                                disabled={!editando}
                                required
                              />
                            </div>
                            <div className={estilo.field}>
                              <label htmlFor="cep">CEP</label>
                              <input
                                id="cep"
                                name="cep"
                                type="text"
                                className={estilo["w120"]}
                                value={dadosMascarados.cep}
                                onChange={handleInputChange}
                                disabled={!editando}
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
                                id="telefone"
                                name="telefone"
                                type="text"
                                className={estilo["w200"]}
                                value={dadosMascarados.telefone}
                                onChange={handleInputChange}
                                disabled={!editando}
                                required
                              />
                            </div>
                            <div className={estilo.field}>
                              <label htmlFor="email">E-mail</label>
                              <input
                                id="email"
                                name="email"
                                type="text"
                                defaultValue={dadosEstb.email || ""}
                                className={estilo["w240"]}
                                disabled={!editando}
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
                            <textarea
                              id="obs"
                              name="obs"
                              defaultValue={dadosEstb.obs || ""}
                              disabled={!editando}
                            ></textarea>
                          </div>
                        </div>
                      </div>

                      {/* Botões de Ação (somente quando editando) */}
                      {editando && (
                        <div className={estilo.caixaBtn}>
                          <button
                            type="button"
                            className={estilo.btnCancelar}
                            onClick={cancelarEdicao}
                            disabled={salvando}
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className={estilo.btnSubmit}
                            disabled={salvando}
                          >
                            {salvando ? "Salvando..." : "Salvar Alterações"}
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default TelaDadosEstabelecimentoCpf;

