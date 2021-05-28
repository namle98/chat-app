const socket = io("http://localhost:5555")
const peer = new Peer()
// const Peer = require('peer')
// const uid = require('uid')
// function getPeer() {
//     const id = uid(10)
//     $("#peerid").append("<h4>ID: " + id + "</h4>")
//     return id
// }

// const config = {
//     host: 'localhost',
//     port: 5555,
//     path: '/myapp'
// }
// const peer = new Peer(getPeer(), config);

// socket.on('sendListUser', function(data){
    
// })



socket.on("serverSendInfoRoom", function(data){
    $("#info-room").append("<h4> Name room: " + data +"</h4>")
})

socket.on("sendChatFromServer", function(data){
    $("#view-chat").append("<h5> Name: " + data.user +"</h5>")
    $("#view-chat").append("<h5> Msg: " + data.msg +"</h5>")
})

socket.on("sendIdPeer", function(data){
    
})

$(document).ready(function(){

    peer.on('open', id => {
        $("#login").click(function(){
            socket.emit('createRoomAndUser', {userName:$("#userName").val(), room:$("#room").val(), idPeer: id})
            $("#userName").val("")
            $("#room").val("")
            $("#info").hide()
            $("#view-chat").show()
        
        })
    })

    $("#send").click(function(){
        socket.emit("sendChat", $("#inputMsg").val())
        $("#inputMsg").val("")
    })

    $("#endCall").hide()
    $("#call-video").hide()
    $(".call").click(function(){
        const id = $(".call").attr("id");
        openStream()
        .then( stream => {
            playVideo('local-stream', stream)
            const call = peer.call(id, stream)
            call.on("stream", remoteStream => playVideo('remote-stream', remoteStream))
        })
        $("#call-video").show()
        $("#endCall").show()
    })

    peer.on('call', call => {
        openStream()
        .then(stream => {
            call.answer(stream)
            playVideo('local-stream', stream)
            call.on("stream", remoteStream => playVideo('remote-stream', remoteStream))
            $("#call-video").show()
        })
    })

    // $("#endCall").click(function(){
    //     peer.destroy()
    // })

    const openStream = () => {
        const config = {video: true, audio: true}
        return navigator.mediaDevices.getUserMedia(config)
    }
    const closeStream = () => {
        const config = {video: false, audio: false}
        return navigator.mediaDevices.getUserMedia(config)
    }
    
    const playVideo = (idVideoTag, stream) => {
        const video = document.getElementById(idVideoTag)
        video.srcObject = stream
        video.play()
    }

    $("#view-chat").hide()

    // openStream().then(stream => playVideo('local-stream', stream))

})