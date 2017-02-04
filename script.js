const $ = (id) => document.getElementById(id);

const $form = $("post");
const $fromText = $("fromText");
const $inputText = $("inputText");
const $fromImage = $("fromImage");
const $inputImage = $("inputImage");

const $renderer = $("renderer");

const $deliverable = $("deliverable");
const $copy = $("copy");
const $download = $("download");

const context = $renderer.getContext("2d");

const worker = new Worker("worker.js");


