const musicList = [
    {
        id: 1,
        title: "빨간 운동화",
        link: "./music/01.mp3",
        cover: "./images/01.jpg",
    },
    {
        id: 2,
        title: "Never Ending Story",
        link: "./music/02.mp3",
        youtube: "https://www.youtube.com/embed/6J9ixwhDYSM?si=f6HA_KVWlOQsvuZM",
        cover: "./images/02.jpg",
    },
    {
        id: 3,
        title: "10월 4일",
        link: "./music/03.mp3",
        cover: "./images/03.jpg",
    },
    {
        id: 4,
        title: "Last Scene (Feat. 원슈타인)",
        link: "./music/04.mp3",
        cover: "./images/04.jpg",
    },
    {
        id: 5,
        title: "미인 (Feat. Balming Tiger)",
        link: "./music/05.mp3",
        youtube: "https://www.youtube.com/embed/l5Z1PBJLUss?si=EA-AXwN1J__SJS8k",
        cover: "./images/05.jpg",
    },
    {
        id: 6,
        title: "네모의 꿈",
        link: "./music/06.mp3",
        cover: "./images/06.jpg",
    },
];

window.addEventListener("DOMContentLoaded", () => {
    const img = document.getElementById("animatedImg");
    const main = document.querySelector("main");
    const imgWidth = 335;
    const imgHeight = 506;

    let hasMoved = false;

    function updateImagePosition() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const targetX = vw - imgWidth + 80 - vw / 2;
        const targetY = vh - imgHeight - vh / 2;

        img.style.transform = `translate(${targetX}px, ${targetY}px)`;
        img.style.opacity = "0.3";
    }

    setTimeout(() => {
        updateImagePosition();
        hasMoved = true;
    }, 2000);

    window.addEventListener("resize", () => {
        if (hasMoved) updateImagePosition();
    });

    img.addEventListener("transitionend", e => {
        if (
            (e.propertyName === "transform" || e.propertyName === "opacity") &&
            !main.classList.contains("visible")
        ) {
            main.classList.add("visible");
        }
    });

    // 모달 관련 요소
    const backdrop = document.getElementById("backdrop");
    const modal = document.getElementById("modal");
    const closeBtn = document.getElementById("closeModalBtn");
    const youtubeWrapper = document.getElementById("youtubeWrapper");
    const youtubeFrame = document.getElementById("youtubeFrame");
    const modalAudio = modal.querySelector(".modal-audio");
    const modalTitle = modal.querySelector(".modal-title");
    const currentTimeEl = modal.querySelector("#currentTime");
    const durationEl = modal.querySelector("#duration");
    const coverEl = modal.querySelector("#modal-cover");

    // 토글 버튼들
    const toggleYoutubeBtn = document.getElementById("toggleYoutube");
    const toggleAudioBtn = document.getElementById("toggleAudio");

    // 오디오 컨트롤 요소들
    const audioControls = modal.querySelector(".player-controls");
    const progressBarContainer = document.getElementById("progressBar");
    const timeInfo = modal.querySelector(".time-info");

    // 플레이어 버튼들 (추가 기능으로 사용 가능)
    const prevBtn = document.getElementById("prevBtn");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const nextBtn = document.getElementById("nextBtn");

    let currentIndex = 0;
    let isPlaying = false;

    // YouTube 플레이어 보이기
    function showYoutubePlayer() {
        youtubeWrapper.classList.remove("hidden");
        audioControls.style.display = "none";
        progressBarContainer.style.display = "none";
        timeInfo.style.display = "none";
        coverEl.style.display = "none";

        toggleYoutubeBtn.classList.add("active");
        toggleAudioBtn.classList.remove("active");

        // 오디오 일시정지
        modalAudio.pause();
    }

    // 오디오 플레이어 보이기
    function showAudioPlayer() {
        youtubeWrapper.classList.add("hidden");
        audioControls.style.display = "flex";
        progressBarContainer.style.display = "block";
        timeInfo.style.display = "flex";
        coverEl.style.display = "block";

        toggleAudioBtn.classList.add("active");
        toggleYoutubeBtn.classList.remove("active");

        // YouTube iframe 일시정지 (src 변경으로)
        const currentSrc = youtubeFrame.src;
        youtubeFrame.src = "";
        youtubeFrame.src = currentSrc;
    }

    // 토글 버튼 이벤트 리스너
    toggleYoutubeBtn.addEventListener("click", showYoutubePlayer);
    toggleAudioBtn.addEventListener("click", showAudioPlayer);

    // 시간 포맷 함수
    function formatTime(sec) {
        const minutes = Math.floor(sec / 60);
        const seconds = Math.floor(sec % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    // 재생시간 업데이트
    modalAudio.addEventListener("loadedmetadata", () => {
        durationEl.textContent = formatTime(modalAudio.duration);
        progressBar.max = Math.floor(modalAudio.duration);
    });

    modalAudio.addEventListener("timeupdate", () => {
        currentTimeEl.textContent = formatTime(modalAudio.currentTime);
        progressBar.value = Math.floor(modalAudio.currentTime);
    });

    // 프로그래스바 요소
    const progressBar = document.getElementById("progressBar");
    progressBar.addEventListener("input", () => {
        modalAudio.currentTime = progressBar.value;
    });

    // 재생/일시정지 토글 함수
    function togglePlayPause() {
        if (isPlaying) {
            modalAudio.pause();
        } else {
            modalAudio.play();
        }
    }

    modalAudio.addEventListener("play", () => {
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="ti ti-player-pause"></i>';
    });

    modalAudio.addEventListener("pause", () => {
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="ti ti-player-play"></i>';
    });

    // 음악 변경 함수
    function loadMusic(index) {
        if (index < 0) index = musicList.length - 1;
        if (index >= musicList.length) index = 0;
        currentIndex = index;

        if (!musicList[currentIndex].youtube) {
            toggleYoutubeBtn.style.display = "none";
        } else {
            toggleYoutubeBtn.style.display = "block";
            youtubeFrame.src = musicList[currentIndex].youtube;
        }

        coverEl.style.backgroundImage = `url("${musicList[currentIndex].cover}")`;
        modalAudio.src = musicList[currentIndex].link;
        modalTitle.textContent = musicList[currentIndex].title;
        modalAudio.load();
        progressBar.value = 0;
        currentTimeEl.textContent = "0:00";
        durationEl.textContent = "0:00";
    }

    // 이전, 다음 버튼 이벤트
    prevBtn.addEventListener("click", () => {
        loadMusic(currentIndex - 1);
        modalAudio.play();
    });

    nextBtn.addEventListener("click", () => {
        loadMusic(currentIndex + 1);
        modalAudio.play();
    });

    playPauseBtn.addEventListener("click", togglePlayPause);

    // 모달 열기/닫기
    function openModal(id) {
        const index = musicList.findIndex(m => m.id === Number(id));
        if (index === -1) return;

        const music = musicList[index];
        const hasYoutube = !!music.youtube;

        loadMusic(index);

        youtubeFrame.src = music.youtube || "";

        backdrop.style.display = "block";
        modal.style.display = "block";

        // show 클래스로 애니메이션 실행
        setTimeout(() => {
            backdrop.classList.add("show");
            modal.classList.add("show");
        }, 10);

        modalAudio.play().catch(err => console.log(err));
    }

    function closeModal() {
        backdrop.classList.remove("show");
        modal.classList.remove("show");
        backdrop.classList.add("fade-out");
        modal.classList.add("slide-down");
        showAudioPlayer();

        modalAudio.pause();

        // 애니메이션 종료 후 숨김 처리
        setTimeout(() => {
            backdrop.style.display = "none";
            modal.style.display = "none";

            backdrop.classList.remove("fade-out");
            modal.classList.remove("slide-down");
        }, 300);
    }

    // 버튼 클릭으로 모달 열기
    const openBtns = document.querySelectorAll(".open-modal-btn");
    openBtns.forEach(btn => {
        btn.addEventListener("click", e => {
            openModal(e.currentTarget.dataset.id);
        });
    });

    // 닫기 버튼과 백드롭 클릭 시 모달 닫기
    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);

    function updateProgressBar(value, max) {
        const percent = (value / max) * 100;
        progressBar.style.setProperty("--progress", `${percent}%`);
    }

    // 시간 업데이트시 프로그래스 바도 업데이트
    modalAudio.addEventListener("timeupdate", () => {
        currentTimeEl.textContent = formatTime(modalAudio.currentTime);
        progressBar.value = Math.floor(modalAudio.currentTime);
        updateProgressBar(modalAudio.currentTime, modalAudio.duration);
    });

    // 프로그래스바 조작시
    progressBar.addEventListener("input", e => {
        modalAudio.currentTime = e.target.value;
        updateProgressBar(e.target.value, e.target.max);
    });

    // 메타데이터 로드시 초기값 설정
    modalAudio.addEventListener("loadedmetadata", () => {
        durationEl.textContent = formatTime(modalAudio.duration);
        progressBar.max = Math.floor(modalAudio.duration);
        updateProgressBar(0, modalAudio.duration);
    });
});
