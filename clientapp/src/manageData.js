import React from 'react'
import { loader } from 'graphql.macro'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { AwesomeButtonProgress } from 'react-awesome-button'
const ALL_HELMS = loader("./graphqlQueries/ALL_HELMS.graphql")
const REMOVE_PERSON = loader("./graphqlQueries/REMOVE_PERSON.graphql")
export default () => {
    let obj
    const { data, loading, error } = useQuery(ALL_HELMS)
    const [remove] = useMutation(REMOVE_PERSON, {
        update(cache, { data: {  removePerson } }) {
            removePerson = removePerson.RemovePersonPayloadData
            if (removePerson == null) {
                return
            }
        let allHelms = cache.readQuery({ query: ALL_HELMS })
        let newAllHelms = allHelms.allHelms.filter(elem=> !(elem.name===removePerson.name && elem.boatName=== removePerson.boatName && 
        elem.boatNumber === removePerson.boatNumber && elem.pY=== removePerson.pY))
        cache.writeQuery({ query: ALL_HELMS, data: { allHelms: newAllHelms } })
     
        }
    })
    if (loading) obj = 'loading'
    if (error) obj = error
    let x
    if (data != null) {
        x = data.allHelms.map(elem => <tr key={elem.name + elem.boatName + elem.boatNumber + elem.pY}>

            <td key={"name"}>{elem.name}</td>
            <td key={"remove"}><AwesomeButtonProgress onPress={async (e, next) => {
                let response = await remove({
                    variables: {
                        input: {
                            RemovePersonData: {
                                name: elem.name,
                                boatName: elem.boatName,
                                boatNumber: elem.boatNumber,
                                pY: elem.pY
                            }
                        }
                    }
                })

                next(response.data.removePerson !== null)
            }}>Remove Person</AwesomeButtonProgress></td>
            <td key={"boatName"}>{elem.boatName}</td>
            <td key={"boatNumber"}>{elem.boatNumber}</td>
            <td key={"pY"}>{elem.pY}</td>
        </tr>)
        obj = <><table>
            <tbody>
                <tr>
                    <th>Name</th>
                    <th>Remove Person</th>
                    <th>Boat Class</th>
                    <th>Boat Number</th>
                    <th>PY</th>
                </tr>
                {x}
            </tbody>
        </table></>;
    }
    return obj
}