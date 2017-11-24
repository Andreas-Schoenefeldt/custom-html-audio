
var audio = document.getElementById('audio');

var customAudio = new CustomHtmlAudio(audio, {
    src: "SampleAudio.mp3"
});

new CustomHtmlAudio(document.getElementById('audio2'), {
    src: "SampleAudio.mp3"
});
