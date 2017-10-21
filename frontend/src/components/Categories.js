import React, { Component } from 'react';
import '../App.css';

class Categories extends Component {
  render() {
    const { categories } = this.props
    return (
      <div>
          Listing Categories
          {categories.map(category => (
            <div key={category.name}>{category.name}</div>
          ))}
      </div>
    );
  }
}

export default Categories;
