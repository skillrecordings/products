const common = {
  schema: [
    {
      'http://localhost:8080/v1/graphql': {
        headers: {
          'x-hasura-role': 'admin',
          'x-hasura-admin-secret': 'admin_secret',
        },
      },
    },
  ],
  plugins: [
    'typescript',
    'typescript-operations',
    'typescript-graphql-request',
  ],

  config: {
    preResolveTypes: true,
    skipTypename: false,
    enumsAsTypes: true,
    constEnums: true,
    gqlImport: 'graphql-request#gql',
  },
}

module.exports = {
  overwrite: true,
  generates: {
    './src/lib/generated-api.ts': {
      documents: ['./queries/*.graphql'],
      ...common,
    },
  },
}
