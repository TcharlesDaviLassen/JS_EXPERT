function supportsWorkerType() {
  let supports = false 
  const tester = {
    get type() { supports = true}
  }

  try {
    // blob:// como se fosse estar lendo um arquivo, como por exemplo com base64
    new Worker('blob://', tester).terminate()
  } finally {
    return supports
  }
}

function prepareRunChecker({ timerDelay }) {
  let lastEvent = Date.now()
  return {
    shouldRun() {
      const result = (Date.now() - lastEvent) > timerDelay
      if(result) lastEvent = Date.now()

      return result
    }
  }
}

export {
  supportsWorkerType,
  prepareRunChecker
}