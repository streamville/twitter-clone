$('#postTextarea, #replyTextarea').keyup(event => {
  var textbox = $(event.target);
  var value = textbox.val().trim()
  var isModal = textbox.parents(".modal").length == 1;
  var submitButton = isModal ? $("#submitReplyBtn") : $('#submitPostButton');

  if(submitButton.length == 0){
    console.log("No submit button found");
  }

  // disable submitButton if input value is empty:
  if(value == ""){
    submitButton.prop("disabled", true);
    return; 
  }
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
    textbox.val("");
    button.prop("disabled", true);
  })
})

// Reply modal:
$("#replyModal").on("show.bs.modal", (event) => {
  var button = $(event.relatedTarget);
  var postId = getPostIdFromElement(button);

  $.get("/api/posts/" + postId, results => {
    outputPosts(result, $("#originalPostContainer"))
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

      if(postData.likes.includes(userLoggedIn._id)){
        button.addClass("active");
      }
      else{
        button.removeClass("active");
      }
    }
  })
})

// Retweet button:
$(document).on("click", ".retweetButton", (event) => {
  var button = $(event.target);
  var postId = getPostIdFromElement(button);
  
  if(postId === undefined) return;

  $.ajax({
    url: `/api/posts/${postId}/retweet`,
    type: "POST",
    success: (postData) => {
      button.find("span").text(postData.retweetUsers.length || "");

      if(postData.retweetUsers.includes(userLoggedIn._id)){
        button.addClass("active");
      }
      else{
        button.removeClass("active");
      }
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

  if(postData == null) return alert('post object is null');

  var isRetweet = postData.retweetData !== undefined;
  var retweetedBy = isRetweet ? postData.postedBy.username : null;
  postData = isRetweet ? postData.retweetData : postData;

  var postedBy = postData.postedBy;
  console.log(postedBy);

  if(postedBy._id === undefined){
    return console.log("user object not populate");
  }
  var displayName = postedBy.firstName + " " + postedBy.lastName;
  var timestamp = timeDifference(new Date(), new Date(postData.createdAt));

  // caching previous Likes && Retweets:
  var likeBtnClassActive = postData.likes.includes(userLoggedIn._id) ? "active" : "";
  var retweetBtnClassActive = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : "";

  var retweetText = '';
  if(isRetweet){
    retweetText = `<span>Retweeted by <a href="/profile/${retweetedBy}">@${retweetedBy}</a></span>`
  }

  return `<div class="post" data-id="${postData._id}">
    <div class="postActionContainer">
    <i class="fas fa-retweet"></i> ${retweetText}
    </div>
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
                    <button data-toggle='modal' data-target='#replyModal'>
                      <i class="far fa-comment"></i>
                    </button>
                  </div>
                  <div class='postButtonContainer green'>
                    <button class='retweetButton ${retweetBtnClassActive}'>
                      <i class="fas fa-retweet"></i>
                      <span>${postData.retweetUsers.length || ""}</span>
                    </button>
                  </div>
                  <div class="postButtonContainer red">
                    <button class="likeButton ${likeBtnClassActive}">
                      <i class="fas fa-heart"></i>
                      <span>${postData.likes.length || ""}</span>
                    </button>
                  </div>
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

// from api/posts.js
function outputPosts(results, container){
  container.html("");
  
  if(Array.isArray(results)){
    results = [results];
  }
  results.forEach(result => {
    var html = createPostHtml(result)
    container.append(html);
  });

  if(results.length == 0){
    container.append("<span>Nothing to show</span>")
  }
}