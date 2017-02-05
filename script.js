const $ = (id) => document.getElementById(id);

const $form = $("post");
const $inputTitle = $("inputTitle");
const $inputNumbering = $("inputNumbering");

const $renderer = $("renderer");

const $status = $("status")

const $deliverable = $("deliverable");

const context = $renderer.getContext("2d");

const worker = new Worker("worker.js");

let count;

context.textAlign = "center";
context.font = "50px cinecaption"
context.fillText("", 0, 0)

$form.addEventListener("submit", e =>{
  e.preventDefault();
  count = 0;
  $status.innerText = "背景画像をレンダリング中…";
  worker.postMessage({cmd: "start"});
  context.fillStyle = "#9dc26d";
  context.fillRect(0, 0, $renderer.width, $renderer.height);
  context.fillStyle = "#000"
  context.font = "50px cinecaption"
  context.fillText($inputNumbering.value, 640, 270, 600);
  context.font = "60px cinecaption"
  context.fillText($inputTitle.value, 640, 350, 850);
  const background = context.getImageData(
    0, 0, $renderer.width, $renderer.height);

  $status.innerText = "フレームの画像をロード中…";

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
    .then(() =>{
      worker.postMessage({ cmd: 'finish' })
    });
});

worker.onmessage = ({data:{done, data}}) => {
  if(done){
    $status.innerText = "完了。画像を右クリック/ドラッグアンドドロップで保存できます。";
    const url = 'data:image/gif;base64,' + data;
    $deliverable.src = url;
  } else {
    count++;
    $status.innerText = `42フレーム中${count}フレームレンダリング中……`;
  }
};
