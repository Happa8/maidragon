importScripts("./jsgif/LZWEncoder.js", "./jsgif/NeuQuant.js", "./jsgif/GIFEncoder.js");

const encoder = new GIFEncoder();

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
      postMessage(encode64(encoder.stream().getData()));
      break;
	}
})
