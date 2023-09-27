const form = document.getElementById("idForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datForm = new FormData(e.target);
  const user = Object.fromEntries(datForm);

  try {
    const response = await fetch("/api/sessions/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (response.status === 401) {
      // Manejar el caso de contraseña no válida
      const data = await response.json();
      console.error(data.resultado);
    } else if (response.status === 404) {
      // Manejar el caso de usuario no encontrado
      const data = await response.json();
      console.error(data.resultado);
    } else {
      // Manejar otros casos, como errores de servidor
      console.error("Error en el inicio de sesión");
    }
  } catch (error) {
    console.log("error al iniciar sesion", error);
  }
});
