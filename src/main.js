// importing named exports we use brackets
import loginPage from './login.js'
import signupPage from './signup.js'

loginPage.load();
signupPage.load();

loginPage.setEvents();
signupPage.setEvents();

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

