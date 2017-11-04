import React, { Component } from 'react';

class PostView extends Component {
    render() {
        const { post } = this.props
        return (
            <div>
                <div>Title: {post.title}</div>
            </div>
        );
    }
}

export default PostView;
