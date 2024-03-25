import {
  supabase,
  successNotification,
  errorNotification,
  countUsers,
} from "../main";

const itemsImageUrl =
  "https://plsyfklzwmasyypcuwei.supabase.co/storage/v1/object/public/profilePic/";
const userId = localStorage.getItem("user_id");
const form_modal_questions = document.getElementById("form_modal_questions");

getDatas();

form_item.onsubmit = async (e) => {
  e.preventDefault();
  // Disable Button
  document.querySelector("#form_item button[type='submit']").disabled = true;
  document.querySelector("#form_item button[type='submit']").innerHTML = `
                    <span>Loading...</span>`;

  const formData = new FormData(form_item);

  // Check if image input is null
  let image_path = formData.get("image_path");
  let image_data = null;
  if (!image_path) {
    // Retrieve the last saved image path
    // Assuming you have a variable holding the last saved image path
    // Replace 'last_saved_image_path' with the variable holding the last saved image path
    image_path = last_saved_image_path;
  } else {
    // Supabase Image Upload
    const image = formData.get("image_path");
    const { data, error } = await supabase.storage
      .from("profilePic")
      .upload("public/" + image.name, image, {
        cacheControl: "3600",
        upsert: true,
      });
    image_data = data;

    // Error notification for upload
    if (error) {
      errorNotification(
        "Something wrong happened. Cannot upload image, image size might be too big. You may update the item's image.",
        15
      );
      console.log(error);
    }
  }

  // Insert or update data
  if (for_update_id == "") {
    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          username: formData.get("username"),
          about: formData.get("about"),
          likes: formData.get("likes"),
          firstname: formData.get("firstname"),
          lastname: formData.get("lastname"),
          mobile_no: formData.get("mobile_no"),
          dislikes: formData.get("dislikes"),
          image_path: image_data ? image_data.path : image_path,
        },
      ])
      .select();

    if (error) {
      errorNotification("Something wrong happened. Cannot add item.", 15);
      console.log(error);
    } else {
      successNotification("Item Successfully Added!", 15);
      // Reload Datas
      getDatas();
    }
  } else {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        username: formData.get("username"),
        about: formData.get("about"),
        likes: formData.get("likes"),
        firstname: formData.get("firstname"),
        lastname: formData.get("lastname"),
        mobile_no: formData.get("mobile_no"),
        dislikes: formData.get("dislikes"),
        image_path: image_data ? image_data.path : image_path,
      })
      .eq("id", for_update_id)
      .select();

    if (error == null) {
      successNotification("Item Successfully Added!", 15);

      // Reset storage id
      for_update_id = "";
      /* reload datas */
      getDatas();
    } else {
      errorNotification("Something wrong happened. Cannot add item.", 15);
      console.log(error);
    }
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

