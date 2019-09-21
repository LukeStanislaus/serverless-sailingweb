import {useMutation} from '@apollo/react-hooks'
import {loader} from 'graphql.macro'
const SET_ERROR = loader("./graphqlQueries/SET_ERROR.graphql")
const GET_ERROR = loader("./graphqlQueries/GET_ERROR.graphql")

export default () => {
    const [setError, {data,loading, error}] = useMutation(SET_ERROR, {
        refetchQueries: [ {query: GET_ERROR}]
        
        })
        return setError
}