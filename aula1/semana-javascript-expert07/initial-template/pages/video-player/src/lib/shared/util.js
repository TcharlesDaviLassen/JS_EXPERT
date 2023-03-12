function supportsWorkerType() {
  let supports = false 
  const tester = {
    get type() { supports = true}
  }

  try {
    // blob:// como se fosse estar lendo um arquivo, como por exemplo com base64.
    new Worker('blob://', tester).terminate()
  } finally {
    return supports
  }
}

//  Condição para verificar se piscou e não ficar interpretando a todo momento quando estiver com os olhos fechados.
function prepareRunChecker({ timerDelay }) {
  let lastEvent = Date.now()
  return {
    shouldRun() {
      const result = (Date.now() - lastEvent) > timerDelay
      if(result) lastEvent = Date.now()

      console.log("RESULT => ",result)

      return result
    }
  }
}

export {
  supportsWorkerType,
  prepareRunChecker
}