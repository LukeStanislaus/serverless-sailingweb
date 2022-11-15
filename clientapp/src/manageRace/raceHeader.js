import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { loader } from 'graphql.macro'
import styled from 'styled-components'
let Tr = styled.tr`
&:hover {background-color: #fdbdbd;}
&:nth-child(even){background-color: #f2f2f2;}
`
let Th = styled.th`
padding-top: 12px;
padding-bottom: 12px;
text-align: left;
background-color: #187bd1;
color: white;
border: 1px solid #ddd;
padding: 8px;
`
const SELECT_ORDER_BY = loader('../graphqlQueries/SELECT_ORDER_BY.graphql')
const ORDER_BY = loader("../graphqlQueries/ORDER_BY.graphql")
let RaceHeader =  ({ maxLaps, viewOnly=false }) => {

    const [selectOrderBy] = useMutation(SELECT_ORDER_BY, {
        refetchQueries: () => {
            return [
                {
                    query: ORDER_BY
                }
            ]
        }
    })

    let viewOnlyHeaders = ["Helm Name", "PY", "Boat Class", "Sail Number", "Place"]

    let manageRaceHeaders = viewOnlyHeaders.slice()

    manageRaceHeaders.splice(4, 0, "Lap")

    manageRaceHeaders.splice(1, 1) // remove py from manage race

    for (let index = maxLaps; index > 0; index--) {
        manageRaceHeaders.push(index)

    }
    manageRaceHeaders.push("Corrected Time")
    viewOnlyHeaders.push("Corrected Time")
    manageRaceHeaders.push("Elapsed Time")
    viewOnlyHeaders.push("Elapsed Time")
    return <Tr>
        {(viewOnly? viewOnlyHeaders: manageRaceHeaders).map(elem =>
        <Th key={elem}> <HeaderCell selectOrderBy={selectOrderBy} text={elem} /></Th>)}


    </Tr>
}

function HeaderCell({ text, selectOrderBy }) {
    return <div onClick={e => selectOrderBy({ variables: { input: { SelectOrderByInput: { type: text } } } })}>{text}</div>
} 
export default RaceHeader