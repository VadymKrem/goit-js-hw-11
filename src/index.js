import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const api_key = '37472485-f9bdad7e7011607296af4912b';

const formEl = document.querySelector('form');
const inputEl = document.querySelector('input'); 
const galleryPhotos = document.querySelector('.gallery');
// const loadMoreAuto = document.querySelector('.load-more-auto');
// console.log(loadMoreAuto)

// loadMoreAuto.classList.add('is-hidden');
let page = 1;
let searchQuery = '';
let perPage;
let totalValues;
let inputValue = '';

let lightbox; 

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

function getAxiosImages(searchQuery, page) {
    const url = fetch(searchQuery, page);
   
    return axios.get(url).then(response => response).catch(error => Notiflix.Notify.failure(error))
}

function makeMarkup(responseData) {
  let galleryItems = responseData.data.hits.map(item => {
    let galleryBlock = document.createElement('div');
    galleryBlock.innerHTML = `
      <a class="gallery_link" href="${item.largeImageURL}">
        <img class="image" src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/>
      </a>
      <div class="info">
        <p>${item.likes}  <b>Likes</b>  ${item.views}  <b>Views</b>  ${item.comments}  <b>Comments</b>  ${item.downloads}  <b>Downloads</b><p>
      </div>
    `;
    return galleryBlock;
  });

  galleryItems.forEach(item => {
    galleryPhotos.appendChild(item);
  });
  
  lightbox.refresh();

  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });

  window.scrollTo(0, 0);
}

async function onSubmit(event) {
    event.preventDefault();

    searchQuery = inputEl.value;
    page = 1;
    let responseData;
    
    if (searchQuery.length === 0) {
        Notiflix.Notify.warning('Sorry, your request is empty')
    } else {
        try {
            responseData = await getAxiosImages(searchQuery, page);
            if (responseData.data.total === 0) {
                throw new Error('Sorry, there are no images matching your search query. Please try again.');
            } else {
              galleryPhotos.innerHTML = '';
              makeMarkup(responseData);
              inputEl.value = '';
              Notiflix.Notify.success(`Hooray! We found ${responseData.data.totalHits} images.`)
            }
        } catch (error) {
            Notiflix.Notify.failure(error.message);
        }
    }
};

formEl.addEventListener('submit', onSubmit);

let isLoading = false;
let throttleTimeout;
let currentScrollTop = 0;
let previousScrollTop = 0;

// async function loadMoreImages() {
//   if (isLoading || page * perPage >= totalValues) {
//     return
//   }
//   isLoading = true;
//   page++;
    
//   try {
//     let responseData = await getAxiosImages(searchQuery, page);
//     makeMarkup(responseData);
//     totalValues = responseData.data.totalHits;
//   } catch (error) {
//     Notiflix.Notify.failure(error.message);
//   } finally {
//     isLoading = false;
//   }
// }

function onScroll() {
 const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}

window.addEventListener('scroll', onScroll);

document.addEventListener('DOMContentLoaded', function() {
  lightbox = new SimpleLightbox('.gallery a');
});
