import axios from 'axios';

const api_key = '37472485-f9bdad7e7011607296af4912b';
let page = 1;
let searchQuery = '';
let perPage;

function fetch(searchQuery, pageCount) {
    perPage = 40;
    const urlSource = 'https://pixabay.com/api/?';
    const params = new URLSearchParams({
        key: api_key,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage,
        page: pageCount,
    });

    return urlSource + params.toString();
}

export function getAxiosImages(searchQuery, page) {
    const url = fetch(searchQuery, page);
    return axios.get(url).then(response => response).catch(error => Notiflix.Notify.failure(error))
}
