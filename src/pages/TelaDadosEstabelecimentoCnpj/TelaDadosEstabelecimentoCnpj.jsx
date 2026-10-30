// Página de visualização e edição dos dados cadastrais de estabelecimento Pessoa Jurídica (CNPJ).
import estilo from "./estiloTelaDadosEstabelecimentoCnpj.module.css";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate, useLocation } from "react-router";
import { cpf, cnpj } from "cpf-cnpj-validator";
import { AiOutlineArrowLeft, AiOutlineEdit } from "react-icons/ai";
import Sidebar from "../../components/Sidebar";
import TopAppBar from "../../components/TopAppBar/TopAppBar";

function TelaDadosEstabelecimentoCnpj() {
  const [sidebarOpen] = useState(false);
  const nav = useNavigate();
  const location = useLocation();
  const idEstabelecimento = location.state?.id;

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const [categorias, setCategorias] = useState([]);
  const [dadosEstb, setDadosEstb] = useState({});
  const [dadosMascarados, setDadosMascarados] = useState({
    cnpj: "",
    cpf: "",
    cep: "",
    telefone: "",
  });

  const [erroCnpj, setErroCnpj] = useState("");
  const [erroCpf, setErroCpf] = useState("");
  const [erroEnvio, setErroEnvio] = useState("");
  const [sucessoMsg, setSucessoMsg] = useState("");
  const hoje = new Date().toISOString().split("T")[0];

  const mascararCnpj = (valor = "") => {
    return String(valor)
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 18);
  };

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
      nav("/estabelecimentos-cnpj");
      return;
    }

    setCarregando(true);
    setErroEnvio("");

    Promise.all([
      api.get(`getEstabelecimentos_cnpj/${idEstabelecimento}`),
      api.get("getCategorias"),
    ])
      .then(([resEstb, resCat]) => {
        const res = resEstb.data;
        setDadosEstb(res);
        setCategorias(Array.isArray(resCat.data) ? resCat.data : []);
        setDadosMascarados({
          cnpj: mascararCnpj(res.cnpj || ""),
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

    if (name === "cnpj") {
      valorComMascara = mascararCnpj(value);
    } else if (name === "cpf") {
      valorComMascara = mascararCpf(value);
    } else if (name === "cep") {
      valorComMascara = mascararCep(value);
    } else if (name === "telefone") {
      valorComMascara = mascararTelefone(value);
    }

    setDadosMascarados((prev) => ({ ...prev, [name]: valorComMascara }));

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

  function habilitarEdicao() {
    setSucessoMsg("");
    setErroEnvio("");
    setEditando(true);
  }

  function cancelarEdicao() {
    setErroCnpj("");
    setErroCpf("");
    setErroEnvio("");
    setDadosMascarados({
      cnpj: mascararCnpj(dadosEstb.cnpj || ""),
      cpf: mascararCpf(dadosEstb.cpf || ""),
      cep: mascararCep(dadosEstb.cep || ""),
      telefone: mascararTelefone(dadosEstb.telefone || ""),
    });
    setFormKey((prev) => prev + 1);
    setEditando(false);
  }

  function enviarForm(e) {
    e.preventDefault();
    if (erroCnpj || erroCpf) {
      setErroEnvio("Corrija os campos inválidos (CNPJ/CPF) antes de salvar.");
      return;
    }

    setErroEnvio("");
    setSucessoMsg("");
    setSalvando(true);

    const dadosForm = new FormData(e.target);
    const dadosJson = Object.fromEntries(dadosForm);

    const dadosTratados = {
      ...dadosJson,
      cnpj: dadosJson.cnpj?.replace(/\D/g, ""),
      cpf: dadosJson.cpf?.replace(/\D/g, ""),
      cep: dadosJson.cep?.replace(/\D/g, ""),
      telefone: dadosJson.telefone?.replace(/\D/g, ""),
      insc_estadual: dadosJson.insc_estadual?.replace(/\D/g, ""),
      insc_municipal: dadosJson.insc_municipal?.replace(/\D/g, ""),
    };

    api
      .put(`estabelecimentos_cnpj/${idEstabelecimento}`, dadosTratados)
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
          if (validationErrors.cnpj) {
            setErroCnpj(validationErrors.cnpj[0]);
          }
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
                    Dados do Estabelecimento - Pessoa Jurídica
                  </h1>
                  <p className={estilo.pageSubtitle}>
                    {dadosEstb.nome_fantasia
                      ? `${dadosEstb.nome_fantasia} · CNPJ: ${dadosMascarados.cnpj}`
                      : "Visualização e edição dos dados cadastrais"}
                  </p>
                </div>

                <div className={estilo.headerActions}>
                  <button
                    type="button"
                    className={estilo.btnVoltar}
                    onClick={() => nav("/estabelecimentos-cnpj")}
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
                                {categorias.map((categoria) => (
                                  <option
                                    key={categoria.id_categoria}
                                    value={categoria.id_categoria}
                                  >
                                    {categoria.nome_categoria}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Identificação da Empresa */}
                      <div className={estilo.section}>
                        <div className={estilo.sectionTitle}>
                          Identificação da Empresa
                        </div>
                        <div className={estilo.sectionBody}>
                          <div className={estilo.row}>
                            <div className={estilo.field}>
                              <label htmlFor="razao_social">Razão Social</label>
                              <input
                                id="razao_social"
                                name="razao_social"
                                type="text"
                                defaultValue={dadosEstb.razao_social || ""}
                                className={estilo["w280"]}
                                disabled={!editando}
                                required
                              />
                            </div>
                            <div className={estilo.field}>
                              <label htmlFor="cnpj">CNPJ</label>
                              <input
                                id="cnpj"
                                name="cnpj"
                                type="text"
                                className={estilo["w200"]}
                                value={dadosMascarados.cnpj}
                                onChange={handleInputChange}
                                disabled={!editando}
                                required
                              />
                              {erroCnpj && (
                                <p className={estilo.errorMessage}>
                                  {erroCnpj}
                                </p>
                              )}
                            </div>
                          </div>

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
                          </div>

                          <div className={estilo.row}>
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
                            <div className={estilo.field}>
                              <label htmlFor="natureza_juridica">
                                Natureza Jurídica
                              </label>
                              <select
                                id="natureza_juridica"
                                name="natureza_juridica"
                                defaultValue={dadosEstb.natureza_juridica || ""}
                                className={estilo["w200"]}
                                disabled={!editando}
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
                          </div>

                          {Number(dadosEstb.categoria_id) === 1 && (
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
                                  className={estilo["w200"]}
                                  disabled={!editando}
                                  required
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Atividade */}
                      <div className={estilo.section}>
                        <div className={estilo.sectionTitle}>Atividade</div>
                        <div className={estilo.sectionBody}>
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
                        </div>
                      </div>

                      {/* Inscrições */}
                      <div className={estilo.section}>
                        <div className={estilo.sectionTitle}>Inscrições</div>
                        <div className={estilo.sectionBody}>
                          <div className={estilo.row}>
                            <div className={estilo.field}>
                              <label htmlFor="insc_estadual">
                                Insc. Estadual
                              </label>
                              <input
                                id="insc_estadual"
                                name="insc_estadual"
                                type="text"
                                defaultValue={dadosEstb.insc_estadual || ""}
                                className={estilo["w200"]}
                                disabled={!editando}
                              />
                            </div>
                            <div className={estilo.field}>
                              <label htmlFor="insc_municipal">
                                Insc. Municipal
                              </label>
                              <input
                                id="insc_municipal"
                                name="insc_municipal"
                                type="text"
                                defaultValue={dadosEstb.insc_municipal || ""}
                                className={estilo["w200"]}
                                disabled={!editando}
                              />
                            </div>
                            <div className={estilo.field}>
                              <label htmlFor="cnes">
                                CNES (Cadastro Nacional)
                              </label>
                              <input
                                id="cnes"
                                name="cnes"
                                type="text"
                                defaultValue={dadosEstb.cnes || ""}
                                className={estilo["w200"]}
                                disabled={!editando}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

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
                                type="text"
                                defaultValue={dadosEstb.numero_endereco || ""}
                                className={estilo["w80"]}
                                disabled={!editando}
                                required
                              />
                            </div>
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
                          </div>
                          <div className={estilo.row}>
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
                                type="email"
                                defaultValue={dadosEstb.email || ""}
                                className={estilo["w240"]}
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
                              <label htmlFor="nome_responsavel">
                                Nome Responsável
                              </label>
                              <input
                                id="nome_responsavel"
                                name="nome_responsavel"
                                type="text"
                                defaultValue={dadosEstb.nome_responsavel || ""}
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
                                value={dadosMascarados.cpf}
                                onChange={handleInputChange}
                                type="text"
                                className={estilo["w200"]}
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
                                type="text"
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

export default TelaDadosEstabelecimentoCnpj;

