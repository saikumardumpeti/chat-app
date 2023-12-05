const socket = io('http://localhost:8000');

const form = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageContainer = document.querySelector(".message-container");

var audio = new Audio('ting.mp3');


const append = (message, position) => {
    console.log(message)
    let messageElement = document.createElement('div');
    messageElement.innerText = message;

    messageElement.classList.add('message');
    messageElement.classList.add(position);

    if (position === 'center') {
        messageElement.classList.add('center');
    }
    if (position === "left"){
        audio.play();
    }

    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}
let name = prompt("Enter Your Name");

socket.emit('new-user-joined', name);

socket.on('user-joined', name => {
    append(`${name} joined the chat`, "center" )
})

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
})
socket.on('left', data => {
    append(`${data}: left the chat`, 'center')
})

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const message = messageInput.value;
    if (message !== '') {
        append(`You: ${message}`, 'right')
        socket.emit('send', message);
        messageInput.value = ''; 
    }
});


document.getElementById("hamburger-icon").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("show");
});

document.getElementById("clear-chat").addEventListener("click", function() {
    document.getElementById("message-container").innerHTML = "";
    document.getElementById("sidebar").classList.remove("show");
});