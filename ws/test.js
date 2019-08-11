websocket = new WebSocket("ws://localhost:8080", "echo-protocol")
const x = {
    d: {
        adad: {
            n: "a"
        }
    }
}
console.log(websocket.readyState)
websocket.onopen = () => {
    websocket.send(JSON.stringify(x))
    console.log(websocket.readyState)
}

websocket.onmessage = (event) => console.log(JSON.parse(event.data))