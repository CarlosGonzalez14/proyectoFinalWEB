function playVideo(videoId) {
    const video = document.getElementById(videoId);
    video.play();
}

function pauseVideo(videoId) {
    const video = document.getElementById(videoId);
    video.pause();
    video.currentTime = 0; 
}