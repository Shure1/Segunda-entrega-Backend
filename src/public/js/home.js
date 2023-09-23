const socket = io();
const form = document.getElementById("idForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const datForm = new FormData(e.target);
  const user = Object.fromEntries(datForm);
  socket.emit("usuario", user);
});
