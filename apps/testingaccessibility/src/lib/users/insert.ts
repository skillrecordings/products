export async function insertUser(user: any) {
  const query = JSON.stringify({
    query: `mutation {
            insert_users_one(object: {
              id: "${user.id}"
              name: "${user.name}"}
            ) { id }
          }
          `,
  })

  const response = await fetch(process.env.HASURA_GRAPHQL_ENDPOINT || '', {
    method: 'POST',
    body: query,
    headers: {
      'content-type': 'application/json',
      'X-Hasura-Admin-Secret': process.env.HASURA_ADMIN_SECRET || '',
    },
  }).then((result) => result.json())

  return response
}
