import React from 'react'
import Modal from 'react-modal'
import {useQuery} from '@apollo/react-hooks'
import {loader} from 'graphql.macro'
const GET_ERROR = loader("./graphqlQueries/GET_ERROR.graphql")
export default ()=>{
    const {data, loading, error} = useQuery(GET_ERROR)
    if(!data.error) return null
    console.log(data);
    return <Modal 
    isOpen={data.error.message !== null}>{data.error.message}</Modal>
}