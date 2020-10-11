// importing named exports we use brackets
import { createElement, createPostTile, uploadImage } from './helpers.js';
import { loginPage, getFeed } from './components.js'

// when importing 'default' exports, use below syntax
// import API from './api.js';

// const api = new API();


// api.makeAPIRequest('auth/signup');
window.onload = (e) => loginPage(e);

// we can use this single api request multiple times
// const feed = api.getFeed();

// feed
// .then(posts => {
//     posts.reduce((parent, post) => {

//         parent.appendChild(createPostTile(post));

//         return parent;

//     }, document.getElementById('large-feed'))
// });

// // Potential example to upload an image
// const input = document.querySelector('input[type="file"]');

// input.addEventListener('change', uploadImage);

