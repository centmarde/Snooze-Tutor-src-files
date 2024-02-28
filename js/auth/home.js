import {doLogout,supabase,successNotification,errorNotification} from "../main";


// Assign Logout Functionality
const userId = localStorage.getItem("user_id");

const btn_logout = document.getElementById("btn_logout");
btn_logout.onclick = doLogout;   

//function initialize for navbar dynamic name
getDatas();

//navbar dynamic name
async function getDatas() {
    let { data: user_information, error } = await supabase
    .from('user_information')
    .select('*')
    .eq('id', userId);
    let container = "";
    user_information.forEach((user_info) => {
        container += `<h4 class="mt-2" data-id="${user_info.username}">Good Day! ${user_info.username}</h4>`;
    });
   
    // Assuming you have a container in your HTML with an id, for example, "userContainer"
    document.getElementById("userContainer").innerHTML = container;
}

form_modal.onsubmit = async (e) => {
    e.preventDefault();
    document.querySelector("#form_modal button").disabled = true;
    document.querySelector(
        "#form_modal button" //logout button script
    ).innerHTML = `<span>Loading...</span>`;


    // Modal Close
    document.getElementById("modal_close").click();

    // Reset Form
    form_item.reset();

    // Enable Submit Button
    document.querySelector("#form_item button[type='submit']").disabled = false;
    document.querySelector(
        "#form_modal button[type='submit']"
    ).innerHTML = `Submit`;
};

