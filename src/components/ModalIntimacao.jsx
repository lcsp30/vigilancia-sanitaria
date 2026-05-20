import * as Dialog from "@radix-ui/react-dialog";
import styles from "./cssComponents/estiloModal.module.css";
import api from "../services/api";
import { useState } from "react";


function ModalIntimacao({id, ano, tipo, setExecultar}){
    const hoje = new Date().toISOString().split("T")[0];
    let [fechar, setFechar] = useState(false);

    function criarIntimacao(e){
        e.preventDefault();

        let dados = new FormData(e.target);
        let dadosObj = Object.fromEntries(dados);
        dadosObj.estabelecimento_id = id;
        dadosObj.ano = ano;
        dadosObj.tipoEstabelecimento = tipo;
        dadosObj.finalizar = 0;
        dadosObj.tipo = 1;

        console.log(dadosObj);
        api.post('intimacao_constatacao', dadosObj)
        .then(function(response){
             console.log(response.data);
             setExecultar(prev => !prev);
             setFechar(false);
        })
        .catch(function(error){
            console.error(error);
        });
    }

    return(
        <div>
            <Dialog.Root open={fechar} onOpenChange={setFechar}>
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
					<form className={styles.formModal} onSubmit={criarIntimacao}>
                        <div className={styles.divInput}>
                            <label htmlFor="descricao">Descrição</label>
                            <input name="descricao" type="text" required/>
                        </div>
                        <div className={styles.divInput} >
                            <label htmlFor="data_expiracao">Data Limite</label>
                            <input name="data_expiracao" type="date" min={hoje} required/>
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