form_modal_about.onsubmit = async (e) => {
  e.preventDefault();
  document.querySelector("#form_modal_about button").disabled = true;
  document.querySelector(
    "#form_modal_about button" //logout button script
  ).innerHTML = `<span>Loading...</span>`;

  // Modal Close
  document.getElementById("modal_close").click();

  // Reset Form
  form_item.reset();

  // Enable Submit Button
  document.querySelector("#form_item button[type='submit']").disabled = false;
  document.querySelector(
    "#form_modal_about button[type='submit']"
  ).innerHTML = `Submit`;
};
async function getDatas() {
  try {
    // Fetch user information
    let { data: profiles, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId);

    let { data: questions, error } = await supabase
      .from("questions")
      .select("*,profiles(*)")
      .eq("user_id", userId);

    // Fetch sign-ins
    let { data: sign_ins, error: signInError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId);

    let { data: rank, error: rankError } = await supabase
      .from("rank")
      .select("*")
      .eq("user_id", userId);

    if (userError || signInError) {
      throw new Error(userError || signInError);
    }

    //ge declare ug empty para makahimo ug dynamic nga output
    let questionContainer = "";
    let container = "";
    let UniversalContainer = "";
    let lastsignInContainer = "";
    let sideContainer = "";
    let rankContainer = "";

    profiles.forEach((user_info) => {
      //Dynamic Navbar para mag baylo2 base sa ga log-in na user
      container += `<h4 class="mt-2" data-id="${user_info.username}">${user_info.username}'s  </h4><h4 class="mt-2 ms-2">profile</h4>`;
      //Dyanimc data sa User tanan makita nimo sa userprofile na info naa direa
      UniversalContainer += `<div id="box"class="d-flex justify-content-center p-2">
            <div id="t1" class="col-6 col-lg-6 col-md-12 col-sm-12">
              <div class="d-flex justify-content-center" >
                <!-- connector to javaS image -->
                <div
                  class="col-12 col-md-4 cold-sm-12 col-lg-4"
                  id="imageContainer" 
                ><div data-id="${
                  user_info.image_path
                }"><img class="block my-2 border border-light border-2 rounded-circle" src="${
        itemsImageUrl + user_info.image_path
      }" width="100%" height="130px"></div></div>
              </div>
              <div>
                <!-- Button trigger modal Profile Picture-->
                <button
                  id="btn_edit"
                  type="button"
                  class="btn btn-secondary w-100"
                  data-bs-toggle="modal"
                  data-bs-target="#form_modal"
                  style=" background-color: #2b1055; color: white;"
                >
                  Edit Info
                </button>
                <!-- End Button trigger modal  -->
              </div>
              <!-- end of navbar -->
    
              <!--   container body -->
            </div>
            <div class="col-6 col-lg-6 col-md-6 ms-2">
              <div>
                <div><p class="mt-2"><svg xmlns="http://www.w3.org/2000/svg"  width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                <path  d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
              </svg> Username: ${user_info.username}</p></div>
                <p id="lastsignInContainer"></p>
                <div class = "d-flex" > <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-award" viewBox="0 0 16 16">
                <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702z"/>
                <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z"/>
              </svg> Rank: <p id="rank" class = "ms-1"> </p></div>
              
              </div>
            </div>
          </div>
          <div id="t2" class="row">
            <div class="col">
            <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Listings</a>
            </li>
            <li class="nav-item" data-bs-toggle="modal" data-bs-target="#form_modal_about" >
              <a class="nav-link" style="color: #2b1055; background-color: rgb(240, 240, 240);
            }" href="#">About</a>
            </li>
            </li>
            <li class="nav-item">
              <a class="nav-link" style="color: #2b1055; background-color: rgb(230, 230, 230);
            }" data-bs-toggle="modal"
            data-bs-target="#modal_sets">Sets</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" style="color: #2b1055; background-color: rgb(220, 220, 220);
            }" href="#">Tasks</a>
            </li>
          </ul>
             
            </div>
          </div>
          <div id="t3" class="row">
            <div class="col">
            <div class="container"  >
             <div id="indexContainer" >
             </div>
            </div>
            </div>
          </div>
        `;

      sideContainer += `<div  data-id="${user_info.image_path}">
      <img class="block my-2 border border-dark border-2" src="${
        itemsImageUrl + user_info.image_path
      }" width="100%" height="100%"></div>
      <div class="row">
      <div class="col">
      <div class="mt-2">Username: ${user_info.username}</div>
     <div class="mt-2">FirstName: ${user_info.firstname}</div>
     <div class="mt-2">LastName: ${user_info.lastname}</div>
     <div class="mt-2">Mobile Number: ${user_info.mobile_no}</div>
     <div class="mt-2">About: ${user_info.about}</div>
     </div>
     </div>
      <div class="row">
      <div class="col">
      <div class="mt-2">Likes: ${user_info.likes}</div>
      <div class="mt-2">Dislikes: ${user_info.dislikes}</div>
      </div>
      </div>`;
    });

    /* ge lahi kay para makuha ang last sign-in */
    sign_ins.forEach((sign_in) => {
      lastsignInContainer += `<p class="mt-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
    </svg> Last Sign In:<br> ${sign_in.last_sign_in_at
      .replace(/T/g, " ")
      .replace(/\..+/g, "")}</p>`;
    });

    rank.forEach((rank) => {
      rankContainer += `${rank.rank_name}`;
    });

    questions.forEach((data, index) => {
      questionContainer += ` <div class="col d-flex justify-content-center mb-3 mt-5">
      <div class="card justify-content-center" style="width: 18rem" data-id="${data.id}" >
        <div class="card" style="width: 18rem">
          <div class="card-body">
            <h4 class="card-title">${data.tittle}</h4>
            <p class="card-text">
            ${data.question_text}
            </p>
            <div id="textContainer${index}" class="d-grid gap-2">
                <i>${data.answer_text}</i>
            </div>
            
            <div class = "row mt-4">
            <div class = "col-6 d-grid gap-2 ">
            <button type="button"  class="btn btn-dark" data-bs-toggle="modal"
            data-bs-target="#form_modal_questions" id="btn_edit_questions" style=" background-color: #2b1055; color: white;" data-id="${data.id}">Edit</button>
            </div>
            <div class = "col-6 d-grid gap-2">
            <button type="button"   class="btn" style="background-color: #a679eb; color: white; id="btn_deleteQuestions" data-id="${data.id}">delete</button>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
           `;
    });

    // Assuming you have a container in your HTML with an id, for example, "userContainer"
    // initialize ug container
    document.body.addEventListener("click", function (event) {
      if (event.target.id === "btn_deleteQuestions") {
        deleteQuestion(event);
      }
    });

    /* edit funtion calling */
    document.body.addEventListener("click", function (event) {
      if (event.target.id === "btn_edit_questions") {
        editAction_question(event);
      }
    });

    document.getElementById("userContainer").innerHTML = container;
    document.getElementById("alldata").innerHTML = UniversalContainer;
    document.getElementById("lastsignInContainer").innerHTML =
      lastsignInContainer;
    document.getElementById("sidedata").innerHTML = sideContainer;
    document.querySelectorAll("#btn_edit").forEach((element) => {
      element.addEventListener("click", editAction);
    });
    document.getElementById("indexContainer").innerHTML = questionContainer;
    document.getElementById("rank").innerHTML = rankContainer;
  } catch (error) {
    alert("Error fetching data:", error);
    window.location.reload();
  }
}

