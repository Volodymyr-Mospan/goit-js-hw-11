import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayAPI from './js/components/PixabayAPI';
import LoadMoreButton from './js/components/load-more-button';
import Notiflix from 'notiflix';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');

const pixabayApi = new PixabayAPI();
const loadMoreButton = new LoadMoreButton({
  selector: '.load-more',
  hidden: true,
});

let lightbox = null;

formRef.addEventListener('submit', onSubmitSearch);
loadMoreButton.refs.button.addEventListener('click', onLoadMoreButton);

function onSubmitSearch(e) {
  e.preventDefault();

  if (pixabayApi.query !== e.currentTarget.searchQuery.value) {
    clearMarkupGallery();
    pixabayApi.query = e.currentTarget.searchQuery.value;
    pixabayApi.resetPage();

    return fechGallery()
      .then(totalHits =>
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
      )
      .catch(error => {
        Notiflix.Notify.failure(error.message);
      });
  }

  fechGallery();
}

function onLoadMoreButton() {
  fechGallery().then(() => {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
}

function markupGallery(arr) {
  const gallery = arr
    .map(el => {
      return `
      <div class="photo-card">
        <a class="gallery__link" href="${el.largeImageURL}">
          <img class="gallery__image" src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />  
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${el.likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${el.views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${el.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${el.downloads}
          </p>
        </div>
      </div>
    `;
    })
    .join('');

  return galleryRef.insertAdjacentHTML('beforeend', gallery);
}

function clearMarkupGallery() {
  loadMoreButton.hide();
  galleryRef.innerHTML = '';
}

function fechGallery() {
  if (pixabayApi.page > pixabayApi.totalPage) {
    return Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  return pixabayApi.fetchGallery().then(arr => {
    loadMoreButton.hide();
    markupGallery(arr);

    if (lightbox) {
      lightbox.refresh();
    } else {
      lightbox = new SimpleLightbox('.gallery a');
    }

    if (pixabayApi.page <= pixabayApi.totalPage) {
      loadMoreButton.show();
    }

    return pixabayApi.totalHits;
  });
}
