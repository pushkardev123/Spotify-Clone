var currentPlaylist;

async function getSongs(folder) {
    currentPlaylist = folder;
    const repo = "pushkardev123/Spotify-Clone";
    const dirPath = `songs/${folder}`;
    const apiURL = `https://api.github.com/repos/${repo}/contents/${dirPath}`;

    try {
        let response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let files = await response.json();
        let songs = files.filter(file => file.name.endsWith('.mp3')).map(file => file.name);
        return songs;
    } catch (error) {
        console.error('Error fetching songs:', error);
        return [];
    }
}

function formatTime(seconds) {
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
}

let currentSong = new Audio();

const playMusic = async (songName) => {
    console.log(currentPlaylist);
    currentSong.src = `songs/${currentPlaylist}/${songName}.mp3`;
    currentSong.play();
    play.src = "pause.svg";
}

async function loadPlaylists() {
    const repo = "pushkardev123/Spotify-Clone";
    const dirPath = "songs";
    const apiURL = `https://api.github.com/repos/${repo}/contents/${dirPath}`;

    try {
        let response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let folders = await response.json();
        for (const folder of folders) {
            if (folder.type === "dir") {
                const folderName = folder.name.replaceAll("%20", " ");
                const infoURL = `https://api.github.com/repos/${repo}/contents/${dirPath}/${folder.name}/info.json`;
                let c = await fetch(infoURL);
                let d = await c.json();
                let playlist = document.querySelector(".cardContainer");
                playlist.innerHTML += `<div class="card rounded" data-folder="${folder.name}">
                    <img class="rounded" src="songs/${folder.name}/cover.jpeg" alt="">
                    <h4>${d.title}</h4>
                    <p>${d.description}</p>
                </div>`;
            }
        }
    } catch (error) {
        console.error('Error loading playlists:', error);
    }
}

async function main() {
    await loadPlaylists();

    Array.from(document.querySelector(".playlists").getElementsByTagName("div")).forEach((e) => {
        e.addEventListener("click", async element => {
            let songs = await getSongs(element.target.dataset.folder);
            let songUL = document.getElementsByClassName("songList")[0].getElementsByTagName("ul")[0];
            songUL.innerHTML = '';

            for (const song of songs) {
                if (song.includes(".mp3")) {
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
                }
            }

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
