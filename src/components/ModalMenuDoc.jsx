// Modal com checkboxes para habilitar/desabilitar documentos de um estabelecimento.
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./cssComponents/estiloModalMenuDoc.module.css";
import api from "../services/api";
import { useState } from "react";

/**
 * @param {Object} props
 * @param {Array} props.docs - Lista de documentos com id_documento, nome_doc e status
 * @param {Function} props.menuDoc - Fecha o menu dropdown pai
 * @param {string} props.tipoEstabelecimento - "cpf" ou "cnpj"
 * @param {Function} props.setExecultar - Força refresh da lista pai
 */
function ModalMenuDoc({docs, menuDoc, tipoEstabelecimento, setExecultar}){
    const [alteracoes, setAlteracoes] = useState({});
    let [fechar, setFechar] = useState(false);
    let [erroMsg, setErroMsg] = useState('');

    // Rastreia apenas mudanças de estado dos checkboxes (marcado/desmarcado).
    const registrarMudanca = (e) => {
    const { name, checked } = e.target;
    setAlteracoes(prev => ({
        ...prev,
        [name]: checked
    }));
    };

    // Envia ao backend somente os documentos que sofreram alteração.
    function enviar(e){
         e.preventDefault();
         setErroMsg('');
        const apenasAlterados = Object.entries(alteracoes).map(([id, valor]) => ({
        id_documento: id,
        status: valor
    }));
    api.put('doc/alterar', {
            dados: apenasAlterados,
            tipo: tipoEstabelecimento
    })
    .then(function (response){
        setFechar(false);
        setExecultar(prev => !prev);
        menuDoc();
    })
    .catch(function(error){
        setErroMsg("Erro ao Desabilitar Documento.");
    });
    }

    return(
        <Dialog.Root open={fechar} onOpenChange={setFechar}>
        <Dialog.Trigger asChild>
                <div className={styles.btnMenu}>
                        <p>Desabilitar Documento</p>
                </div>
        </Dialog.Trigger>
        <Dialog.Portal>
                <Dialog.Overlay className={styles.DialogOverlay} />
                <Dialog.Content className={styles.DialogContent}  onPointerDownOutside={(event) => event.preventDefault()}>
                    <Dialog.Title className={styles.DialogTitle}>Desabilitar Documento</Dialog.Title>
                    <Dialog.Description className={styles.DialogDescription}>
                    Selecione os Documentos para Desabilitar.
                </Dialog.Description>
                    {erroMsg && (
                        <div style={{ color: '#d32f2f', background: '#ffebee', padding: '8px 12px', borderRadius: 6, marginBottom: 12, fontSize: 14 }}>
                            {erroMsg}
                        </div>
                    )}
                    <form className={styles.formModal} onSubmit={enviar}>
                        <div className={styles.divInput}>
                            {docs.map((doc) => 
                                <div className={styles.itensDoc} key={doc.id_documento}>
                                <input type='checkbox' name={doc.id_documento} value={doc.id_documento} defaultChecked={doc.status} onChange={registrarMudanca}/>
                                <label >{doc.nome_doc}</label>
                            </div>
                            )}    
                        </div>
                        <div className={styles.divBtnSalvar}>
                            <button type="submit" className={styles.btnSalvar}>Salvar</button>
                        </div>
                    </form>
                <Dialog.Close asChild>
                        <div className={styles.IconButton} onClick={() => menuDoc()} aria-label="Close">
                            X
                        </div>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
        </Dialog.Root>
    )
}

export default ModalMenuDoc;