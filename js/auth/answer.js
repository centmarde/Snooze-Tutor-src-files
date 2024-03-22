import {
    supabase,
    successNotification,
    errorNotification,
    doLogout,
  } from "../main";
  
  $(document).ready(function () {
    // Show the modal when the document is ready
     $("#form_count").modal("show");
  });

  const parentIdFromStorage = localStorage.getItem("parentId");
  const userSelections = JSON.parse(localStorage.getItem("userSelections")); // Parse JSON string to object
  
  /* bridge function to sets IMPORTANT */
  getSet();
  
  function getSet() {
    if (parentIdFromStorage) {
      console.log(parentIdFromStorage);
    } else {
      console.log("parentId not found in localStorage");
    }
  }
  
  getUserAnswer();
  
  function getUserAnswer() {
    if (userSelections) {
      console.log(userSelections);
    } else {
      console.log("userSelections not found in localStorage");
    }
  }
  /*END of bridge function to sets IMPORTANT */
  
  // Iterate over the userSelections object
  getKey().then(countResult);
  
  async function getKey() {
    try {
      let { data: set_pages, error } = await supabase
        .from("set_pages")
        .select("*")
        .eq("set_id", parentIdFromStorage);
  
      if (error) {
        throw error;
      }
  
      let answerCont = "";
  
      set_pages.forEach((data, index) => {
        const userAnswer = (userSelections[index]?.selectedChoice || "").toUpperCase(); // Convert user's answer to uppercase
        const correctAnswer = data.answer.toUpperCase(); // Convert correct answer to uppercase
  
        let cardClass = ""; // Define CSS class for the card
        
        console.log("User Answer:", userAnswer);
        console.log("Correct Answer:", correctAnswer);
  
        if (userAnswer === correctAnswer) {
          cardClass = "border border-success border-4"; // Apply green border if user's answer is correct
        } else {
          cardClass = "border border-danger border-4"; // Apply red border if user's answer is wrong
        }
        answerCont += `<div  class="card ${cardClass}" style="width: 20rem">
          <div id="paper" class="card-body" data-id ="${data.id}">
            <form>
              <fieldset disabled>
                <div class="card-text">${data.question}</div>
                <div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      value="A"
                      ${userAnswer === 'A' ? 'checked' : ''} // Check if user selected this option
                    />
                    <label class="form-check-label" for="choiceA">
                      A. <span>${data.choiceA}</span>
                    </label>
                  </div>
                  <!-- Repeat for other options -->
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      value="B"
                      ${userAnswer === 'B' ? 'checked' : ''} // Check if user selected this option
                    />
                    <label class="form-check-label" for="choiceA">
                      B. <span>${data.choiceB}</span>
                    </label>
                  </div>
                  <!-- Repeat for other options -->
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      value="C"
                      ${userAnswer === 'C' ? 'checked' : ''} // Check if user selected this option
                    />
                    <label class="form-check-label" for="choiceA">
                      C. <span>${data.choiceC}</span>
                    </label>
                  </div>
                  <!-- Repeat for other options -->
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      value="D"
                      ${userAnswer === 'D' ? 'checked' : ''} // Check if user selected this option
                    />
                    <label class="form-check-label" for="choiceA">
                      D. <span>${data.choiceD}</span>
                    </label>
                  </div>
                  <!-- Repeat for other options -->
                </div>
              </fieldset>
            </form>
            <div class="d-grid gap-2">
              <button type="button" class="btn btn-outline-dark fs-1 d-flex" disabled>
                Correct Answer:
                <p class="ms-3">${data.answer.toUpperCase()}</p>
              </button>
              <button type="button" class="btn btn-outline-dark fs-1 d-flex text-center" disabled>
                Your Answer:
                <p id="final-answer" class="ms-3" >${userAnswer ? userAnswer.toUpperCase() : '-'}</p>
              </button>
            </div>
          </div>
        </div><br>`;
      });
  
      document.getElementById("problem_choices").innerHTML = answerCont;
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }
  
  document.body.addEventListener("click", function (event) {
    if (event.target.id === "show") {
      window.location.href = './sets.html';
    }
  });
 

  async function countResult() {
    try {
        let { data: set_pages, error } = await supabase
            .from("set_pages")
            .select("*")
            .eq("set_id", parentIdFromStorage);

        if (error) {
            throw error;
        }

        let totalScore = 0;

        set_pages.forEach((data, index) => {
            const userAnswer = (userSelections[index]?.selectedChoice || "").toUpperCase(); // Convert user's answer to uppercase
            const correctAnswer = data.answer.toUpperCase(); // Convert correct answer to uppercase

            if (userAnswer === correctAnswer) {
                totalScore++; // Increment total score if user's answer is correct
            }
        });

        const percentage = (totalScore / set_pages.length) * 100;
        let rank = "";

        if (percentage >= 10 && percentage < 20) {
            rank = "Worm 🐛";
        } else if (percentage >= 20 && percentage < 30) {
            rank = "Rabbit 🐰";
        } else if (percentage >= 30 && percentage < 40) {
            rank = "Chicken 🐔";
        } else if (percentage >= 40 && percentage < 50) {
            rank = "Cat 😺";
        } else if (percentage >= 50 && percentage < 60) {
            rank = "Snake 🐍";
        } else if (percentage >= 60 && percentage < 70) {
            rank = "Dog 🐶";
        } else if (percentage >= 70 && percentage < 80) {
            rank = "Wolf 🐺";
        } else if (percentage >= 80 && percentage < 90) {
            rank = "Tiger 🐯";
        } else if (percentage >= 90 && percentage <= 100) {
            rank = "Lion 🦁";
        } else if (percentage === 100) {
            rank = "Dragon 🐲";
        }

        document.getElementById("result").innerText = `Total Score: ${totalScore} out of ${set_pages.length}`;
        document.getElementById("rankQuestion").innerText = `You have the brain of a ${rank}`;

    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
}

