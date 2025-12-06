const socket = io();

const form = document.getElementById("chat-form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

form.addEventListener("submit", e => {
  e.preventDefault();
  if (input.value.trim() !== "") {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

socket.on("chat message", msg => {
  const li = document.createElement("li");
  li.textContent = msg;
  messages.appendChild(li);
});
