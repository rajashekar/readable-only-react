import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Timestamp from 'react-timestamp'
import Comments from './Comments';
import CreateComment from './createComment';

class PostView extends Component {

    render() {
        const { post,comments,vote } = this.props
        return (
            <div className="postdetail">
                <Link className='button' to='/'>Back</Link>
                <button className="button">Edit</button>
                <button className="button">Delete</button>
                <h1>{post.title}</h1>
                <div>Author: {post.author}</div>
                <div>Posted: <Timestamp time={post.timestamp/1000}/></div>
                <div>Category: {post.category}</div>
                <div>Vote Score: {post.voteScore}</div>
                <div>{post.body}</div>
                <div><b>{post.commentCount} comments : </b></div>
                <div>
                    <Comments
                        comments={comments}
                        vote={vote}
                    />
                </div>
                <div>
                    <CreateComment
                    />
                </div>
            </div>
        );
    }
}

export default PostView;
