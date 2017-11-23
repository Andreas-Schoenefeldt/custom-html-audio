'use strict';
(function (root, factory) {
    // https://github.com/umdjs/umd/blob/master/returnExports.js
    if (typeof module === 'object' && module.exports) {
        // Node
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.CustomHtmlAudio = factory();
    }
}(this, function() {

    /**
     *
     * @param message
     * @param [level=info]
     */
    var debug = function(message, level) {
            console[level || 'info']('[custom-html-audio.js] %o', message);

        },

        template = '<div class="audio-controls">' +
            '<div class="audio-controls__play"></div>' +
            '<div class="audio-controls__time">' +
                '<div class="audio-controls__loaded"></div>' +
                '<div class="audio-controls__played"></div>' +
            '</div>' +
            '<div class="audio-controls__text">' +
                '<span class="audio-controls__currentTime"></span>' +
                '<span class="audio-controls__end"></span>' +
            '</div>' +
            '<div class="audio-controls__noise"></div>' +
        '</div>',

        CLASS_PLAYER_PLAYING = 'playing'


    ;

    /**
     * @param {Node} audio
     * @param {Object} options
     */
    return function(container, options) {
        var playBtn,
            loaded,
            played,

            textCurrent,
            textEnd,

            audio,

            state = {
                playing: false,
                end: 1,
                loaded: 0,
                currentTime: 0
            },

            /**
             *
             * @param {Object} newState
             */
            changeState = function(newState) {
                for (var prop in newState) {
                    state[prop] = newState[prop];
                }

                render();
            },

            togglePlay = function () {
                changeState({playing: !state.playing});
                audio[state.playing ? 'play' : 'pause']();
            },

            getTimeString = function (seconds) {
                seconds = Math.round(seconds);

                var mins = Math.floor(seconds / 60);
                var secs = seconds - (mins * 60);

                return mins.toFixed() + ':' + (secs < 10 ? '0' : '' ) + secs.toFixed();
            },

            /**
             * sets all the classes and layouts according to the current state
             */
            render = function () {

                // play button
                playBtn.classList[state.playing ? 'add' : 'remove'](CLASS_PLAYER_PLAYING);

                textCurrent.innerHTML = getTimeString(state.currentTime);
                textEnd.innerHTML = getTimeString(state.end);

                loaded.style.width = (state.loaded / state.end * 100) + '%';
                played.style.width = (state.currentTime / state.end * 100) + '%';
            }
        ;

        if (options && options.src) {
            audio = document.createElement('audio');
            audio.src = options.src;
            audio.style.display = 'none';

            // initialize events
            // thx to https://developer.mozilla.org/de/docs/Web/Guide/Events/Media_events
            audio.addEventListener('pause', function(){ changeState({ playing: false }); });
            audio.addEventListener('play', function(){ changeState({ playing: true }); });
            audio.addEventListener('ended', function(){ changeState({ playing: false });  });
            audio.addEventListener('error', function(){ changeState({ playing: false });  });

            audio.addEventListener('loadedmetadata', function(){
                changeState({currentTime: audio.currentTime, loaded: audio.buffered.end(0), end: audio.seekable.end(0)});
            });

            audio.addEventListener('timeupdate', function(){
                changeState({currentTime: audio.currentTime, loaded: audio.buffered.end(0), end: audio.seekable.end(0)});
            });

            // we add the markup
            container.innerHTML = template;

            container.appendChild(audio);

            playBtn = container.querySelector('.audio-controls__play');
            loaded = container.querySelector('.audio-controls__loaded');
            played = container.querySelector('.audio-controls__played');
            textCurrent = container.querySelector('.audio-controls__currentTime');
            textEnd = container.querySelector('.audio-controls__end');


            playBtn.addEventListener('click', togglePlay);
        } else {
            debug('src for audio is not defined', 'error');
        }

    }

}));