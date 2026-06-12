// Abre modal para gerar um Auto de Constatação e Advertência (tipo=2) contra o estabelecimento.
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./cssComponents/estiloModal.module.css";
import { useState } from "react";
import api from "../services/api";

/**
 * @param {Object} props
 * @param {Function} props.setExecultar - Força refresh da lista pai
 * @param {number} props.id - ID do estabelecimento
 * @param {string} props.ano - Ano de referência
 * @param {string} props.tipo - "cpf" ou "cnpj"
 */
function ModalConstatacaoAdvertencia({setExecultar, id, ano, tipo}){
    const hoje = new Date().toISOString().split("T")[0];
    const [fechar, setFechar] = useState(false);

    // Envia os dados da constatação (tipo=2) para o endpoint compartilhado intimacao_constatacao.
    function enviarConstatacao(e){
        e.preventDefault();
        const dados = e.target;
        let dadosForm = new FormData(dados);
        const dadosObj = Object.fromEntries(dadosForm);
        dadosObj.estabelecimento_id = id;
        dadosObj.ano = ano;
        dadosObj.tipoEstabelecimento = tipo;
        dadosObj.finalizar = 0;
        dadosObj.tipo = 2;
        api.post('intimacao_constatacao', dadosObj)
        .then(function (response){
            setExecultar(prev => !prev);
            setFechar(false);
        })
        .catch(function(error){
            setFechar(false);
        });
    }

    // ... (JSX idêntico sem alterações)
    return(
        <div>
        <Dialog.Root open={fechar} onOpenChange={setFechar}>
		<Dialog.Trigger asChild>
				<button className={styles.btnNotificacao}>Constatação e Advertência</button>
		</Dialog.Trigger>
		<Dialog.Portal>
				<Dialog.Overlay className={styles.DialogOverlay} />
				<Dialog.Content className={styles.DialogContent}  onPointerDownOutside={(event) => event.preventDefault()}>
					<Dialog.Title className={styles.DialogTitle}>Gerar Novo Auto de Constatação e Advertência</Dialog.Title>
					<Dialog.Description className={styles.DialogDescription}>
					Adicione os dados para gerar um Auto de Constatação e Advertência.
				</Dialog.Description>
					<form onSubmit={enviarConstatacao}  className={styles.formModal}>
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

export default ModalConstatacaoAdvertencia;