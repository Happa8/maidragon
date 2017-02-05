importScripts("./jsgif/LZWEncoder.js", "./jsgif/NeuQuant.js", "./jsgif/GIFEncoder.js");

const encoder = new GIFEncoder();

self.addEventListener("message", ({data}) => {
  console.log(data.cmd);
  switch(data.cmd){
    case "start":
      encoder.setRepeat(0);
      encoder.setDelay(10);
      encoder.setSize(1280, 720);

      encoder.start();
      break;
    case "frame":
      encoder.addFrame(data.data, true);
      break;
    case "finish":
      encoder.finish();
      postMessage(encoder.stream().getData());
      break;
	}
})