// Storage of Id of chosen data to update
let for_update_id = "";

// Edit Functionality; but show first for about info edit
const editAction = async (e) => {
  const id = e.target.getAttribute("data-id");

  // Supabase show by id
  let { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId);

  if (error == null) {
    // Store id to a variable; id will be utilize for update
    for_update_id = profiles[0].id;

    // Assign values to the form
    document.getElementById("username").value = profiles[0].username;
    document.getElementById("firstname").value = profiles[0].firstname;
    document.getElementById("lastname").value = profiles[0].lastname;
    document.getElementById("mobile_no").value = profiles[0].mobile_no;
    document.getElementById("likes").value = profiles[0].likes;
    document.getElementById("dislikes").value = profiles[0].dislikes;
    document.getElementById("about").value = profiles[0].about;

    // Change Button Text using textContent; either innerHTML or textContent is fine here
  } else {
    errorNotification("Something wrong happened. Cannot show item.", 15);
    console.log(error);
  }
};
// Delete Functionality
const deleteQuestion = async (e) => {
  const id = e.target.getAttribute("data-id");
  console.log(id);

  const isConfirmed = window.confirm(
    "Are you sure you want to delete question?"
  );

  // Check if the user has confirmed the deletion
  if (!isConfirmed) {
    return; // Abort the operation if the user cancels
  }

  try {
    const { error } = await supabase.from("questions").delete().eq("id", id);
    successNotification("Item Successfully Deleted!", 15);
    window.location.reload();
  } catch (error) {
    errorNotification("Something wrong happened. Cannot delete item.", 15);
    alert(error);
    window.location.reload();
  }
};

let update_questions = "";

