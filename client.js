var displayView = function(viewId)
{
    var alertMessageView = document.getElementById("alertMessageView");

    document.getElementsByTagName("body")[0].innerHTML = alertMessageView.innerHTML;
   
    var view = document.getElementById(viewId);
    
    document.getElementsByTagName("body")[0].innerHTML += view.innerHTML;
}

var displayMessage = function(message, type)
{
    setTimeout(hideMessage, 3000);

    var alertMessage = document.getElementById("alertMessage");

    alertMessage.className = type;

    alertMessage.innerHTML = message;
}

var hideMessage = function()
{
    var alertMessage = document.getElementById("alertMessage");

    alertMessage.className = "";

    alertMessage.innerHTML = "";
}

var signOut = function()
{
    serverstub.signOut(localStorage.getItem("userToken"));

    localStorage.removeItem("userToken");

    loadSignedOut();
}

var loginSubmit = function()
{
    var loginEmail = document.getElementById("loginEmail");
    var loginPassword = document.getElementById("loginPassword");

    var response = serverstub.signIn(loginEmail.value, loginPassword.value);

    if (response.success)
    {
	localStorage.setItem("userToken", response.data);
	
	loadSignedIn();
    }
    else
    {
	loginEmail.setCustomValidity(response.message);
	loginEmail.checkValidity();
    }

    return false;
}

var signupSubmit = function()
{
    var signupPassword = document.getElementById("signupPassword");
    var repeatPassword = document.getElementById("repeatPassword");

    if (validPasswordLength(signupPassword.value) && validPasswordMatch(signupPassword.value, repeatPassword.value))
    {
	var user = {
	    email: document.getElementById("signupEmail").value,
	    password: signupPassword.value,
	    firstname: document.getElementById("firstName").value,
	    familyname: document.getElementById("lastName").value,
	    gender: document.getElementById("gender").value,
	    city: document.getElementById("city").value,
	    country: document.getElementById("country").value
	};

	var response = serverstub.signUp(user);

	if (response.success)
	{
	    displayMessage(response.message, "infoMessage");
	    
	    document.getElementById("signupForm").reset();
	}
	else
	{ 
	    displayMessage(response.message, "errorMessage");
	}
    }

    return false;
}

var changePasswordSubmit = function()
{
    var oldPassword = document.getElementById("oldPassword");
    var newPassword = document.getElementById("newPassword");
    var repeatNewPassword = document.getElementById("repeatNewPassword");

    if (validPasswordLength(newPassword.value) && validPasswordMatch(newPassword.value, repeatNewPassword.value))
    {
	var response = serverstub.changePassword(localStorage.getItem("userToken"), oldPassword.value, newPassword.value);

	if (response.success)
	{
	    displayMessage(response.message, "infoMessage");

	    document.getElementById("changePasswordForm").reset();
	}
	else
	{
	    displayMessage(response.message, "errorMessage");
	}
    }
	    
    return false;
}

var homePostMessageSubmit = function()
{
    var message = document.getElementById("homeMessage");
    
    postMessage(message.value, getEmail());

    loadMessages(getEmail(), "homeMessages");

    return false;
}

var searchProfileSubmit = function()
{
    var profileEmail = document.getElementById("profileEmail");
    
    var profileInformation = loadProfileInformation(profileEmail.value);

    if (profileInformation != undefined)
    {
	appendSearchProfileInformation(profileInformation);

	loadMessages(profileEmail.value, "browseMessages");

	localStorage.setItem("currentBrowseEmail", profileEmail.value);

	showBrowseElements();
    }

    return false;
}

var showBrowseElements = function()
{
    var browseElements = document.getElementsByClassName("hideBrowseElement");

    for (var i = browseElements.length - 1; i >= 0; --i)
    {
	browseElements[i].classList.remove("hideBrowseElement");
    }
}

var browsePostMessageSubmit = function()
{
    var message = document.getElementById("browseMessage");
    
    postMessage(message.value, localStorage.getItem("currentBrowseEmail"));

    loadMessages(localStorage.getItem("currentBrowseEmail"), "browseMessages");

    return false;
}
    
var postMessage = function(message, email)
{	
    var response = serverstub.postMessage(localStorage.getItem("userToken"), message, email);

    displayMessage(response.message, "infoMessage");
}

var validPasswordLength = function(password)
{
    return (password.length >= 6);
}

var validPasswordMatch = function(repeatPassword, password)
{
    return (password == repeatPassword);
}

var menuItemClick = function(menuItem)
{
    var selectedMenuItem = document.getElementsByClassName("selected");

    selectedMenuItem[0].classList.remove("selected");

    menuItem.classList.add("selected");

    var selectedContent = document.getElementsByClassName("selectedContent");

    selectedContent[0].classList.remove("selectedContent");

    var view;

    if (menuItem.getAttribute("id") == "homeButton")
    {
	view = document.getElementById("homeView");
    }
    else if (menuItem.getAttribute("id") == "browseButton")
    {
	view = document.getElementById("browseView");	    
    }
    else if (menuItem.getAttribute("id") == "accountButton")
    {
	view = document.getElementById("accountView"); 
    }
    
    view.classList.add("selectedContent");
}

var loadProfileInformation = function(email)
{
    var response = serverstub.getUserDataByEmail(localStorage.getItem("userToken"), email);

    if (response.success)
    {
	var profileInformation = {
	    name: response.data.firstname + " " + response.data.familyname,
	    email: response.data.email,
	    gender: response.data.gender,
	    city: response.data.city,
	    country: response.data.country,
	};

	return profileInformation;
    }
    else
    {
	displayMessage(response.message, "errorMessage");
    }
}

