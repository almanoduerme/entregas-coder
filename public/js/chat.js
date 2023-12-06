const socket = io();

let user;
let chatBox = document.getElementById("chatBox");

Swal.fire({
  title: "Enter your name",
  input: "text",
  text: "Enter your name to join the chat",
  inputValidator: (value) => {
    return !value && "You need to write your name to join the chat!";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;

  socket.emit("newUser", user);
});

socket.on("alert", (data) => {
  Swal.fire({
    text: "New user joined the chat",
    toast: true,
    position: "top-right",
  });
});

chatBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  let log = document.getElementById("messageLogs");
  let messages = "";

  data.forEach((message) => {
    messages = messages + `${message.user} dice: ${message.message}<br/>`;
  });

  log.innerHTML = messages;
});
