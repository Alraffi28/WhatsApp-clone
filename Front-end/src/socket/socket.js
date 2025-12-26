import {io} from "socket.io-client";
const socket = io("https://whatsapp-clone-uh55.onrender.com" , {
    transports : ["websocket" , "polling"],
    withCredentials : true
})
export default socket