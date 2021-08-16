$('#postTextArea').keyup(event => {
  var textbox = $(event.target);
  var value = textbox.val().trim()
  var submitButton = $('#submitPostButton');

  if(submitButton.length == 0){
    console.log("No submit button found");
  }

  // disable submitButton if input value is empty:
  if(value = ""){
    submitButton.prop("disabled", true);
    return; 
  }
  // otherwise:
  submitButton.prop("disabled", false);
})