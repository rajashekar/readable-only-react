import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import '../App.css';

class Categories extends Component {
  render() {
    const { categories, onSelectCategory } = this.props
    return (
      <div className="layout_3col_left">
          <div><b>Categories</b></div>
          <div className="category">
            <div>
                <Link to='/' onClick={e => onSelectCategory(e.target.innerText)}>all</Link>
            </div>
            {categories.map(category => (
            <div key={category.name}>
                <Link to={category.name} onClick={e => onSelectCategory(e.target.innerText)}>
                    {category.name}
                </Link>
            </div>
            ))}
          </div>
      </div>
    );
  }
}

export default Categories;
