import React, { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import * as awesomplete from "awesomplete";
import "../App.css";

function signon() {
  const [helm, setHelm] = useState("");
  const [crew, setCrew] = useState("");
  const [notes, setNotes] = useState("");
  
  const [boats, setBoats] = useState([]);
  const [chooseBoat, setChooseBoat] = useState("");
  var inputStyle = {
    "width": "100%",
    "maxWidth": "500px",
    "boxSizing": "border-box"
  }
  const helmRef = useRef(null);
  const crewRef = useRef(null);
  useEffect(()=>{
    async function fetchData() {
      const query = `query ($name: String){
        allFullLists(first: 10, condition: {name: $name}){
          
          nodes{
            boatName
          }
        }
        }
        `
          let result = (await (await fetch('https://nkhjezgzu6.execute-api.us-east-1.amazonaws.com/dev/graphql',{
            method:'post',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },  
            body: JSON.stringify({
              query,
              variables: {name: helm}
            })
          })).json()).data.allFullLists.nodes;
          setBoats(result.map((element,index)=><option key={index} value={element.boatName}>{element.boatName}</option>));
    }
    fetchData();
  }, [helm])
  useEffect(() => {
    //window.addEventListener('awesomplete-select', e => setName(e.text));
    async function fetchData() {
      const query = `mutation{
    distinctNames(input:{}){
      fullLists{
        name
      }
    }
    }`
      console.log("hi");
      let result = (await (await fetch('https://nkhjezgzu6.execute-api.us-east-1.amazonaws.com/dev/graphql',{
        method:'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },  
        body: JSON.stringify({
          query,
        })
      })).json()).data.distinctNames.fullLists;
      new awesomplete(helmRef.current, { list: result.map((elem)=>elem.name), minChars: 1 });
      new awesomplete(crewRef.current, { list: result.map((elem)=>elem.name), minChars: 1 });

    }
    fetchData();
  },[]
  )
  return (<div>
    <form>
      <Form.Group controlId="signOn" style={{"padding": "25px"}}>
      <h3>Sign on to your race:</h3>
        <Form.Label>Helm Name</Form.Label>
  {// look at /app.css for any issues with styling - awesomplete creates a wrapping div!!
  }
        <Form.Control
          style={inputStyle}
          autoComplete="off"
          ref={helmRef}
          value={helm}
          onChange={e => setHelm(e.target.value)}
          onSelect={e => setHelm(e.target.value)}
          placeholder=""
        />
                <Form.Label>Boat Class</Form.Label>
                
        <Form.Control as="select"
          style={inputStyle}
          value={chooseBoat}
          onChange={e => setChooseBoat(e.target.value)}
          placeholder=""
        >
        {boats}</Form.Control>
        <Form.Label>Crew Name</Form.Label>
  {// look at /app.css for any issues with styling - awesomplete creates a wrapping div!!
  }
        <Form.Control
          style={inputStyle}
          autoComplete="off"
          ref={crewRef}
          value={crew}
          onChange={e => setCrew(e.target.value)}
          onSelect={e => setCrew(e.target.value)}
          placeholder=""
        />
        <Form.Label>Notes</Form.Label>
                <Form.Control as="textarea"
          style={inputStyle}
          autoComplete="off"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          onSelect={e => setNotes(e.target.value)}
          placeholder=""
        />
        <div style={{"paddingTop":"20px"}} ><Button variant="outline-primary" >Enter race</Button></div>
        
                


      </Form.Group></form>
  </div>
  );
}
export default signon;
