import * as React from 'react'
import {AppContext} from './provider'
import {canLike} from './utils'
import {PostView} from './post-view'

class Post extends React.Component {
  static contextType = AppContext
  handleLikeClick = async () => {
    const {post} = this.props
    const {user, toggleLike} = this.context
    if (!(await canLike(post, user))) return

    toggleLike(post)
  }
  render() {
    return (
      <PostView post={this.props.post} onLikeClick={this.handleLikeClick} />
    )
  }
}

export {Post}
