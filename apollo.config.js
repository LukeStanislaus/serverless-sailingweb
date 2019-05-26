module.exports = {
    client: {
        
        includes: ['./clientapp/src/signOn.js'],
        service: {
            name: 'SailingWeb',
            localSchemaFile: './backend/src/schema.graphql'
        }
    },
    service: {
        localSchemaFile: './backend/src/schema.graphql'
    }
}
