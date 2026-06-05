async function GetSongs() {
    let SongData = await fetch("/Songs/")

    let SongHTML = await SongData.text()

    let div = document.createElement("div")
    div.innerHTML = SongHTML
    let a = div.getElementsByTagName("a")

    let SongList = []

    for (let i = 0; i < a.length; i++) {
        if (a[i].href.slice(-3) == "mp3") {
            SongList.push(a[i].href)
        }
    }
    return SongList
}


function SecToMin(time) {
    if (isNaN(time)) {
        return "00:00"
    }
    let min = Math.floor(time / 60)
    let sec = Math.floor(time % 60)

    if (sec < 10) {
        return `${min}:${"0" + sec}`
    }
    return `${min}:${sec}`
}

function playMusic(element, index) {
    audio.src = element
    audio.addEventListener("loadedmetadata", () => {
        document.querySelector(".songtime").innerText =
            `${SecToMin(audio.currentTime)} / ${SecToMin(audio.duration)}`
    }, { once: true })
    audio.play()
    play.src = "/Spotify-Clone/controls/pause.svg"
    currsongindex = index

    let song = element
        .replaceAll("http://127.0.0.1:3000/Spotify-Clone/Songs/", "")
        .replaceAll("%20", " ")
        .replace(".mp3", "")

    document.querySelector(".songinfo").innerText = song

}

let audio = new Audio()
let currsongindex = 0
let allsongs = []

let main = async () => {
    let songs = await GetSongs()
    allsongs = songs

    let prev = document.querySelector("#prev")
    let play = document.querySelector("#play")
    let next = document.querySelector("#next")

    for (let i = 0; i < songs.length; i++) {
        let element = songs[i];
        let song = element.replaceAll("http://127.0.0.1:3000/Spotify-Clone/Songs/", "").replaceAll("%20", " ").replace(".mp3", "")
        let artist = song.split("-")[1]

        let card = document.querySelector(".card_container")
        let div = document.createElement("div")
        div.className = "card"
        div.innerHTML = `   <img src="https://i.scdn.co/image/ab67706f000000029e1828b742d18f4756bb6c29" alt="">
        <h3>${song}</h3>
        <p>${artist}</p>`
        card.appendChild(div)


        div.addEventListener("click", () => {
            playMusic(element, i)
        })

        let middle_card = document.querySelector(".middle")
        let middle_div = document.createElement("div")
        middle_div.className = "sub_box"
        middle_div.innerHTML = `<div><h5>${song}</h5>
        <p>${artist}</p></div>
        <img src="play_circle.svg" alt="">`
        middle_card.appendChild(middle_div)

        middle_div.addEventListener("click", () => {
            playMusic(element, i)
        })
    }

    play.addEventListener("click", () => {
        if (audio.paused) {
            audio.play()
            play.src = "/Spotify-Clone/controls/pause.svg"
        }
        else {
            audio.pause()
            play.src = "/Spotify-Clone/controls/play.svg"
        }
    })

    prev.addEventListener("click", () => {
        if (currsongindex > 0) {
            currsongindex--
            element = allsongs[currsongindex]
            playMusic(element, currsongindex)
        }
        else {
            audio.pause()
            play.src = "/Spotify-Clone/controls/play.svg"

        }
    })

    next.addEventListener("click", () => {
        if (currsongindex < allsongs.length - 1) {
            currsongindex++
            element = allsongs[currsongindex]
            playMusic(element, currsongindex)
        }
        else {
            audio.pause()
            play.src = "/Spotify-Clone/controls/play.svg"
        }
    })

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        document.querySelector(".circle").style.width = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%"
        audio.currentTime = audio.duration * (e.offsetX / e.target.getBoundingClientRect().width)
    })

    playMusic(allsongs[0])
    audio.pause()
    play.src = "/Spotify-Clone/controls/play.svg"

}
main()

audio.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerText =
        `${SecToMin(audio.currentTime)} / ${SecToMin(audio.duration)}`

    document.querySelector(".circle").style.width = (audio.currentTime / audio.duration) * 100 + "%"
})


// Updated GetSongs function for Vercel






// function SecToMin(time) {
//     if (isNaN(time)) {
//         return "00:00"
//     }
//     let min = Math.floor(time / 60)
//     let sec = Math.floor(time % 60)

//     if (sec < 10) {
//         return `${min}:${"0" + sec}`
//     }
//     return `${min}:${sec}`
// }

