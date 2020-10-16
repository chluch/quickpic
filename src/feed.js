"use strict";
import API from "./api.js";
import { getTime } from "./helpers.js";
import { handleLike } from "./likes.js"

// Main Feed Div
const feed = document.createElement("div");
feed.id = "feed";

export async function getFeed(token) {
    const fetchFeed = new API;
    const option = {
        headers: { "content-type": "application/json", "authorization": `Token ${token}` },
    }
    const data = await fetchFeed.get("user/feed", option);
    Object.keys(data).forEach((post) => {
        if (data[post].length === 0) {
            console.log('Oops no posts here');
            return;
        }
        feed.style.display="flex";
        data[post].forEach((p) => {
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
    document.getElementById("main").appendChild(feed);
    setLikeEvent();
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
                    <div class="stats">
                        <div class="comments-number">${comments.length} comments</div>
                        <div class="likes-number" id="likes-num-${postId}">${likes.length}</div><div class="heart">&#x2764;</div>
                    </div>
                <div class="comment-display" id="comment-display-${postId}"></div>
            </div>
        </div>
    `;
    // set post image
    const parser = new DOMParser();
    const newNode = parser.parseFromString(postTemplate, "text/html");
    const imgWrapper = newNode.getElementsByClassName("post-img")[0];
    imgWrapper.appendChild(image);

    // set comments
    const commentDisplay = newNode.getElementsByClassName("comment-display")[0];
    for (let el of commentLog) {
        commentDisplay.appendChild(el);
    }

    const showComments = newNode.getElementById(`comment-display-${postId}`)
    showComments.style.display = "none";
    const commentNum = newNode.getElementsByClassName("comments-number")[0];
    commentNum.onclick = () => {
        showComments.style.display === "none" ? showComments.style.display = "block" : showComments.style.display = "none";
    }
    const post = newNode.getElementsByClassName("post");
    feed.appendChild(post[0]);
}


const setLikeEvent = () => {
    let hearts = document.querySelectorAll(".heart"); // array
    hearts.forEach(heart => {
        let postId = heart.closest(".post").id.replace(/\D+/, "");
        heart.addEventListener("click", () => {
            handleLike(postId);
        })
    })
}
