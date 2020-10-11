// change this when you integrate with the real API, or when u start using the dev server
const API_URL = 'http://localhost:5000'

const getJSON = (path, options) => 
    fetch(path, options)
        .then(res => res.json())
        .then((data) => console.log(data)) //extra
        .catch(err => console.warn(`API_ERROR: ${err.message}`));

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

    makeAPIRequest(path) {
        console.log(this.url);
        return getJSON(`${this.url}/${path}`);
    }
}
