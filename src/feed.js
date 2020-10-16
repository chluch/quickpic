"use strict";
import API from "./api.js";
import { getTime } from "./helpers.js";

// Main Feed Div
const feed = document.createElement("div");
feed.id = "feed";

// Stick banner on top
export const stickBanner = () => {
    const banner = document.getElementsByClassName("banner")[0];
    banner.style.top = 0;
    banner.style.position = "sticky";
    const wrapper = document.getElementById("page-wrapper");
    wrapper.style.height = "auto";
}

// get Feed after login with token
export const getFeed = (data) => {
    const feed = new API;
    const token = {
        headers: { "content-type": "application/json", "authorization": `Token ${data}` },
    }
    feed.get("user/feed", token)
        .then((posts) => {
            if (posts.message) {
                alert(posts.message);
            }
            else {
                document.getElementById("feed").style.display = "flex";
                showPosts(posts);
            }
        });
}

// Create each individual post from getFeed
const createPost = (postId, author, time, likes, description, comments, img) => {
    const image = document.createElement("img");
    Object.assign(image, {
        src: `data:image/jpeg;base64, ${img}`,
        alt: `${author}'s post`
    });

    let postTemplate = `
        <div class="post" id=post-${postId}>
            <h2 class="author">${author}</h2>
            <div class="post-img"></div>
            <div class="post-info">
                <p class="post-text">${description}</p>
                <div class="comments-number">${comments.length} comments</div>
                <div class="likes-number">${likes.length} <span class="heart">&#x2764;</span></div>
                <div class="timestamp">${getTime(time)}</div>
            </div>
        </div>
    `;
    const parser = new DOMParser();
    const newNode = parser.parseFromString(postTemplate, "text/html");
    const imgWrapper = newNode.getElementsByClassName("post-img");
    imgWrapper[0].appendChild(image);
    const heart = newNode.getElementsByClassName("heart")[0];
    heart.onclick = (e) => {
        e.preventDefault();
        isLiked(likes, postId);
    }
    const post = newNode.getElementsByClassName("post");
    feed.appendChild(post[0]);
}

// Who the post was made by
// When it was posted
// The image itself
// How many likes it has (or none)
// The post description text
// How many comments the post has
const showPosts = (posts) => {
    Object.keys(posts).forEach((post) => {
        //  console.log(posts[post]);
        if (posts[post].length === 0) {
            console.log('Oops no posts here');
            return;
        }
        posts[post].forEach((p) => {
            // console.log(p.meta.author);
            // console.log(getTime(p.meta.published));
            // console.log(p.meta.likes.length);
            // console.log(p.meta.description_text);
            // console.log(p.comments.length);
            createPost(
                p.id,
                p.meta.author,
                p.meta.published,
                p.meta.likes,
                p.meta.description_text,
                p.comments,
                p.src
            );

        })
    });
}

document.getElementById("main").appendChild(feed);

const isLiked = (likes, postId) => {
    const userId = new API;
    console.log(`likes arr: ${likes}`);
    const token = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`,
        },
    }
    userId.get("user/", token)
        .then((ret) => {
            likes.includes(ret.id) ? removeLike(postId) : addLike(postId);
        })
}

const addLike = (postId) => {
    console.log('like')
    const like = new API;
    const token = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`,
        },
    }
    like.put(`post/like?id=${postId}`, token)
        .then((ret) => {
            if (ret.message) {
                console.log(ret.message);
            }
            else {
                console.log(ret);
            }
        });
}

const removeLike = (postId) => {
    console.log('removeLike')
    const unlike = new API;
    const token = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`,
        },
    }
    unlike.put(`post/unlike?id=${postId}`, token)
        .then((ret) => {
            if (ret.message) {
                console.log(ret.message);
            }
            else {
                console.log(ret);
            }
        });
}