"use strict";
import API from "./api.js";
import { getTime, clearMainContent } from "./helpers.js";
import { handleLike } from "./likes.js";
import { getProfile, createProfile } from "./profile.js";

export async function getFeed(token, startPage, pageNum) {
    console.log(`getfeed start: ${startPage}, ${pageNum}`)
    let gotMorePosts = false;
    if (!startPage) {
        startPage = 0;
    }
    if (!pageNum) {
        pageNum = 10;
    }
    console.log(`getfeed after: ${startPage}, ${pageNum}`)
    let api = new API;
    const option = {
        headers: { "content-type": "application/json", "authorization": `Token ${token}` },
    }
    let data = await api.get(`user/feed?p=${startPage}&n=${pageNum}`, option);

    // Main Feed Div
    let feed = document.getElementById("feed");
    if (!feed) {
        feed = document.createElement("div");
        feed.id = "feed";
    }

    Object.keys(data).forEach((post) => {
        console.log(`feed length: ${data[post].length}`)
        if (data[post].length === 0) {
            console.log('Oops no posts here');
            gotMorePosts = false;
            console.log("getFeed -> return FALSE")
            return gotMorePosts;
        }
        data[post].forEach((p) => {
            createPost(
                p.id,
                p.meta.author,
                p.meta.published,
                p.meta.likes,
                p.meta.description_text,
                p.comments,
                p.src,
                feed
            );

        })
        console.log("getFeed -> return TRUE")
        gotMorePosts = true;
    });
    document.getElementById("main").appendChild(feed);
    setLikeEvent();
    return gotMorePosts;
}

// Create each individual post from getFeed
const createPost = (postId, author, time, likes, description, comments, img, feed) => {
    let image = document.createElement("img");
    Object.assign(image, {
        src: `data:image/jpeg;base64, ${img}`,
        alt: `${author}'s post`
    });

    // save each comment as div in array
    let commentLog = [];
    Object(comments).forEach((c) => {
        // console.log(`${c.author}: ${c.comment}`);
        let commenter = document.createElement("span");
        commenter.className = "commenter";
        let commentText = document.createElement("span");
        commentText.className = "comment";
        commenter.innerText = `${c.author}: `;
        commentText.innerText = c.comment;
        let wrapper = document.createElement("div");
        commenter.onclick = () => {
            clearMainContent();
            createProfile(getProfile(c.author));
            // feed.style.display = "none";
        }
        wrapper.appendChild(commenter);
        wrapper.appendChild(commentText);
        commentLog.push(wrapper);
    });
    // <div class="profile-summary" id="profile-s-${postId}">
    const postTemplate = `
        <div class="wrapper">
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
    let parser = new DOMParser();
    let newNode = parser.parseFromString(postTemplate, "text/html");
    let imgWrapper = newNode.getElementsByClassName("post-img")[0];
    imgWrapper.appendChild(image);

    let userInfo = newNode.getElementsByClassName("author")[0];
    // const profile = newNode.getElementsByClassName("profile-summary")[0];

    // createProfileSummary(author, postId);
    // let clickProfile = false;
    userInfo.onclick = () => {
        clearMainContent();
        createProfile(getProfile(author))
        // if (clickProfile) {
        // profile.style.display = "none";
        // clickProfile = false;
        // }
        // else {
        // profile.style.display = "block";
        // clickProfile = true;
        // }
    }

    // Make comments divs
    let commentDisplay = newNode.getElementsByClassName("comment-display")[0];
    for (let el of commentLog) {
        commentDisplay.appendChild(el);
    }
    let showComments = newNode.getElementById(`comment-display-${postId}`)
    showComments.style.display = "none";
    let commentNum = newNode.getElementsByClassName("comments-number")[0];
    commentNum.onclick = () => {
        showComments.style.display === "none" ? showComments.style.display = "block" : showComments.style.display = "none";
    }
    let wrapper = newNode.getElementsByClassName("wrapper")[0];
    feed.appendChild(wrapper);
}


const setLikeEvent = () => {
    let idsSeen = [];
    let hearts = document.querySelectorAll(".heart"); // array
    console.log(`heartslength: ${hearts.length}`);
    // console.log(hearts);
    hearts.forEach(heart => {
        heart.onclick = "";
        let postId = heart.closest(".post").id.replace(/\D+/, "");
        // console.log(idsSeen)
        if (!idsSeen.includes(postId)) {
            heart.addEventListener("click", () => {
                handleLike(postId, `likes-num-${postId}`);
            })
            idsSeen.push(postId);
        }
    })
}