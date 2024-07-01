async function getSongs() {
    let a= await fetch("http://192.168.0.119:3000/Spotify-Clone/songs/");
    let b= await a.text();
    let div=document.createElement("div");
    div.innerHTML=b;
    as=div.getElementsByTagName("a");
    let songs=[];
    for(let i=0;i<as.length;i++){
        songs.push(as[i].innerHTML);
    }
    return songs;
}
let currentSong= new Audio();
const playMusic = async (songName) => {
    currentSong.src= "songs/" + songName;
    currentSong.play();
    play.src = "pause.svg";
}
async function main() {
    let songs = await getSongs();
    let songUL = document.getElementsByClassName("songList")[0].getElementsByTagName("ul")[0];

    for (const song of songs) {
        // Use createElement and innerHTML to add list items
        let li = document.createElement("li");

        li.innerHTML = `
            <img src="music.svg" alt="M" width="25px">
            <div class="songName">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Pushkar</div>
            </div>
            <div class="playNow">Play now<img src="play.svg" alt="P"></div>
        `;

        songUL.appendChild(li);
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", element => {
           console.log(e.querySelector(".songName").firstElementChild.innerHTML);
           playMusic(e.querySelector(".songName").firstElementChild.innerText.trim());
        });

})
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }
    });
}
main();