import React, {useState, useEffect} from 'react'
import { Query, gql } from 'react-apollo'
import Autocomplete from 'react-autocomplete';
const getHelms = gql`

`
export default function SignOn() {
  const [Helm, setHelm] = useState("");
  const [HelmList, setHelmList] = useState([{label:"Luke"}])
  useEffect(()=>{

  })
  return (<>
  Helm Name:<Query>
  <Autocomplete 
  onChange={(e)=> setHelm(e.target.value)} 
  value={Helm}
  onSelect={(val) => setHelm(val)}  
  getItemValue={(item) => item.label}
  items={HelmList}
  renderItem={(item, isHighlighted) =>
    <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
      {item.label}
    </div>
  }
  />
  </Query>
<div>Its hammer time.</div>
  </>)
}
