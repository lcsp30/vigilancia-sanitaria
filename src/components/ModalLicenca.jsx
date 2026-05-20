import * as Dialog from "@radix-ui/react-dialog";
import styles from "./cssComponents/estiloModal.module.css";
import api from "../services/api";
import { useState } from "react";

function ModalLicenca({idDado, tipoEstabelecimento, ano, valorBtnLicenca, categoria, nomeEstb}){
    let [fechar, setFechar] = useState(false);
    let [gerando, setGerando] = useState(false);

    function gerarLicenca(e){
         e.preventDefault();
        setGerando(true);
        let dados = new FormData(e.target);

        let dadosJson = Object.fromEntries(dados);
        dadosJson.id = idDado;
        dadosJson.categoria = categoria;
        dadosJson.ano = ano;

        console.log(dadosJson);

        if(tipoEstabelecimento == "cpf"){
              api.get('licenca_cpf', {
                params: {
                    ...dadosJson
                },
                responseType: 'blob',
            })
            .then(function(response){
              let nomeArquivo = "Licença " + nomeEstb;
            
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
                console.error(error);
                setFechar(false);
                alert('Falha ao tentar gerar Licença!!');
            })
            .finally(function (){
                setGerando(false);
            })
        }else if(tipoEstabelecimento == "cnpj"){
            api.get('licenca', {
                params: {
                   ...dadosJson,
                },
                responseType: 'blob',
            })
            .then(function(response){
            let nomeArquivo = "Licença" + nomeEstb;
            
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
                console.error(error);
                setFechar(false);
                alert('Falha ao tentar gerar Licença!!');
            })
            .finally(function (){
                setGerando(false);
            });
        }

        }

        function controleLicenca(e){
            if(valorBtnLicenca === true){
                e.preventDefault();
                setFechar(false);
                alert("A Licença não pode ser criada, documentação pendente!!");
            }
        }

    return(
        
            <Dialog.Root open={fechar} onOpenChange={setFechar}>
        <Dialog.Trigger asChild>
                <button className={styles.btnNotificacao} style={{cursor: "pointer" , opacity: !valorBtnLicenca ? 1 : 0.5}} onClick={controleLicenca}>Gerar Licença</button>
        </Dialog.Trigger>
        <Dialog.Portal>
                <Dialog.Overlay className={styles.DialogOverlay} />
                {gerando && <div className={styles.loadingOverlay}><span className={styles.spinner}></span></div>}
                <Dialog.Content className={styles.DialogContent}  onPointerDownOutside={(event) => event.preventDefault()}>
                    <Dialog.Title className={styles.DialogTitle}>Gerar Nova Licença</Dialog.Title>
                    <Dialog.Description className={styles.DialogDescription}>
                    Adicione os dados para gerar a Licença.
                </Dialog.Description>
                    <form className={styles.formModal} onSubmit={gerarLicenca}>
                        <div className={styles.divInput}>
                            <select name="tipo" defaultValue={""} required>
                                <option value="">Selecione o Tipo</option>
                                <option value="licenca">Licença de Funcionamento</option>
                                <option value="renovacao">Renovação da Lincença de Funcionamento</option>
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

export default ModalLicenca;
