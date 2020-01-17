import React from 'react'
import {loader} from 'graphql.macro'
import {useQuery, useMutation} from '@apollo/react-hooks'
const ALL_HELMS = loader("./graphqlQueries/ALL_HELMS.graphql")
export default ()=>{
    
    const {data, loading, error} = useQuery(ALL_HELMS)
    //const {remove} = useMutation()
    if(loading) return 'loading'
    if (error) return error
console.log(data);

let x = data.allHelms.map(elem=><tr>
<td>{elem.name}</td>
<td><button>X</button></td>
<td>{elem.boatName}</td>
<td>{elem.boatNumber}</td>
<td>{elem.pY}</td>
</tr>)
    return <><table>
        <tr>
            <th>Name</th>
            <th>Remove</th>
            <th>Boat Class</th>
            <th>Boat Number</th>
            <th>PY</th>
        </tr>
        {x}
    
    </table></>;}