import '@johnlindquist/kit'
import {gql, GraphQLClient} from 'graphql-request'

let endpoint = 'https://app.egghead.io/graphql'
let slugs = await arg('Course slug or slugs separated with comma')

let client = new GraphQLClient(endpoint)

let query = gql`
  query CourseQuery($slug: String!) {
    course(slug: $slug) {
      title
      slug
      path
      duration
      image_thumb_url
      instructor {
        full_name
      }
      lessons {
        title
        path
        duration
      }
    }
  }
`
let courses = []

for (let courseSlug of slugs.split(',')) {
  let response = await client.request(query, {slug: courseSlug})
  let course = response.course
  courses.push(course)
}

await outputJson(projectPath('public', 'data', 'courses.json'), courses)
