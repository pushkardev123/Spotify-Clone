async function getSongs(folder) {
    currentPlaylist = folder;
    let a = await fetch(`http://192.168.0.119:3000/Spotify-Clone/songs/${folder}`);
    let b = await a.text();
    let div = document.createElement("div");
    div.innerHTML = b;
    as = div.getElementsByTagName("a");
    let songs = [];
    for (let i = 0; i < as.length; i++) {
        songs.push(as[i].innerHTML);
    }
    return songs;
}
var currentPlaylist;
function formatTime(seconds) {
    // Round the seconds to the nearest integer
    const totalSeconds = Math.floor(seconds);

    // Calculate the number of minutes
    const minutes = Math.floor(totalSeconds / 60);

    // Calculate the remaining seconds
    const remainingSeconds = totalSeconds % 60;

    // Pad minutes and seconds with leading zeros if needed
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');

    // Combine minutes and seconds into the final format
    return `${paddedMinutes}:${paddedSeconds}`;
}
let currentSong = new Audio();
const playMusic = async (songName) => {
    console.log(currentPlaylist);
    currentSong.src = "songs/" + currentPlaylist + "/" + songName+".mp3";
    currentSong.play();
    play.src = "pause.svg";
}

async function loadPlaylists(){
    let a = await fetch(`http://192.168.0.119:3000/Spotify-Clone/songs/`);
    let b = await a.text();
    let div=document.createElement("div");
    div.innerHTML=b;
    let as=div.getElementsByTagName("a");
    Array.from(as).forEach(async e=>{
        if(e.href.includes("/songs")){
            let folder=e.href.split("/").slice(-2)[0].replaceAll("%20"," ");
            console.log(folder);
            let c= await fetch(`http://192.168.0.119:3000/Spotify-Clone/songs/${folder}/info.json`);
            let d=await c.json();
            let playlist=document.querySelector(".cardContainer");
            playlist.innerHTML+=`<div class="card rounded" data-folder="${folder}">
                        <img class="rounded" src="songs/${folder}/cover.jpeg" alt="">
                        <h4>${d.title}</h4>
                        <p>${d.description}</p>
                    </div>`;
                    console.log(`Spotify-Clone/songs/${folder}/cover.jpeg`);
        }
    });

}
async function main() {

    loadPlaylists();

    Array.from(document.querySelector(".playlists").getElementsByTagName("div")).forEach((e) => {
        e.addEventListener("click", async element => {
            let songs = await getSongs(element.target.dataset.folder);
            let songUL = document.getElementsByClassName("songList")[0].getElementsByTagName("ul")[0];
            songUL.innerHTML = ''; // Clear existing songs

            for (const song of songs) {
                // Use createElement and innerHTML to add list items
                if(song.includes(".mp3")){
                    let li = document.createElement("li");

                li.innerHTML = `
                    <img src="music.svg" alt="M" width="25px">
                    <div class="songName">
                        <div>${song.replace(".mp3", "").replaceAll("%20", " ")}</div>
                        <div>Pushkar</div>
                    </div>
                    <div class="playNow">Play now<img src="play.svg" alt="P"></div>
                `;

                songUL.appendChild(li);
            }}

            // Add click event listeners to the newly added list items
            Array.from(songUL.getElementsByTagName("li")).forEach((li) => {
                li.addEventListener("click", element => {
                    let songName = li.querySelector(".songName").firstElementChild.innerText.trim();
                    console.log(songName);
                    playMusic(songName);
                    document.querySelector("#songTitle").innerText = songName;
                });
            });
        });
    });

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }
    });
    currentSong.addEventListener("timeupdate", () => {
        currTime.innerText = formatTime(currentSong.currentTime);
        timeRemaining.innerText = "-" + formatTime(currentSong.duration - currentSong.currentTime);
        // progressBar.value = currentSong.currentTime;
        // progressBar.max = currentSong.duration;
    });
    currentSong.addEventListener('timeupdate', function () {
        const currentTime = currentSong.currentTime;
        const duration = currentSong.duration;
        const seekbar = document.querySelector('.seekbar');
        const circle = document.querySelector('.circle');
        if (!isNaN(duration)) {
            const seekbarWidth = seekbar.clientWidth;
            const circleWidth = circle.clientWidth;
            const maxCirclePosition = seekbarWidth - circleWidth;

            const newLeft = (currentTime / duration) * maxCirclePosition;
            circle.style.left = `${newLeft}px`;
        }
    });
    const seekbar = document.querySelector('.seekbar');
    const circle = document.querySelector('.circle');
    seekbar.addEventListener('click', function (event) {
        const seekbarRect = seekbar.getBoundingClientRect();
        const offsetX = event.clientX - seekbarRect.left;
        const seekbarWidth = seekbar.clientWidth;

        const newTime = (offsetX / seekbarWidth) * currentSong.duration;
        currentSong.currentTime = newTime;
    });
    hamburgerIcon.addEventListener("click", () => {
        console.log("clicked");
        const left = document.querySelector(".left");
        const right = document.querySelector(".right");
        console.log("none");
        left.style.left = "0%";
        const close = document.querySelector(".close");
        close.style.left = "370px";
        close.style.top = "5%";
        close.addEventListener("click", () => {
            left.style.left = "-120%";
            close.style.left = "-120%";
        });

    });
    volume.addEventListener("click", () => {
        const volumeRect = volume.getBoundingClientRect();
        const volumeWidth = volume.clientWidth;
        const offsetX = event.clientX - volumeRect.left;
        const newVolume = offsetX / volumeWidth;
        currentSong.volume = newVolume;
        const circle = volume.firstElementChild;
        circle.style.left = `${offsetX}px`;
    });

}
main();