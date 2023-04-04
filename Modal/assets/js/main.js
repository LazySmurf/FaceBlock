$(document).ready(function () {
    var DevInfo = "LazySmurf";

    //Auto-Open Modal
    $('.showModal').click()
    var selectedPhrase = generatePhrase();
    $("#selectedPhrase").html(selectedPhrase);
    $("#PassPhraseLabel").click();

    //Random phrase picking for user entry
    function generatePhrase() {
        var selectedPhrase = "Facebook is all I've got, man"
        var phraseArray = [
            "I have free time to be browsing Facebook I promise",
            "I have nothing better to do right now than scroll",
            "There's nothing I could be doing right now besides Facebook",
            "My to-do list is empty and this is how I want to spend my free time",
            "Maybe I shouldn't be on Facebook right now but I'm going to anyway"
        ];
        var randomNumber = Math.floor(Math.random() * phraseArray.length);
        selectedPhrase = phraseArray[randomNumber];
        return(selectedPhrase);
    }

    //Monitor button clicks
    var AttemptsCounter = 0
    $('#submit, #logo').click(function () {
        //If the submit button is clicked, perform the check against the selected phrase.
        if (this.id == 'submit') {
            AttemptsCounter += 1; //Also keep track of attempts :)
            if ($("#PassPhrase").val() == selectedPhrase) {
                    //If the textbox value matches the selected phrase, we log the info and close the modal.
                    console.log("Match! (Attempt #" + AttemptsCounter +")");
                    console.log("Selected Phrase:\t" + selectedPhrase);
                    console.log("Entered Phrase:\t\t" + (($("#PassPhrase").val() == "") ? '{empty}' : $("#PassPhrase").val()));
                    console.log("\t");

                    //Showing success message even though it will fade away quickly
                    $("#message").removeClass("text-danger").addClass("text-success");
                    $("#message").html("Success! Allowing access...");

                    //Closing the modal
                    var myModalEl = document.getElementById('staticBackdrop');
                    var modal = bootstrap.Modal.getInstance(myModalEl)
                    modal.hide();
            } else {
                    //If they don't match, log the info and pick a new phrase, then show an error message on the modal.
                    console.log("No Match! (Attempt #" + AttemptsCounter +")");
                    console.log("Selected Phrase:\t" + "[Obscured for Security]");
                    console.log("Entered Phrase:\t\t" + (($("#PassPhrase").val() == "") ? '{empty}' : $("#PassPhrase").val()));
                    console.log("\t");
                    selectedPhrase = generatePhrase();
                    $("#selectedPhrase").html(selectedPhrase);

                    //Showing error message
                    $("#message").removeClass("text-success").addClass("text-danger");
                    $("#message").html("Nope! Phrase entered incorrectly.");
            }
        }

        //If the logo image is clicked, we will show an alert with some version info
        else if (this.id == 'logo') {
           alert(apps[i].innerHTML = chrome.runtime.getManifest().name + '\nVersion ' + chrome.runtime.getManifest().version_name + "\n\nBy " + chrome.runtime.getManifest().author);
        }
     });
});