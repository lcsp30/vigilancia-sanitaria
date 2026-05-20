import * as Dialog from "@radix-ui/react-dialog";
import styles from "./cssComponents/estiloModal.module.css";
import api from "../services/api";
import { useState } from "react";

function ModalNovoAno({categoriaid, idDado, tipoEstabelecimento, setExecultar}){
    let [fechar, setFechar] = useState(false);
    let [gerando, setGerando] = useState(false);
    const anoAtual = new Date().getFullYear();


    function gerarRequerimento(e){
        e.preventDefault();
        setGerando(true);
       const formData = new FormData(e.currentTarget);
       const anoSelecionado = formData.get('ano');

       let dados = {
            id: idDado,
            id_categoria: categoriaid,
            tipo: tipoEstabelecimento,
            ano: anoSelecionado
       }
            api.post('criarDocsNovoAno', dados)
            .then(function(response){
                console.log(response.data.res);
                setExecultar(prev => !prev);
                setFechar(false);
                alert(response.data.res);
            })
            .catch(function(error){
                console.error(error);
                setFechar(false);
                alert('Falha ao tentar gerar requerimento!!');
            })
            .finally(function (){
                setGerando(false);
            });
        }
        
    return(
        
            <Dialog.Root open={fechar} onOpenChange={setFechar}>
        <Dialog.Trigger asChild>
                <button className={styles.btnNotificacao}>Novo Ano</button>
        </Dialog.Trigger>
        <Dialog.Portal>
                <Dialog.Overlay className={styles.DialogOverlay} />
                {gerando && <div className={styles.loadingOverlay}><span className={styles.spinner}></span></div>}
                <Dialog.Content className={styles.DialogContent}  onPointerDownOutside={(event) => event.preventDefault()}>
                    <Dialog.Title className={styles.DialogTitle}>Gerar Nova Requerimento</Dialog.Title>
                    <Dialog.Description className={styles.DialogDescription}>
                    Adicione os dados para gerar o Requerimento.
                </Dialog.Description>
                    <form className={styles.formModal} onSubmit={gerarRequerimento}>
                        <div className={styles.divInput}>
                            <select name="ano" defaultValue={""} required>
                                <option value="">Selecione o Ano</option>
                                <option value={anoAtual}>{anoAtual}</option>
                                <option value={anoAtual + 1}>{anoAtual + 1}</option>
                                <option value={anoAtual + 2}>{anoAtual + 2}</option>
                            </select>
                        </div>
                        <div className={styles.divBtnSalvar}>
                            <button type="submit" className={styles.btnSalvar} disabled={gerando}>Gerar</button>
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

export default ModalNovoAno;
