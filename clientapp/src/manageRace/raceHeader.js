import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { AwesomeButton } from 'react-awesome-button'
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
export default ({ maxLaps, viewOnly=false }) => {
    let laps = []

    const [selectOrderBy] = useMutation(SELECT_ORDER_BY, {
        refetchQueries: () => {
            return [
                {
                    query: ORDER_BY
                }
            ]
        }
    })
    for (let index = maxLaps; index > 0; index--) {
        laps.push(<Th key={index}>{index}</Th>)

    }
    let viewOnlyHeaders = [{text: "Helm Name", order: true}, {text: "Boat Class", order: true}, {text: "Sail Number", order: true}, {text: "Place", order: true}, {text: "Corrected Time", order: true}]

    let manageRaceHeaders = viewOnlyHeaders.slice()
    manageRaceHeaders.splice(3, 0, {text: "Lap", order: false})
    return <Tr>
        {(viewOnly? viewOnlyHeaders: manageRaceHeaders).map(({text: elem, order}) =><Th key={elem}> {order? <HeaderCell selectOrderBy={selectOrderBy} text={elem} />: <div>{elem}</div>}</Th>)}
        {laps}

    </Tr>
}

function HeaderCell({ text, selectOrderBy }) {
    const [picker, setPicker] = useState(false)

    return <div onClick={e => setPicker(!picker)}>{text}{picker && <AwesomeButton onPress={() => selectOrderBy({ variables: { input: { SelectOrderByInput: { type: text } } } })}>Order by {text}? </AwesomeButton>}</div>
} 