import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import Categories from './Categories';
import Posts from './Posts';
import * as ReadableAPI from '../api/ReadableAPI'
import '../App.css';

class App extends Component {

  state = {
    categories : [],
    posts : []
  }

  componentDidMount() {
    ReadableAPI.getCategories().then((categories) => {
        this.setState({categories})
    });
    var category = window.location.pathname === "/"? 
        "all": window.location.pathname.substr(1);
    this.onSelectCategory(category);
  }

  onSelectCategory = (category) => {
    // if category is all get all posts
    if(category === "all") {
        ReadableAPI.getPosts().then((posts) => {
            this.setState({posts})
        });
    } else {
        ReadableAPI.getCategoryPosts(category).then((posts) => {
            this.setState({posts})
        });
    }
    
    console.log("category: ",category)
  }

  render() {
    const { categories,posts } = this.state
    return (
      <div className='ContentWrapper'>
        <Categories categories={categories} onSelectCategory={this.onSelectCategory}/>
        <Route exact path={window.location.pathname} render={() => (
          <div className='grid_page'>
            <Posts posts={posts}/>
          </div>
        )}/>
      </div>
    );
  }
}

export default App;
