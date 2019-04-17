import fetch from 'node-fetch'
import { notDeepEqual } from 'assert';

test("returns something",  done => {

    fetch('http://localhost:3000/graphql', {
        method: 'post',
        body:JSON.stringify({query: `
        query{
            specificEvent(input: {eventData:{eventId:"4f061a32-682e-40e3-bc7e-036b58a2e2e6"}}){
              pY
              helmName
            }
          }
        `})
    }).then(res => res.json().then(result => {console.log(result); expect(result).not.toBe(0); done();}))
})