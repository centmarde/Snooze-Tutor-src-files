import {
  doLogout,
  supabase,
  successNotification,
  errorNotification,
} from "../main";

const itemsImageUrl =
  "https://plsyfklzwmasyypcuwei.supabase.co/storage/v1/object/public/cards/";
// Assign Logout Functionality

const btn_logout = document.getElementById("btn_logout");
const userId = localStorage.getItem("user_id");

getDatas();

btn_logout.onclick = doLogout;

async function getDatas() {
  try {
    // Fetch user information
    let { data: profiles, error: userError } = await supabase
      .from("profiles") 
      .select("*")
      .eq("id", userId);

    //supabase cards Fetc
      let { data: cards1, error: cardError } = await supabase
      .from("cards")
      .select("*", { foreignTable: "UserCardCreation", foreignKey: "id", as: "UserCardCreation" })

    //randomer
      let randomIndex1 = Math.floor(Math.random() * cards1.length);
    
    //emptry containers
    let container = "";
    let cardImage1 = "";

    profiles.forEach((user_info) => {
      container += `<h4 class="mt-2" data-id="${user_info.username}">${user_info.username}'s  profile</h4>`;
    });

    //card layers
    if (cards1.length > randomIndex1) {
      const selectedRow = cards1[randomIndex1];
      cardImage1 += `<img class="block" src="${itemsImageUrl + selectedRow.card_image}" width="100%" height="360px">`;
    } else {
      console.log("Not enough rows in the result.");
    }


    //HTML connector
    document.getElementById("userContainer").innerHTML = container;
    document.getElementById("cardImage1").innerHTML = cardImage1;
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle error, show error notification, etc.
  }
}
