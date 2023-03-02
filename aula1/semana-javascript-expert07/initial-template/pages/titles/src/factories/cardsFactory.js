import CardsController from "./../controllers/cardsController.js"
import CardsView from "./../views/cardsView.js"
import CardsService from "./../services/cardsService.js"
const [rootPath] = window.location.href.split('/pages/')

// As factories tem a responsabilidade de inicializar o projeto
const cardListWorker = new Worker(`./src/workers/CardListWorker.js`, {type: "module"}) // Usando o type: "module"n consegue se usar o IMPORT e o EXPORT 

cardListWorker.onmessage = (message) => {
  console.log('processo principal: ' + message)
}

cardListWorker.postMessage("Heyy")

const factory = {
  async initalize() {
    return CardsController.initialize({ // CardsController que faz o intermedio
      worker: cardListWorker,
      view: new CardsView(), // CardsView é só responsavel pela tela
      service: new CardsService({ dbUrl: `${rootPath}/assets/database.json` })
    })
  }
}

export default factory