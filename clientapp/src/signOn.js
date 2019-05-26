import React, {useState} from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Autocomplete from 'react-autocomplete'
const allHelms = gql`
query getAllHelms{
  allHelms{
    name
    userId
    boatName
    boatNumber
    pY
  }
}`

function SignOn(){
  const [name, setName] = useState("")
    return <Query query={allHelms}>
        {({loading, error, data})=>{
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`
            
            return (<>
              <Autocomplete 
                getItemValue={(item) => item.label}
                items={data.allHelms.map(elem => {return {label: elem.name}})}
                renderItem={(item, isHighlighted) =>
                  <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                    {item.label}
                  </div>
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                onSelect={(val) => setName(val)}
              />
</>
            )
        }}
</Query>
}
export default SignOn