const api = "http://localhost:3001"

// Generate a unique token for storing your bookshelf data on the backend server.
let token = localStorage.token
if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

export const getCategories = () =>
  fetch(`${api}/categories`, { headers })
    .then(res => res.json())
    .then(data => data.categories)

export const getPosts = () =>
  fetch(`${api}/posts`, { headers })
    .then(res => res.json())
    .then(data => data)

export const getPost = (id) =>
  fetch(`${api}/posts/${id}`, { headers })
    .then(res => res.json())
    .then(data => data)

export const getComments = (id) =>
  fetch(`${api}/posts/${id}/comments`, { headers })
    .then(res => res.json())
    .then(data => data)

export const getCategoryPosts = (category) =>
  fetch(`${api}/${category}/posts`, { headers })
    .then(res => res.json())
    .then(data => data)

export const createPost = (post) =>
  fetch(`${api}/posts`, { 
     method: 'POST',
     headers: {...headers, 'Content-Type':'application/json'},
     body: JSON.stringify(post)
     }).then(res => res.json())
    .then(data => data)

export const createComment = (comment) =>
  fetch(`${api}/comments`, { 
     method: 'POST',
     headers: {...headers, 'Content-Type':'application/json'},
     body: JSON.stringify(comment)
     }).then(res => res.json())
    .then(data => data)

export const deletePost = (id) =>
  fetch(`${api}/posts/${id}`, { 
    method: 'DELETE',
    headers 
    }).then(res => res.json())
    .then(data => data)

export const deleteComment = (id) =>
  fetch(`${api}/comments/${id}`, { 
    method: 'DELETE',
    headers 
    }).then(res => res.json())
    .then(data => data)

export const editPost = (post) =>
  fetch(`${api}/posts/${post.id}`, { 
     method: 'PUT',
     headers: {...headers, 'Content-Type':'application/json'},
     body: JSON.stringify(post)
     }).then(res => res.json())
    .then(data => data)

export const editComment = (comment) =>
  fetch(`${api}/posts/${comment.id}`, { 
     method: 'PUT',
     headers: {...headers, 'Content-Type':'application/json'},
     body: JSON.stringify(comment)
     }).then(res => res.json())
    .then(data => data)

export const vote = (type,option,id) =>
  fetch(`${api}/${type}/${id}`, { 
    method: 'POST',
    headers: {...headers, 'Content-Type':'application/json'},
    body: JSON.stringify({option})
    }).then(res => res.json())
    .then(data => data)
