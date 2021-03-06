"use strict";
import { clearMainContent, toggle } from "./helpers.js";
import { getFeed } from "./feed.js";
import { getProfile, createProfile } from "./profile.js";
import { createPostForm } from "./post.js";

export const initialisePage = (token) => {
    clearMainContent();
    setPostLink();
    setProfileLink();
    setFeedLink();
    banner.style.display = "flex";
    setDropdownIcons();
    setSearch();
    getFeed(token, 0, 10).then(() => setInfiniteScroll(10));
}

export const initialiseFeedOnly = () => {
    window.onscroll = null;
    getFeed(localStorage.getItem("token")).then(() => setInfiniteScroll(10));
}

const banner = document.getElementsByClassName("banner")[0];

// Set up all the links in nav and dropdown
const setPostLink = () => {
    const elements = ["post-link", "dd-post-link"];
    for (const el of elements) {
        document.getElementById(el).onclick = (e) => {
            e.preventDefault();
            clearMainContent();
            window.onscroll = null;
            createPostForm();
        }
    }
}
const setProfileLink = () => {
    const elements = ["profile-link", "dd-profile-link"];
    for (const el of elements) {
        document.getElementById(el).onclick = (e) => {
            e.preventDefault();
            clearMainContent();
            window.onscroll = null;
            const ownData = getProfile(localStorage.getItem("username"));
            createProfile(ownData);
        }
    }
}
const setFeedLink = () => {
    const elements = ["quickpic", "feed-link", "dd-feed-link"];
    for (const el of elements) {
        document.getElementById(el).onclick = (e) => {
            e.preventDefault();
            clearMainContent();
            window.onscroll = null;
            getFeed(localStorage.getItem("token"), 0, 10).then(() => setInfiniteScroll(10))
        }
    }
}

// Set up infinite scroll for feed
let isScrolled = false;
export const setInfiniteScroll = (start) => {
    window.onscroll = () => {
        // console.log(`Total Window:${window.scrollY + window.innerHeight}`);
        // console.log(`Document: ${document.body.scrollHeight}`);
        // console.log(`isScrolled: ${isScrolled}`)
        if (((window.scrollY + window.innerHeight) >= document.body.scrollHeight) && !isScrolled) {
            // console.log("BOTTOM<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
            isScrolled = true;
            // console.log(`SCROLL from: ${start}`);
            getFeed(localStorage.getItem("token"), start, 10)
                .then((getMorePosts) => {
                    const loadMore = getMorePosts;
                    if (loadMore) {
                        start += 10;
                        // console.log('gettin more posts');
                        // console.log(`next SCROLL: ${start}`);
                    }
                    else {
                        window.onscroll = '';
                    }
                });
            setTimeout(() => { // Wait for fetch
                isScrolled = false;
            }, 2500);
        }
    }
}

// Set up dropdown icons onclick behaviour
const setDropdownIcons = () => {
    const dropdownIcon = document.getElementById("dropdown-icon");
    const dropdownMenu = document.getElementById("dropdown-menu");
    dropdownMenu.style.display = "none";
    const searchIcon = document.getElementsByClassName("dropdown-search-icon")[0];
    const searchLink = document.getElementById("search-link");
    const dropdownSearchBar = document.getElementsByClassName("dropdown-search-bar")[0];
    dropdownSearchBar.style.display = "none";
    dropdownIcon.onclick = (e) => {
        e.preventDefault();
        if (dropdownMenu.style.display === "none" || dropdownSearchBar.style.display === "flex") {
            dropdownSearchBar.style.display = "none";
            dropdownMenu.style.display = "flex";
        }
        else if (dropdownMenu.style.display === "flex") {
            dropdownMenu.style.display = "none";
        }
    }
    searchIcon.onclick = (e) => {
        e.preventDefault();
        if (dropdownSearchBar.style.display === "none" || dropdownMenu.style.display === "flex") {
            dropdownMenu.style.display = "none";
            dropdownSearchBar.style.display = "flex";
        }
        else if (dropdownSearchBar.style.display === "flex") {
            dropdownSearchBar.style.display = "none";
        }
    }
    toggle(searchLink, dropdownSearchBar, "flex");
}

const setSearch = () => {
    const searchButton = document.getElementById("dd-search-btn");
    searchButton.onclick = (e) => {
        e.preventDefault();
        const userToSearch = document.getElementById("dd-search-box").value;
        if (!userToSearch) {
            return;
        }
        clearMainContent();
        window.onscroll = null;
        const user = getProfile(userToSearch);
        createProfile(user);
    }
}
