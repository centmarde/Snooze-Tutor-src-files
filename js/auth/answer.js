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
        answerCont += `<div  class="card ${cardClass}" style="width: 100vh">
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
          const randomNum = Math.random();
          if (randomNum < 0.33) {
              rank = "Worm 🐛";
          } else if (randomNum < 0.66) {
              rank = "Bee 🐝";
          } else {
              rank = "Ant 🐜";
          }
        } else if (percentage >= 20 && percentage < 30) {
          const randomNum = Math.random();
          if (randomNum < 0.33) {
              rank = "Rabbit 🐰";
          } else if (randomNum < 0.66) {
              rank = "Bird 🐦";
          } else {
              rank = "Mice 🐁";
          }
        } else if (percentage >= 30 && percentage < 40) {
          const randomNum = Math.random();
          if (randomNum < 0.33) {
              rank = "Chicken 🐔";
          } else if (randomNum < 0.66) {
              rank = "Peacock 🦚";
          } else {
              rank = "Flamingo 🦩";
          }
        } else if (percentage >= 40 && percentage < 50) {
          const randomNum = Math.random();
          if (randomNum < 0.33) {
              rank = "Cat 🐱";
          } else if (randomNum < 0.66) {
              rank = "Lama 🦙";
          } else {
              rank = "cow 🐃";
          }
        } else if (percentage >= 50 && percentage < 60) {
          const randomNum = Math.random();
          if (randomNum < 0.2) {
            rank = "Horse 🐴";
        } else if (randomNum < 0.4) {
            rank = "Unicorn 🦄";
        } else if (randomNum < 0.6) {
            rank = "Gorilla 🦍";
        } else if (randomNum < 0.8) {
            rank = "Camel 🐪";
        } else {
            rank = "Sloth 🦥";
        }
        } else if (percentage >= 60 && percentage < 70) {
          const randomNum = Math.random();
          if (randomNum < 0.2) {
            rank = "dog 🐶";
        } else if (randomNum < 0.4) {
            rank = "Penguin 🐧";
        } else if (randomNum < 0.6) {
            rank = "Chimp 🦧";
        } else if (randomNum < 0.8) {
            rank = "Scorpion 🦂";
        } else {
            rank = "giraffe 🦒";
        }
        } else if (percentage >= 70 && percentage < 80) {
          const randomNum = Math.random();
          if (randomNum < 0.2) {
            rank = "Fox 🦊";
        } else if (randomNum < 0.4) {
            rank = "Jaguar 🐆";
        } else if (randomNum < 0.6) {
            rank = "Wolf 🐺";
        } else if (randomNum < 0.8) {
            rank = "Parrot 🦜";
        } else {
            rank = "Crocodile 🐊";
        }
        } else if (percentage >= 80 && percentage < 90) {
          const randomNum = Math.random();
          if (randomNum < 0.2) {
            rank = "Tiger 🦊";
        } else if (randomNum < 0.4) {
            rank = "Octupos 🐆";
        } else if (randomNum < 0.6) {
            rank = "Elepant 🐺";
        } else if (randomNum < 0.8) {
            rank = "Typical Women 🙆🏼‍♀️";
        } else {
            rank = "Programmer 👨🏼‍💻";
        }
        } else if (percentage >= 90 && percentage <= 99) {
          const randomNum = Math.random();
          if (randomNum < 0.2) {
            rank = "Eagle 🦅";
        } else if (randomNum < 0.4) {
            rank = "Lion 🐆";
        } else if (randomNum < 0.6) {
            rank = "Shark 🐺";
        } else if (randomNum < 0.8) {
            rank = "Detective 🕵️";
        } else {
            rank = "Emperor 👑";
        }
        } else if (percentage === 100) {
          const randomNum = Math.random();
          if (randomNum < 0.33) {
              rank = "Dragon 🐲";
          } else if (randomNum < 0.66) {
              rank = "Dracula 🧛‍♀️";
          } else {
              rank = "Ai 🤖";
          }
        } else {
          const randomNum = Math.random();
          if (randomNum < 0.2) {
            rank = "Banana 🍌";
        } else if (randomNum < 0.4) {
            rank = "Eggplant 🍆";
        } else if (randomNum < 0.6) {
            rank = "T-rex 🦖";
        } else if (randomNum < 0.8) {
            rank = "Snowman ⛄️";
        } else {
            rank = "Rose 🥀";
        }
        }

        document.getElementById("result").innerText = `Total Score: ${totalScore} out of ${set_pages.length}`;
        document.getElementById("rankQuestion").innerText = `You have the brain of a ${rank}`;

    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
}

// delay button for not showing
const delayButton = document.getElementById('delay');
function showButtonWithFade() {
  delayButton.style.display = 'block'; 
}
delayButton.style.display = 'none';
const delayInMilliseconds = 3000; // 1 minute delay
setTimeout(showButtonWithFade, delayInMilliseconds);
//end delay button for not showing
