// TODO: Add in a way to just query the latest comments, instead of loading them all every single time

var comments_url = "https://9hz4ejld0d.execute-api.eu-west-2.amazonaws.com/DEV/dbitems";


function clearComments() {
	document.getElementById("commentsScrollbox").innerHTML = "";
}


function create_comment(commentName, commentTimestamp, commentText) {
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


function parseComments(commentsData) {
	let parsedComments = [];
	for (let i = 0; i < commentsData.length; i++) {
		let commentInfo = {
			"timestamp": decodeURIComponent(commentsData[i]["timestamp"]["S"]),
			"name": decodeURIComponent(commentsData[i]["name"]["S"]),
			"text": decodeURIComponent(commentsData[i]["text"]["S"])
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

	document.getElementById("commentsScrollbox").scrollTop = 0;
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


async function create_new_comment() {
	var date = new Date();
	
	var input_name = document.getElementById("commentNameInput");
	var input_text = document.getElementById("commentTextInput");
	var commentBtn = document.getElementById("btnSendMessage");
	
	var cName = encodeURIComponent(input_name.value);
	var cText = encodeURIComponent(input_text.value);
	var cTimestamp = String(date.getTime());
	var cID = cTimestamp + cName;

	input_name.disabled = true;
	input_text.disabled = true;
	commentBtn.disabled = true;

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


function refreshCommentSection() {
	var input_name = document.getElementById("commentNameInput");
	var input_text = document.getElementById("commentTextInput");
	var commentBtn = document.getElementById("btnSendMessage");

	input_name.value = "";
	input_text.value = "";
	input_name.disabled = false;
	input_text.disabled = false;
	commentBtn.disabled = false;

	fetch_comment_data();
}


function clickCommentButton() {
	create_new_comment();
	setTimeout(refreshCommentSection, 1000);
	// fetch_comment_data();
}


document.getElementById("btnSendMessage").onclick = clickCommentButton;

// document.getElementById("btnSendMessage").onclick = create_new_comment;

		// await fetch(comments_url)
		// .then(response => response.json())
		// .then(responseJSON => {
		// 	console.log(responseJSON);
		// 	localStorage["kcuichi_commentsData"] = JSON.stringify(responseJSON["Items"]);
		// });

fetch_comment_data();