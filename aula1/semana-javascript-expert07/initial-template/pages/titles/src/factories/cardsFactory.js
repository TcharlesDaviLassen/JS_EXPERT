import CardsController from "./../controllers/cardsController.js"
import CardsView from "./../views/cardsView.js"
import CardsService from "./../services/cardsService.js"


// As factories tem a responsabilidade de inicializar o projeto
// Worker pede um arquivo
const cardListWorker = new Worker(`./src/workers/CardListWorker.js`, { type: "module" }) // Usando o type: "module"n consegue se usar o IMPORT e o EXPORT 

// Removed 
// cardListWorker.onmessage = (message) => {
//   console.log('processo principal: ' + message)
// }
// cardListWorker.postMessage("Heyy")

const [rootPath] = window.location.href.split('/pages/')
const factory = {
  async initalize() {
    return CardsController.initialize({ // CardsController que faz o intermedio
      view: new CardsView(), // CardsView é só responsavel pela tela

      service: new CardsService({
        dbUrl: `${rootPath}/assets/database.json`,
        cardListWorker
      })

    })
  }
}



export default factory