import React, { Component } from 'react';
import '../App.css';

class Posts extends Component {
  render() {
    const { posts } = this.props
    return (
      <div>
          List Posts
          { posts.map(post => (
            <div key={post.id}>{post.title}</div>
          ))}
      </div>
    );
  }
}

export default Posts;
