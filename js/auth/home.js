import {
  doLogout,
  supabase,
  successNotification,
  errorNotification,
} from "../main";

const itemsImageUrl =
  "https://plsyfklzwmasyypcuwei.supabase.co/storage/v1/object/public/profilePic/";
// Assign Logout Functionality

const userId = localStorage.getItem("user_id");
const form_item = document.getElementById("form_item");
const btn_logout = document.getElementById("btn_logout");
const form_search = document.getElementById('form_search');


btn_logout.onclick = doLogout;

//function initialize for navbar dynamic name
getDatas();
getQuestions();


//navbar dynamic name
async function getDatas() {
  let { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId);
  let container = "";
  profiles.forEach((user_info) => {
    container += `<h4 class="mt-2" data-id="${user_info.username}">Good Day! ${user_info.username}</h4>`;
  });

  // Assuming you have a container in your HTML with an id, for example, "userContainer"
  document.getElementById("userContainer").innerHTML = container;
}
let for_update_id = "";
//setquestions


form_search.onsubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData(form_search);
  getQuestions(formData.get("keyword"))
  document.getElementById("modal_close_search").click();
  form_search.reset();
}

form_item.onsubmit = async (e) => {
  e.preventDefault();
  // Disable Button
  document.querySelector("#form_item button[type='submit']").disabled = true;
  document.querySelector("#form_item button[type='submit']").innerHTML = `
                  <span>Loading...</span>`;

  const formData = new FormData(form_item);

  // Supabase Image Upload

  /* update */
  if (for_update_id == "") {
    const { data: questions, error } = await supabase
      .from("questions")
      .insert([
        {
          tittle: formData.get("tittle"),
          question_text: formData.get("question"),
          answer_text: formData.get("answer"),
        },
      ])
      .select();
     
    if (error) {
      errorNotification("Something wrong happened. Cannot add question.", 15);
      console.log(error);
    } else {
      successNotification("question Successfully Added!", 15);
      // Reload Datas
      getDatas();
          window.location.pathname = "/home.html";

    }
  }

  // for update
  else {
    errorNotification("Something wrong happened. Cannot add item.", 15);
    console.log(error);
  }
  // Modal Close
  document.getElementById("modal_close").click();

  // Reset Form
  form_item.reset();

  // Enable Submit Button
  document.querySelector("#form_item button[type='submit']").disabled = false;
  document.querySelector(
    "#form_item button[type='submit']"
  ).innerHTML = `Submit`;
};



//get questions
async function getQuestions(keyword = "") {
  let { data: questions, error } = await supabase
    .from("questions")
    .select("*,profiles(*)")
    .or(
      "question_text.ilike.%" + keyword + "%",
      "tittle.ilike.%" + keyword + "%",
      "username.ilike.%" + keyword + "%"
  );
 
    questions.sort(() => Math.random() - 0.5);
    //CHILLI SPICY COM-SCI LORDS BABY!
  
  let questionContainer = "";
  
  questions.forEach((data, index) => {
    const imagepath = data.profiles.image_path;
    const username = data.profiles.username;
    const likes = data.profiles.likes;

    questionContainer += ` <div class="col d-flex justify-content-center mb-3">
    <div class="card justify-content-center" style="width: 18rem">
      <div class="card" style="width: 18rem">
        <div class="card-body">
          <div class="row">
            <div class="col-4">
              <img
                src="${itemsImageUrl + imagepath}"
                class="block my-2 border border-dark border-2 rounded-circle"
                width="80px"
                height="80px"
              />
            </div>
            <div class="col-8">
              <div>
                <p>IGN: ${username}</p>
                <p>Likes: ${likes}</p>
              </div>
            </div>
          </div>
          <h4 class="card-title">${data.tittle}</h4>
          <p class="card-text">
          ${data.question_text}
          </p>
          <div id="textContainer${index}" class="d-grid gap-2 d-none">
              <i>${data.answer_text}</i>
          </div>
          <div class="d-grid gap-2 mt-2" >
          <button type="button" id="showButton${index}" class="btn btn-dark">Show Answer</button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
});

document.getElementById("indexContainer").innerHTML = questionContainer;

for (let i = 0; i < questions.length; i++) {
    var showButton = document.getElementById(`showButton${i}`);
    showButton.onclick = function () {
        var textContainer = document.getElementById(`textContainer${i}`);
        textContainer.classList.remove("d-none");
    };
}}

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



