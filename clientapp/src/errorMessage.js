import React from 'react'
import Modal from 'react-modal'

export default function({error, setError}){
//const [oldError, setOldError] = useState("")
   // const [isOpen, setIsOpen] = useState(true);
    //useEffect(()=>{

    //    setOldError(isOpen?error:"")
   // },[isOpen, error])
    return (<Modal isOpen={error!==""}>{error.message}<button type={"button"} onClick={()=>setError("")}>{"ok"}</button></Modal>);
}