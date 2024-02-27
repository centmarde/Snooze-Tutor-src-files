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

