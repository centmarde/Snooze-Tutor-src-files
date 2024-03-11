import {
  supabase,
  successNotification,
  errorNotification,
  countUsers,
} from "../main";

const itemsImageUrl =
  "https://plsyfklzwmasyypcuwei.supabase.co/storage/v1/object/public/profilePic/";
const userId = localStorage.getItem("user_id");
getDatas();

form_item.onsubmit = async (e) => {
  e.preventDefault();
  // Disable Button
  document.querySelector("#form_item button[type='submit']").disabled = true;
  document.querySelector("#form_item button[type='submit']").innerHTML = `
                    <span>Loading...</span>`;

  const formData = new FormData(form_item);

  // Supabase Image Upload
  const image = formData.get("image_path");
  const { data, error } = await supabase.storage
    .from("profilePic")
    .upload("public/" + image.name, image, {
      cacheControl: "3600",
      upsert: true,
    });
  const image_data = data;

  // Error notification for upload
  if (error) {
    errorNotification(
      "Something wrong happened. Cannot upload image, image size might be too big. You may update the item's image.",
      15
    );
    console.log(error);
  }

  /* update */
  if (for_update_id == "") {
    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          username: formData.get("username"),
          about: formData.get("about"),
          likes: formData.get("likes"),
          dislikes: formData.get("dislikes"),
          image_path: image_data === null ? null : image_data.path,
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
  }

  // for update
  else {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        username: formData.get("username"),
        about: formData.get("about"),
        likes: formData.get("likes"),
        dislikes: formData.get("dislikes"),
        image_path: image_data == null ? null : image_data.path,
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
    

    if (userError || signInError) {
      throw new Error(userError || signInError);
    }

    //ge declare ug empty para makahimo ug dynamic nga output
    let questionContainer = "";
    let container = "";
    let UniversalContainer = "";
    let lastsignInContainer = "";
    let sideContainer = "";

    profiles.forEach((user_info) => {
      //Dynamic Navbar para mag baylo2 base sa ga log-in na user
      container += `<h4 class="mt-2" data-id="${user_info.firstname}">${user_info.firstname}'s  profile</h4>`;
      //Dyanimc data sa User tanan makita nimo sa userprofile na info naa direa
      UniversalContainer += `<div class="row my-4 p-2">
            <div id="t1" class="col-6 col-lg-6 col-md-6 col-sm-6">
              <div class="d-flex justify-content-center">
                <!-- connector to javaS image -->
                <div
                  class="col-12 col-md-6 cold-sm-4 col-lg-4"
                  id="imageContainer" 
                ><div data-id="${
                  user_info.image_path
                }"><img class="block my-2 border border-dark border-2 rounded-circle" src="${
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
                >
                  Edit Info
                </button>
                <!-- End Button trigger modal  -->
              </div>
              <!-- end of navbar -->
    
              <!--   container body -->
            </div>
            <div class="col-6 col-lg-6 col-md-6">
              <div>
                <div><p class="mt-2">Username: ${user_info.username}</p></div>
                <p id="lastsignInContainer"></p>
                <p>Rank:</p>
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
              <a class="nav-link" href="#">About</a>
            </li>
          </ul>
             
            </div>
          </div>
          <div id="t3" class="row">
            <div class="col">
            <div class="container">
             <div id="indexContainer">
             </div>
            </div>
            </div>
          </div>
        `;
        
      sideContainer += `<div data-id="${user_info.image_path}">
      <img class="block my-2 border border-dark border-2" src="${
        itemsImageUrl + user_info.image_path
      }" width="100%" height="100%"></div>
      <div class="row">
      <div class="col">
      <div class="mt-2">Username: ${user_info.username}</div>
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
      lastsignInContainer += `<p class="mt-2">Last Sign In:<br> ${sign_in.last_sign_in_at
        .replace(/T/g, " ")
        .replace(/\..+/g, "")}`;
    });

    questions.forEach((data, index) => {
      const imagepath = data.profiles.image_path;
      const username = data.profiles.username;
      const likes = data.profiles.likes;
  
      questionContainer += ` <div class="col d-flex justify-content-center mb-3 mt-5">
      <div class="card justify-content-center" style="width: 18rem" data-id="${data.id} >
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
            data-bs-target="#form_modal_questions" id="btn_edit_questions" data-id="${data.id
            }">Edit</button>
            </div>
            <div class = "col-6 d-grid gap-2">
            <button type="button"  class="btn btn-danger" id="btn_deleteQuestions" data-id="${data.id
            }">delete</button>
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
    document.body.addEventListener('click', function (event) {
      if (event.target.id === 'btn_deleteQuestions') {
        deleteQuestion(event);
      }
    });
    
    
  /* edit funtion calling */
  document.querySelectorAll("#btn_edit_questions").forEach((element) => {
      element.addEventListener("click", editAction_question);
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
    
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle error, show error notification, etc.
  }
  
}


//edit questions
form_modal_questions.onsubmit = async (e) => {
  e.preventDefault();
  // Disable Button
document.querySelector("#form_item button[type='submit']").disabled = true;
document.querySelector("#form_item button[type='submit']").innerHTML = `
                  <span>Loading...</span>`;


  const formData = new FormData(form_modal_questions);

  /* update */
  if (for_update_id_questions == '') {
      const { data, error } = await supabase
          .from("questions")
          .insert([
              {
                  tittle: formData.get("tittle"),
                 question_text: formData.get("question_text"),
                 answer_text: formData.get("answer"),
              }
              ,])
          .select();
      if (error) {
          errorNotification("Something wrong happened. Cannot add item.", 15);
          console.log(error);
      }
      else {

          successNotification("Item Successfully Added!", 15);
          window.location.reload();
          // Reload Datas
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
            answer_text: formData.get("answer"),
          })
          .eq("id", for_update_id_questions)
          .select();
      if (error == null) {
          successNotification("Item Successfully Added!", 15);

          // Reset storage id
          for_update_id_questions = "";
          /* reload datas */
          getDatas();
      }
      else {

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
}
//end of edit questions






// Storage of Id of chosen data to update
let for_update_id = "";

// Edit Functionality; but show first
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

  const isConfirmed = window.confirm("Are you sure you want to delete question?");

  // Check if the user has confirmed the deletion
  if (!isConfirmed) {
    return; // Abort the operation if the user cancels
  }

  try {
    const { error } = await supabase.from('questions').delete().eq('id', id);
    successNotification("Item Successfully Deleted!", 15);
    window.location.reload();
  } catch (error) {
    errorNotification("Something wrong happened. Cannot delete item.", 15);
    console.error(error);
  }
}





let for_update_id_questions = " ";

const editAction_question = async (e) => {
  const id = e.target.getAttribute("data-id");

  // Supabase show by id
  let { data: questions, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", userId);

  if (error == null) {
    // Store id to a variable; id will be utilize for update
    for_update_id_questions = questions[0].id;

    // Assign values to the form
    document.getElementById("tittle").value = questions[0].tittle;
    document.getElementById("question_text").value = questions[0].question_text;
    document.getElementById("answers").value = questions[0].answer_text;
    

    // Change Button Text using textContent; either innerHTML or textContent is fine here
  } else {
    errorNotification("Something wrong happened. Cannot show item.", 15);
    console.log(error);
  }

  document.getElementById("modal_show").click();
};







