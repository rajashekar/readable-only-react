import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import Categories from './Categories';
import Posts from './Posts';
import PostView from './PostView';
import CreatePost from './CreatePost'
import EditPost from './EditPost'
import * as ReadableAPI from '../api/ReadableAPI'
import '../App.css';

/*
 * Main component for this app
 */

class App extends Component {

  // State object
  state = {
    categories : [],
    posts : [],
    comments: [],
    selectedPost : {},
    sortBy : 'votes',
    modifiedComment : ""
  }

   // Initially mount all Categories and all Posts
  componentDidMount() {
    var context = window.location.pathname === "/"? 
        "all": window.location.pathname.substr(1);
    if(context === "all" || context.startsWith('category'))  {
        ReadableAPI.getCategories().then((categories) => {
            this.setState({categories})
            var category = context.substring(context.indexOf("/")+1,context.length);
            this.onSelectCategory(category);
        });
    } else if(context.startsWith('post')) {
        var post = context.substring(context.indexOf("/")+1,context.length);
        this.onSelectPost(post);
    }
  }

  // for voting both posts & comments
  vote = (type,option,id) => {
    if(type === 'posts') {
        ReadableAPI.vote(type,option,id).then((result) => {
            this.setUpdatedResults(type,this.state.posts,result,this.state.sortBy)
        });
    } else {
        ReadableAPI.vote(type,option,id).then((result) => {
            this.setUpdatedResults(type,this.state.comments,result,"votes")
        });
    }
  }

  // update the results
  setUpdatedResults = (type, currentPosts, post, sortBy) => {
    var posts = currentPosts.reduce(this.updateResults(post),[]);
    this.sort(type, posts,sortBy)
  }
  updateResults = (updatedPost) => (
    (allPosts,post) => {
        if(post.id === updatedPost.id) {
            post.title = updatedPost.title
            post.body = updatedPost.body
            post.voteScore = updatedPost.voteScore
            post.deleted = updatedPost.deleted
            post.commentCount = updatedPost.commentCount
        }
        allPosts.push(post)
        return allPosts
    }
  )

  // on select category get all posts of category
  onSelectCategory = (category) => {
    // if category is all get all posts
    if(category === "all") {
        ReadableAPI.getPosts().then((posts) => {
            this.sort("posts", posts, this.state.sortBy)
        });
    } else {
        ReadableAPI.getCategoryPosts(category).then((posts) => {
            this.sort("posts", posts, this.state.sortBy)
        });
    }
    console.log("category: ",category)
  }

  // on select post get all post details of that post
  onSelectPost = (postid) => {
    console.log(postid);
    ReadableAPI.getPost(postid).then((post) => {
        this.setState({selectedPost: post})
    })
    ReadableAPI.getComments(postid).then((comments) => {
        comments.map(c => {c.edit=false;return c;})
        this.sort("comments", comments,"votes")
    })
  }

  // for sorting based on votes or date
  sort = (type, posts, sortBy) => {
      // sort before to set state
      if(type === 'posts') {
        if(sortBy === 'votes') {
            this.setState({posts: posts.sort((a,b) => b.voteScore-a.voteScore)});
        } else {
            this.setState({posts: posts.sort((a,b) => b.timestamp-a.timestamp)});
        }
      } else {
        this.setState({comments: posts.sort((a,b) => b.voteScore-a.voteScore)});
      }
  }

  // to create post
  createPost = (post) => {
    ReadableAPI.createPost(post).then((posts) => {
        this.setState((state) => ({
            posts: state.posts.concat([post])
        }))
    })
  }

  // to delete post
  deletePost = (postid) => {
    ReadableAPI.deletePost(postid).then((result) => {
        this.setUpdatedResults("posts",this.state.posts,result,this.state.sortBy)
    })
  }

  editPost = (post) => {
    console.log(post)
    ReadableAPI.editPost(post).then((result) => {
        this.setUpdatedResults("posts",this.state.posts,result,this.state.sortBy)
    })
  }

  createComment = (comment) => {
    console.log(comment);
    ReadableAPI.createComment(comment).then((result) => {
        // first set comments & sort
        this.sort("comments", [...this.state.comments,result],"votes")
        //  increment comment count at selected post
        this.setState((state) => ({
            selectedPost: {...state.selectedPost,
                    commentCount:state.selectedPost.commentCount+1}
        }))
        // increment comment count at posts
        this.setUpdatedResults("posts",this.state.posts,this.state.selectedPost,this.state.sortBy)
    })
  }

  deleteComment = (commentid) => {
    ReadableAPI.deleteComment(commentid).then((result) => {
        this.setUpdatedResults("comments",this.state.comments,result,"votes")
        this.setState({selectedPost: {...this.state.selectedPost,
                commentCount:this.state.selectedPost.commentCount-1}});
        this.setUpdatedResults("posts",this.state.posts,this.state.selectedPost,this.state.sortBy)
    })
  }

  editComment = (commentid) => {
    this.setState((state) => ({
        comments: state.comments.map(comment => {
            if(comment.id === commentid) {
                comment.edit = !comment.edit
            }
            return comment;
        })
    }))
  }

  changeComment = (e) => {
    console.log(e.target.value)
    this.setState({ modifiedComment: e.target.value });
  }

  editDone = (commentid) => {
    var comment = {id:commentid, body:this.state.modifiedComment, timestamp: Date.now()}
    ReadableAPI.editComment(comment).then((result) => {
        this.setUpdatedResults("comments",this.state.comments,result,"votes")
    })
    this.editComment(commentid)
  }

  // For rendering categories
  renderCategory = () => {
    const { categories,posts } = this.state
    return (
        <div>
            <Categories categories={categories} onSelectCategory={this.onSelectCategory}/>
            <div className='grid_page'>
                <Posts 
                    posts={posts} 
                    sort={this.sort}
                    vote={this.vote} 
                    onSelectPost={this.onSelectPost}
                />
            </div>
        </div>
    )
  }

  // For rendering Posts
  renderPost = (history) => {
    const { comments,selectedPost } = this.state
    return (
        <div>
            <PostView 
                post={selectedPost}
                comments={comments}
                vote={this.vote}
                onDeletePost={(postid) => {
                    this.deletePost(postid)
                }}
                onSelectPost={this.onSelectPost}
                onCreateComment={this.createComment}
                onDeleteComment={this.deleteComment}
                onEditComment={this.editComment}
                onEditDone={this.editDone}
                onChangeComment={this.changeComment}
                onClick={() => {
                    history.push('/')
                }}
            />
        </div>
    )
  }

  // For rendering create post
  renderCreatePost = (history) => {
    return (
        <div>
            <CreatePost
                onCreatePost={(post) => {
                    this.createPost(post)
                    history.push('/')
                }}
            />
        </div>
    )
  }

  // For rendering Edit post
  renderEditPost = (history) => {
    const { selectedPost } = this.state
    return (
        <div>
            <EditPost
                post={selectedPost}
                onEditPost={(post) => {
                    this.editPost(post)
                    history.push('/')
                }}
            />
        </div>
    )
  }

  // Main render method
  render() {
    return (
        <div className='ContentWrapper'>
            <Route exact path="/" render={() => this.renderCategory()}/>
            <Route path="/category" render={() => this.renderCategory()}/>
            <Route path="/post" render={({history}) => this.renderPost(history)}/>
            <Route path="/newpost" render={({history}) => this.renderCreatePost(history)}/>
            <Route path="/editpost" render={({history}) => this.renderEditPost(history)}/>
        </div>
    );
  }
}

export default App;
