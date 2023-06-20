import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';


const form = document.querySelector('form');
const input = document.querySelector('input'); 
const gallery = document.querySelector('.gallery');

const PER_PAGE = 40;
let searchQuery = '';
let pageCount = 1;
let isLoading = false;
let totalPages = 0;

// запит на сайт з параметрами ТЗ
const API_KEY = '37472485-f9bdad7e7011607296af4912b';
const url = 'https://pixabay.com/api/';
const quantityPerPage = 40;

async function getImages(searchQuerys, countPage) {
  const parametres = {
    parametres: {
      timeout: 1000,
      key: API_KEY,
      q: searchQuerys,
      image_type: 'photo',
      orientation: 'horizontal',
      page: countPage,
      per_page: quantityPerPage,
    },
  };

  const response = await axios.get(url, parametres)
    .then(response => { return response.data })
    .catch(error => Notiflix.Notify.failure(error))
}

// ф-ція створення розмітки
function createImageCardMarkup(galleryCards) {
  return galleryCards
    .map(({
        webformatURL, // посилання на маленьке зображення
        largeImageURL, // посилання на велике зображення
        tags, // теги
        likes, // кількість лайків
        views, // кількість переглядів
        comments, // кількість коментів
        downloads, // кількість завантажень
      }) =>
        `
    <div class="gallery">
      <a class="link-gallery" href="${largeImageURL}">
        <img
          class="item-image"
          src="${webformatURL}" 
          alt="${tags}"
          loading="lazy"/>
      </a>

      <div class="info">
        <p class="info-item"><b>Likes</b>${likes}</p>
        <p class="info-item"><b>Views</b>${views}</p>
        <p class="info-item"><b>Comments</b>${comments}</p>
        <p class="info-item"><b>Downloads</b>${downloads}</p>
      </div>
      
    </div>
    `
    )
    .join('');
}
// скролл
const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});