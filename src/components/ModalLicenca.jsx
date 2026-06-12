// Gera licença sanitária em PDF via download forçado (blob). Bloqueada se houver documentos pendentes ou ano inválido.
// TODO: Extrair lógica de download duplicada entre branches CPF/CNPJ para uma função utilitária.
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./cssComponents/estiloModal.module.css";
import api from "../services/api";
import { useState } from "react";

/**
 * @param {Object} props
 * @param {number} props.idDado - ID do estabelecimento
 * @param {string} props.tipoEstabelecimento - "cpf" ou "cnpj"
 * @param {string} props.ano - Ano de referência
 * @param {boolean} props.valorBtnLicenca - true = bloqueado (documentação pendente)
 * @param {string} props.categoria - Categoria do estabelecimento
 * @param {string} props.nomeEstb - Nome do estabelecimento (usado no nome do arquivo)
 * @param {boolean} props.anoAtual - false = ano anterior (licença não pode ser gerada)
 */
function ModalLicenca({
  idDado,
  tipoEstabelecimento,
  ano,
  valorBtnLicenca,
  categoria,
  nomeEstb,
  anoAtual
}) {
  let [fechar, setFechar] = useState(false);
  let [gerando, setGerando] = useState(false);
  let [erroMsg, setErroMsg] = useState('');

  // Solicita PDF ao backend como blob e força download via criação dinâmica de <a>.
  function gerarLicenca(e) {
    e.preventDefault();
    setGerando(true);
    setErroMsg('');
    let dados = new FormData(e.target);

    let dadosJson = Object.fromEntries(dados);
    dadosJson.id = idDado;
    dadosJson.categoria = categoria;
    dadosJson.ano = ano;

    console.log(dadosJson);

    if (tipoEstabelecimento == "cpf") {
      api
        .get("licenca_cpf", {
          params: {
            ...dadosJson,
          },
          responseType: "blob",
        })
        .then(function (response) {
          let nomeArquivo = "Licença " + nomeEstb;

          const url = window.URL.createObjectURL(response.data);

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", nomeArquivo);
          document.body.appendChild(link);
          link.click();
          link.remove();

          window.URL.revokeObjectURL(url);
          setFechar(false);
        })
        .catch(function (error) {
          console.error(error);
          setErroMsg("Falha ao tentar gerar Licença.");
        })
        .finally(function () {
          setGerando(false);
        });
    } else if (tipoEstabelecimento == "cnpj") {
      api.get("licenca", {
          params: {
            ...dadosJson,
          },
          responseType: "blob",
        })
        .then(function (response) {
          let nomeArquivo = "Licença" + nomeEstb;

          const url = window.URL.createObjectURL(response.data);

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", nomeArquivo);
          document.body.appendChild(link);
          link.click();
          link.remove();

          window.URL.revokeObjectURL(url);
          setFechar(false);
        })
        .catch(function (erro) {
          console.error(erro);
          const msg = erro.response?.data?.res || "Falha ao tentar gerar Licença.";
          setErroMsg(msg);
        })
        .finally(function () {
          setGerando(false);
        });
    }
  }

  /**
   * Bloqueia a abertura do modal quando a licença não pode ser gerada.
   *
   * O preventDefault interrompe a propagação do clique para o Dialog.Trigger,
   * impedindo que o modal abra. A diferenciação entre ano inválido e
   * documentação pendente é feita por mensagens de alerta distintas.
   */
  function controleLicenca(e) {
    if (valorBtnLicenca === true) {
      e.preventDefault();
      if(anoAtual == false){
        alert("Licença de anos anteriores não pode ser gerada.");
      }else{
        alert("A Licença não pode ser criada, documentação pendente.");
      }
    }
  }

  return (
    <Dialog.Root open={fechar} onOpenChange={setFechar}>
      <Dialog.Trigger asChild>
        <button
          className={styles.btnNotificacao}
          style={{ cursor: "pointer", opacity: !valorBtnLicenca ? 1 : 0.5 }}
          onClick={controleLicenca}
        >
          Gerar Licença
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.DialogOverlay} />
        {gerando && (
          <div className={styles.loadingOverlay}>
            <span className={styles.spinner}></span>
          </div>
        )}
        <Dialog.Content
          className={styles.DialogContent}
          onPointerDownOutside={(event) => event.preventDefault()}
        >
          <Dialog.Title className={styles.DialogTitle}>
            Gerar Nova Licença
          </Dialog.Title>
          <Dialog.Description className={styles.DialogDescription}>
            Adicione os dados para gerar a Licença.
          </Dialog.Description>
          <form className={styles.formModal} onSubmit={gerarLicenca}>
            <div className={styles.divInput}>
              <select name="tipo" defaultValue={""} required>
                <option value="">Selecione o Tipo</option>
                <option value="licenca">Licença de Funcionamento</option>
                <option value="renovacao">
                  Renovação da Lincença de Funcionamento
                </option>
              </select>
            </div>

            <div className={styles.divBtnSalvar}>
              <button
                type="submit"
                className={styles.btnSalvar}
                disabled={gerando}
              >
                Gerar
              </button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button className={styles.IconButton} aria-label="Close">
              X
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ModalLicenca;
