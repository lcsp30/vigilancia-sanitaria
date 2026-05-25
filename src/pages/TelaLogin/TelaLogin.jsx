import { useState } from 'react';
import { useNavigate } from "react-router";
import { useAuth } from '../../contexts/AuthContext';
import estilo from "./estiloTelaLogin.module.css";

function TelaLogin(){
    let nav = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ name:'', senha:''});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.name, form.senha);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao fazer login.');
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className={estilo.divPrincipal}>
            <div className={estilo.caixaFormulario}>
                    <form className={estilo.formLogin} onSubmit={handleSubmit}>
                        <div style={{textAlign: "center", marginBottom: "8px"}}>
                            <h2 style={{fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#1f2937", margin: 0}}>Login</h2>
                        </div>
                        <div className={estilo.caixaInput}>
                            <label className={estilo.labelLogin} htmlFor="name">Usuario</label>
                            <input
                                className={estilo.inputLogin}
                                type="text"
                                name="name_user"
                                placeholder="Digite seu usuario"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        
                        <div className={estilo.caixaInput}>
                            <label className={estilo.labelLogin} htmlFor="senha">Código de Acesso</label>
                            <input
                                className={estilo.inputLogin}
                                type="password"
                                name="senha"
                                placeholder="Digite seu código de acesso"
                                value={form.senha}
                                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                                required
                            />
                        </div>

                        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: 16 }}>{error}</p>}

                        <div className={estilo.caixaBtn}>
                            <button className={estilo.btnEntrar} type="submit" disabled={loading}>
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </div>
                    </form>
            </div>
        </div>
    );
}

export default TelaLogin;
