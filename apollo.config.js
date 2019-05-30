module.exports = {
    client: {
        
        includes: ['./clientapp/src/**'],
        service: {
            name: 'SailingWeb',
            localSchemaFile: './client/src/schema.graphql'
        }
    },
    service: {
        localSchemaFile: './backend/src/schema.graphql'
    }
}
