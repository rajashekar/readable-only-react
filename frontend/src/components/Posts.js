import React, { Component } from 'react';
import '../App.css';

class Posts extends Component {
  render() {
    const { posts } = this.props
    return (
      <div className="layout_3col_center">
          <h4>Posts</h4>
          { posts.map(post => (
            <div className="post" key={post.id}>
                <div className="midcol">
                    <div className="arrow up"></div>
                    <div className="score">{post.voteScore}</div>
                    <div className="arrow down"></div>
                </div>
                <div>
                    <div><b>{post.title}</b> by <i>{post.author}</i></div>
                    <div>{post.body}</div>
                    <div>{post.commentCount} comments</div>
                </div>
            </div>
          ))}
      </div>
    );
  }
}

export default Posts;
