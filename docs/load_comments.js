var comments_url = "https://9hz4ejld0d.execute-api.eu-west-2.amazonaws.com/DEV/dbitems";

// Data Handler Object /////////////////////////////////////////////////////////

function currentCommentData() {
	/*
		Make a function / class that will store the current comment data,
		and be able to identify new comments when asked to compare to new data.
		Also give it the ability to determine the current index of each comment 
		(by sorting comments according to their ID/timestamp), so that it can
		insert new comment objects in between existing comment object.

		To do this, we will need to have new comments stand out visually, maybe 
		with an animation and a little label that says 'new'
		e.g. in small red italics.
	*/
}

// Data Downloading / Uploading ////////////////////////////////////////////////

async function fetch_comment_data() {
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
}


function parse_comments(commentsData) {
	let parsedComments = [];
	for (let i = 0; i < commentsData.length; i++) {
		let commentInfo = {
			"timestamp": decodeURIComponent(commentsData[i]["timestamp"]["S"]),
			"name": decodeURIComponent(commentsData[i]["name"]["S"]),
			"text": decodeURIComponent(commentsData[i]["text"]["S"]),
			"commentID": decodeURIComponent(commentsData[i]["commentID"]["S"])
		}
		parsedComments.push(commentInfo);
	}

	parsedComments.sort((commentA, commentB) => {
		return commentB.timestamp - commentA.timestamp}
	);

	return parsedComments;
}


async function upload_comment(raw_name, raw_text, cTimestamp, cID) {	
	var cName = encodeURIComponent(raw_name);
	var cText = encodeURIComponent(raw_text);

	let body = JSON.stringify({
		"commentID": cID,
		"timestamp": cTimestamp,
		"name": cName,
		"text": cText
	});

	console.group("Message Input");
	console.log(cName);
	console.log(cText);
	console.log(body);
	console.groupEnd();

	fetch(comments_url,
	    {
		    headers: {
		      'Accept': 'application/json',
		      'Content-Type': 'application/json'
		    },
	    	method: "POST",
	    	body: body
    	}
	);
}


// UI Functions ////////////////////////////////////////////////////////////////


async function refresh_comment_display(currentPostID=null, retry=0) {
	await fetch_comment_data();
	comments = parse_comments(JSON.parse(localStorage["kcuichi_commentsData"]));

	// TODO: Check if there are any new comments here, compare to a saved 
	// WINDOW variable or something.

	if (true) {
		clearComments();

		for (let i = 0; i < comments.length; i++) {
			currComment = comments[i];
			create_comment(currComment.name, currComment.timestamp, currComment.text);
		}

		document.getElementById("commentsScrollbox").scrollTop = 0;
	}

	if (currentPostID!=null) {
		console.log(`Looking for comment with ID: ${currentPostID}...`);
		console.log(comments);
		let commentFound = false;
		for (let i = 0; i < comments.length; i++) {
			if (comments[i].commentID == currentPostID) {
				commentFound = true;
				break;
			}
		}

		document.getElementById("commentErrorText").textContent = "";

		if (commentFound == false) {
			if (retry >= 3) {
				// Comment was not found after 3 scans
				// Assume something has gone wrong
				document.getElementById("commentErrorText").textContent = `Error: Newly uploaded comment could not be found.`;
			} else {
				console.log(`Couldn't find comment yet - trying again (${retry})`);
				setTimeout(refresh_comment_display.bind(null, currentPostID, retry+1), 1000);
				return;
			}
		}

		// If here, we sent a new message and it has been found or abandoned
		// Reset the comment input areas
		document.getElementById("commentNameInput").value = "";
		document.getElementById("commentNameInput").disabled = false;
		document.getElementById("commentTextInput").value = "";
		document.getElementById("commentTextInput").disabled = false;
		document.getElementById("btnSendComment").disabled = false;
		document.getElementById("commentSendingMessage").classList.remove("active");
	}

	document.getElementById("commentsTitle").classList.remove("refreshing");
	document.getElementById("commentsScrollbox").classList.remove("paused");
}


function create_comment(commentName, commentTimestamp,
                        commentText, newComment=false) {
	var container = document.getElementById("commentsScrollbox");

	var outer_div = document.createElement("div");
	outer_div.classList.add("comment");
	
	let date = new Date(parseInt(commentTimestamp));
	let timeText = date.toLocaleString("en-US") + " (UK)";

	var name_div = document.createElement("div");
	var name_span = document.createElement("span");
	name_span.classList.add("commentName");
	name_span.textContent = commentName;
	var timestamp_span = document.createElement("span");
	timestamp_span.classList.add("commentTimestamp");
	timestamp_span.textContent = timeText;
	name_div.appendChild(name_span);
	name_div.appendChild(timestamp_span);

	var text_div = document.createElement("div");
	text_div.classList.add("commentText");
	text_div.textContent = commentText;

	outer_div.appendChild(name_div);
	outer_div.appendChild(text_div);

	container.appendChild(outer_div);
}


function clearComments() {
	document.getElementById("commentsScrollbox").innerHTML = "";
}


function onclick_comment_send() {
	console.log("Send Comment Clicked");
	var input_name = document.getElementById("commentNameInput");
	var input_text = document.getElementById("commentTextInput");
	var commentBtn = document.getElementById("btnSendComment");

	var cName = input_name.value;
	var cText = input_text.value;

	if ((cName.length == 0) || (cText.length == 0)) {
		return;
	}

	var date = new Date();
	var cTimestamp = String(date.getTime());
	var cID = cTimestamp + cName;

	input_name.disabled = true;
	input_text.disabled = true;
	commentBtn.disabled = true;

	document.getElementById("commentSendingMessage").classList.add("active");
	document.getElementById("commentsTitle").classList.add("refreshing");

	upload_comment(cName, cText, cTimestamp, cID);

	setTimeout(refresh_comment_display.bind(null, cID), 1000);
}


function onclick_comment_refresh() {
	console.log("Refresh Comments Clicked");
	document.getElementById("commentsScrollbox").classList.add("paused");
	document.getElementById("commentsTitle").classList.add("refreshing");
	setTimeout(refresh_comment_display, 500);
}


document.getElementById("btnSendComment").onclick = onclick_comment_send;
document.getElementById("commentsRefreshBtn").onclick = onclick_comment_refresh;
refresh_comment_display();