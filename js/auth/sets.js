import { supabase, successNotification, errorNotification} from "../main";

//start of sets navigation
$(document).ready(function(){
    // Show the modal when the document is ready
    $('#form_modal').modal('show');
});

//end of sets navigation

const itemsImageUrl =
  "https://plsyfklzwmasyypcuwei.supabase.co/storage/v1/object/public/profilePic/";
const userId = localStorage.getItem("user_id");
const form_set_creation = document.getElementById("form_set_creation");
const form_set_making = document.getElementById("form_set_making");


// modal creations set 1st start
form_set_creation.onsubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    
    try {
        const formData = new FormData(form_set_creation); // Get form data
        const title = formData.get("title");
        const category = formData.get("category");
        
        // Assuming userId is defined elsewhere in your code
        const { data, error } = await supabase
            .from("set")
            .insert([
                {
                    title,
                    category,
                    user_id: userId,
                },
            ])
            .select();

        if (error) {
            throw error.message; // Throw error message if there's an error
        }
        else{
       alert("Set Successfully Added!");
        // Show modal after successful submission
        $('#modal_set_making').modal('show');
        document.getElementById("btn-close").click();
       
        // Clear the form fields if needed
        form_set_creation.reset();
             }
    } catch (error) {
        console.error("Error:", error);
        window.location.reload();
    }
};
// modal set creation 1st end
const { data: setData, error: setError } = await supabase
    .from('set')
    .select('id')
    .eq('user_id',userId); // Add any conditions if needed to fetch the specific set record

// Check for errors while fetching data
if (setError) {
    console.error('Error fetching data from set table:', setError.message);
}

const setId = setData[2].id;
console.log(setId);

const finnishButton = document.getElementById("finnishButton");
const newPage = document.getElementById("newPage");

// Function to handle form submission
const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    
    try {
        const formData = new FormData(form_set_making);
        const question = formData.get("question");
        const choiceA = formData.get("choiceA");
        const choiceB = formData.get("choiceB");
        const choiceC = formData.get("choiceC");
        const choiceD = formData.get("choiceD");
        const answer = formData.get("answer")

        const { data, error } = await supabase
            .from("set_pages")
            .insert([
                {
                    question,
                    choiceA,
                    choiceB,
                    choiceC,
                    choiceD,
                    answer,
                    set_id: setId,
                },
            ])
            .select();

        if (error) {
            throw error.message;
        }
      form_set_making.reset();
        // Wait until the Finnish button is clicked
        while (!finnishButton.clicked) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          
          
        }
    } catch (error) {
        errorNotification("Something wrong happened. Cannot add Question.", 15);
        console.error(error);
    }
    document.getElementById("btn_close2").click();
};

// Event listener for form submission
form_set_making.onsubmit = handleSubmit;


// Event listener for the NewPage button to reload the form
newPage.addEventListener("click", () => {
    $('#form_celebration').modal('show');
    document.getElementById("btn_close2").click();

});


