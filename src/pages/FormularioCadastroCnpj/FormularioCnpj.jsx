// Formulário de cadastro de estabelecimento Pessoa Jurídica (CNPJ) com campos adicionais (natureza jurídica, inscrições, CNES).
import estilo from "./estiloFormularioCnpj.module.css";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router";
import { cpf, cnpj } from "cpf-cnpj-validator";
import Sidebar from "../../components/Sidebar";
import TopAppBar from "../../components/TopAppBar/TopAppBar";

function FormularioCnpj() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  let [selecionado, setSelecionado] = useState("");
  let [categorias, setCategorias] = useState([]);
  const [dados, setDados] = useState({ cnpj: "", cpf: "" });
  const [erroCnpj, setErroCnpj] = useState("");
  const [erroCpf, setErroCpf] = useState("");
  const [erroEnvio, setErroEnvio] = useState("");
  const hoje = new Date().toISOString().split("T")[0];
  let nav = useNavigate();

  useEffect(() => {
    api
      .get("getCategorias")
      .then(function (response) {
        console.log(response.data);
        setCategorias(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  let [chave, setChave] = useState(true);
  function valorSelect(e) {
    let valor = e.target.value;
    setSelecionado(valor);
    if (valor != "") {
      setChave(false);
    } else {
      setChave(true);
    }
  }

  function enviarForm(e) {
    e.preventDefault();
    let dados = new FormData(e.target);
    let dadosJson = Object.fromEntries(dados);

    const dadosTratados = {
      ...dadosJson,
      cnpj: dadosJson.cnpj.replace(/\D/g, ""),
      cpf: dadosJson.cpf?.replace(/\D/g, ""),
      cep: dadosJson.cep?.replace(/\D/g, ""),
      telefone: dadosJson.telefone?.replace(/\D/g, ""),
      insc_estadual: dadosJson.insc_estadual?.replace(/\D/g, ""),
      insc_municipal: dadosJson.insc_municipal?.replace(/\D/g, ""),
    };
    console.log(dadosTratados);

    api
      .post("estabelecimentos_cnpj", dadosTratados)
      .then(function (response) {
        console.log(response.data);
        nav("/estabelecimentos-cnpj");
      })
      .catch(function (error) {
        console.error("Dados do Erro:", error.response?.data || error);
        const msg = error.response?.data?.detail
          || error.response?.data?.error
          || 'Erro ao cadastrar estabelecimento.';
        setErroEnvio(msg);
      });
  }

  function voltar() {
    nav(-1);
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
                    Cadastro de Pessoa Jurídica
                  </h1>
                  <p className={estilo.pageSubtitle}>
                    Preencha os dados do estabelecimento
                  </p>
                </div>
              </div>

              {erroEnvio && (
                <div style={{ color: '#d32f2f', background: '#ffebee', padding: '10px 16px', borderRadius: 6, marginBottom: 16, fontSize: 14, maxWidth: 600 }}>
                  {erroEnvio}
                </div>
              )}

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
                              name="razao_social"
                              type="text"
                              className={estilo["w280"]}
                              disabled={chave}
                              required
                            />
                          </div>
                          <div className={estilo.field}>
                            <label htmlFor="cnpj">CNPJ</label>
                            <input
                              name="cnpj"
                              type="text"
                              className={estilo["w200"]}
                              value={dados.cnpj}
                              onChange={handleInputChange}
                              disabled={chave}
                              required
                            />
                            {erroCnpj && (
                              <p className={estilo.errorMessage}>{erroCnpj}</p>
                            )}
                          </div>
                        </div>

                        <div className={estilo.row}>
                          <div className={estilo.field}>
                            <label htmlFor="nome_fantasia">
                              Nome Fantasia
                            </label>
                            <input
                              name="nome_fantasia"
                              type="text"
                              className={estilo["w280"]}
                              disabled={chave}
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
                              name="data_inicio_funcionamento"
                              type="date"
                              className={estilo["w200"]}
                              max={hoje}
                              disabled={chave}
                              required
                            />
                          </div>
                          <div className={estilo.field}>
                            <label htmlFor="natureza_juridica">
                              Natureza Jurídica
                            </label>
                            <select
                              name="natureza_juridica"
                              className={estilo["w200"]}
                              disabled={chave}
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

                        {selecionado == 1 && (
                          <div className={estilo.row}>
                            <div className={estilo.field}>
                              <label htmlFor="tipo_estabelecimento">
                                Tipo Estabelecimento
                              </label>
                              <input
                                name="tipo_estabelecimento"
                                placeholder="Ex: Padaria"
                                type="text"
                                className={estilo["w200"]}
                                disabled={chave}
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
                              name="insc_estadual"
                              type="text"
                              className={estilo["w200"]}
                              disabled={chave}
                            />
                          </div>
                          <div className={estilo.field}>
                            <label htmlFor="insc_municipal">
                              Insc. Municipal
                            </label>
                            <input
                              name="insc_municipal"
                              type="text"
                              className={estilo["w200"]}
                              disabled={chave}
                            />
                          </div>
                          <div className={estilo.field}>
                            <label htmlFor="cnes">
                              CNES (Cadastro Nacional)
                            </label>
                            <input
                              name="cnes"
                              type="text"
                              className={estilo["w200"]}
                              disabled={chave}
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
                              type="text"
                              className={estilo["w80"]}
                              disabled={chave}
                              required
                            />
                          </div>
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
                        </div>
                        <div className={estilo.row}>
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
                              value={dados.cep || ""}
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
                              value={dados.telefone || ""}
                              onChange={handleInputChange}
                              disabled={chave}
                              required
                            />
                          </div>
                          <div className={estilo.field}>
                            <label htmlFor="email">E-mail</label>
                            <input
                              name="email"
                              type="email"
                              className={estilo["w240"]}
                              disabled={chave}
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
                              name="nome_responsavel"
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
                              value={dados.cpf}
                              onChange={handleInputChange}
                              type="text"
                              className={estilo["w200"]}
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
                              type="text"
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

export default FormularioCnpj;
