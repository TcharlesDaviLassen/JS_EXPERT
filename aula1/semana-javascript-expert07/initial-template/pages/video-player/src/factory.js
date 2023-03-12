import Camera from "./lib/shared/camera.js"
import { supportsWorkerType } from "./lib/shared/util.js"
import Controller from "./controller.js"
// import Service from "./service.js"
import View from "./view.js"
import Service from "./service.js"


async function getWorker() {

  if (supportsWorkerType()) {
    console.log("Worker type, suporta esm workers")
    const worker = new Worker('./src/worker.js', { type: 'module' })
    return worker;
  }

  // else {

  console.warn("Your browser doesn't support esm modules on webworkers!")
  console.warn("Import libraries...")

  await import("https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js")
  await import("https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js")
  await import("https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js")
  await import("https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js")

  console.warn("using worker mock instead!");
  const service = new Service({
    faceLandmarksDetection: window.faceLandmarksDetection
  });
  // Mock siginifca que o json-server, vai simular a criação de uma API 
  // pra que se consiga testar outros códigos sem ter que subir toda uma API real só pra isso.
  const workerMock = {
    async postMessage(video) {
      const blinked = await service.handBlinked(video);
      if (!blinked) { return }
      workerMock.onmessage({ data: { blinked } })

    },
    // vais ser sobreescrito p elo controller
    onmessage(msg) { }
  }
  console.log('loading tf model...')
  await service.loadModel();
  console.log('tf model loaded');

  // console.log("Worker type, não suporta")
  setTimeout(() => worker.onmessage({ data: 'successfully' }), 900);
  return workerMock;
  // }

}
const worker = await getWorker();


const camera = await Camera.init();
const [rootPath] = window.location.href.split('/pages/')
const factory = {
  async initalize() {
    return Controller.initialize({ // CardsController que faz o intermedio
      view: new View(), // CardsView é só responsavel pela tela
      // service: new Service(),
      camera,
      worker
    })
  }
}

export default factory