const editAction_question = async (e) => {
  const id = e.target.getAttribute("data-id");
  console.log(id);
  console.log("Event target:", e.target);
  console.log("Event object:", e);

  // Set loading state to true
  setLoading(true);

  // Supabase show by id
  let { data: questions, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", id);

  // Set loading state to false after fetching data
  setLoading(false);

  if (error == null) {
    // Store id to a variable; id will be utilized for update
    update_questions = questions[0].id;

    // Assign values to the form
    document.getElementById("tittle").value = questions[0].tittle;
    document.getElementById("question_text").value = questions[0].question_text;
    document.getElementById("answer_text").value = questions[0].answer_text;

    // Change Button Text using textContent; either innerHTML or textContent is fine here
  } else {
    errorNotification("Something wrong happened. Cannot show item.", 15);
    console.log(error);
  }
};

// Function to set loading state
const setLoading = (isLoading) => {
  const loader = document.getElementById("preloader"); // Replace "loader" with the actual ID of your loading screen element
  if (isLoading) {
    loader.style.display = "block"; // Show loading screen
  } else {
    loader.style.display = "none"; // Hide loading screen
  }
};

//edit questions
form_modal_questions_edit.onsubmit = async (e) => {
  e.preventDefault();
  // Disable Button
  document.querySelector(
    "#form_modal_questions button[type='submit']"
  ).disabled = true;
  document.querySelector(
    "#form_modal_questions button[type='submit']"
  ).innerHTML = `
                  <span>Loading...</span>`;

  const formData = new FormData(form_modal_questions_edit);

  /* update */
  if (update_questions == "") {
    const { data, error } = await supabase
      .from("questions")
      .insert([
        {
          tittle: formData.get("tittle"),
          question_text: formData.get("question_text"),
          answer_text: formData.get("answer_text"),
        },
      ])
      .select();
    if (error) {
      errorNotification("Something wrong happened. Cannot add Question", 15);
      console.log(error);
    } else {
      successNotification("Question Successfully Added!", 15);

      getDatas();
    }
  }

  // for update
  else {
    const { data, error } = await supabase
      .from("questions")
      .update({
        tittle: formData.get("tittle"),
        question_text: formData.get("question_text"),
        answer_text: formData.get("answer_text"),
      })
      .eq("id", update_questions)
      .select();
    if (error == null) {
      successNotification("Item Successfully Added!", 15);

      // Reset storage id
      update_questions = "";
      /* reload datas */
      getDatas();
      window.location.reload();
    } else {
      errorNotification("Something wrong happened. Cannot add item.", 15);
      console.log(error);
    }
  }
  // Modal Close
  document.getElementById("modal_close").click();

  // Reset Form
  form_modal_questions_edit.reset();

  // Enable Submit Button
  document.querySelector(
    "#form_modal_questions button[type='submit']"
  ).disabled = false;
  document.querySelector(
    "#form_modal_questions button[type='submit']"
  ).innerHTML = `Submit`;
};
//end of edit questions

// JavaScript code
document
  .getElementById("form_item")
  .addEventListener("submit", function (event) {
    // Get the value of the file input
    const fileInput = document.getElementById("imageUpload");
    const file = fileInput.files[0];

    // Check if no file is selected or file is null
    if (!file || file.size === 0) {
      alert("Please select a non-empty image file.");
      event.preventDefault();
    }
  });
getSets();
async function getSets() {
  try {
    let { data: setIndex, error } = await supabase
      .from("set")
      .select("*,profiles(*)")
      .eq("user_id", userId);

    let Sets = "";

    setIndex.forEach((data, index) => {
      Sets += `<div class="container">
                <div class="row">
                  <div class="col">
                    <div class="card text-bg-light shadow mb-3" style="max-width: 18rem;">
                      <div class="card-header" data-id="${data.id}">${data.category}</div>
                      <div class="card-body">
                        <h5 class="card-title">${data.title}</h5>
                        <p class="card-text">${data.details}</p>
                        <p class="card-text mt-3">${data.created_at}</p>
                        <div class="d-flex justify-content-end gap-2 d-md-block">
                          <button class="btn me-2 edit-set-btn" data-bs-toggle="modal"
                          data-bs-target="#editSets_modal" data-id="${data.id}" type="button" style="background-color: #2b1055; color: white;">Edit Set</button>
                          <button id="final_delete" class="btn" delete-set-btn" style="background-color: #a679eb; color: white; data-id="${data.id}" type="button">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`;
    });

// Event listener to handle delete set button click
document.body.addEventListener("click", function (event) {
  if (event.target.id === "final_delete") {
    deleteSet(event);
  }
});


    const deleteSet = async (e) => {
      const id = e.target.getAttribute("data-id");
      console.log(id);
    
      const isConfirmed = window.confirm(
        "Are you sure you want to delete question?"
      );
    
      // Check if the user has confirmed the deletion
      if (!isConfirmed) {
        return; // Abort the operation if the user cancels
      }
    
      try {
        const { error } = await supabase.from("set").delete().eq("id", id);
        alert("Item Successfully Deleted!");
        window.location.reload();
      } catch (error) {
        alert("Error Somethings Wrong!");
      alert(error);
      window.location.reload();
      }
    };




    document.getElementById("sets_index").innerHTML = Sets;

    // Attach event listener to edit buttons
    const editButtons = document.querySelectorAll(".edit-set-btn");
    editButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const setId = this.getAttribute("data-id");
        // Now you can use setId wherever you need it
        console.log(setId);
        // Call getPages and pass setId as an argument
        getPages(setId);
      });
    });
  } catch {
    alert("Failed to fetch Sets");
    window.location.reload();
  }
}

