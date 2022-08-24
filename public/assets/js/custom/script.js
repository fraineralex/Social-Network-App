const body = document.querySelector("body"),
  sidebar = body.querySelector("nav"),
  toggle = body.querySelector(".toggle"),
  searchBtn = body.querySelector(".search-box"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text");

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    modeText.innerText = "Light mode";
  } else {
    modeText.innerText = "Dark mode";
  }
});

function ShowAlert(postId, csrfToken) {
  Swal.fire({
    title: "¿Seguro que quieres eliminar esta publicación?",
    text: "Una vez eliminada no podrás recuperla.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Eliminar",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        "¡Eliminada!",
        "Tu publicación ha sido eliminada satisfactoriamente.",
        "success"
      );

      setTimeout(() => {
        let form = document.createElement("form");
        form.action = "/delete-post";
        form.method = "POST";
        form.innerHTML = `<input type="hidden" value="${postId}" name="PostId"> <input type="hidden" name="_csrf" value="${csrfToken}">`;
        document.body.append(form);
        form.submit();
      }, 2000);
    }
  });
}

function DeleteConfirm(id, item, title, successMessage) {
  Swal.fire({
    title: `¿${title}?`,
    text: "Una vez se ha eliminado no se podrá recuperar.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Eliminar",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Listo!", `${successMessage}.`, "success");

      setTimeout(() => {
        let form = document.createElement("form");
        form.action = `/delete-${item}/${id}`;
        form.method = "GET";
        document.body.append(form);
        form.submit();
      }, 2000);
    }
  });
}

function TDate() {
  var UserDate = document.getElementById("userdate").value;
  var ToDate = new Date();
  console.log(ToDate.toISOString());
  if (new Date(UserDate).toISOString() <= ToDate.toISOString()) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Debe escoger una fecha y hora superior a la actual",
    });
    return false;
  }
  return true;
}
