// Cria documentos em lote para um novo ano (ano atual ou próximo) do estabelecimento.
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./cssComponents/estiloModal.module.css";
import api from "../services/api";
import { useState } from "react";

/**
 * @param {Object} props
 * @param {number} props.categoriaid - ID da categoria do estabelecimento
 * @param {number} props.idDado - ID do estabelecimento
 * @param {string} props.tipoEstabelecimento - "cpf" ou "cnpj"
 * @param {Function} props.setExecultar - Força refresh da lista pai
 */
function ModalNovoAno({categoriaid, idDado, tipoEstabelecimento, setExecultar}){
    let [fechar, setFechar] = useState(false);
    let [gerando, setGerando] = useState(false);
    let [erroMsg, setErroMsg] = useState('');
    const anoAtual = new Date().getFullYear();

    // Envia ao backend os dados para criar o conjunto de documentos do ano selecionado.
    function gerarRequerimento(e){
        e.preventDefault();
        setGerando(true);
        setErroMsg('');
       const formData = new FormData(e.currentTarget);
       const anoSelecionado = formData.get('ano');
       let dados = {
            id: idDado,
            id_categoria: categoriaid,
            tipo: tipoEstabelecimento,
            ano: anoSelecionado
       }
            api.post('criarDocsNovoAno', dados)
            .then(function(response){
                setExecultar(prev => !prev);
                setFechar(false);
            })
            .catch(function(error){
                const msg = error.response?.data?.Error || error.response?.data?.error || error.response?.data?.res || 'Falha ao tentar criar documentos para o novo ano.';
                setErroMsg(msg);
            })
            .finally(function (){
                setGerando(false);
            });
        }
        
    return(
        
            <Dialog.Root open={fechar} onOpenChange={setFechar}>
        <Dialog.Trigger asChild>
                <button className={styles.btnNotificacao}>Novo Ano</button>
        </Dialog.Trigger>
        <Dialog.Portal>
                <Dialog.Overlay className={styles.DialogOverlay} />
                {gerando && <div className={styles.loadingOverlay}><span className={styles.spinner}></span></div>}
                <Dialog.Content className={styles.DialogContent}  onPointerDownOutside={(event) => event.preventDefault()}>
                    <Dialog.Title className={styles.DialogTitle}>Criar Documentos - Novo Ano</Dialog.Title>
                    <Dialog.Description className={styles.DialogDescription}>
                    Selecione o ano para criar os documentos do estabelecimento.
                </Dialog.Description>
                    {erroMsg && (
                        <div style={{ color: '#d32f2f', background: '#ffebee', padding: '8px 12px', borderRadius: 6, marginBottom: 12, fontSize: 14 }}>
                            {erroMsg}
                        </div>
                    )}
                    <form className={styles.formModal} onSubmit={gerarRequerimento}>
                        <div className={styles.divInput}>
                            <select name="ano" defaultValue={""} required>
                                <option value="">Selecione o Ano</option>
                                <option value={anoAtual}>{anoAtual}</option>
                                <option value={anoAtual + 1}>{anoAtual + 1}</option>
                            </select>
                        </div>
                        <div className={styles.divBtnSalvar}>
                            <button type="submit" className={styles.btnSalvar} disabled={gerando}>Gerar</button>
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
    )
}

export default ModalNovoAno;