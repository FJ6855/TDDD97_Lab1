var displayView = function()
{
    //the code to display a viewrequired
}

var signOut = function()
{
    serverstub.signOut(localStorage.getItem("userToken"));

    localStorage.removeItem("userToken");

    location.reload();
}

var loginSubmit = function()
{
    var loginEmail = document.getElementById("loginEmail");
    var loginPassword = document.getElementById("loginPassword");

    var response = serverstub.signIn(loginEmail.value, loginPassword.value);

    if (response.success)
    {
	localStorage.setItem("userToken", response.data);
    }
    else
    {
	loginEmail.setCustomValidity(response.message);
	loginEmail.checkValidity();

	return false;
    }
}

var changePasswordSubmit = function()
{
    var oldPassword = document.getElementById("oldPassword");
    var newPassword = document.getElementById("newPassword");
    var repeatNewPassword = document.getElementById("repeatNewPassword");

    if (validatePasswordLength(oldPassword) && validatePasswordLength(newPassword) && validatePasswordMatch(newPassword, repeatNewPassword))
    {
	var response = serverstub.changePassword(localStorage.getItem("userToken"), oldPassword.value, newPassword.value);

	if (response.success)
	{
	    alert(response.message);
	}
	else
	{
	    oldPassword.setCustomValidity(response.message);
	    oldPassword.checkValidity();
	    
	    return false;
	}
    }
    else
    {
	return false;
    }
}

var signupSubmit = function()
{
    var signupPassword = document.getElementById("signupPassword");
    var repeatPassword = document.getElementById("repeatPassword");
    
    if (validatePasswordLength(signupPassword) && validatePasswordMatch(signupPassword, repeatPassword))
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
	    alert(response.message);
	}
	else
	{ 
	    var signupEmail = document.getElementById("signupEmail");
	    
	    signupEmail.setCustomValidity(response.message);
	    signupEmail.checkValidity();
	    
	    return false;
	}
    }
    else
    {
	return false;
    }
}

var postMessageSubmit = function()
{
    var message = document.getElementById("message");
    
    postMessage(message.value, getEmail());
}
    
var postMessage = function(message, email)
{	
    var response = serverstub.postMessage(localStorage.getItem("userToken"), message, email);

    alert(response.message);
}

var validatePasswordLength = function(passwordElement)
{
    if (passwordElement.value.length < 6)
    {
	passwordElement.setCustomValidity("Password must be at least 6 characters long");

	return false;
    }
    else
    {
	passwordElement.setCustomValidity("");

	return true;
    }
}

var validatePasswordMatch = function(repeatPasswordElement, passwordElement)
{
    if (passwordElement.value != repeatPasswordElement.value)
    {
	repeatPasswordElement.setCustomValidity("Password doesn't match");

	return false;
    }
    else
    {
	repeatPasswordElement.setCustomValidity("");

	return true;
    }
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
    else if (menuItem.getAttribute("id") == "signOut")
    {
	signOut();
    }
    
    view.classList.add("selectedContent");
}

var loadProfileInformation = function(email)
{
    var response = serverstub.getUserDataByEmail(localStorage.getItem("userToken"), email);

    if (response.success)
    {
	var profileInformation = {
	    name: document.createTextNode(response.data.firstname + " " + response.data.familyname),
	    email: document.createTextNode(response.data.email),
	    gender: document.createTextNode(response.data.gender),
	    city: document.createTextNode(response.data.city),
	    country: document.createTextNode(response.data.country),
	};

	return profileInformation;
    }
    else
    {
	alert(response.message);
    }
}

var appendProfileInformation = function(profileInformation)
{    
    document.getElementById("profileInfoName").appendChild(profileInformation.name);
    document.getElementById("profileInfoEmail").appendChild(profileInformation.email);
    document.getElementById("profileInfoGender").appendChild(profileInformation.gender);
    document.getElementById("profileInfoCity").appendChild(profileInformation.city);
    document.getElementById("profileInfoCountry").appendChild(profileInformation.country);
}

var appendSearchProfileInformation = function(profileInformation)
{    
    document.getElementById("searchProfileInfoName").appendChild(profileInformation.name);
    document.getElementById("searchProfileInfoEmail").appendChild(profileInformation.email);
    document.getElementById("searchProfileInfoGender").appendChild(profileInformation.gender);
    document.getElementById("searchProfileInfoCity").appendChild(profileInformation.city);
    document.getElementById("searchProfileInfoCountry").appendChild(profileInformation.country);
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
	alert(response.message);
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

var searchProfileSubmit = function()
{
    var profileEmail = document.getElementById("profileEmail");
    
    var profileInformation = loadProfileInformation(profileEmail.value);

    appendSearchProfileInformation(profileInformation);

    loadMessages(profileEmail.value, "browseMessages");

    localStorage.setItem("currentBrowseEmail", profileEmail.value);

    return false;
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
	alert(response.message);
    }
}

var loadView = function(viewId)
{
    var view = document.getElementById(viewId);
	
    document.getElementsByTagName("body")[0].innerHTML = view.innerHTML;
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
	validatePasswordLength(element);
    }
}

var validatePasswordMatchOnInput = function(element, elementToMatch)
{
    element.oninput = function()
    {
	validatePasswordMatch(element, elementToMatch);
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

    validatePasswordMatchOnInput(document.getElementById("repeatPassword"), document.getElementById("signupPassword"));
    
    clearCustomValidityOnInput(document.getElementById("signupEmail"));
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

    validatePasswordLengthOnInput(document.getElementById("oldPassword"));

    validatePasswordLengthOnInput(document.getElementById("newPassword"));
	
    validatePasswordMatchOnInput(document.getElementById("repeatNewPassword"), document.getElementById("newPassword"));
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

window.onload = function()
{
    if (localStorage.getItem("userToken") === null)
    {	
	loadView("welcomeView");

	setupLoginForm();

	setupSignUpForm();
    }
    else
    {
	loadView("profileView");

	loadProfile(getEmail(), "homeMessages");

	setupMenuItems();

	setupChangePasswordForm();

	document.getElementById("postMessageForm").onsubmit = postMessageSubmit;

	setupRefreshButton(document.getElementById("homeRefreshButton"), getEmail(), "homeMessages");
	setupRefreshButton(document.getElementById("browseRefreshButton"), localStorage.getItem("currentBrowseEmail"), "browseMessages");

	document.getElementById("searchProfileForm").onsubmit = searchProfileSubmit;
    }
}