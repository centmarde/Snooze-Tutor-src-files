import { supabase, successNotification, errorNotification } from "../main";

const form_login = document.getElementById("form_login");
const forgot_pass = document.getElementById("forgot_pass");

form_login.onsubmit = async (e) => {
    e.preventDefault();

    // Disable login button and show loading spinner
    document.querySelector("#login_button").disabled = true;
    document.querySelector("#login_button").innerHTML = `<div class="spinner-border spinner-border-sm me-2" role="status"></div><span>Loading...</span>`;
    const formData = new FormData(form_login);

    // Supabase sign-in
    let { data, error } = await supabase.auth.signInWithPassword({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    let session = data.session;
    let user = data.user;

    console.log(user);

    if (session != null) {
        // Store tokens for API
        localStorage.setItem("access_token", session.access_token);
        localStorage.setItem("refresh_token", session.refresh_token);

        // Save user id in local storage
        localStorage.setItem("auth_id", user?.id);

        // Fetch user profiles
        let { data: profiles, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", localStorage.getItem("auth_id"));

        localStorage.setItem("user_id", profiles[0].id);
        console.log(profiles[0].id);

        // Redirect to home page after successful login
        window.location.pathname = '/home.html';

        successNotification("Login Successfully", 10);
    } else {
        errorNotification("Error Please Try again or check your password", 10);
        console.log(error);
    }

    // Reset form and enable login button
    form_login.reset();
    document.querySelector("#form_login button").disabled = false;
    document.querySelector("#form_login button").innerHTML = "Log-in";
};

forgot_pass.onsubmit = async (e) => {
    e.preventDefault();

    // Disable submit button and show loading text
    document.querySelector("#forgot_pass button:nth-child(2)").disabled = true;
    document.querySelector("#forgot_pass button:nth-child(2)").innerHTML = `<span>Loading...</span>`;

    const email = forgot_pass.querySelector("#forgot_email").value;

    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);

        if (error === null) {
            successNotification("Password reset email sent successfully", 5);
            console.log(data);
        } else {
            errorNotification(`Error: ${error.message}`, 10);
            console.error(error);
        }
    } catch (error) {
        console.error("An unexpected error occurred:", error);
    }

    // Close modal, reset form, and enable submit button
    document.getElementById("modal_close").click();
    forgot_pass.reset();
    document.querySelector("#forgot_pass button[type='submit']").disabled = false;
    document.querySelector("#forgot_pass button[type='submit']").innerHTML = `Loading..`;
};

function randomize(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

document.addEventListener('DOMContentLoaded', function () {
    var lavender = document.getElementById('lavender');

    // Rotate and move the lavender element randomly
    setInterval(function () {
        lavender.style.transform = 'rotate(' + randomize(-5, 5) + 'deg)';
        lavender.style.left = randomize(-5, 5) + 'px';
    }, 3000); // Adjust the interval time as needed
});
