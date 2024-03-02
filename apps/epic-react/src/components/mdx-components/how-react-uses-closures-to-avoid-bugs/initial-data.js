const authors = [
  {id: 'a123', name: 'Geordi'},
  {id: 'a234', name: 'Barkley'},
  {id: 'a345', name: 'Crusher'},
]
const posts = [
  {
    id: 'p123',
    authorId: 'a123',
    title: 'Post 1',
    content: 'This is post number 1',
  },
  {
    id: 'p234',
    authorId: 'a234',
    title: 'Post 2',
    content: 'This is post number 2',
  },
  {
    id: 'p345',
    authorId: 'a234',
    title: 'Post 3',
    content: 'This is post number 3',
  },
]
const likes = [
  {id: 'l123', ownerId: 'a123', postId: 'p123'},
  {id: 'l234', ownerId: 'a123', postId: 'p234'},
]

const user = authors[0]

export {posts, likes, authors, user}
