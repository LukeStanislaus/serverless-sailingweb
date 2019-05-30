import React from 'react'
import RaceRow from './raceRow'

export default () => <>
<Query>
 {   ({data, loading, error})=>
<RaceRow/>
}
</Query>
</>