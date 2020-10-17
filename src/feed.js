"use strict";
import API from "./api.js";
import { getTime } from "./helpers.js";
import { handleLike } from "./likes.js";
import { getProfile, createProfileSummary, createProfile } from "./profile.js";

// Main Feed Div
const feed = document.createElement("div");
feed.id = "feed";

export async function getFeed(token, startPage, endPage) {
    let gotMorePosts = false;
    if (!startPage && !endPage) {
        startPage = 0;
        endPage = 10;
    }
    const api = new API;
    const option = {
        headers: { "content-type": "application/json", "authorization": `Token ${token}` },
    }
    const data = await api.get(`user/feed?p=${startPage}&n=${endPage}`, option);
    Object.keys(data).forEach((post) => {
        if (data[post].length === 0) {
            console.log('Oops no posts here');
            gotMorePosts = false;
            return gotMorePosts;
        }
        feed.style.display = "flex";
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
        gotMorePosts = true;
    });
    document.getElementById("main").appendChild(feed);
    setLikeEvent();
    return gotMorePosts;
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
        commenter.onclick = () => {
            createProfile(getProfile(c.author));
            feed.style.display = "none";
        }
        wrapper.appendChild(commenter);
        wrapper.appendChild(commentText);
        commentLog.push(wrapper);
    });

    let postTemplate = `
        <div class="wrapper">
            <div class="profile-summary" id="profile-s-${postId}">
            </div>
            <div class="post" id=post-${postId}>
                <div class="post-heading">
                    <h2 class="author">${author}</h2>
                    <div class="timestamp">${getTime(time)}</div>
                </div>
                <div class="post-img"></div>
                <div class="post-info">
                    <p class="post-text">${description}</p>
                        <div class="stats">
                            <div class="add-comment">Add comment</div>
                            <div class="comments-number">${comments.length} comments</div>
                            <div class="likes-number" id="likes-num-${postId}">${likes.length}</div><div class="heart">&#x2764;</div>
                        </div>
                    <div class="comment-display" id="comment-display-${postId}"></div>
                </div>
            </div>
        </div>
    `;
    // set post image
    const parser = new DOMParser();
    const newNode = parser.parseFromString(postTemplate, "text/html");

    const imgWrapper = newNode.getElementsByClassName("post-img")[0];
    imgWrapper.appendChild(image);

    const userInfo = newNode.getElementsByClassName("author")[0];
    const profile = newNode.getElementsByClassName("profile-summary")[0];

    createProfileSummary(author, postId);
    let clickProfile = false;
    userInfo.onclick = () => {
        if (clickProfile) {
            profile.style.display = "none";
            clickProfile = false;
        }
        else {
            profile.style.display = "block";
            clickProfile = true;
        }
    }

    // Make comments divs
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
    const wrapper = newNode.getElementsByClassName("wrapper")[0];
    feed.appendChild(wrapper);
}

const setLikeEvent = () => {
    let hearts = document.querySelectorAll(".heart"); // array
    hearts.forEach(heart => {
        let postId = heart.closest(".post").id.replace(/\D+/, "");
        heart.addEventListener("click", () => {
            handleLike(postId, `likes-num-${postId}`);
        })
    })
}

// Infinite scroll
let start = 11;
let end = 20;
window.onscroll = () => {
    if ((window.scrollY + window.innerHeight + 100) >= document.body.scrollHeight) {
        getFeed(localStorage.getItem("token"), start, end)
            .then((gotMorePosts) => {
                if (gotMorePosts) {
                    start = end + 1;
                    end = end + 10;
                }
            })
    }
}

