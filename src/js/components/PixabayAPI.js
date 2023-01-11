import axios from 'axios';

const API_KEY = '32702004-1edcc94db1ad9191accf2fa0a';
const imageType = 'photo';
const orientation = 'horizontal';
const safesearch = 'true';
const BASE_URL = 'https://pixabay.com/api/';

export default class fetchPixabayAPI {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
    this.totalPage = 1;
    this.quantityIndex = 3;
  }

  async fetchGallery() {
    const url = `${BASE_URL}?key=${API_KEY}&image_type=${imageType}&orientation=${orientation}&safesearch=${safesearch}&q=${this.searchQuery}&per_page=${this.perPage}&page=${this.page}`;
    const resp = await axios.get(url);
    const data = await resp.data;
    if (!data.totalHits) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    this.totalPage = Math.ceil(data.totalHits / this.perPage);
    this.page += 1;
    return data;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
