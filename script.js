function login(){

let username = document.getElementById("username").value;
let code = document.getElementById("code").value;

if(users[username] && users[username] === code){

localStorage.setItem("acces","autorise");
localStorage.setItem("user",username);

window.location="cours.html";

}else{

document.getElementById("msg").innerText="Accès refusé";

}

}

if(localStorage.getItem("acces")=="autorise"){

window.location="cours.html";

}