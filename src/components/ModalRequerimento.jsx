import * as Dialog from "@radix-ui/react-dialog";
import styles from "./cssComponents/estiloModal.module.css";


function ModalRequerimento(){
    const hoje = new Date().toISOString().split("T")[0];

    return(
        
            <Dialog.Root>
        <Dialog.Trigger asChild>
                <button className={styles.btnNotificacao}>Gerar Requerimento</button>
        </Dialog.Trigger>
        <Dialog.Portal>
                <Dialog.Overlay className={styles.DialogOverlay} />
                <Dialog.Content className={styles.DialogContent}  onPointerDownOutside={(event) => event.preventDefault()}>
                    <Dialog.Title className={styles.DialogTitle}>Gerar Nova Requerimento</Dialog.Title>
                    <Dialog.Description className={styles.DialogDescription}>
                    Adicione os dados para gerar o Requerimento.
                </Dialog.Description>
                    <form className={styles.formModal}>
                        <div className={styles.divInput}>
                            <label htmlFor="data">Licença de Funcionamento</label>
                            <input name="data" type="text" required/>
                        </div>
                        <div className={styles.divInput}>
                            <label htmlFor="data">Renovação da Lincença de Funcionamento</label>
                            <input name="data" type="text" required/>
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
    )
}

export default ModalRequerimento;
