'use strict'

function delegateLaborTask() {
  const isWorkerSelected = document.querySelector('[name=useWebWorker]').checked
  const operationTimes = 1000000000

  showResults()

  isWorkerSelected
    ? useWebWorker(operationTimes)
    : useMainThread(operationTimes)
}

function workerScope() {
  const self = this

  function heavyOperation(operationTimes) {
    let result = 0
    while (operationTimes--) {
      result += Math.random()
    }
    return result
  }

  self.addEventListener('message', event => {
    let result = heavyOperation(event.data)
    self.postMessage(result)
  })

  return heavyOperation
}

function getWorkerAsString(worker) {
  return `( ${worker} )()`
}

function getBlobWoker() {
  const worker = getWorkerAsString(workerScope)
  const blob = new Blob([worker])
  const blobURL = URL.createObjectURL(blob, {
    type: 'application/javascript; charset=UTF-8'
  })
  return blobURL
}

function useWebWorker(operationTimes) {
  const worker = new Worker(getBlobWoker())
  worker.addEventListener('message', event => {
    showResults(event.data)
    worker.terminate()
  })
  worker.postMessage(operationTimes)
}

function useMainThread(operationTimes) {
  const heavyOperation = workerScope()
  const result = heavyOperation(operationTimes)
  showResults(result)
}

function showResults(result) {
  const output = document.getElementById('output')
  output.textContent = result ? `received: ${result}` : ''
}

const button = document.querySelector('button')
button.addEventListener('click', delegateLaborTask)
