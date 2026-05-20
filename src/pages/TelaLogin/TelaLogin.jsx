import estilo from "./estiloTelaLogin.module.css";
import { useNavigate } from "react-router";

function TelaLogin(){
    let nav = useNavigate();

    return(
        <div className={estilo.divPrincipal}>
            <div className={estilo.caixaFormulario}>
                    <form className={estilo.formLogin}>
                        <div style={{textAlign: "center", marginBottom: "8px"}}>
                            <h2 style={{fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#1f2937", margin: 0}}>Login</h2>
                        </div>
                        
                        <div className={estilo.caixaInput}>
                            <label className={estilo.labelLogin} htmlFor="senha">Código de Acesso</label>
                            <input className={estilo.inputLogin} type="text" name="senha" placeholder="Digite seu código de acesso"/>
                        </div>

                        <div className={estilo.caixaBtn}>
                            <button className={estilo.btnEntrar} type="submit">Entrar</button>
                        </div>
                    </form>
            </div>
        </div>
    );
}

export default TelaLogin;
