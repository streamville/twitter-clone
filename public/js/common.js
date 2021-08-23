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
    
    var html = createPostHtml(postData);
    $(".postsContainer").prepend(html);
    textbox.val = "";
    button.prop("disabled", true);
  })
})

// Like button:
$(document).on("click", ".likeButton", (event) => {
  var button = $(event.target);
  var postId = getPostIdFromElement(button);
  
  if(postId === undefined) return;

  $.ajax({
    url: `/api/posts/${postId}/like`,
    type: "PUT",
    success: (postData) => {
      button.find("span").text(postData.likes.length || "");
    }
  })
})

function getPostIdFromElement(element){
  var isRoot = element.hasClass("post");
  var rootElement = isRoot == true ? element : element.closest(".post");
  var postId = rootElement.data().id;

  if(postId === undefined) return alert("postId undefined")

  return postId;
}

// create reuseable container for posts:
function createPostHtml(postData){
  console.log(postData);
  var postedBy = postData.postedBy;

  if(postedBy._id === undefined){
    return console.log("user object not populate");
  }
  var displayName = postedBy.firstName + " " + postedBy.lastName;
  var timestamp = timeDifference(new Date(), new Date(postData.createdAt));

  return `<div class="post" data-id="${postData._id}">
            <div class="mainContentContainer">
              <div class="userImageContainer">
                <img src='${postedBy.profileLogo}'/>
              </div>

              <div class="postContentContainer">
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
                    <button class="likeButton">
                      <i class="fas fa-heart"></i>
                      <span>${postData.likes.length || ""}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>`
}

// for timestamp:
function timeDifference(current, previous) {

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
       if(elapsed/1000 < 30) return "just now";   
  }
  else if (elapsed < msPerHour) {
       return Math.round(elapsed/msPerMinute) + ' minutes ago';   
  }
  else if (elapsed < msPerDay ) {
       return Math.round(elapsed/msPerHour ) + ' hours ago';   
  }
  else if (elapsed < msPerMonth) {
      return Math.round(elapsed/msPerDay) + ' days ago';   
  }
  else if (elapsed < msPerYear) {
      return Math.round(elapsed/msPerMonth) + ' months ago';   
  }
  else {
      return Math.round(elapsed/msPerYear ) + ' years ago';   
  }
}