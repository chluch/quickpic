"use strict";
import API from "./api.js";
import { getTime, clearMainContent, renderHTML, sortByTimestamp } from "./helpers.js";
import { handleLike } from "./likes.js";
import { getProfile, getProfileById, createProfile } from "./profile.js";

export async function getFeed(token, startPage, pageNum) {
    // console.log(`getfeed start: ${startPage}, ${pageNum}`)
    let gotMorePosts = false;
    if (!startPage) {
        startPage = 0;
    }
    if (!pageNum) {
        pageNum = 10;
    }
    // console.log(`getfeed after: ${startPage}, ${pageNum}`)
    const api = new API;
    const option = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${token}`
        },
    }
    let data = await api.get(`user/feed?p=${startPage}&n=${pageNum}`, option);

    // Main Feed Div
    let feed = document.getElementById("feed");
    if (!feed) {
        feed = document.createElement("div");
        feed.id = "feed";
    }

    Object.keys(data).forEach((post) => {
        // console.log(`feed length: ${data[post].length}`)
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
        // console.log("getFeed -> return TRUE")
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
                    <div class="likes-display" id="likes-display-${postId}"></div>
                        <div class="action">
                            <div class="add-comment">
                            <svg id="Capa_1" enable-background="new 0 0 512.193 512.193" height="512" viewBox="0 0 512.193 512.193" width="512" xmlns="http://www.w3.org/2000/svg">
                                <path d="m403.538 177.757 76.491-76.838-100.466-100.919-76.491 76.838z" />
                                <path d="m55.736 325.291-23.572 23.678v100.852h100.533l23.505-23.611z" />
                                <path d="m185.974 396.303 188.364-189.215-100.466-100.919-188.364 189.215z" />
                                <path d="m32.164 482.193h447.85v30h-447.85z" />
                                <path d="m237.864 419.821h242.149v30h-242.149z" />
                            </svg>
                            <a>Add comment...</a>
                            </div>
                            <div class="comments-number"><a title="comments">${comments.length}</a> 
                                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                                y="0px" viewBox="0 0 60.016 60.016" style="enable-background:new 0 0 60.016 60.016;" xml:space="preserve" title="see comments">
                                <path d="M42.008,0h-24c-9.925,0-18,8.075-18,18v14c0,9.59,7.538,17.452,17,17.973v8.344c0,0.937,0.764,1.699,1.703,1.699
                                c0.449,0,0.874-0.178,1.195-0.499l1.876-1.876C26.708,52.714,33.259,50,40.227,50h1.781c9.925,0,18-8.075,18-18V18
                                C60.008,8.075,51.933,0,42.008,0z M17.008,29c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S19.213,29,17.008,29z M30.008,29
                                c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S32.213,29,30.008,29z M43.008,29c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4
                                S45.213,29,43.008,29z" />
                                </svg>
                            </div>
                            <div class="likes-number"><a title="show likes" id="likes-num-${postId}">${likes.length}</a></div><div class="heart">&#x2764;</div>
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
    userInfo.onclick = () => {
        clearMainContent();
        createProfile(getProfile(author));
    }

    // Generate like list and Toggle
    createLikesList(likes, newNode);
    const showLikes = newNode.getElementById(`likes-display-${postId}`);
    showLikes.style.display = "none";
    let displayLikesToggle = newNode.getElementById(`likes-num-${postId}`);
    displayLikesToggle.onclick = (e) => {
        e.preventDefault();
        showLikes.style.display === "none" ? showLikes.style.display = "block" : showLikes.style.display = "none";
    }

    // save each comment as div in array
    let commentLog = [];
    displayEachComment(comments, commentLog);

    // Generate comment input box
    createCommentBox(postId, `post-${postId}`, newNode); ////// <<<<<!~~~~~

    // Make div for showing ALL comments for EACH post
    let displayAllComments = newNode.getElementsByClassName("comment-display")[0];
    for (let el of commentLog) {
        displayAllComments.appendChild(el);
    }

    // Toggle comments
    const showComments = newNode.getElementById(`comment-display-${postId}`);
    showComments.style.display = "none";
    let displayAllCommentsToggle = newNode.getElementsByClassName("comments-number")[0];
    displayAllCommentsToggle.onclick = (e) => {
        e.preventDefault();
        showComments.style.display === "none" ? showComments.style.display = "block" : showComments.style.display = "none";
    }

    // Toggle comment input box
    let commentBox = newNode.getElementById(`post-comment-${postId}`);
    commentBox.style.display = "none";
    let addCommentToggle = newNode.getElementsByClassName("add-comment")[0];
    addCommentToggle.onclick = () => {
        commentBox.style.display === "none" ? commentBox.style.display = "block" : commentBox.style.display = "none";
    }
    newNode.getElementsByClassName("submit-comment")[0].onclick = (e) => {
        e.preventDefault();
        postComment(postId, document.getElementById(`post-${postId}`));
    }
    // Prevent enter in comment input box
    newNode.getElementsByClassName("comment-text")[0].onkeydown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    }

    let wrapper = newNode.getElementsByClassName("wrapper")[0];
    feed.appendChild(wrapper);



}

const createLikesList = (likes, parentElement) => {
    const parent = parentElement.getElementsByClassName("likes-display")[0];
    const likeList = document.createElement("ul");
    if (likes.length === 0) {
        const likesMessage = document.createTextNode("No \u2661 given!");
        parent.appendChild(likesMessage);
        return;
    }
    for (const userId of likes) {
        getProfileById(userId)
            .then((data) => {
                likeList.className = "like-list";
                let user = document.createElement("li");
                user.innerText = data.username;
                likeList.appendChild(user);
            })
            .then(()=> {
                parent.appendChild(likeList);
            })
            .catch(err => console.log(err));
    }
}

const setLikeEvent = () => {
    let idsSeen = [];
    let hearts = document.querySelectorAll(".heart"); // array
    // console.log(`heartslength: ${hearts.length}`);
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

const displayEachComment = (commentArray, log) => {
    sortByTimestamp(commentArray);
    (commentArray).forEach((comment) => {
        const wrapper = document.createElement("div");
        wrapper.className = "comment-wrapper";
        const commenter = document.createElement("h5");
        const commentContent = document.createElement("p");
        const commentTime = document.createElement("div");
        commenter.className = "commenter";
        commentContent.className = "comment";
        commentTime.className = "comment-time";
        commentTime.innerText = getTime(comment.published);
        commenter.innerText = `${comment.author}: `
        commentContent.innerText = comment.comment;
        commenter.onclick = (e) => {
            e.preventDefault();
            clearMainContent();
            createProfile(getProfile(comment.author));
        }
        let temp = [commentTime, commenter, commentContent];
        temp.forEach((el) => {
            wrapper.appendChild(el);
            log.push(wrapper);
        });
    });
}

const createCommentBox = (postId, parentElementId, parent) => {
    const commentBoxTemplate = `
    <div class="post-comment" id="post-comment-${postId}">
        <textarea class="comment-text" placeholder="Say something" maxlength="200"></textarea>
        <button type="submit" class="submit-comment" style="display: block;">comment</button>
    </div>
    `;
    renderHTML(commentBoxTemplate, `post-comment-${postId}`, parentElementId, parent);
}

export const postComment = (postId, post) => {
    // const post = document.getElementById(`post-${postId}`);
    let commentContent = post.querySelector("textarea").value;
    if (!commentContent) {
        alert("You didn't comment!");
        return;
    }
    const toSend = { "comment": commentContent, }
    const api = new API;
    const option = {
        headers: {
            "content-type": "application/json",
            "authorization": `Token ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(toSend),
    }
    api.put(`post/comment?id=${postId}`, option)
        .then((ret) => {
            console.log(ret.message);
            // clearMainContent();
            console.log("posted");
            console.log(commentContent);
            commentContent = "";
            console.log("after" + commentContent);
        })
        .catch(err => alert(`${err} Oopsie Woopsie uwu`)); //TODO: This error doesn't pop up
}

//TODO: clear textarea after comment is sent