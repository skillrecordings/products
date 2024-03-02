import * as React from 'react'
import {AppContext} from './provider'
import {canLike} from './utils'
import {PostView} from './post-view'

class Post extends React.Component {
  static contextType = AppContext
  handleLikeClick = async () => {
    if (!(await canLike(this.props.post, this.context.user))) return

    this.context.toggleLike(this.props.post)
  }
  render() {
    return (
      <PostView post={this.props.post} onLikeClick={this.handleLikeClick} />
    )
  }
}

export {Post}
