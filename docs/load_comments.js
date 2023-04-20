// Get the comments container object
// Load comment data
// For each comment, create a div with the Name, timestamp, and message
// Load only the last 50 comments?

var comments_url = "https://9hz4ejld0d.execute-api.eu-west-2.amazonaws.com/DEV/dbitems";


function clearComments() {
	document.getElementById("commentsScrollbox").innerHTML = "";
}


function create_comment(commentName, commentTimestamp, commentText) {
	var container = document.getElementById("commentsScrollbox");

	var outer_div = document.createElement("div");
	outer_div.classList.add("comment");
	
	var name_div = document.createElement("div");
	var name_span = document.createElement("span");
	name_span.classList.add("commentName");
	name_span.textContent = commentName;
	var timestamp_span = document.createElement("span");
	timestamp_span.classList.add("commentTimestamp");
	timestamp_span.textContent = commentTimestamp;
	name_div.appendChild(name_span);
	name_div.appendChild(timestamp_span);

	var text_div = document.createElement("div");
	text_div.classList.add("commentText");
	text_div.textContent = commentText;

	outer_div.appendChild(name_div);
	outer_div.appendChild(text_div);

	container.appendChild(outer_div);
}


function parseComments(commentsData) {
	let parsedComments = [];
	for (let i = 0; i < commentsData.length; i++) {
		let commentInfo = {
			"timestamp": commentsData[i]["timestamp"]["S"],
			"name": commentsData[i]["name"]["S"],
			"text": commentsData[i]["text"]["S"]
		}
	parsedComments.push(commentInfo);
	}

	parsedComments.sort((commentA, commentB) => {
		return commentB.timestamp - commentA.timestamp}
	);

	clearComments();

	for (let i = 0; i < parsedComments.length; i++) {
		currComment = parsedComments[i];
		create_comment(currComment.name, currComment.timestamp, currComment.text);
	}
}


async function fetch_comment_data(lastUpload=null) {
	var date = new Date();

	lastDownload = parseFloat(localStorage["kcuichi_lastDownload_comments"]);

	if (isNaN(lastDownload) || (lastDownload + 0 < date.getTime())) { // 1260000
		console.log("Downloading comments data...");
		await fetch(comments_url)
		.then(response => response.json())
		.then(responseJSON => {
			localStorage["kcuichi_commentsData"] = JSON.stringify(responseJSON["Items"]);
			localStorage["kcuichi_lastDownload_comments"] = JSON.stringify(date.getTime());
		});
	} else {
		console.log("Using previously downloaded comments data...");
	}

	parseComments(JSON.parse(localStorage["kcuichi_commentsData"]));
}


create_comment("Elliott", "15/05/2023 10:23am", "Hi, hope you're well!");
create_comment("Elliott", "15/05/2023 10:23am", "Hi, hope you're well! I'm going to try and write you a reaaaaaaaaaaaaaally long message here, just to see what happens when I force the text box to overflow because there's way more than the 140 character limit that I'm eventually going to impose.");
create_comment("Elliott", "15/05/2023 10:23am", "Hi, hope you're well!");
create_comment("Elliott", "15/05/2023 10:23am", "Hi, hope you're well!");
create_comment("Elliott", "15/05/2023 10:23am", "Hi, hope you're well!");
create_comment("Elliott", "15/05/2023 10:23am", "Hi, hope you're well!");
create_comment("Elliott", "15/05/2023 10:23am", "Hi, hope you're well!");
create_comment("Elliott", "15/05/2023 10:23am", "Hi, hope you're well!");
create_comment("Elliott", "15/05/2023 10:23am", "Hi, hope you're well!");
create_comment("Elliott", "15/05/2023 10:23am", "Hi, hope you're well!");
create_comment("Elliott", "15/05/2023 10:23am", "Hi, hope you're well!");
create_comment("Elliott", "15/05/2023 10:23am", "Hi, hope you're well!");
create_comment("Elliott", "15/05/2023 10:23am", "Hi, hope you're well!");
create_comment("Elliott", "15/05/2023 10:23am", "Hi, hope you're well!");
create_comment("Elliott", "15/05/2023 10:23am", "Hi, hope you're well!");
create_comment("Elliott", "15/05/2023 10:23am", "Hi, hope you're well!");
create_comment("Elliott", "15/05/2023 10:23am", "Hi, hope you're well!");
create_comment("Elliott", "15/05/2023 10:23am", "Hi, hope you're well!");
create_comment("Elliott", "15/05/2023 10:23am", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");


async function create_new_comment() {
	var date = new Date();
	var cName = document.getElementById("commentNameInput").value;
	var cText = document.getElementById("commentTextInput").value;
	var cTimestamp = String(date.getTime());
	var cID = cTimestamp + cName;

	console.log(cID, cName, cText, cTimestamp)

	fetch(comments_url,
	    {
		    headers: {
		      'Accept': 'application/json',
		      'Content-Type': 'application/json'
		    },
	    	method: "POST",
	    	body: JSON.stringify({"commentID": cID,
	    	                      "timestamp": cTimestamp,
	    	                      "name": cName,
	    	                      "text": cText,
	    	                      "timestamp": cTimestamp
	    	                    })
    	}
	);

	// Refresh comments?
}




function clickCommentButton() {
	create_new_comment();
	fetch_comment_data();
}

document.getElementById("btnSendMessage").onclick = clickCommentButton;

// document.getElementById("btnSendMessage").onclick = create_new_comment;

		// await fetch(comments_url)
		// .then(response => response.json())
		// .then(responseJSON => {
		// 	console.log(responseJSON);
		// 	localStorage["kcuichi_commentsData"] = JSON.stringify(responseJSON["Items"]);
		// });