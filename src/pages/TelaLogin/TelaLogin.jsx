import estilo from "./estiloTelaLogin.module.css";
import { useNavigate } from "react-router";

function TelaLogin(){
    let nav = useNavigate();

    function cadastro(){
        nav("/cadastro");
    }

    return(
        <div className={estilo.divPrincipal}>
            <div className={estilo.caixaFormulario}>
                    <form className={estilo.formLogin} action="">
                        <div style={{textAlign: "center"}}>
                            <h2>Login</h2>
                        </div>

                        <div className={estilo.caixaInput}>
                            <label className={estilo.labelLogin} htmlFor="usuario">Usuario</label>
                            <input className={estilo.inputLogin} type="text" name="senha"/>
                        </div>
                        
                        <div className={estilo.caixaInput}>
                            <label className={estilo.labelLogin} htmlFor="senha">Senha</label>
                            <input className={estilo.inputLogin} type="text" name="senha"/>
                        </div>

                        <div className={estilo.divCadastro}>
                            <p>Ainda não tem cadastro? <a className={estilo.linkCadastrar} onClick={cadastro}>Cadastrar-se</a></p>
                        </div>
                    </form>
            </div>
        </div>
    );
}

export default TelaLogin;