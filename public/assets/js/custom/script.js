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

function ShowAlert(postId) {
  Swal.fire({
      title: '¿Seguro que quieres eliminar esta publicación?',
      text: "Una vez eliminada no podrás recuperla.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      reverseButtons: true
  }).then((result) => {
      if (result.isConfirmed) {
          Swal.fire(
              '¡Eliminada!',
              'Tu publicación ha sido eliminada satisfactoriamente.',
              'success'
          )

          setTimeout(() => {
              let form = document.createElement('form');
              form.action = '/delete-post';
              form.method = 'POST';
              form.innerHTML = `<input type="hidden" value="${postId}" name="PostId">`;
              document.body.append(form);
              form.submit();
          }, 2000);
      }
  })
}


