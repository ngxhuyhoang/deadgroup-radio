import axios from "axios";

const form = document.getElementById("form");
const playlist = document.getElementById("playlist");
const search = document.getElementById("search");

const API_KEY = "AIzaSyBvmvGIvLkkUrAlOBQ8p4BSgZLc3Xf-0i0";

const fetchYouTubeVideo = async (keyword) => {
  if (!keyword) {
    return;
  }
  try {
    const result = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/search?q=${keyword}&key=${API_KEY}`
    );
    const result2 = await Promise.all([
      ...result.data.items.map((x) => {
        return axios.get(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${x.id.videoId}&key=${API_KEY}`
        );
      }),
    ]);
    return result2.map((x) => x.data);
  } catch (error) {
    console.log(error);
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const response = await fetchYouTubeVideo(search.value);

  console.log(response);

  const test = response.map((item) => {
    return `
    <div class="card">
      <div class=" row g-0">
        <div class="col-md-4">
          <img src="${item.items[0].snippet.thumbnails.medium.url}" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${item.items[0].snippet.title}</h5>
            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
          </div>
        </div>
      </div>
    </div>
    `;
  });

  const htmlParser = new DOMParser().parseFromString(
    test.join(""),
    "text/html"
  );

  playlist.appendChild(htmlParser.body);
});