var appendProfileInformation = function(profileInformation)
{    
    document.getElementById("profileInfoName").innerHTML = "<span>Name:</span> " + profileInformation.name;
    document.getElementById("profileInfoEmail").innerHTML = "<span>Email:</span> " + profileInformation.email;
    document.getElementById("profileInfoGender").innerHTML = "<span>Gender:</span> " + profileInformation.gender;
    document.getElementById("profileInfoCity").innerHTML = "<span>City:</span> " + profileInformation.city;
    document.getElementById("profileInfoCountry").innerHTML = "<span>Country:</span> " + profileInformation.country;
}

var appendSearchProfileInformation = function(profileInformation)
{    
    document.getElementById("browseProfileInfoName").innerHTML = "<span>Name:</span> " + profileInformation.name;
    document.getElementById("browseProfileInfoEmail").innerHTML = "<span>Email:</span> " + profileInformation.email;
    document.getElementById("browseProfileInfoGender").innerHTML = "<span>Gender:</span> " + profileInformation.gender;
    document.getElementById("browseProfileInfoCity").innerHTML = "<span>City:</span> " + profileInformation.city;
    document.getElementById("browseProfileInfoCountry").innerHTML = "<span>Country:</span> " + profileInformation.country;
}

var loadMessages = function(email, elementId)
{
    var response = serverstub.getUserMessagesByEmail(localStorage.getItem("userToken"), email);

    if (response.success)
    {
	document.getElementById(elementId).innerHTML = "";

	for (var i = 0; i < response.data.length; ++i)
	{
	    createMessage(response.data[i].writer,response.data[i].content, elementId);
	}
    }
    else
    {
	displayMessage(response.message, "errorMessage");
    }
}

var createMessage = function(writer, content, elementId)
{
    var container = document.createElement("DIV");

    container.classList.add("messageContainer");

    var header = document.createElement("H2");

    var writerTextNode = document.createTextNode(writer);
    
    header.appendChild(writerTextNode);

    container.appendChild(header);

    var message = document.createElement("P");

    var messageTextNode = document.createTextNode(content);

    message.appendChild(messageTextNode);

    container.appendChild(message);

    document.getElementById(elementId).appendChild(container);
}

var getEmail = function()
{
    var response = serverstub.getUserDataByToken(localStorage.getItem("userToken"));

    if (response.success)
    {
	return response.data.email;
    }
    else
    {
	displayMessage(response.message, "errorMessage");
    }
}

var clearCustomValidityOnInput = function(element)
{
    element.oninput = function()
    {
	element.setCustomValidity("");
    }
}

var validatePasswordLengthOnInput = function(element)
{
    element.oninput = function()
    {
	if (validPasswordLength(element.value))
	    element.setCustomValidity("");
	else
	    element.setCustomValidity("Password must be at least 6 characters long.");
    }
}

var validatePasswordMatchOnInput = function(element, elementToMatch)
{
    elementToMatch.oninput = function()
    {
	if (validPasswordMatch(element.value, elementToMatch.value))
	    elementToMatch.setCustomValidity("");
	else
	    elementToMatch.setCustomValidity("Password doesn't match.");
    }
}

var setupLoginForm = function()
{    
    document.getElementById("loginForm").onsubmit = loginSubmit;
    
    clearCustomValidityOnInput(document.getElementById("loginEmail"));
}

var setupSignUpForm = function()
{   
    document.getElementById("signupForm").onsubmit = signupSubmit;

    validatePasswordLengthOnInput(document.getElementById("signupPassword"));

    validatePasswordMatchOnInput(document.getElementById("signupPassword"), document.getElementById("repeatPassword"));
}

var setupMenuItems = function()
{
    var menuItems = document.getElementsByClassName("menuItem");

    for (var i = 0; i < menuItems.length; ++i)
    {
	menuItems[i].onclick = function()
	{
	    menuItemClick(this);
	}
    }
}

var setupChangePasswordForm = function()
{
    document.getElementById("changePasswordForm").onsubmit = changePasswordSubmit;

    validatePasswordLengthOnInput(document.getElementById("newPassword"));
	
    validatePasswordMatchOnInput(document.getElementById("newPassword"), document.getElementById("repeatNewPassword"));
}

var loadProfile = function(email, wallId)
{
    appendProfileInformation(loadProfileInformation(email));

    loadMessages(email, wallId);
}

var setupRefreshButton = function(element, email, wallId)
{
    element.onclick = function()
    {	
	loadMessages(email, wallId);
    }
}

var loadSignedOut = function()
{    
    displayView("welcomeView");

    setupLoginForm();

    setupSignUpForm();
}

var loadSignedIn = function()
{
    displayView("profileView");

    loadProfile(getEmail(), "homeMessages");

    setupMenuItems();

    setupChangePasswordForm();

    document.getElementById("homePostMessageForm").onsubmit = homePostMessageSubmit;

    setupRefreshButton(document.getElementById("homeRefreshButton"), getEmail(), "homeMessages");
    setupRefreshButton(document.getElementById("browseRefreshButton"), localStorage.getItem("currentBrowseEmail"), "browseMessages");

    document.getElementById("searchProfileForm").onsubmit = searchProfileSubmit;

    document.getElementById("browsePostMessageForm").onsubmit = browsePostMessageSubmit;

    document.getElementById("signOut").onclick = signOut;
}

window.onload = function()
{
    if (localStorage.getItem("userToken") === null)
    {	
	loadSignedOut();
    }
    else
    {
	loadSignedIn();
    }
}