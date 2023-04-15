// Get the comments container object
// Load comment data
// For each comment, create a div with the Name, timestamp, and message
// Load only the last 50 comments?

var container = document.getElementById("commentsScrollbox");

function create_comment(commentName, commentTimestamp, commentText) {
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