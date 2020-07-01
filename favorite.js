(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const dataPanel = document.getElementById('data-panel')
  const data = JSON.parse(localStorage.getItem('favoriteMovies'))
  displayDataList(data)

  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-remove-favorite')) {
      removeFavoriteItem(event.target.dataset.id)
    }
  })

  function showMovie(id) {
    const title = document.querySelector('#show-movie-title')
    const image = document.querySelector('#show-movie-image')
    const date = document.querySelector('#show-movie-date')
    const description = document.querySelector('#show-movie-description')
    const url = INDEX_URL + id
    axios.get(url)
      .then(res => {
        const data = res.data.results
        console.log(res.data.results)
        title.innerText = data.title
        image.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
        date.innerText = `release at : ${data.release_date}`
        description.innerText = data.description
      })
      .catch(err => console.log(err))
  }

  function removeFavoriteItem(id) {
    // find movie by id
    const index = data.findIndex(item => item.id === Number(id))
    if (index === -1) { return }

    // remove movie and update localStorage
    data.splice(index, 1)
    localStorage.setItem('favoriteMovies', JSON.stringify(data))

    // repaint dataList
    displayDataList(data)
  }

  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }
})()