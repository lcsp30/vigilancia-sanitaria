import * as Dialog from "@radix-ui/react-dialog";
import styles from "./cssComponents/estiloModal.module.css";


function ModalIntimacao(){
    const hoje = new Date().toISOString().split("T")[0];

    return(
        <div>
            <Dialog.Root>
		<Dialog.Trigger asChild>
				<button className={styles.btnNotificacao}>Gerar Intimação</button>
		</Dialog.Trigger>
		<Dialog.Portal>
				<Dialog.Overlay className={styles.DialogOverlay} />
				<Dialog.Content className={styles.DialogContent}  onPointerDownOutside={(event) => event.preventDefault()}>
					<Dialog.Title className={styles.DialogTitle}>Gerar Nova Intimação</Dialog.Title>
					<Dialog.Description className={styles.DialogDescription}>
					Adicione os dados para gerar uma Intimação.
				</Dialog.Description>
					<form className={styles.formModal}>
                        <div className={styles.divInput}>
                            <label htmlFor="nomeEstabelecimento">Descrição</label>
                            <input name="nomeEstabelecimento" type="text" required/>
                        </div>
                        <div className={styles.divInput} style={{display: "none"}}>
                            <label htmlFor="data">Data da Notificação</label>
                            <input name="data" type="text" required/>
                        </div>
                        <div className={styles.divInput} >
                            <label htmlFor="data">Data Limite</label>
                            <input name="data" type="date" min={hoje} required/>
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

export default ModalIntimacao;
