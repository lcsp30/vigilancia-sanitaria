// Modal para adicionar um documento avulso específico para o estabelecimento (sem afetar categorias).
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./cssComponents/estiloModalAdicionarDoc.module.css";
import api from "../services/api";
import { useState } from "react";

/**
 * @param {Object} props
 * @param {number} props.estabelecimentoId - ID do estabelecimento
 * @param {string} props.tipoEstabelecimento - "cpf" ou "cnpj"
 * @param {number|string} props.ano - Ano de vigência atual da documentação
 * @param {Function} props.menuDoc - Fecha o menu dropdown pai
 * @param {Function} props.setExecultar - Força refresh da lista pai
 */
function ModalAdicionarDoc({ estabelecimentoId, tipoEstabelecimento, ano, menuDoc, setExecultar }) {
    const [fechar, setFechar] = useState(false);
    const [nomeDoc, setNomeDoc] = useState("");
    const [docFixo, setDocFixo] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erroMsg, setErroMsg] = useState("");

    function resetForm() {
        setNomeDoc("");
        setDocFixo(false);
        setErroMsg("");
        setSalvando(false);
    }

    function fecharModal() {
        setFechar(false);
        resetForm();
    }

    function salvar(e) {
        e.preventDefault();
        setErroMsg("");

        const nomeTrim = nomeDoc.trim();
        if (!nomeTrim) {
            setErroMsg("O nome do documento é obrigatório.");
            return;
        }

        setSalvando(true);
        api.post("doc/adicionar", {
            estabelecimento_id: estabelecimentoId,
            tipo: tipoEstabelecimento,
            ano: ano,
            nome_doc: nomeTrim,
            doc_fixo: docFixo ? 1 : 0
        })
        .then(() => {
            fecharModal();
            setExecultar(prev => !prev);
            if (menuDoc) menuDoc();
        })
        .catch(error => {
            const msg = error.response?.data?.Error || error.response?.data?.error || error.response?.data?.message || "Erro ao adicionar documento.";
            setErroMsg(msg);
        })
        .finally(() => {
            setSalvando(false);
        });
    }

    return (
        <Dialog.Root open={fechar} onOpenChange={(aberto) => {
            setFechar(aberto);
            if (!aberto) resetForm();
        }}>
            <Dialog.Trigger asChild>
                <div className={styles.btnMenu}>
                    <p>Adicionar Documento</p>
                </div>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.DialogOverlay} />
                <Dialog.Content className={styles.DialogContent} onPointerDownOutside={(event) => event.preventDefault()}>
                    <Dialog.Title className={styles.DialogTitle}>Adicionar Documento</Dialog.Title>
                    <Dialog.Description className={styles.DialogDescription}>
                        Adicione um novo documento específico para este estabelecimento. Ele entrará na lista de documentos pendentes.
                    </Dialog.Description>

                    {erroMsg && (
                        <div className={styles.errorBox}>
                            {erroMsg}
                        </div>
                    )}

                    <form className={styles.formModal} onSubmit={salvar}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="nome_doc">Nome do Documento *</label>
                            <input
                                id="nome_doc"
                                type="text"
                                value={nomeDoc}
                                onChange={(e) => setNomeDoc(e.target.value)}
                                placeholder="Ex: Alvará Sanitário Anterior, Habite-se, etc."
                                autoFocus
                                required
                                maxLength={150}
                            />
                        </div>

                        <label className={styles.checkboxGroup}>
                            <input
                                type="checkbox"
                                checked={docFixo}
                                onChange={(e) => setDocFixo(e.target.checked)}
                            />
                            <label>Documento Fixo (permanente / não anual)</label>
                        </label>

                        <div className={styles.divBtnSalvar}>
                            <button type="button" className={styles.btnCancelar} onClick={fecharModal} disabled={salvando}>
                                Cancelar
                            </button>
                            <button type="submit" className={styles.btnSalvar} disabled={salvando}>
                                {salvando ? "Adicionando..." : "Adicionar Documento"}
                            </button>
                        </div>
                    </form>

                    <Dialog.Close asChild>
                        <button className={styles.IconButton} aria-label="Fechar" onClick={fecharModal}>
                            ✕
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default ModalAdicionarDoc;

