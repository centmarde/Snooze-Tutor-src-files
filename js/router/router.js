function setRouter() {
  const path = window.location.pathname;
  const isLoggedIn = localStorage.getItem("access_token") !== null;
  const userRole = localStorage.getItem("Role");

  switch (path) {
    // If you are logged in, you can't access outside pages; redirect to dashboard
    case "/":
    case "/index.html":
    case "/register.html":
    case "/login.html":
      if (isLoggedIn) {
        window.location.pathname = "/home.html"; // default page when logged in
      }
      break;

    // If you are not logged in, you can't access dashboard pages; redirect to /
    case "/dashboard.html":
    case "/userProfile.html":
    case "/help.html":
    case "/accept.html":
    case "/sets.html":
    case "/home.html":
      // Allow access to items.html only if the user has the "Owner" or "Admin" role
      if (!isLoggedIn/*  || (userRole !== "user" && userRole !== "Admin") */) {
        window.location.pathname = "/index.html"; // redirect to home page if not logged in or not an owner/admin
      }
      break;

     /*  case "/siteadmin.html":
       
        if (!isLoggedIn) {
          window.location.pathname = "/index.html"; 
        } else if (userRole !== "admin") {
          
          window.location.pathname = "/home.html";
        }
        break; */

    default:
      break;
  }
}

export { setRouter };
