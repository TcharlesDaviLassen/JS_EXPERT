export default class Controller {
    #view
    #camera
    #worker
    // #service
    #blinkedCounter = 0;

    constructor({ view, camera, worker }) {
        this.#view = view;
        this.#camera = camera;
        // this.#service = service;
        this.#worker = this.#configureWorker(worker);

        this.#view.configureOnBtnClick(this.onBtnStart.bind(this));// bind usado para referenciar ao controller e não a view
    }

    static async initialize(deps) {
        const controller = new Controller(deps);
        controller.log('Not yet detecting eye blink! click in the button to start');

        return controller.init();
    }

    #configureWorker(worker) {
        let ready = false;
        worker.onmessage = ({ data }) => {
            if ('successfully' === data) {
                console.log("ok recebido ", "dados retornados do Worker postMessage => ", { data })
                this.#view.enableButton()
                ready = true
                return
            }

            const blinked = data.blinked
            this.#blinkedCounter += blinked;
            this.#view.togglePLayVideo();
            console.log("blinked", blinked)
        }

        return {
            send(msg) {
                if (!ready) { return };
                worker.postMessage(msg);
            }
        }
    }

    async init() {
        console.log("Controller")
    }

    loop() {
        const video = this.#camera.video;
        const img = this.#view.getVideoFrame(video);
        this.#worker.send(img);
        this.log('detecting eye blink...');

        setTimeout(() => this.loop(), 300);

    }

    log(text) {
        const times = `     -blinked times: ${this.#blinkedCounter}`
        this.#view.log(`status: ${text}`.concat(this.#blinkedCounter ? times : ""));
    }

    onBtnStart() {
        this.log("initializing detection...");
        this.#blinkedCounter = 0;
        this.loop();
    }
}