// function playMusic(element, index) {
//     audio.src = element
//     audio.addEventListener("loadedmetadata", () => {
//         document.querySelector(".songtime").innerText =
//             `${SecToMin(audio.currentTime)} / ${SecToMin(audio.duration)}`
//     }, { once: true })
//     audio.play()
//     play.src = "/Spotify-Clone/controls/pause.svg"
//     currsongindex = index

//     // FIXED: Remove URL hardcoding - works for any path
//     let song = element
//         .split("/").pop() // Get just the filename
//         .replaceAll("%20", " ")
//         .replace(".mp3", "")

//     document.querySelector(".songinfo").innerText = song
// }

// let audio = new Audio()
// let currsongindex = 0
// let allsongs = []

// let main = async () => {
//     let songs = await GetSongs()
    
//     if (songs.length === 0) {
//         console.error("No songs found!");
//         document.querySelector(".error-message").style.display = "block";
//         return;
//     }
    
//     allsongs = songs

//     let prev = document.querySelector("#prev")
//     let play = document.querySelector("#play")
//     let next = document.querySelector("#next")

//     for (let i = 0; i < songs.length; i++) {
//         let element = songs[i];
        
//         // FIXED: Extract song name without hardcoded paths
//         let fullFileName = element.split("/").pop()
//         let song = fullFileName.replaceAll("%20", " ").replace(".mp3", "")
//         let artist = song.includes("-") ? song.split("-")[1].trim() : "Unknown Artist"
//         let songTitle = song.includes("-") ? song.split("-")[0].trim() : song

//         // Create cards
//         let card = document.querySelector(".card_container")
//         let div = document.createElement("div")
//         div.className = "card"
//         div.innerHTML = `   <img src="https://i.scdn.co/image/ab67706f000000029e1828b742d18f4756bb6c29" alt="">
//         <h3>${songTitle}</h3>
//         <p>${artist}</p>`
//         card.appendChild(div)

//         div.addEventListener("click", () => {
//             playMusic(element, i)
//         })

//         // Create playlist items
//         let middle_card = document.querySelector(".middle")
//         let middle_div = document.createElement("div")
//         middle_div.className = "sub_box"
//         middle_div.innerHTML = `<div><h5>${songTitle}</h5>
//         <p>${artist}</p></div>
//         <img src="play_circle.svg" alt="">`
//         middle_card.appendChild(middle_div)

//         middle_div.addEventListener("click", () => {
//             playMusic(element, i)
//         })
//     }

//     play.addEventListener("click", () => {
//         if (audio.paused) {
//             audio.play()
//             play.src = "/Spotify-Clone/controls/pause.svg"
//         }
//         else {
//             audio.pause()
//             play.src = "/Spotify-Clone/controls/play.svg"
//         }
//     })

//     prev.addEventListener("click", () => {
//         if (currsongindex > 0) {
//             currsongindex--
//             let element = allsongs[currsongindex]
//             playMusic(element, currsongindex)
//         }
//         else {
//             audio.pause()
//             play.src = "/Spotify-Clone/controls/play.svg"
//         }
//     })

//     next.addEventListener("click", () => {
//         if (currsongindex < allsongs.length - 1) {
//             currsongindex++
//             let element = allsongs[currsongindex]
//             playMusic(element, currsongindex)
//         }
//         else {
//             audio.pause()
//             play.src = "/Spotify-Clone/controls/play.svg"
//         }
//     })

//     document.querySelector(".seekbar").addEventListener("click", (e) => {
//         let seekbar = e.target
//         let rect = seekbar.getBoundingClientRect()
//         let percent = (e.clientX - rect.left) / rect.width
//         document.querySelector(".circle").style.width = percent * 100 + "%"
//         audio.currentTime = audio.duration * percent
//     })

//     if (allsongs[0]) {
//         playMusic(allsongs[0])
//         audio.pause()
//         play.src = "/Spotify-Clone/controls/play.svg"
//     }
// }

// main()

// audio.addEventListener("timeupdate", () => {
//     if (audio.duration) {
//         document.querySelector(".songtime").innerText =
//             `${SecToMin(audio.currentTime)} / ${SecToMin(audio.duration)}`

//         document.querySelector(".circle").style.width = (audio.currentTime / audio.duration) * 100 + "%"
//     }
// })
