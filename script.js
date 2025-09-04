document.addEventListener('DOMContentLoaded', () => {

    // --- DATA ---
    const serverSongs = [
        { url: 'music/Aaj Dil Gustak Hai - Blue 320 Kbps.mp3' },
        { url: 'music/Aandhi Ki Tarah - Sivaji The Boss 320 Kbps.mp3' },
        { url: 'music/Aaya Khwaab Ka Mausam - Kochadaiiyaan 320 Kbps.mp3' },
        { url: 'music/Afreeda - Dil Bechara 192 Kbps.mp3' },
        { url: 'music/Aise Na Dekho - Raanjhanaa 320 Kbps.mp3' },
        { url: 'music/Aiyla - I 320 Kbps.mp3' },
        { url: 'music/Alaahda - Lekar Hum Deewana Dil 320 Kbps.mp3' },
        { url: 'music/Aromale (My Beloved) - Ekk Deewana Tha 320 Kbps.mp3' },
        { url: 'music/Aur Ho - Rockstar 320 Kbps.mp3' },
        { url: 'music/Azeem-O-Shaan Shahenshah - Jodhaa Akbar 320 Kbps.mp3' },
        { url: 'music/Beera Beera Beera Beera - Raavan 320 Kbps.mp3' },
        { url: 'music/Call Me Dil - Jhootha Hi Sahi 320 Kbps.mp3' },
        { url: 'music/Chali Kahani - Tamasha 320 Kbps.mp3' },
        { url: 'music/Chalke Re - Lingaa (Hindi) 320 Kbps.mp3' },
        { url: 'music/Challa - Jab Tak Hai Jaan 320 Kbps.mp3' },
        { url: 'music/Dhakka Laga Bukka - Tandav 320 Kbps.mp3' },
        { url: 'music/Dreams On Fire - Slumdog Millionaire 320 Kbps.mp3' },
        { url: 'music/Enna Sona - OK Jaanu 128 Kbps.mp3' },
        { url: 'music/Heera - Highway 320 Kbps.mp3' },
        { url: 'music/Hind Mere Jind - Sachin A Billion Dreams 320 Kbps.mp3' },
        { url: 'music/Issak Taari - I 320 Kbps.mp3' },
        { url: 'music/Jee Lein - OK Jaanu 128 Kbps.mp3' },
        { url: 'music/Lakhon Salaam - Jugni 320 Kbps.mp3' },
        { url: 'music/Mohenjo Mohenjo - Mohenjo Daro 320 Kbps.mp3' },
        { url: 'music/O Sona Tere Liye - MOM 128 Kbps.mp3' },
        { url: 'music/Rang De Basanti - Its A Wonderful Afterlife 320 Kbps.mp3' },
        { url: 'music/Rehna Tu - Delhi 6 320 Kbps.mp3' },
        { url: 'music/Tu Bol Main Boloon.mp3' },
        { url: 'music/Tu Chale - I 320 Kbps.mp3' }
    ];


    let localTracks = [];

    // --- STATE ---
    let currentTrack = { index: -1, source: null }; // source can be 'local' or 'server'
    let isPlaying = false;

    // --- ELEMENTS ---
    const audioPlayer = document.getElementById('audio-player');
    // Hamburger Menu Elements
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const localPlayerPanel = document.getElementById('local-player-panel');
    const overlay = document.getElementById('overlay');
    // Local Player Elements
    const folderInput = document.getElementById('folder-input');
    const localPlaylistElement = document.getElementById('local-playlist');
    // Server Player Elements
    const songGrid = document.getElementById('song-grid');
    // Unified Player Bar Elements
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const playerCover = document.getElementById('player-cover');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');

    // --- HAMBURGER MENU LOGIC ---

    /**
     * Toggles the visibility of the left-side local player panel and the overlay.
     * It adds/removes the 'open' class to the panel to trigger the CSS transition for sliding in/out.
     * It also adds/removes the 'active' class to the overlay to show/hide it.
     */
    function toggleMenu() {
        localPlayerPanel.classList.toggle('open');
        overlay.classList.toggle('active');
    }

    // Event listener for the hamburger button. When clicked, it calls the toggleMenu function.
    hamburgerBtn.addEventListener('click', toggleMenu);

    // Event listener for the overlay. Clicking the dark area outside the menu will also close it.
    overlay.addEventListener('click', toggleMenu);

    // --- LOCAL PLAYER LOGIC ---
    folderInput.addEventListener('change', (event) => {
        localTracks = [];
        localPlaylistElement.innerHTML = '';
        const files = event.target.files;
        for (const file of files) {
            if (file.type === 'audio/mpeg') {
                localTracks.push({
                    title: file.name.replace('.mp3', ''),
                    artist: "Local File",
                    audioSrc: URL.createObjectURL(file),
                    coverSrc: "https://placehold.co/100x100/e2e8f0/e2e8f0?text=."
                });
            }
        }
        buildLocalPlaylist();
    });

    function buildLocalPlaylist() {
        if (localTracks.length === 0) {
            localPlaylistElement.innerHTML = '<p style="text-align: center; color: var(--subtle-text-color); padding: 1rem;">No MP3s found.</p>';
            return;
        }
        localTracks.forEach((track, index) => {
            const trackItem = document.createElement('div');
            trackItem.className = 'track-item';
            trackItem.textContent = track.title;
            trackItem.dataset.index = index;
            trackItem.addEventListener('click', () => {
                loadTrack(index, 'local');
                playTrack();
                // Close menu on mobile after selection
                if (localPlayerPanel.classList.contains('open')) {
                    toggleMenu();
                }
            });
            localPlaylistElement.appendChild(trackItem);
        });
    }

    // --- SERVER PLAYER LOGIC ---
    // function loadServerSongs() {
    //     songGrid.innerHTML = '';
    //     serverSongs.forEach((song, index) => {
    //         const card = document.createElement('div');
    //         card.className = 'song-card';
    //         card.dataset.index = index;
    //         card.innerHTML = `<img src="${song.coverSrc}" alt="${song.title} cover"><div class="song-card-info"><h3>${song.title}</h3><p>${song.artist}</p></div>`;
    //         card.addEventListener('click', () => {
    //             loadTrack(index, 'server');
    //             playTrack();
    //         });
    //         songGrid.appendChild(card);
    //     });
    // }





    function loadServerSongs() {
        songGrid.innerHTML = ''; // Clear existing cards

        serverSongs.forEach((song, index) => {
            // Create empty card placeholders first to avoid UI delay
            const card = document.createElement('div');
            card.className = 'song-card';
            card.dataset.index = index;
            card.innerHTML = `
      <img src="" alt="Loading cover..." style="display:none;" class="cover-img">
      <div class="song-card-info">
        <h3>Loading title...</h3>
        <p>Loading artist...</p>
      </div>`;
            card.addEventListener('click', () => {
                loadTrack(index, 'server');
                playTrack();
            });
            songGrid.appendChild(card);

            // Fetch the MP3 file as a blob to read metadata
            fetch(song.url)
                .then(res => {
                    if (!res.ok) throw new Error(`Failed to fetch ${song.url}`);
                    return res.blob();
                })
                .then(blob => {
                    jsmediatags.read(blob, {
                        onSuccess: (tag) => {
                            const tags = tag.tags;
                            // Update card content with metadata
                            const img = card.querySelector('.cover-img');
                            const info = card.querySelector('.song-card-info');
                            info.querySelector('h3').textContent = tags.title || 'Unknown Title';
                            info.querySelector('p').textContent = tags.artist || 'Unknown Artist';

                            if (tags.picture) {
                                const { data, format } = tags.picture;
                                const byteArray = new Uint8Array(data);
                                const imageBlob = new Blob([byteArray], { type: format });
                                const imageUrl = URL.createObjectURL(imageBlob);
                                img.src = imageUrl;
                                img.style.display = 'block';
                            } else {
                                // No cover art, hide the image element or set placeholder
                                img.style.display = 'none';
                            }
                        },
                        onError: (error) => {
                            console.error(`Error reading tags for ${song.url}:`, error);
                            const info = card.querySelector('.song-card-info');
                            info.querySelector('h3').textContent = 'Unknown Title';
                            info.querySelector('p').textContent = 'Unknown Artist';
                            const img = card.querySelector('.cover-img');
                            img.style.display = 'none';
                        }
                    });
                })
                .catch(err => {
                    console.error(`Failed to load song file ${song.url}`, err);
                });
        });
    }









    // --- UNIFIED PLAYER LOGIC ---
    // function loadTrack(index, source) {
    //     currentTrack = { index, source };
    //     const song = (source === 'local') ? localTracks[index] : serverSongs[index];

    //     audioPlayer.src = song.audioSrc;
    //     playerCover.src = song.coverSrc;
    //     playerTitle.textContent = song.title;
    //     playerArtist.textContent = song.artist;

    //     updateActiveUI();
    //     enableControls();
    // }

    function loadTrack(index, source) {
        currentTrack = { index, source };
        const song = (source === 'local') ? localTracks[index] : serverSongs[index];

        // Set audio source immediately
        audioPlayer.src = song.url || song.audioSrc; // support old localTracks or new serverSongs with url

        // Reset UI placeholders while loading metadata
        playerCover.src = '';
        playerTitle.textContent = 'Loading...';
        playerArtist.textContent = '';

        // Fetch the audio file as blob to read metadata if from serverSongs
        if (source === 'server') {
            fetch(song.url)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.blob();
                })
                .then(blob => {
                    jsmediatags.read(blob, {
                        onSuccess: function (tag) {
                            const tags = tag.tags;
                            playerTitle.textContent = tags.title || 'Unknown Title';
                            playerArtist.textContent = tags.artist || 'Unknown Artist';

                            if (tags.picture) {
                                const { data, format } = tags.picture;
                                const byteArray = new Uint8Array(data);
                                const imageBlob = new Blob([byteArray], { type: format });
                                const imageUrl = URL.createObjectURL(imageBlob);
                                playerCover.src = imageUrl;
                            } else {
                                playerCover.src = 'default-cover.png'; // fallback cover image path if you want
                            }

                            updateActiveUI();
                            enableControls();
                        },
                        onError: function (error) {
                            console.error('Failed to read tags:', error);
                            playerTitle.textContent = 'Unknown Title';
                            playerArtist.textContent = 'Unknown Artist';
                            playerCover.src = 'default-cover.png'; // fallback cover
                            updateActiveUI();
                            enableControls();
                        }
                    });
                })
                .catch(err => {
                    console.error('Failed to fetch track for metadata:', err);
                    playerTitle.textContent = 'Unknown Title';
                    playerArtist.textContent = 'Unknown Artist';
                    playerCover.src = 'default-cover.png'; // fallback cover
                    updateActiveUI();
                    enableControls();
                });
        } else {
            // For 'local' source, assume metadata is already in localTracks
            playerTitle.textContent = song.title || 'Unknown Title';
            playerArtist.textContent = song.artist || 'Unknown Artist';
            playerCover.src = song.coverSrc || 'default-cover.png';

            updateActiveUI();
            enableControls();
        }
    }








    function playTrack() {
        isPlaying = true;
        audioPlayer.play();
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    }

    function pauseTrack() {
        isPlaying = false;
        audioPlayer.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    }

    function togglePlayPause() {
        if (currentTrack.index === -1) return;
        isPlaying ? pauseTrack() : playTrack();
    }

    function playNext() {
        if (currentTrack.source === null) return;
        const playlist = (currentTrack.source === 'local') ? localTracks : serverSongs;
        const nextIndex = (currentTrack.index + 1) % playlist.length;
        loadTrack(nextIndex, currentTrack.source);
        playTrack();
    }

    function playPrev() {
        if (currentTrack.source === null) return;
        const playlist = (currentTrack.source === 'local') ? localTracks : serverSongs;
        const prevIndex = (currentTrack.index - 1 + playlist.length) % playlist.length;
        loadTrack(prevIndex, currentTrack.source);
        playTrack();
    }

    function updateProgress() {
        if (audioPlayer.duration) {
            const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progress.style.width = `${progressPercent}%`;
            durationEl.textContent = formatTime(audioPlayer.duration);
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        }
    }

    function setProgress(e) {
        if (currentTrack.index === -1) return;
        const width = this.clientWidth;
        const clickX = e.offsetX;
        if (audioPlayer.duration) {
            audioPlayer.currentTime = (clickX / width) * audioPlayer.duration;
        }
    }

    function updateActiveUI() {
        // Deselect all
        document.querySelectorAll('.song-card.playing').forEach(el => el.classList.remove('playing'));
        document.querySelectorAll('.track-item.active-track').forEach(el => el.classList.remove('active-track'));

        if (currentTrack.source === 'server') {
            const activeCard = document.querySelector(`.song-card[data-index='${currentTrack.index}']`);
            if (activeCard) activeCard.classList.add('playing');
        } else if (currentTrack.source === 'local') {
            const activeTrack = document.querySelector(`.track-item[data-index='${currentTrack.index}']`);
            if (activeTrack) activeTrack.classList.add('active-track');
        }
    }

    function enableControls() {
        playPauseBtn.disabled = false;
        nextBtn.disabled = false;
        prevBtn.disabled = false;
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // --- EVENT LISTENERS ---
    playPauseBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', playNext);
    progressBar.addEventListener('click', setProgress);

    // --- INITIALIZE ---
    loadServerSongs();
});