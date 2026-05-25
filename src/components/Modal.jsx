import * as Dialog from "@radix-ui/react-dialog";
import styles from "./cssComponents/estiloModal.module.css";
import api from "../services/api";
import { useState } from "react";


function Modal({setExecultar}){
    const hoje = new Date().toISOString().split("T")[0];
    let [fechar, setFechar] = useState(false);
    
   function enviarDados(e){
        e.preventDefault();

        let dados = new FormData(e.target);
        let dadosJson = Object.fromEntries(dados);
        
        api.post('estabelecimentos_notificados', dadosJson)
        .then(function(response){
            console.log(response.data);
            setFechar(false);
            setExecultar(prev => !prev);
        })
        .catch(function(erro){
            console.error(erro);
        });
   }

    return(
        <div>
            <Dialog.Root open={fechar} onOpenChange={setFechar}>
		<Dialog.Trigger asChild>
				<button className={styles.btnNotificacao}>Gerar Notificação</button>
		</Dialog.Trigger>
		<Dialog.Portal>
				<Dialog.Overlay className={styles.DialogOverlay} />
				<Dialog.Content className={styles.DialogContent}  onPointerDownOutside={(event) => event.preventDefault()}>
					<Dialog.Title className={styles.DialogTitle}>Gerar Nova Notificação</Dialog.Title>
					<Dialog.Description className={styles.DialogDescription}>
					Adicione os dados para gerar uma nova notificação.
				</Dialog.Description>
					<form className={styles.formModal} onSubmit={enviarDados}>
                        <div className={styles.divInput}>
                            <label htmlFor="nome_estabelecimento">Nome do Estabelecimento</label>
                            <input name="nome_estabelecimento" type="text" required/>
                        </div>
                        <div className={styles.divInput}>
                            <label htmlFor="nome_proprietario">Nome do Proprietario</label>
                            <input name="nome_proprietario" type="text" required/>
                        </div>
                        <div className={styles.divInput}>
                            <label htmlFor="contato">Contato</label>
                            <input name="contato" type="text" required/>
                        </div>
                        <div className={styles.divInput}>
                            <label htmlFor="situacao">Situação</label>
                            <input name="situacao" type="text" required/>
                        </div>
                        <div className={styles.divInput}>
                            <label htmlFor="data_notificacao">Data da Notificação</label>
                            <input name="data_notificacao" type="date" required/>
                        </div>
                        <div className={styles.divBtnSalvar}>
                            <button type="submit" className={styles.btnSalvar}>Salvar</button>
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
        </div> 
    )
}

export default Modal;
