import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import Categories from './Categories';
import Posts from './Posts';
import PostView from './PostView';
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
    sortBy : 'votes'
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
            post.voteScore = updatedPost.voteScore
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
        this.setState({comments});
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
                onClick={() => {
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
            <Route path="/post" render={({history}) => this.renderPost()}/>
        </div>
    );
  }
}

export default App;
