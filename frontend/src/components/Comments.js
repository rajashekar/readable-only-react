import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Timestamp from 'react-timestamp'

/*
 * To show comments of post
 * Gives option for voting
 */

class Comments extends Component {

    render() {
        const {comments,vote,parentId,onDeleteComment} = this.props
        return (
            <div>
                {comments.map(comment => (
                !comment.deleted &&  <div className="post" key={comment.id}>
                        <div className="midcol">
                            <div className="arrow up" onClick={() => vote("comments","upVote",comment.id)}></div>
                            <div className="score">{comment.voteScore}</div>
                            <div className="arrow down" onClick={() => vote("comments","downVote",comment.id)}></div>
                        </div>
                        <div>
                            {comment.body}
                            &nbsp;&nbsp;<Link onClick={() => onDeleteComment(comment.id)} to={'/post/'+parentId}>Delete</Link>
                        </div> 
                        <div>Comment by {comment.author}</div>
                        <div>posted on <Timestamp time={comment.timestamp/1000}/></div>
                    </div>
                ))}
            </div>
        );
    }
}

export default Comments;
