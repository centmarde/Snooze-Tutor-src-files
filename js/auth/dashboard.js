import {
  doLogout,
  successNotification,
  errorNotification,
  supabase,
} from "../main";

// Assign Logout Functionality
const btn_logout = document.getElementById("btn_logout");
btn_logout.onclick = doLogout;
// logout function
const form_item = document.getElementById("form_item");

const form_search = document.getElementById("form_search");

getDatas();
form_item.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(form_item);
  /* update */
  if (for_update_id == "") {
    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          firstname: formData.get("firstname"),
          /* password: formData.get("password"),
          Role: formData.get("Role"), */
        },
      ])
      .select();
    if (error) {
      errorNotification("Something wrong happened. Cannot add item.", 15);
      console.log(error);
    } else {
      successNotification("Item Successfully Added1!", 15);
      // Reload Datas
      getDatas();
      window.location.href = "./dashboard.html";
    }
  }

  // for update
  else {
    const { data, error } = await supabase
      .from("user_information")
      .update({
        firstname: formData.get("firstname"),
        password: formData.get("password"),
        Role: formData.get("Role"),
      })
      .eq("id", for_update_id)
      .select();
    if (error == null) {
      successNotification("Item Successfully Added2!", 15);

      // Reset storage id
      for_update_id = "";
      /* reload datas */
      getDatas();
      window.location.href = "./dashboard.html";
    } else {
      errorNotification("Something wrong happened. Cannot add item.", 15);
      console.log(error);
    }
  }
};
// Modal Close
document.getElementById("modal_close").click();

// Reset Form
form_item.reset();

// Enable Submit Button
document.querySelector("#form_item button[type='submit']").disabled = false;
document.querySelector("#form_item button[type='submit']").innerHTML = `Submit`;

async function getDatas(keyword = "") {
  // Get all rows
  let { data: user_information, error } = await supabase
    .from("profiles")
    .select("*")
    .or("firstname.ilike.%" + keyword + "%, lastname.ilike.%" + keyword + "%");

  let container = "";
  user_information.sort((a, b) => a.id - b.id);
  user_information.forEach((user_info) => {
    container += `<div class="container mt-2 "> <table class="table">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">username</th>
            <th scope="col">firstname</th>
            <th scope="col">Role</th>
          </tr>
        </thead>
        <tbody>
          <div class="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
          <tr class = "text-start" >
            <th scope="row">${user_info.id}</th>
            <td>${user_info.username}</td>
            <td>${user_info.firstname}</td>
            <td class="text-start">${user_info.likes} <div class="dropdown float-end">
            <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
            <ul class="dropdown-menu">
                <li>
                    <a class="dropdown-item shadow pb-3 text-start" href="#" id="btn_edit" data-id="${user_info.id}">Edit</a>
                </li>
                <li>
                    <a class="dropdown-item pb-3 text-start" id="btn_delete" data-id="${user_info.id}">Delete</a>
                </li>
            </ul>
        </div>
</div></td>
           
                       
                </td>
                
          </tr>
        </tbody>
      </table>
      </div>`;
  });
  document.getElementById("get_data").innerHTML = container;

  /* delete function calling */
  document.querySelectorAll("#btn_delete").forEach((element) => {
    element.addEventListener("click", deleteAction);
  });
  /* edit funtion calling */
  document.querySelectorAll("#btn_edit").forEach((element) => {
    element.addEventListener("click", editAction);
  });
}

const deleteAction = async (e) => {
  const id = e.target.getAttribute("data-id");
  console.log(id);

  // Display a confirmation dialog
  const isConfirmed = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (isConfirmed) {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (error == null) {
      successNotification("User Successfully Deleted!", 15);
      window.location.href = "./dashboard.html";
    } else {
      errorNotification("Something wrong happened. Cannot delete item.", 15);
      console.log(error);
    }
  } else {
    // User clicked Cancel in the confirmation dialog
    console.log("User canceled the delete operation.");
  }
};

let for_update_id = "";

const editAction = async (e) => {
  const id = e.target.getAttribute("data-id");
  console.log(id);

  // Supabase show by id
  let { data: profiledata, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id);

  if (error == null) {
    // Store id to a variable; id will be utilized for update
    for_update_id = profiledata[0].id;

    // Assign values to the form
    document.getElementById("firstname").value = profiledata[0].firstname;
    document.getElementById("codename").value = profiledata[0].username;
    /* document.getElementById("Role").value = profiles[0].Role; */

    // Change Button Text using textContent; either innerHTML or textContent is fine here
    document.querySelector("#form_item button[type='submit']").textContent =
      "Update";

    // Show Modal Form
    document.getElementById("modal_show").click();
  } else {
    errorNotification("Something wrong happened. Cannot show item.", 15);
    console.log(error);
  }
};
