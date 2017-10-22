import React, { Component } from 'react';
import Timestamp from 'react-timestamp'
import '../App.css';

class Posts extends Component {
  render() {
    const { posts, sortPosts } = this.props
    return (
      <div className="layout_3col_center">
          <div><b className="sortby">Posts</b> sort by : &nbsp;
              <select onChange={e => sortPosts(posts, e.target.value)}>
                  <option value="votes">votes</option>
                  <option value="date">date</option>
              </select>
          </div>
          { posts.map(post => (
            <div className="post" key={post.id}>
                <div className="midcol">
                    <div className="arrow up"></div>
                    <div className="score">{post.voteScore}</div>
                    <div className="arrow down"></div>
                </div>
                <div>
                    <div>
                        <b>{post.title}</b> by <i>{post.author}</i>
                        &nbsp; (posted on <Timestamp time={post.timestamp/1000}/>)
                    </div>
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
