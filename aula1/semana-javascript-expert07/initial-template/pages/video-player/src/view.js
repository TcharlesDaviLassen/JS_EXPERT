export default class View {
    #btnInit = document.querySelector('#init');
    #btnStatus = document.querySelector('#status');
    #videoFrameCanvas = document.createElement('canvas');
    #canvasContext = this.#videoFrameCanvas.getContext('2d', { willReadFrequently: true });
    #videoElement = document.querySelector('#video');

    // Transformando um video em uma imagem
    getVideoFrame(video) {
        const canvas = this.#videoFrameCanvas;
        const [width, height] = [video.videoWidth, video.videoHeight];

        canvas.width = width;
        canvas.height = height;

        this.#canvasContext.drawImage(video, 0, 0, width, height);

        return this.#canvasContext.getImageData(0, 0, width, height);
    }

    togglePLayVideo() {
        if (this.#videoElement.paused) {
            this.#videoElement.play()

            return
        }

        this.#videoElement.pause();
    }


    enableButton() {
        this.#btnInit.disabled = false;
    }

    configureOnBtnClick(fn) {
        this.#btnInit.addEventListener('click', fn);
    }

    log(text) {
        this.#btnStatus.innerHTML = text;
    }

}