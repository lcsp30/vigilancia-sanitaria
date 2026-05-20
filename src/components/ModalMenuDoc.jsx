import * as Dialog from "@radix-ui/react-dialog";
import styles from "./cssComponents/estiloModalMenuDoc.module.css";
import api from "../services/api";
import { useState } from "react";

function ModalMenuDoc({docs, menuDoc, tipoEstabelecimento, setExecultar}){
    const [alteracoes, setAlteracoes] = useState({});
    let [fechar, setFechar] = useState(false);

    const registrarMudanca = (e) => {
    const { name, checked } = e.target;
    
    setAlteracoes(prev => ({
        ...prev,
        [name]: checked // Salva: "id_do_doc": true/false
    }));
    };

    function enviar(e){
         e.preventDefault();
        const apenasAlterados = Object.entries(alteracoes).map(([id, valor]) => ({
        id_documento: id,
        status: valor // true = marcado, false = desmarcado
    }));

    api.put('doc/alterar', {
            dados: apenasAlterados,
            tipo: tipoEstabelecimento
    })
    .then(function (response){
        console.log(tipoEstabelecimento);
        console.log(apenasAlterados);
        console.log(response.data);
        setFechar(false);
        setExecultar(prev => !prev);
        menuDoc();
    })
    .catch(function(error){
        console.error(error);
        menuDoc();
        setFechar(false);
        alert("Erro ao Desabilitar Documento!");
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
