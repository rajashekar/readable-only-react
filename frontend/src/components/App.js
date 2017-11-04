import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import Categories from './Categories';
import Posts from './Posts';
import PostView from './PostView';
import * as ReadableAPI from '../api/ReadableAPI'
import '../App.css';

class App extends Component {

  // State object
  state = {
    categories : [],
    posts : [],
    selectedPost : {},
    sortBy : 'votes',
    view : ""
  }

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

  vote = (type,option,id) => {
    ReadableAPI.vote(type,option,id).then((post) => {
        this.setUpdatedPosts(this.state.posts,post,this.state.sortBy)
    });
  }

  setUpdatedPosts = (currentPosts, post, sortBy) => {
    var posts = currentPosts.reduce(this.updatePosts(post),[]);
    this.sortPosts(posts,sortBy)
  }
  updatePosts = (updatedPost) => (
    (allPosts,post) => {
        if(post.id === updatedPost.id) {
            post.voteScore = updatedPost.voteScore
        }
        allPosts.push(post)
        return allPosts
    }
  )

  onSelectCategory = (category) => {
    // if category is all get all posts
    this.setState({view : "category"})
    if(category === "all") {
        ReadableAPI.getPosts().then((posts) => {
            this.sortPosts(posts, this.state.sortBy)
        });
    } else {
        ReadableAPI.getCategoryPosts(category).then((posts) => {
            this.sortPosts(posts, this.state.sortBy)
        });
    }
    console.log("category: ",category)
  }

  onSelectPost = (postid) => {
    console.log(postid);
    this.setState({view : "post"})
    ReadableAPI.getPost(postid).then((post) => {
        console.log(post)
        this.setState({selectedPost: post})
    })
  }

  sortPosts = (posts, sortBy) => {
      // sort before to set state
      if(sortBy === 'votes') {
         this.setState({posts: posts.sort((a,b) => b.voteScore-a.voteScore)});
      } else {
         this.setState({posts: posts.sort((a,b) => b.timestamp-a.timestamp)});
      }
  }

  render() {
    const { categories,posts,selectedPost,view } = this.state
    console.log(view)
    return (
      <div>
        {view === "category" && 
        <div className='ContentWrapper'>
        <button className="button">Create Post</button>
            <Route path="/" render={() => (
            <div>
                <Categories categories={categories} onSelectCategory={this.onSelectCategory}/>
                <div className='grid_page'>
                    <Posts 
                        posts={posts} 
                        sortPosts={this.sortPosts}
                        vote={this.vote} 
                        onSelectPost={this.onSelectPost}
                    />
                </div>
            </div>
        )}/>
        </div>
        }
        {view === "post" && 
        <Route path="/post" render={({history}) => (
            <div>
                <PostView 
                    post={selectedPost}
                />
            </div>
        )}/>
        }
      </div>
    );
  }
}

export default App;
