import React, { Component } from 'react';
import Timestamp from 'react-timestamp'

class Comments extends Component {
    render() {
        const {comments,vote} = this.props
        return (
            <div>
                {comments.map(comment => (
                    <div className="post" key={comment.id}>
                        <div className="midcol">
                            <div className="arrow up" onClick={() => vote("comments","upVote",comment.id)}></div>
                            <div className="score">{comment.voteScore}</div>
                            <div className="arrow down" onClick={() => vote("comments","downVote",comment.id)}></div>
                        </div>
                        <div>{comment.body}</div>
                        <div>{comment.author}</div>
                        <div>posted on <Timestamp time={comment.timestamp/1000}/></div>
                    </div>
                ))}
            </div>
        );
    }
}

export default Comments;
