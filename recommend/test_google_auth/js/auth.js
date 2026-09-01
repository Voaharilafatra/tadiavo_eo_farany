const googleButton = document.getElementById("google-login");


// Initialiser Google UNE SEULE FOIS
google.accounts.id.initialize({
    client_id: "874902324188-k6donmtrqo5jpglatldd5ihfdrbmkn2q.apps.googleusercontent.com",
    callback: handleGoogleResponse
});


// Quand l'utilisateur clique
googleButton.addEventListener("click", () => {
    google.accounts.id.prompt();
});


// Réponse de Google
function handleGoogleResponse(response) {

    console.log("Réponse Google :", response);

    console.log("Credential :", response.credential);

}