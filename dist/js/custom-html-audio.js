/*! custom-html-audio - v1.0.0 - 2017-11-24 
 *  A custom html5 audio wrapper, that allows styling and functional changes.
 */

"use strict";!function(e,n){"object"==typeof module&&module.exports?module.exports=n():"function"==typeof define&&define.amd?define([],n):e.CustomHtmlAudio=n()}(this,function(){var e=function(e,n){console[n||"info"]("[custom-html-audio.js] %o",e)};return function(n,o){var d,i,t,r,a,s,l={playing:!1,end:1,loaded:0,currentTime:0},c=function(e){for(var n in e)l[n]=e[n];p()},u=function(e){e=Math.round(e);var n=Math.floor(e/60),o=e-60*n;return n.toFixed()+":"+(o<10?"0":"")+o.toFixed()},p=function(){d.classList[l.playing?"add":"remove"]("playing"),r.innerHTML=u(l.currentTime),a.innerHTML=u(l.end),i.style.width=l.loaded/l.end*100+"%",t.style.width=l.currentTime/l.end*100+"%"};o&&o.src?((s=document.createElement("audio")).src=o.src,s.style.display="none",s.addEventListener("pause",function(){c({playing:!1})}),s.addEventListener("play",function(){c({playing:!0})}),s.addEventListener("ended",function(){c({playing:!1})}),s.addEventListener("error",function(){c({playing:!1})}),s.addEventListener("loadedmetadata",function(){c({currentTime:s.currentTime,loaded:s.buffered.end(0),end:s.seekable.end(0)})}),s.addEventListener("timeupdate",function(){c({currentTime:s.currentTime,loaded:s.buffered.end(0),end:s.seekable.end(0)})}),n.innerHTML='<div class="audio-controls"><div class="audio-controls__play"></div><div class="audio-controls__text"><span class="audio-controls__currentTime"></span><span class="audio-controls__end"></span></div><div class="audio-controls__time"><div class="audio-controls__loaded"></div><div class="audio-controls__played"></div></div><div class="audio-controls__noise"></div></div>',n.appendChild(s),d=n.querySelector(".audio-controls__play"),i=n.querySelector(".audio-controls__loaded"),t=n.querySelector(".audio-controls__played"),r=n.querySelector(".audio-controls__currentTime"),a=n.querySelector(".audio-controls__end"),d.addEventListener("click",function(){c({playing:!l.playing}),s[l.playing?"play":"pause"]()})):e("src for audio is not defined","error")}});