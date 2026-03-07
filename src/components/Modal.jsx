import * as Dialog from "@radix-ui/react-dialog";
import styles from "./cssComponents/estiloModal.module.css";


function Modal(){
    const hoje = new Date().toISOString().split("T")[0];
    

    return(
        <div>
            <Dialog.Root>
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
					<form className={styles.formModal}>
                        <div className={styles.divInput}>
                            <label htmlFor="categoria">Categoria</label>
                            <select name="categoria" id="" required>
                                <option value="">Selecione a Categoria</option>
                                <option value="cfp">Pessoa Física</option>
                                <option value="cnpj">Pessoa Jurídica</option>
                            </select>
                        </div>
                        <div className={styles.divInput}>
                            <label htmlFor="nomeEstabelecimento">Nome do Estabelecimnto</label>
                            <input name="nomeEstabelecimento" type="text" required/>
                        </div>
                        <div className={styles.divInput}>
                            <label htmlFor="nomeProprietario">Nome do Proprietario</label>
                            <input name="nomeProprietario" type="text" required/>
                        </div>
                        <div className={styles.divInput} style={{display: "none"}}>
                            <label htmlFor="data">Data da Notificação</label>
                            <input name="data" type="text" required/>
                        </div>
                        <div className={styles.divInput} >
                            <label htmlFor="data">Data Limite</label>
                            <input name="data" type="date" min={hoje} required/>
                        </div>
                        <div className={styles.divInput}>
                            <label htmlFor="cfp-cnpj">CPF/CNPJ</label>
                            <input name="cpf-cnpj" type="text" required/>
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
