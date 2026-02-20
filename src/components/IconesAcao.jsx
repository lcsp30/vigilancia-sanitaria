import { AiOutlineExport, AiTwotoneDelete } from "react-icons/ai";

function IconesAcao(){
    return(
        <div style={{textAlign:"center"}}>
            <AiTwotoneDelete size={23} style={{cursor:"pointer", marginRight:"20px"}}/> 
            <AiOutlineExport size={23} style={{cursor:"pointer"}} />
        </div>
    )
}

export default IconesAcao;