import * as Dialog from "@radix-ui/react-dialog";
import { AiTwotoneDelete } from "react-icons/ai";
import styles from "./cssComponents/estiloModalApagarDoc.module.css";
import { useState } from "react";
import api from "../services/api";

function ModalApagarDoc({id, setExecultar, url, tipo}){
    let [fechar, setFechar] = useState(false);
    function cancelar(){
        setFechar(false);
    }

    function deletar(){
        api.delete('doc/deletar', {
            params:{
                id: id,
                url: url,
                tipo: tipo
            }
        })
        .then(function(response){
            console.log(response.data);
            setExecultar(prev => !prev);
        })
        .catch(function(error){
            console.error(error);
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