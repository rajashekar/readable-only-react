import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import Categories from './Categories';
import Posts from './Posts';
import * as ReadableAPI from '../api/ReadableAPI'
import '../App.css';

class App extends Component {

  state = {
    categories : [],
    posts : [],
    sortBy : 'votes'
  }

  componentDidMount() {
    ReadableAPI.getCategories().then((categories) => {
        this.setState({categories})
    });
    var context = window.location.pathname === "/"? 
        "all": window.location.pathname.substr(1);
    if(context === "all" || this.state.categories.indexOf(context)>-1) {
        this.onSelectCategory(context);
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

  sortPosts = (posts, sortBy) => {
      // sort before to set state
      if(sortBy === 'votes') {
         this.setState({posts: posts.sort((a,b) => b.voteScore-a.voteScore)});
      } else {
         this.setState({posts: posts.sort((a,b) => b.timestamp-a.timestamp)});
      }
  }

  render() {
    const { categories,posts } = this.state
    return (
      <div>
        <button className="button">Create Post</button>
        <div className='ContentWrapper'>
            <Categories categories={categories} onSelectCategory={this.onSelectCategory}/>
            <Route exact path={window.location.pathname} render={() => (
            <div className='grid_page'>
                <Posts 
                    posts={posts} 
                    sortPosts={this.sortPosts}
                    vote={this.vote} 
                />
            </div>
            )}/>
        </div>
      </div>
    );
  }
}

export default App;
