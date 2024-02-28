import { supabase, successNotification, errorNotification} from "../main";
const form_register = document.getElementById("form_register");

form_register.onclick = async (e) => {
    e.preventDefault();
    document.querySelector("#form_register button").disabled = true;
    document.querySelector(
        "#form_register button" //logout button script
    ).innerHTML = `<span>Loading...</span>`;

    window.location.href = '/register.html';

    // Enable Submit Button
    document.querySelector("#form_register button[type='submit']").disabled = false;
    document.querySelector(
        "#form_register button[type='submit']"
    ).innerHTML = `Submit`;
};