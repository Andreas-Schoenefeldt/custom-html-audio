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
            '<div class="audio-controls__text">' +
                '<span class="audio-controls__currentTime"></span>' +
                '<span class="audio-controls__end"></span>' +
            '</div>' +
            '<div class="audio-controls__time">' +
                '<div class="audio-controls__loaded"></div>' +
                '<div class="audio-controls__seeking"></div>' +
                '<div class="audio-controls__played"></div>' +
            '</div>' +
            '<div class="audio-controls__noise"></div>' +
        '</div>',

        CLASS_PLAYER_PLAYING = 'playing'


    ;

    /**
     * Many thanks to http://html5doctor.com/html5-audio-the-state-of-play/
     *
     * @param {Node} audio
     * @param {Object} options
     */
    return function(container, options) {
        var playBtn,
            playTime,
            loaded,
            played,
            seeking,

            textCurrent,
            textEnd,

            audio,

            state = {
                playing: false,
                end: 1,
                loaded: 0,
                seeking: 0,
                currentTime: 0
            },

            /**
             *
             * @param {Object} newState
             */
            changeState = function(newState) {
                var changed = false;
                for (var prop in newState) {
                    if (newState[prop] !== state[prop]) {
                        state[prop] = newState[prop];
                        changed = true;
                    }
                }

                if (changed) {
                    render();
                }
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

            getEnd = function () {
                return isFinite(state.end) ? state.end : Math.max(state.currentTime + 1, state.loaded);
            },

            getWidthPercent = function (e, el) {
                var width = el.offsetWidth;
                var clickPos = e.layerX;

                return clickPos / width * 100;
            },

            /**
             * sets all the classes and layouts according to the current state
             */
            render = function () {
                var theEnd = getEnd();

                // play button
                playBtn.classList[state.playing ? 'add' : 'remove'](CLASS_PLAYER_PLAYING);

                textCurrent.innerHTML = getTimeString(state.currentTime);
                textEnd.innerHTML =  isFinite(state.end) ? getTimeString(state.end) : '';

                loaded.style.width = (state.loaded / theEnd * 100) + '%';
                played.style.width = (state.currentTime / theEnd * 100) + '%';
                seeking.style.width = state.seeking + '%';
            }
        ;

        if (options && options.src) {
            audio = document.createElement('audio');

            // initialize events
            // thx to https://developer.mozilla.org/de/docs/Web/Guide/Events/Media_events
            audio.addEventListener('pause', function(){ changeState({ playing: false }); });
            audio.addEventListener('play', function(){ changeState({ playing: true }); });
            audio.addEventListener('ended', function(){ changeState({ playing: false });  });
            audio.addEventListener('error', function(){ changeState({ playing: false });  });

            ['loadedmetadata','progress', 'timeupdate', 'durationchange'].forEach( function(evt) {
                audio.addEventListener(evt, function(){
                    var newState = {
                        currentTime: audio.currentTime,
                        end: audio.duration
                    };

                    if (audio.buffered.length) {
                        newState.loaded = audio.buffered.end(audio.buffered.length - 1);
                    }

                    changeState(newState);
                }, false);
            });

            audio.src = options.src;
            audio.style.display = 'none';

            // we clean the container
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }

            // we add the markup
            container.innerHTML = template;

            container.appendChild(audio);

            playBtn = container.querySelector('.audio-controls__play');
            loaded = container.querySelector('.audio-controls__loaded');
            played = container.querySelector('.audio-controls__played');
            seeking = container.querySelector('.audio-controls__seeking');
            textCurrent = container.querySelector('.audio-controls__currentTime');
            textEnd = container.querySelector('.audio-controls__end');
            playTime = container.querySelector('.audio-controls__time');

            playTime.addEventListener('click', function (e) {
                audio.currentTime = getEnd() * getWidthPercent(e, this) / 100;
            });

            playTime.addEventListener('mousemove', function (e) { changeState({seeking:  getWidthPercent(e, this)}); });
            playTime.addEventListener('mouseenter', function (e) { changeState({seeking: getWidthPercent(e, this)}); });
            playTime.addEventListener('mouseleave', function () { changeState({seeking: 0}); });

            playBtn.addEventListener('click', togglePlay);
        } else {
            debug('src for audio is not defined', 'error');
        }

    }

}));