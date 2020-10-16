"use strict";
import API from "./api.js";
import { getTime } from "./helpers.js";
import { handleLike } from "./likes.js"

// Main Feed Div
const feed = document.createElement("div");
feed.id = "feed";

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

    // save each comment as div in array
    let commentLog = [];
    Object(comments).forEach((c) => {
        // console.log(`${c.author}: ${c.comment}`);
        const commenter = document.createElement("span");
        commenter.className = "commenter";
        const commentText = document.createElement("span");
        commentText.className = "comment";
        commenter.innerText = `${c.author}: `;
        commentText.innerText = c.comment;
        const wrapper = document.createElement("div");
        wrapper.appendChild(commenter);
        wrapper.appendChild(commentText);
        commentLog.push(wrapper);
    });

    let postTemplate = `
        <div class="post" id=post-${postId}>
            <div class="post-heading">
                <h2 class="author">${author}</h2>
                <div class="timestamp">${getTime(time)}</div>
            </div>
            <div class="post-img"></div>
            <div class="post-info">
                <p class="post-text">${description}</p>
                <div class="comments-number">${comments.length} comments</div>
                <div class="likes-number">${likes.length} <span class="heart">&#x2764;</span></div>
                <div class="comment-display" id="comment-display-${postId}"></div>
            </div>
        </div>
    `;
    // set post image
    const parser = new DOMParser();
    const newNode = parser.parseFromString(postTemplate, "text/html");
    const imgWrapper = newNode.getElementsByClassName("post-img");
    imgWrapper[0].appendChild(image);

    // set comments
    const commentDisplay = newNode.getElementsByClassName("comment-display")[0];
    for (let el of commentLog) {
        commentDisplay.appendChild(el);
    }

    const showComments = newNode.getElementById(`comment-display-${postId}`)
    showComments.style.display = "none";
    const commentNum =  newNode.getElementsByClassName("comments-number")[0];
    commentNum.onclick = () => {
        // e.preventDefault();
        showComments.style.display === "none" ? showComments.style.display = "block" : showComments.style.display = "none";
    }
    // "Like" feature
    const heart = newNode.getElementsByClassName("heart")[0];
    heart.onclick = (e) => {
        e.preventDefault();
        handleLike(likes, postId);
    }
    const post = newNode.getElementsByClassName("post");
    feed.appendChild(post[0]);
}

document.getElementById("main").appendChild(feed);

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
            console.log(p.comments)
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