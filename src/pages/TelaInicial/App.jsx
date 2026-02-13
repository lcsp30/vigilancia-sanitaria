import { useState } from 'react'
import estilo from './App.module.css'
import { useNavigate } from 'react-router';

function App() {
  const [count, setCount] = useState(0)

  let nav = useNavigate();

  function login(){
    nav("/Login");
  }

  return (
   <div className={estilo.divPrincipal}>
    <header className={estilo.topo}>
      <h1>Sistema da Vigilância</h1>
    </header>
    <div className={estilo.caixaBtn}>
      <button className={estilo.btn} onClick={login}>Vigilância Sanitária</button>
      <button className={estilo.btn}>Zoonoses</button>
    </div>
   </div>
  )
}

export default App;
