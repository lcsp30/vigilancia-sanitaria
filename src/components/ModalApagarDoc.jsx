// Modal de confirmação: envia DELETE com url e tipo para remover documento do filesystem e banco.
import * as Dialog from "@radix-ui/react-dialog";
import { AiTwotoneDelete } from "react-icons/ai";
import styles from "./cssComponents/estiloModalApagarDoc.module.css";
import { useState } from "react";
import api from "../services/api";

/**
 * @param {Object} props
 * @param {number} props.id - ID do registro do documento no banco
 * @param {Function} props.setExecultar - Callback para refresh da lista pai
 * @param {string} props.url - Caminho do arquivo no filesystem para o backend localizar e remover
 * @param {string} props.tipo - "cpf" ou "cnpj" para o backend identificar o contexto
 */
function ModalApagarDoc({id, setExecultar, url, tipo}){
    let [fechar, setFechar] = useState(false);
    let [erroMsg, setErroMsg] = useState('');

    // Fecha o modal e limpa mensagem de erro sem executar ação.
    function cancelar(){
        setFechar(false);
        setErroMsg('');
    }

    // Dispara DELETE para o backend com os dados do arquivo e atualiza a lista pai.
    function deletar(){
        setErroMsg('');
        api.delete(`doc/${id}`, {
            params:{
                url: url,
                tipo: tipo
            }
        })
        .then(function(response){
            setExecultar(prev => !prev);
            setFechar(false);
        })
        .catch(function(error){
            // FIXME: Fallback encadeado porque o backend retorna chaves de erro inconsistentes ('Menssagem', 'Error', 'error'). Unificar no backend.
            const msg = error.response?.data?.Menssagem || error.response?.data?.Error || error.response?.data?.error || 'Falha ao apagar documento.';
            setErroMsg(msg);
        });
    }

    return(
        <div>
                <Dialog.Root open={fechar} onOpenChange={setFechar}>
                <Dialog.Trigger asChild>
                        <AiTwotoneDelete size={23} style={{cursor:"pointer"}}/>
                </Dialog.Trigger>
                <Dialog.Portal>
                        <Dialog.Overlay className={styles.DialogOverlay} />
                        <Dialog.Content className={styles.DialogContent}  onPointerDownOutside={(event) => event.preventDefault()}>
                             <Dialog.Title className={styles.DialogTitle}>Apagar Documento</Dialog.Title>
                             <Dialog.Description className={styles.DialogDescription}>
                             Tem certeza que deseja <b>Apagar</b> o documento ?
                         </Dialog.Description>
                                {erroMsg && (
                                    <div style={{ color: '#d32f2f', background: '#ffebee', padding: '8px 12px', borderRadius: 6, marginBottom: 12, fontSize: 14 }}>
                                        {erroMsg}
                                    </div>
                                )}
                                <div className={styles.divBtn}>
                                    <button onClick={deletar}>Apagar</button>
                                    <button onClick={cancelar}>Cancelar</button>
                                </div>
                        <Dialog.Close asChild>
                                <button className={styles.IconButton} aria-label="Close">
                                    X
                                </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
                </Dialog.Root>
                </div> 
    )
}

export default ModalApagarDoc;