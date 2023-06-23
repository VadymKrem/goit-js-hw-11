import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getAxiosImages } from './js/api';



const formEl = document.querySelector('form');
const inputEl = document.querySelector('input'); 
const galleryPhotos = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');
const loadMoreAuto = document.querySelector('.load-more-auto');

const perPage = 40;
let page = 1;

loadMoreBtn.classList.add('is-hidden');

let totalValues;
let inputValue = '';

const lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  enableKeyboard: true
});



function makeMarkup(responseData) {
 return responseData.data.hits
    .map(
      ({
        webformatURL, 
        largeImageURL, 
        tags, 
        likes, 
        views, 
        comments, 
        downloads, 
      }) =>
        `
    <div class="photo-card">
      <a class="gallery-link" href="${largeImageURL}">
        <img
          class="gallery-image"
          src="${webformatURL}" 
          alt="${tags}" 
          loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes</b>  ${likes}</p>
        <p class="info-item"><b>Views</b>  ${views}</p>
        <p class="info-item"><b>Comments</b>  ${comments}</p>
        <p class="info-item"><b>Downloads</b>  ${downloads}</p>
      </div>
      
    </div>
    `
    )
    .join('');
  }

async function onSubmit(event) {
    event.preventDefault();

    inputValue = inputEl.value;
    searchQuery = inputValue;
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
              galleryPhotos.insertAdjacentHTML('beforeend', makeMarkup(responseData));
              lightbox.refresh();
  //             const { height: cardHeight } = document
  //             .querySelector(".gallery")
  //             .firstElementChild.getBoundingClientRect();

  //             window.scrollBy({
  //             top: cardHeight * 2,
  //             behavior: "smooth",
  // });     
    
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

async function loadMoreImages() {
  if (isLoading || page * perPage >= totalValues) {
    return
  }
  isLoading = true;
  page++;
  previousScrollTop = window.scrollY;  
  try {
    let responseData = await getAxiosImages(searchQuery, page);
    galleryPhotos.insertAdjacentHTML('beforeend', makeMarkup(responseData));
    totalValues = responseData.data.totalHits;
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  } finally {
    isLoading = false;
    window.scrollTo(0, previousScrollTop);
  }
  }

function onScroll() {
 const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
  loadMoreBtn.classList.remove('is-hidden');
  // loadMoreBtn.addEventListen('', loadMoreImages())
  // const documentRect = document.documentElement.getBoundingClientRect();
  
  //   if (documentRect.bottom < document.documentElement.clientHeight + 150 && window.scrollY > currentScrollTop) {
      
  //     loadMoreBtn.classList.remove('is-hidden');
  //     loadMoreBtn.addEventListener('submit', loadMoreImages())

  // }
  currentScrollTop = window.scrollY;
}

window.addEventListener('scroll', onScroll);
