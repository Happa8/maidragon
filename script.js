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

context.textAlign = "center";
context.font = "80px cinecaption"
context.fillText("", 0, 0)

function encode64(input) {
	var output = "", i = 0, l = input.length,
	key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", 
	chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	while (i < l) {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if (isNaN(chr2)) enc3 = enc4 = 64;
		else if (isNaN(chr3)) enc4 = 64;
		output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
	}
	return output;
}

$form.addEventListener("submit", e =>{
  e.preventDefault();
  worker.postMessage({cmd: "start"});
  context.fillStyle = "#9dc26d";
  context.fillRect(0, 0, $renderer.width, $renderer.height);
  context.fillStyle = "#000"
  context.fillText($inputText.value, 640, 234, 850);
  const background = context.getImageData(
    0, 0, $renderer.width, $renderer.height);
  location.hash = "progress";

  Promise.all(Array.from(new Array(42))
    .map((v, i) =>
      `frames/${('00' + (i + 2)).slice(-3)}.png`)
    .map(url => new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = e => rej(e);
      img.src = url;
    })))
    .then(imgs => imgs.forEach(img =>{
      context.putImageData(background, 0, 0);
      context.drawImage(img, 0, 0);
      worker.postMessage({
        cmd: 'frame',
        data: context.getImageData(
          0, 0, $renderer.width, $renderer.height).data
      });
    }))
    .then(() =>
      worker.postMessage({ cmd: 'finish' }));
});

worker.onmessage = function (e) {
  $deliverable.src = 'data:image/gif;base64,' + encode64(e.data);
};
