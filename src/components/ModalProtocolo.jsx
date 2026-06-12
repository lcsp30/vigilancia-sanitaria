// Gera um Protocolo em PDF com os documentos selecionados via checkbox.
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./cssComponents/estiloModalRequerimento.module.css";
import api from "../services/api";
import { useState } from "react";

/**
 * @param {Object} props
 * @param {number} props.idDado - ID do estabelecimento
 * @param {string} props.tipoEstabelecimento - "cpf" ou "cnpj"
 * @param {string} props.nomeEstb - Nome do estabelecimento (usado no nome do arquivo)
 */
function ModalProtocolo({categoriaDado, idDado,tipoEstabelecimento, nomeEstb}){
    let [fechar, setFechar] = useState(false);
    let [gerando, setGerando] = useState(false);
    let [erroMsg, setErroMsg] = useState('');

    // Separa campos genéricos (validade, n) dos checkboxes e faz o download do PDF como blob.
    function gerarRequerimento(e){
        e.preventDefault();
        setGerando(true);
        setErroMsg('');
        const formData = new FormData(e.target);
        const camposEspecificos = [
        'r','ts','at','pc','lcb','ls','rg','cpf','ce','vcn','in','jc'
        ];
        const dados = {};
        const especificos = {};
        formData.forEach((value, key) => {
            if (camposEspecificos.includes(key)) {
                especificos[key] = value;
            } else {
                dados[key] = value;
            }
        });
        const { n, validade } = dados;
            api.get(`gerarProtocolo/${idDado}`, {
                params: { validade, n, especificos, tipo: tipoEstabelecimento },
                responseType: 'blob',
            })
            .then(function(response){
                let nomeArquivo = "Protocolo_" + nomeEstb;
                const url = window.URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', nomeArquivo);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                setFechar(false);
            })
            .catch(function(error){
                setErroMsg('Falha ao tentar gerar protocolo.');
            })
            .finally(function (){ setGerando(false); })
        }

    return(
    <Dialog.Root open={fechar} onOpenChange={setFechar}>
        <Dialog.Trigger asChild>
                <button className={styles.btnNotificacao}>Gerar Protocolo</button>
        </Dialog.Trigger>
        <Dialog.Portal>
                <Dialog.Overlay className={styles.DialogOverlay} />
                {gerando && <div className={styles.loadingOverlay}><span className={styles.spinner}></span></div>}
                <Dialog.Content className={styles.DialogContent}  onPointerDownOutside={(event) => event.preventDefault()}>
                    <Dialog.Title className={styles.DialogTitle}>Gerar Protocolo</Dialog.Title>
                    <Dialog.Description className={styles.DialogDescription}>Adicione os dados para gerar o Protocolo.</Dialog.Description>
                    {erroMsg && (<div style={{ color: '#d32f2f', background: '#ffebee', padding: '8px 12px', borderRadius: 6, marginBottom: 12, fontSize: 14 }}>{erroMsg}</div>)}
                    <form className={styles.formModal} onSubmit={gerarRequerimento}>
                        <div className={styles.divInput}>
                            <div className={styles.itensDoc}><input type="checkbox" name="r" value="r" id="" /><label htmlFor="r">Requerimento (SMS)</label></div>
                            <div className={styles.itensDoc}><input type="checkbox" name="ts" value="ts" id="" /><label htmlFor="ts">Taxa de Saúde/VISA</label></div>
                            <div className={styles.itensDoc}><input type="checkbox" name="at" value="at" id="" /><label htmlFor="at">Alvará Tributos</label></div>
                            <div className={styles.itensDoc}><input type="checkbox" name="pc" value="pc" id="" /><label htmlFor="pc">Alvará Policia Civil</label></div>
                            <div className={styles.itensDoc}><input type="checkbox" name="lcb" value="lcb" id="" /><label htmlFor="lcb">Licença Corpo de Bombeiro</label></div>
                            <div className={styles.itensDoc}><input type="checkbox" name="ls" value="ls" id="" /><label htmlFor="ls">Licença da SEMA</label></div>
                            <div className={styles.itensDoc}><input type="checkbox" name="rg" value="rg" id="" /><label htmlFor="rg">RG</label></div>
                            <div className={styles.itensDoc}><input type="checkbox" name="cpf" value="cpf" id="" /><label htmlFor="cpf">CPF</label></div>
                            </div>
                            {tipoEstabelecimento == "cnpj" && 
                                <div className={styles.divInput}>
                                     <div className={styles.itensDoc}><input type="checkbox" name="ce" value="ce" id="" /><label htmlFor="ce">Constituição de Empresa</label></div>
                            <div className={styles.itensDoc}><input type="checkbox" name="vcn" value="vcn" id="" /><label htmlFor="vcn">CNPJ</label></div>
                            <div className={styles.itensDoc}><input type="checkbox" name="in" value="in" id="" /><label htmlFor="in">Insc. Estadual/ Municipal</label></div>
                            <div className={styles.itensDoc}><input type="checkbox" name="jc" value="jc" id="" /><label htmlFor="jc">Junta Comercial</label></div>
                                </div>
                            }
                        <div className={styles.divInput1}><label htmlFor="validade">Validade</label><input type="date" name="validade" id="" /></div>
                        <div className={styles.divInput1}><label htmlFor="n">Numero do Protocolo</label><input type="number" name="n" /></div>
                        <div className={styles.divBtnSalvar}><button type="submit" className={styles.btnSalvar} disabled={gerando}>Gerar</button></div>
                    </form>
                <Dialog.Close asChild><button className={styles.IconButton} aria-label="Close">X</button></Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
        </Dialog.Root>
    )
}

export default ModalProtocolo;