// Function to fetch pages for a given set ID
async function getPages(setId) {
  try {
    // Fetch set pages data from Supabase
    let { data: setIndex, error } = await supabase
      .from("set_pages")
      .select("*, set(*)")
      .eq("set_id", setId);

    let SetsHTML = "";

    // Iterate through each set page data and create HTML
    setIndex.forEach((data2, index) => {
      const category = data2.set.category;
      SetsHTML += `<div class="container">
        <div class="row">
          <div class="col">
            <div class="card text-bg-light shadow mb-3" style="max-width: 18rem;">
              <div class="card-header" data-id="${data2.id}">${category}</div>
              <div class="card-body">
                <h5 class="card-title">${data2.question}</h5>
                <p class="card-text">A. ${data2.choiceA}</p>
                <p class="card-text mt-1">B. ${data2.choiceB}</p>
                <p class="card-text mt-1">C. ${data2.choiceC}</p>
                <p class="card-text mt-1">D. ${data2.choiceD}</p>
                <b class="card-text mt-2">Answer. ${data2.answer}</b>
                <div class="d-flex justify-content-end gap-2 d-md-block">
                  <button class="btn me-2 edit-set-btn" data-bs-toggle="modal" data-bs-target="#editSets_modal2" data-id="${data2.id}" type="button" style="background-color: #2b1055; color: white;">Edit Set</button>
                  <button class="btn" style="background-color: #a679eb; color: white; data-id="${data2.id}" type="button">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      `;

    });

    // Set inner HTML of the container to the generated HTML
    document.getElementById("sets_index2").innerHTML = SetsHTML;

    // Attach event listeners to edit buttons
    const editButtons = document.querySelectorAll(".edit-set-btn");
    editButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const setId = this.getAttribute("data-id");
        editSets(setId);
      });
    });

    const editButton = document.querySelector("#final_edit");
    editButton.addEventListener("click", function () {
      const setId = this.getAttribute("data-id"); 
      console.log(setId);
      innerQuestion(setId);
    });

  } catch (error) {
    console.error("Failed to fetch pages:", error);
    alert("Failed to fetch pages");
    /* window.location.reload(); */
  }
}

// Function to handle editing sets
const editSets = async (setId) => {
  console.log(setId);
     
  try {
    // Fetch set pages data from Supabase by set ID
    let { data: setPages, error } = await supabase
      .from("set_pages")
      .select("*")
      .eq("id", setId);

    if (error) {
      throw error; // Throw error if there's an issue fetching data
    }

    // Populate form fields with fetched data
    document.getElementById("question").value = setPages[0].question;
    document.getElementById("choiceA").value = setPages[0].choiceA;
    document.getElementById("choiceB").value = setPages[0].choiceB;
    document.getElementById("choiceC").value = setPages[0].choiceC;
    document.getElementById("choiceD").value = setPages[0].choiceD;
    document.getElementById("answer").value = setPages[0].answer;

    // Get references to the modal elements outside the event listener

  } catch (error) {
    console.error("Error editing set:", error);
    alert("Something went wrong. Unable to edit set.");
    window.location.reload();
  }
};



const innerQuestion = async (setId) => {
  console.log(setId);
  

  const formData = new FormData(edit_set_question);

  /* update */
  if (update_questions == "") {
    const { data, error } = await supabase
      .from("set_pages")
      .insert([
        {
          question: formData.get("question"),
          choiceA: formData.get("choiceA"),
          choiceB: formData.get("choiceB"),
          choiceC: formData.get("choiceC"),
          choiceD: formData.get("choiceD"),
          answer: formData.get("answer"),
        },
      ])
      .select();
    if (error) {
     alert("Something wrong happened. Cannot add Question", 15);
      console.log(error);
    } else {
      alert("Question Successfully Edited!", 15);
    }
}
}

// document.body.addEventListener("click", function (event) {
//   if (event.target.id === "delete_page") {
//     deleteSet2(event);
//   }
// });




// const deleteSet2 = async (e) => {
//   const id = e.target.getAttribute("data-id");
//   console.log(id);

//   const isConfirmed = window.confirm(
//     "Are you sure you want to delete question?"
//   );

//   // Check if the user has confirmed the deletion
//   if (!isConfirmed) {
//     return; // Abort the operation if the user cancels
//   }

//   try {
//     const { error } = await supabase.from("set_pages").delete().eq("set_id", id);
//     alert("Item Successfully Deleted!");
//     /* window.location.reload(); */
//   } catch (error) {
//     alert("Error Somethings Wrong!");
//     console.error(error);
//   }
// };




