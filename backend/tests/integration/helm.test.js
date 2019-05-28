import fetch from 'node-fetch'

test('getBoatsOfHelm works', async () => {

    let input = {
          helmName: ""
      }
      const helm = await fetch('http://localhost:3000/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `query getBoatsOfHelm($input: GetBoatsOfHelmInput!) {
        getBoatsOfHelm(input: $input){
          boatName
          boatNumber
          pY
          name
        }
      }`,
      variables: {
          input: input
      }})
  })
  const helmJson = await helm.json()
  const expectedResponse = [{
          boatName: " ",
          boatNumber: " ",
          pY: 0,
          name: " "
        }]
  expect(helmJson.data.getBoatsOfHelm).toEqual(expectedResponse)
})