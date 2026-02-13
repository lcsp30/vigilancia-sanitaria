import estilo from "./estiloTelaCadastro.module.css";
import voltar from "./volte.png";
import { useNavigate } from "react-router";


function TelaCadastro(){
    let nav = useNavigate();
    function login(){
        nav("/Login");
    }

    return(
        <div className={estilo.divPrincipal}>
            <div className={estilo.caixaImg} onClick={login}><img className={estilo.imgVoltar} src={voltar} alt="" /></div>
            <div className={estilo.caixaFormulario}>
                    <form className={estilo.formCadastro} action="">
                        <div style={{textAlign: "center"}}>
                            <h2>Cadastro</h2>
                        </div>

                        <div className={estilo.caixaInput}>
                            <label className={estilo.labelCadastro} htmlFor="name">Nome</label>
                            <input className={estilo.inputCadastro} type="text" name="nome" placeholder="Digite seu Nome Completo"/>
                        </div>
                        
                        <div className={estilo.caixaInput}>
                            <label className={estilo.labelCadastro} htmlFor="cpf">CPF</label>
                            <input className={estilo.inputCadastro} type="text" name="cpf" placeholder="Digite seu CPF"/>
                        </div>

                         <div className={estilo.caixaInput}>
                            <label className={estilo.labelCadastro} htmlFor="senha">Senha</label>
                            <input className={estilo.inputCadastro} type="text" name="senha" placeholder="Crie uma Senha"/>
                        </div>

                    </form>
            </div>
        </div>
    );
}

export default TelaCadastro;