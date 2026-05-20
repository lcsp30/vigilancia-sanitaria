import * as Dialog from "@radix-ui/react-dialog";
import styles from "./cssComponents/estiloModalRequerimento.module.css";
import api from "../services/api";
import { useState } from "react";

function ModalRequerimento({categoriaDado, idDado, tipoEstabelecimento}){
    let [fechar, setFechar] = useState(false);
    let [gerando, setGerando] = useState(false);

    function gerarRequerimento(e){
        e.preventDefault();
        setGerando(true);
        const formData = new FormData(e.target);
        const dados = Object.fromEntries(formData);

        console.log(dados);
        if(tipoEstabelecimento == "cpf"){
              api.get(`gerar_requerimento/${idDado}`, {
                params: {
                    categoria: categoriaDado,
                    dados: dados
                }
            })
            .then(function(response){
                let link = response.data.link;
                console.log(link);
                window.open(link, "_blank");
                setFechar(false);
            })
            .catch(function(error){
                console.error(error);
                setFechar(false);
                alert('Falha ao tentar gerar requerimento!!');
            })
            .finally(function (){
                setGerando(false);
            });

        }else if(tipoEstabelecimento == "cnpj"){
            api.get(`gerar_requerimento_cnpj/${idDado}`, {
                params: {
                    dados: dados
                }
            })
            .then(function(response){
                let link = response.data.link;
                console.log(link);
                window.open(link, "_blank");
                setFechar(false);
            })
            .catch(function(error){
                console.error(error);
                setFechar(false);
                alert('Falha ao tentar gerar requerimento!!');
            })
            .finally(function (){
                setGerando(false);
            })
        }

        }

    return(
        
            <Dialog.Root open={fechar} onOpenChange={setFechar}>
        <Dialog.Trigger asChild>
                <button className={styles.btnNotificacao}>Gerar Requerimento</button>
        </Dialog.Trigger>
        <Dialog.Portal>
                <Dialog.Overlay className={styles.DialogOverlay} />
                <Dialog.Content className={styles.DialogContent}  onPointerDownOutside={(event) => event.preventDefault()}>
                    {gerando && <div className={styles.loadingOverlay}><span className={styles.spinner}></span></div>}
                    <Dialog.Title className={styles.DialogTitle}>Gerar Nova Requerimento</Dialog.Title>
                    <Dialog.Description className={styles.DialogDescription}>
                    Adicione os dados para gerar o Requerimento.
                </Dialog.Description>
                    <form className={styles.formModal} onSubmit={gerarRequerimento}>
                        <div className={styles.divInput}>
                           
                            <div className={styles.itensDoc}>
                            <input type="checkbox" name="ap" value="ap" id="" />
                            <label htmlFor="ap">APROVAÇÃO DE PROJETO</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="ahc" value="ahc" id="" />
                                <label htmlFor="ahc">ATESTADO DE HIGIENE E CONFORTO</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="ai" value="ai" id="" />
                                <label htmlFor="ai">ATESTADO DE INUTILIZAÇÃO</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="al" value="al" id="" />
                                <label htmlFor="al">AUTENTICAÇÃO DE LIVROS</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="crt" value="crt" id="" />
                                <label htmlFor="crt">CANCELAMENTO DE RESP. TÉCNICA</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="cmb" value="cmb" id="" />
                                <label htmlFor="cmb">CONF. DE MAPAS E BALANÇOS</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="d" value="d" id="" />
                                <label htmlFor="d">DESINTERDIÇÃO</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="eb" value="eb" id="" />
                                <label htmlFor="eb">EXAME BROMATOLÓGICO</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="h" value="h" id="" />
                                <label htmlFor="h">HABITE-SE</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="lml" value="lml" id="" />
                                <label htmlFor="lml">LIBERAÇÃO DE MEDICAMENTOS</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="l" value="l" id="" />
                                <label htmlFor="l">LICENÇA DE FUNCIONAMENTO</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="lo" value="lo" id="" />
                                <label htmlFor="lo">LICENÇA PARA OBRA</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="rdp" value="rdp" id="" />
                                <label htmlFor="rdp">RATIFICAÇÃO DE PROJETO</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="aai" value="aai" id="" />
                                <label htmlFor="aai">AUTORIZAÇÃO APLICAÇÃO INJETÁVEL</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="rf" value="rf" id="" />
                                <label htmlFor="rf">REGISTRO DE FIRMA</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="rp" value="rp" id="" />
                                <label htmlFor="rp">REGISTRO PROFISSIONAL</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="rbe" value="rbe" id="" />
                                <label htmlFor="rbe">REQ. DE B. ENTORPECENTE</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="sr" value="sr" id="" />
                                <label htmlFor="sr">SUBST. DE RESPONSABILIDADE</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="tr" value="tr" id="" />
                                <label htmlFor="tr">TERMO DE RESPONSABILIDADE</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="r" value="r" id="" />
                                <label htmlFor="r">RENOVAÇÃO L. DE FUNCIONAMENTO</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="via2" value="via2" id="" />
                                <label htmlFor="via2">2ª VIA</label>
                            </div>

                            <div className={styles.itensDoc}>
                                <input type="checkbox" name="o" value="o" id="" />
                                <label htmlFor="o">OUTROS</label>
                            </div>

                            <div>

                            </div>

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

export default ModalRequerimento;
