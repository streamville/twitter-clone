$('#postTextarea').keyup(event => {
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

$('#submitPostButton').click(() => {
  var button = $(event.target);
  var textbox = $('#postTextarea');

  var data = {
    content: textbox.val()
  }
  // ajax:
  $.post("/api/posts", data, postData => {
    console.log(postData);
    var html = createPostHtml(postData);
    $(".postsContainer").prepend(html);
    textbox.val = "";
    button.prop("disabled", true);
  })
})

function createPostHtml(postData){

  var postedBy = postData.postedBy;
  var displayName = postedBy.firstName + " " + postedBy.lastName;
  var timestamp = postData.createdAt;;

  return `<div class="post">
            <div class="mainContentContainer">
              <div class="userImageContainer">
                <img src='${postedBy.profileLogo}'/>
              </div>

              <div class="postContentContainer'>
                <div class="header">
                <span class="displayName">${displayName}</span>
                  <a class="username" href="/profile/${postedBy.username}">@${postedBy.username}</a>
                  <span class="timestamp">${timestamp}</span>
                </div>
                
                <div class="postBody">
                  <span>${postData.content}</span>
                </div>

                <div class="postFooter">
                  <div class="postButtonContainer">
                    <button>
                      <i class="far fa-comment"></i>
                    </button>
                    <button>
                      <i class="fas fa-retweet"></i>
                    </button>
                    <button>
                      <i class="fas fa-heart"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>`
}