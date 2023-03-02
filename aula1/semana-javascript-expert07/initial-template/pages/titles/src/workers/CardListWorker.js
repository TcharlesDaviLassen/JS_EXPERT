// O a camada de Workers tem a responsabilidade de resolve tudo o que é problema de CPU, o que tem em segundo plano.
onmessage = ({ data }) => {
    console.log("data", data)

    postMessage(
        {response: 'ok'}
    )
}