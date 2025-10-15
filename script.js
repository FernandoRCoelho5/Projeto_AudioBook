document.addEventListener('DOMContentLoaded', () => {
    // --- Dados dos Capítulos (Substitua pelos seus arquivos) ---
    const chapters = [
        { title: "Capítulo I: Do Título", duration: "03:45", file: "assets/audio/capitulo_01.mp3" },
        { title: "Capítulo II: Do Objeto", duration: "02:15", file: "assets/audio/capitulo_02.mp3" },
        { title: "Capítulo III: A Denúncia", duration: "04:30", file: "assets/audio/capitulo_03.mp3" },
        // Adicione todos os outros capítulos aqui...
    ];

    const chapterList = document.getElementById('chapter-list');
    chapters.forEach((chapter, index) => {
        const item = document.createElement('div');
        item.classList.add('chapter-item');
        item.dataset.index = index;
        item.innerHTML = `
            <div class="chapter-info">
                <span class="chapter-title">${chapter.title}</span>
            </div>
            <span class="chapter-duration">${chapter.duration}</span>
        `;
        chapterList.appendChild(item);
    });

    // --- Animação de Scroll ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // --- Player de Amostra ---
    const sampleAudio = document.getElementById('sample-audio');
    const playSampleBtn = document.getElementById('play-sample-btn');
    const sampleProgressBar = document.getElementById('sample-progress-bar');
    const sampleTime = document.getElementById('sample-time');

    playSampleBtn.addEventListener('click', () => {
        if (sampleAudio.paused) {
            sampleAudio.play();
            playSampleBtn.textContent = '❚❚';
        } else {
            sampleAudio.pause();
            playSampleBtn.textContent = '▶';
        }
    });

    sampleAudio.addEventListener('timeupdate', () => {
        const progress = (sampleAudio.currentTime / sampleAudio.duration) * 100;
        sampleProgressBar.style.width = `${progress}%`;
        
        let currentMinutes = Math.floor(sampleAudio.currentTime / 60);
        let currentSeconds = Math.floor(sampleAudio.currentTime % 60);
        sampleTime.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds} / 1:00`;
    });

    // --- Player Global ---
    const globalPlayer = document.getElementById('global-player');
    const mainAudio = document.getElementById('main-audio');
    const playGlobalBtn = document.getElementById('play-global-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const trackInfo = document.querySelector('#track-info span');
    const globalProgressBar = document.getElementById('global-progress-bar');
    const closePlayerBtn = document.getElementById('close-player-btn');
    
    let currentTrackIndex = 0;
    let isPlayingAll = false;

    function loadTrack(index) {
        mainAudio.src = chapters[index].file;
        trackInfo.textContent = chapters[index].title;
        currentTrackIndex = index;
        updatePlayingChapterUI();
    }

    function playTrack() {
        globalPlayer.classList.add('show');
        mainAudio.play();
        playGlobalBtn.textContent = '❚❚';
    }

    function pauseTrack() {
        mainAudio.pause();
        playGlobalBtn.textContent = '▶';
    }

    function updatePlayingChapterUI() {
        document.querySelectorAll('.chapter-item').forEach(item => item.classList.remove('playing'));
        const currentChapterItem = document.querySelector(`.chapter-item[data-index='${currentTrackIndex}']`);
        if (currentChapterItem) {
            currentChapterItem.classList.add('playing');
        }
    }

    chapterList.addEventListener('click', (e) => {
        const chapterItem = e.target.closest('.chapter-item');
        if (chapterItem) {
            isPlayingAll = false;
            const index = parseInt(chapterItem.dataset.index);
            loadTrack(index);
            playTrack();
        }
    });

    document.getElementById('play-all-btn').addEventListener('click', () => {
        isPlayingAll = true;
        loadTrack(0);
        playTrack();
    });
    
    playGlobalBtn.addEventListener('click', () => {
        if (mainAudio.paused) {
            playTrack();
        } else {
            pauseTrack();
        }
    });

    nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % chapters.length;
        loadTrack(currentTrackIndex);
        playTrack();
    });

    prevBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + chapters.length) % chapters.length;
        loadTrack(currentTrackIndex);
        playTrack();
    });

    mainAudio.addEventListener('ended', () => {
        if (isPlayingAll) {
            nextBtn.click();
        } else {
            pauseTrack();
        }
    });
    
    mainAudio.addEventListener('timeupdate', () => {
        const progress = (mainAudio.currentTime / mainAudio.duration) * 100;
        globalProgressBar.style.width = `${progress}%`;
    });

    closePlayerBtn.addEventListener('click', () => {
        pauseTrack();
        globalPlayer.classList.remove('show');
        document.querySelectorAll('.chapter-item').forEach(item => item.classList.remove('playing'));
    });
    
    // --- Menu Mobile ---
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('#main-header nav');
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });
});