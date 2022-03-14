module.exports = {
  overwrite: true,
  generates: {
    './src/utils/next-auth/admin.ts': {
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
      documents: ['./queries/*.graphql'],
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
        // documentMode: 'string',
        gqlImport: 'graphql-request#gql',
      },
    },
  },
}
