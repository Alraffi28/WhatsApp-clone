import {io} from "socket.io-client";
const socket = io("https://whatsapp-clone-uh55.onrender.com" , {
    transports : ["websocket"]
})
export default socket