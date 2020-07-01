(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  const dataPanel = document.querySelector('#data-panel')
  axios.get('https://movie-list.alphacamp.io/api/v1/movies')
    .then(response => {
      data.push(...response.data.results)
      // displayDataList(data)
      console.log(response.data.results)
      getTotalPages(data)
      getPageData(1, data)
    })
    .catch(error => console.log(error))

  dataPanel.addEventListener('click', event => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      // console.log(Number(event.target.dataset.id))
      addFavoriteItem(event.target.dataset.id)
    }
  })

  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })

  let paginationData = []
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    // console.log(paginationData)
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))
    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  const searchForm = document.querySelector('#search')
  const searchInput = document.querySelector('#search-input')
  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    // let input = searchInput.value.toLowerCase()
    // let results = data.filter(
    //   movie => movie.title.toLowerCase().includes(input)
    // )
    let results = []
    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(movie => movie.title.match(regex))
    console.log(regex)
    console.log(results)
    // displayDataList(results)
    getTotalPages(results)
    getPageData(1, results)
  })

  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(item => {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top" src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h6>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }
  function showMovie(id) {
    const title = document.querySelector('#show-movie-title')
    const image = document.querySelector('#show-movie-image')
    const date = document.querySelector('#show-movie-date')
    const description = document.querySelector('#show-movie-description')
    const url = INDEX_URL + id
    console.log(url)

    axios.get(url)
      .then(response => {
        const data = response.data.results
        console.log(response.data.results)
        title.innerText = data.title
        image.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
        date.innerText = `release at : ${data.release_date}`
        description.innerText = data.description
      })
  }


})()

