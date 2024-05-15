import { supabase, successNotification, errorNotification } from "../main";

const form_register = document.getElementById("form_register");

form_register.onsubmit = async (e) => {
  e.preventDefault();

  //button for IDLE request
  document.querySelector("#form_register button").disabled = true;
  document.querySelector(
    "#form_register button"
  ).innerHTML = `<div class="spinner-border me-2" role="status">
                      </div>
                      <span>Loading...</span>`;

  //password initialization for comparing
  const formData = new FormData(form_register);
  const password = formData.get("password");
  const confirmPassword = formData.get("password_confirm");

  if (formData.get("password") == formData.get("password_confirm")) {
    //supabase log-in
    const { data, error } = await supabase.auth.signUp({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    let user_id = data?.user?.id;

    if (user_id != null) {
      //getting the info
      const { data, error } = await supabase
        .from("profiles")
        .insert([
          {
            username: formData.get("username"),
            user_id: user_id,
          },
        ])
        .select();

      //if succes registration condition
      if (error == null) {
        successNotification(
          "Register Successfully please verify your email. <a href = './login.html'>Click Here!</a>",
          10
        );
        console.log(data);
        console.log(error);
      } else {
        Toastify({
          text: `Error: ${error.message}`,
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          className: "centered-toast",
          onClick: function () {}, // Callback after click
        }).showToast();
      }
      form_register.reset();
      //button loading after succes registration
      document.querySelector("#form_register button").disabled = false;
      document.querySelector("#form_register button").innerHTML = "Register";
    } else {
      Toastify({
        text: `Error: ${error.message}`,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        className: "centered-toast",
        onClick: function () {}, // Callback after click
      }).showToast();
    }
  } else {
    //button loading after password dont match
    errorNotification("Password not match", 10);
    document.querySelector("#form_register button").disabled = false;
    document.querySelector("#form_register button").innerHTML = "Register";
  }
};
document
document.getElementById('togglePassword1').addEventListener('click', function () {
    togglePasswordVisibility('floatingPass', 'togglePassword1');
});

document.getElementById('togglePassword2').addEventListener('click', function () {
    togglePasswordVisibility('password_confirm', 'togglePassword2');
});

function togglePasswordVisibility(inputId, iconId) {
    var passField = document.getElementById(inputId);
    var icon = document.getElementById(iconId);

    if (passField.type === 'password') {
        passField.type = 'text';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    } else {
        passField.type = 'password';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    }
}
