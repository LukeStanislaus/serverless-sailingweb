export const resolvers = {
Mutation: {
    selectRace: (_, {input}, {cache}) => {
        input==null?cache.writeData({data: {selectedRace:null}}):cache.writeData({data: {selectedRace:{...input.Event}}})
    }
}
    

}