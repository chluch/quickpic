"use strict";
import API from "./api.js";
import { renderHTML, fileToDataUrl } from "./helpers.js";

// Feed
const feed = document.createElement("div");
feed.id = "feed";
Object.assign(feed.style, {
    display: "none",
    backgroundColor: "green",
});
feed.appendChild(document.createTextNode('Not implemented yet'));
document.getElementById("main").appendChild(feed);

export const getFeed = (data) => {
    const feed = new API;
    const token = {
        headers: { "content-type": "application/json", "authorization": `Token ${data.token}` },
    }
    feed.get("user/feed", token)
        .then((posts) => {
            if (posts.message) {
                alert(posts.message);
            }
            else {
                // token if authenticated
                document.getElementById("feed").style.display="flex";
                showPosts(posts);
            }
        });
}

const createElement = (author, time, likes, description, comments, img) => {
    let image = document.createElement("img");
    Object.assign(image, {
        className: "feed-img",
        src: `data:image/jpeg;base64, ${img}`,
        alt: `${author}'s post`
    })
}

// Who the post was made by
// When it was posted
// The image itself
// How many likes it has (or none)
// The post description text
// How many comments the post has
const showPosts = (posts) => {
    console.log(posts)
    Object.keys(posts).forEach((post) => {
        //  console.log(posts[post]);
        posts[post].forEach((p) => {
            console.log(p.meta.author);
            console.log(p.meta.published);
            console.log(p.meta.likes.length);
            console.log(p.meta.description_text);
            console.log(p.comments.length);
        })
    });
}