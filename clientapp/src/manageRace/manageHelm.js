import React, {useState} from 'react'
import {AwesomeButton} from 'react-awesome-button'
import {Mutation} from 'react-apollo'

export default ({helmName}) => {
   const [editHelm, setEditHelm] = useState(false) 
    return <Mutation><td onClick={()=>setEditHelm(!editHelm)}>{helmName}
    {editHelm && <AwesomeButton >Remove from race</AwesomeButton>}
    </td></Mutation>
}