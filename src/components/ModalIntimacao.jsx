// Abre modal para gerar uma Intimação (tipo=1) vinculada ao estabelecimento.
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./cssComponents/estiloModal.module.css";
import api from "../services/api";
import { useState } from "react";

/**
 * @param {Object} props
 * @param {number} props.id - ID do estabelecimento
 * @param {string} props.ano - Ano de referência
 * @param {string} props.tipo - "cpf" ou "cnpj"
 * @param {Function} props.setExecultar - Força refresh da lista pai
 */
function ModalIntimacao({id, ano, tipo, setExecultar}){
    const hoje = new Date().toISOString().split("T")[0];
    let [fechar, setFechar] = useState(false);

    // Envia os dados da intimação (tipo=1) para o endpoint compartilhado intimacao_constatacao.
    function criarIntimacao(e){
        e.preventDefault();
        let dados = new FormData(e.target);
        let dadosObj = Object.fromEntries(dados);
        dadosObj.estabelecimento_id = id;
        dadosObj.ano = ano;
        dadosObj.tipoEstabelecimento = tipo;
        dadosObj.finalizar = 0;
        dadosObj.tipo = 1;
        api.post('intimacao_constatacao', dadosObj)
        .then(function(response){
             setExecultar(prev => !prev);
             setFechar(false);
        })
        .catch(function(error){
            // erro silencioso — o backend não retorna mensagem amigável para este endpoint
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
                        <div className={styles.gridInput}>
                              <div className={styles.divInput}>
                            <label htmlFor="descricao">Descrição</label>
                            <input name="descricao" type="text" required/>
                        </div>
                        <div className={styles.divInput} >
                            <label htmlFor="data_expiracao">Data Limite</label>
                            <input name="data_expiracao" type="date" min={hoje} required/>
                        </div>
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