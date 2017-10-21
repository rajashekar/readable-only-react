import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import '../App.css';

class Categories extends Component {
  render() {
    const { categories } = this.props
    return (
      <div className="layout_3col_left">
          <h4>Categories</h4>
          <Link to='/'>all</Link>
          {categories.map(category => (
           <div key={category.name}>
               <Link to={category.name}>
                {category.name}
               </Link>
           </div>
          ))}
      </div>
    );
  }
}

export default Categories;
