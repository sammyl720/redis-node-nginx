const app = document.querySelector('#app');

let albumId = new URLSearchParams(window.location.search).get('albumId') ?? 1;
albumId = isNaN(albumId) ? 1 : Number(albumId);

fetch("/api/photos?albumId="+albumId).then(res => {
  return res.json()
}).then(data => {
  app.innerHTML = '';
  data.forEach(photo => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = photo.id;
    card.innerHTML = `
    <div class="card-header">
      <h3>${photo.title}</h3>
    </div>
    <div class="card-img">
      <img src="${photo.url}" loading="lazy" alt="${photo.title}" />
    </div>
    `;

    app.appendChild(card);
  })
  console.log(data)
}).catch(err => {
  console.log(err);
})