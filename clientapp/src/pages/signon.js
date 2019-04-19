import React, {useState, useEffect} from 'react';
import Autocomplete from 'react-autocomplete';
import {Query} from 'react-apollo';

export default function SignOn(){
	
	const [helm, setHelm] = useState();
	const [helms, setHelms] = useState([{label: 'apple'}, {label: 'banana'}]);
	useEffect( ()=> {
	setHelms
	}, [])	
	return (
		<>
	<h1>Sign On</h1>
	
	Helm Name:
	<Autocomplete
		items={helms}
		getItemValue={(item)=> item.label}
		  renderItem={(item, isHighlighted) =>
			      <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
			        {item.label}
			      </div>
			    }
		value= {helm}
		onChange={(e) => setHelm(e.target.value)}
		onSelect={(val) => setHelm(val)}
		/>
	
		</>)	

}