import { supabase, successNotification, errorNotification} from "../main";

const form_register = document.getElementById("form_register");


form_register.onsubmit = async (e) => {
    e.preventDefault();

    //button for IDLE request
    document.querySelector("#form_register button").disabled = true;
    document.querySelector(
        "#form_register button"
    ).innerHTML = `<div class="spinner-border me-2" role="status">
                      </div>
                      <span>Loading...</span>`;

    //password initialization for comparing
    const formData = new FormData(form_register);
    const password = formData.get("password");
    const confirmPassword = formData.get("password_confirm");


    if (formData.get("password") == formData.get("password_confirm")) {

        //supabase log-in
        const { data, error } = await supabase.auth.signUp({
            email: formData.get("email"),
            password: formData.get("password"),
        });

        let user_id = data?.user?.id;


        if (user_id != null) {

            //getting the info
            const { data, error } = await supabase
                .from('profiles')
                .insert([
                    {
                        password: formData.get("password"), username: formData.get("username"),
                        id:user_id, email: formData.get("email")
                    }
                ])
                .select()



            //if succes registration condition
            if (error == null) {
                successNotification("Register Successfully please verify your email.<a href = './login.html'>Click Here to Log-in!</a>", 10);
                console.log(data);
                console.log(error);
            }
            else {
                 errorNotification(`Error: ${error.message}`, 10);
                alert("error");
                console.log(error);
            }
            form_register.reset();
            //button loading after succes registration
            document.querySelector("#form_register button").disabled = false;
            document.querySelector("#form_register button").innerHTML = "Register";
        }
    }
    else {
        //button loading after password dont match
        errorNotification("Password not match", 10);
        document.querySelector("#form_register button").disabled = false;
        document.querySelector("#form_register button").innerHTML = "Register";
    }

};
