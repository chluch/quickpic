// change this when you integrate with the real API, or when u start using the dev server
const API_URL = 'http://localhost:5000'

export const getJSON = (path, options) =>
    fetch(`${path}`, options)
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => {
                    throw err;
                })
            }
            return res.json();
        })
        .catch(err => {
            console.warn(`API_ERROR: ${err.message||err.msg}`);
            alert(`${err.message||err.msg}`);
            return Promise.reject(err);
        });
/**
 * This is a sample class API which you may base your code on.
 * You don't have to do this as a class.
 */
export default class API {
    /**
     * Defaults to the API URL
     * @param {string} url 
     */
    constructor(url = API_URL) {
        this.url = url;
    }

    makeAPIRequest(path, options) {
        return getJSON(`${this.url}/${path}`, options);
    }

    post(path, options) {
        return getJSON(`${this.url}/${path}`, {
            ...options,
            method: "POST",
        });
    }

    get(path, options) {
        return getJSON(`${this.url}/${path}`, {
            ...options,
            method: "GET",
        });
    }

    put(path, options) {
        return getJSON(`${this.url}/${path}`, {
            ...options,
            method: "PUT",
        });
    }

    delete(path, options) {
        return getJSON(`${this.url}/${path}`, {
            ...options,
            method: "DELETE",
        });
    }
}

// export function getFeed(token) {
//     console.log('we in feeeed')
//     console.log(token);

//     const options = {
//         headers: { "content-type": "application/json", "authorization": 'Token' + token.token },
//         method: "GET",
//     }

//     getJSON("user/feed", options)
//         .then((ret) => {
//             if (ret.message) {
//                 alert(ret.message);
//             }
//             else {
//                 console.log('feed')
//                 console.log(ret);
//                 return ret;
//             }
//         });
// }




// export const getJSON = (path, options) =>
//     fetch(`${path}`, options)
//         .then(response => { 
//             let isOk = false;
//             if (response.ok) {
//                 isOk = true;
//             }
//             return [response.json(), isOk];
//         })
//         .then((arr) => {
//             if (arr[1]) {
//                 return arr[0];
//             }
//             else {
//                 throw new Error (`${arr[0].message}`);
//             }
//         })
//         .catch(error => {
//             console.warn(`API_ERROR: ${error}`);
//             alert(error);
//         });