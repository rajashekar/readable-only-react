import React, { Component } from 'react';
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
    ReadableAPI.getPosts().then((posts) => {
        this.setState({posts})
    });
  }

  render() {
    const { categories,posts } = this.state
    return (
      <div>
          <Categories categories={categories}/>
          <Posts posts={posts}/>
      </div>
    );
  }
}

export default App;
