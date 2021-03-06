// ==UserScript==
// @name         RLC
// @namespace    http://tampermonkey.net/
// @version      3.5.6
// @description  Chat-like functionality for Reddit Live
// @author       FatherDerp, Stjerneklar, thybag, mofosyne, jhon, 741456963789852123, MrSpicyWeiner, Concerned Hobbit (TheVarmari), gabewert(ParagonalDuck)
// @include      https://www.reddit.com/live/*
// @exclude      https://www.reddit.com/live/
// @exclude      https://www.reddit.com/live
// @exclude      https://www.reddit.com/live/*/edit*
// @exclude      https://www.reddit.com/live/*/contributors*
// @exclude      https://*.reddit.com/live/create*
// @require      https://code.jquery.com/jquery-2.2.3.min.js
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==
(function() {
 /*¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨
																			  RLC GLOBAL VARIABLES SECTION BELOW
010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010
____________________________________________________________________________________________________________________________________________________________________________*/

	// set default states for options
	if (!GM_getValue("rlc-NoEmotes")) {                    GM_setValue("rlc-NoEmotes",                false);}
	if (!GM_getValue("rlc-ChannelColors")) {                GM_setValue("rlc-ChannelColors",            true);}
	if (!GM_getValue("rlc-AutoScroll")) {                   GM_setValue("rlc-AutoScroll",               true);}
	if (!GM_getValue("rlc-TextToSpeechTTS")) {                 GM_setValue("rlc-TextToSpeechTTS",             false);}
	if (!GM_getValue("rlc-TTSUsernameNarration")) { 	    GM_setValue("rlc-TTSUsernameNarration",      false);}
	if (!GM_getValue("rlc-RobinColors")) {                  GM_setValue("rlc-RobinColors",              false);}
	if (!GM_getValue("rlc-CSSBackgroundAlternation")) { 	GM_setValue("rlc-CSSBackgroundAlternation", false);}
	if (!GM_getValue("rlc-DebugMode")) {                    GM_setValue("rlc-DebugMode",                false);}

	// Grab users username + play nice with RES
	var robinUser = $("#header-bottom-right .user a").first().text().toLowerCase();

	// Channel Colours
	var colors = ["rgba(255,0,0,0.1)", "rgba(0,255,0,0.1)", "rgba(0,0,255,0.1)", "rgba(0,255,255,0.1)", "rgba(255,0,255,0.1)", "rgba(255,255,0,0.1)", "rgba(211,211,211, .1)", "rgba(0,100,0, .1)", "rgba(255,20,147, .1)", "rgba(184,134,11, .1)"];

	// Notification sound in base64 encoding
	var base64sound ="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QECBtFxREzTNkMyfLLVlM9UgS6aQnkPEo3DJRYkUyVQacP6j+5rqMc4TaCiVCxzSEDIKUTvMec6D7tk0aS4CEYQqahfEu6jh/We1NrVrQzhbTKZBgYbi8YbecRuLTMpTvUoAIIlynCMCimNNtBMWwDOcZIMABFMmDZPSCQgzPrLBYvUyQFMUd6UR1kbzgIGfWKw/SrqKgg5coZaKgUBQzOtyEaucSrOTBlGOqpGMNYXtGwYFhwTdfZ/nmjb0QUrCKicsj8alcPp0y7KmpuOEVAQSvUg25SKDofWuZEBtKidNLZhQJ0oGpdfVeGhJgUUEjARAINH4cGP3olbJAcdDR4gdl/onWtSmuw1xa2WVPSOy6CJ4qHBgSoO8r9UmcZiT4P+YkAhcKf+BJTTY44/cYFV5vLKV2XeYQShgODRoQoL8Kv/7ksTXgBhp4TbVygAE2sIlAzuwAJ5JQRVudDXlr7DoQRA6LbSquF6tu7RZb5t9nGr1bOOvx+64QknJBvtR///////////////6R48LQFE////////////////2AwDFdBkACAVhVSstnYaa015ymstdiCPRbJK5R0zROkwvcAhgeoNiRyAwEGJhpENIsbJLJknUCBC5jw5QzRuQEc0uCEwauFwjqEFhBYXEVxjQyKGKSXFmigRmTxeLx0mUjEumrUkklJJLLpqogQ5x4mhziLGyJdRatHrRLrooskk6Jq6Jqj1o/qSSqS/60UZkXmUkk9FFGtFH/9aPRRZRkXmSLyT0W/0UaLKSSWYl1zFMQU1FMy45OC4yqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OC4yqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+5LEoQPVgaL0XYiAAAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
	var snd = new Audio("data:audio/wav;base64, " + base64sound);

	// Chrome notice image in bass64
	var chromeNotificationImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAIAAABuYg/PAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAADgSURBVFhH7ZdRbsMwDENzgt7/Sj2VG0eEKxGUmgJOUKR5eMNgiRH3u6U5lgPA6Q08sHg+povL1mJNlJiu9Z1bdkKT2Zv+rAyL7/8OfFbcFKOID2QiGhEBMYr4QCaiERHgt2JkpAgpOMNvxchIEVJwht+KkZEipODMeL9HER/IRDQiAmIU8YFMRCMi4EcmFvtqvPisuEnTg7zLpniXTfGXyopVZn2tQ9Nhscqsr3VoOixWmfW1Dk299Zb8eKpDUxKhHdCH5K7QLK9ddt3/YtYf6zuoEpetxX4ZtpgLTq+09gIQTX1K/dS/IgAAAABJRU5ErkJggg==";

	// HTML for injection, inserted at doc.ready
	var htmlPayload =  `<div id="rlc-wrapper">
                          <div id="rlc-header">
                            <div id="rlc-titlebar"></div>
                            <div id="rlc-statusbar"></div>
                        </div>
                        <div id="rlc-leftpanel">&nbsp;</div>
						<div id="rlc-main">
							<div id="rlc-chat"></div>
                            <div id="rlc-messagebox">
					            <select id="rlc-channel-dropdown">
								    <option></option>
								    <option>%general</option>
								    <option>%offtopic</option>
								    <option>%dev</option>
							    </select>
                                <div id="rlc-sendmessage">Send Message</div>
						    </div>
					    </div>
                        <div id="rlc-sidebar">
                            <div id="rlc-settingsbar">
							    <div id="rlc-toggleoptions" title="Show Options" class="noselect">Options</div>
                                <div id="rlc-update" class="noselect"><a target="_blank" href="https://github.com/BNolet/RLC/raw/master/rlcs.user.js" rel="nofollow">Update RLC</a></div>
                                <div id="rlc-toggleguide" title="Show Guide" class="noselect">Readme</div>
                                <div id="loadmessages">Load Msgs</div>
								<div id="s2compactmode">Compact</div>
								<div id="s2tts">TTS</div>
						    </div>
						    <div id="rlc-main-sidebar"></div>
						    <div id="rlc-readmebar">
							</div>
							<div id="rlc-guidebar">
							</div>
							<div id="rlc-settings">
							</div>
						</div>
                        <div id="myContextMenu">
							<ul>
								<li id="mute"><a>Mute User</a></li>
								<li id="PMUser"><a>PM User</a></li>
								<li id="deleteCom"><a>Delete Comment</a></li>
								<li id="copyMessage"><a>Copy Message</a></li>
                                <li id="copyEmbed"><a>Copy Embed</a><li>
							</ul>
						</div>
                    </div>`;

/*¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨
																			  RLC VARIOUS FUNCTIONS SECTION BELOW
010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010
____________________________________________________________________________________________________________________________________________________________________________*/

   // Scroll chat back to bottom
	var scollToBottom = function(){
		$("#rlc-chat").scrollTop($("#rlc-chat")[0].scrollHeight);
	};

	// Option based relay for debug info via console.log, use for checks that make sense to track long term
	function RLClog(thingtolog) {
		if (GM_getValue("rlc-DebugMode")) console.log(thingtolog);
	}

	// Manipulate native reddit live into loading old messages
	function loadHistory() {
		if (GM_getValue("rlc-TextToSpeech")) {
			// TODO: Switch to something more user-friendly. Message in the chat?
			alert("You have TextToSpeech enabled, please disable to load old messages.");
		} else {
			loadingInitialMessages = 1;
			$("body").toggleClass("allowHistoryScroll");
			$("body").scrollTop($("body")[0].scrollHeight);
			scollToBottom();
			$("body").toggleClass("allowHistoryScroll");
		}
	}

	// Time converter for active user list
	function convertTo24Hour(time) {
		var hours = parseInt(time.substr(0, 2));
		if (time.indexOf("am") !== -1 && hours === 12) time = time.replace("12", "0");
		if (time.indexOf("pm") !== -1 && hours < 12) time = time.replace(hours, (hours + 12));
		return time.replace(/(am|pm)/, "");
	}

	var b = GM_getValue("mutedUsers");
	if(b!=undefined){
		var mutedUsers = b;
		console.log(mutedUsers);
	}else{
		var mutedUsers = [];
	}
	
	function updateMutedUsers() {
		// Reset by removing CSS and userlist
		$("#mystyle").remove();
		$("#bannedlist").empty();

		// Iterate over the muted users
		var selectors = [];
		for(let i = 0; i <= mutedUsers.length; i++){
			if (mutedUsers[i] !== undefined) {    // Avoid the undefined one I cant figure out why I'm puttin in
				selectors.push(`.u_${mutedUsers[i]}{display:none;}`);      // Generate CSS display none rule for user in list
				$('.u_'+mutedUsers[i]).addClass('muted');
				$("#bannedlist").append(`<p>${mutedUsers[i]}</p>`);        // Generate interface element for disabling muting
				reAlternate();
			}
		}
		$("body").append(`<style id='mystyle'>${selectors.join(" ")}</style>`); // Inject style tag with user rules

		// Handle clicking in muted user list (needs to be here for scope reasons)
		$("#bannedlist p").click(function(){
			let target = $(this).text();
			let targetPosition = mutedUsers.indexOf(target);
			$('.u_'+mutedUsers[targetPosition]).removeClass('muted');
			reAlternate();
			$(this).remove();  // Remove this element from the muted list
			mutedUsers.splice(targetPosition, 1);  // Remove target from the muted array
			updateMutedUsers(); // Update
			scollToBottom();
		});
		GM_setValue("mutedUsers", mutedUsers);
	}

	var activeUserArray = [],
		activeUserTimes = [],
		updateArray = [];

	// Update active user list
	function processActiveUsersList() {
		$("#rlc-activeusers ul").empty();
		updateArray = [];

		for(let i = 0; i <= activeUserArray.length; i++){
			if (updateArray.indexOf(activeUserArray[i]) === -1 && activeUserArray[i] !== undefined) {
				updateArray.push(activeUserArray[i]);
				$("#rlc-activeusers ul").append(`<li><span class='activeusersUser'>${activeUserArray[i]}</span> @ <span class='activeusersTime'>${activeUserTimes[i]}</span></li>`);
			} else if (updateArray.indexOf(activeUserArray[i]) > -1) {
				/* TODO: Add things.

				   Add message counter value
				   Check if timestamp is recent enough? */
			}
		}
	}

	// Create persistant option
	function createOption(name, clickAction, defaultState){
		var checkedMarkup;
		var key = "rlc-" + name.replace(/\W/g, "");
		var state = (typeof defaultState !== "undefined") ? defaultState : false;
		// Try and state if setting is defined
		if (GM_getValue(key)){
			state = GM_getValue(key);
		}
		// Markup for state
		checkedMarkup = state ? "checked='checked'" : "";
		// Render option
		var $option = $(`<label><input type='checkbox' ${checkedMarkup}>${name}</label>`).click(function(){
			let checked = $(this).find("input").is(":checked");

			// Persist state
			if (checked !== state){
				GM_setValue(key, checked);
				state = checked;
			}

			clickAction(checked, $(this));
		});
		// Add to DOM
		$("#rlc-settings").append($option);
		clickAction(state, $option);
		console.log(key+" = "+state);
	}

/*¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨
																			  RLC MESSAGE HANDLING FUNCTIONS SECTION BELOW
010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010
____________________________________________________________________________________________________________________________________________________________________________*/

	// Channel prefix removal
	var removeChannelKeyFromMessage = function(message){
		if ($("#rlc-chat").attr("data-channel-key")){
			var offset = $("#rlc-chat").attr("data-channel-key").length;
			if (offset === 0) return message;

			if (message.indexOf("/me") === 0) return "/me "+ message.slice(offset+5);
			return message.slice(offset+1);
		}
		return message;
	};

	// Convert string to hex (for user colors)
	function toHex(str) {
		var result = "";
		for (var i=0; i<str.length; i++) {
			result += str.charCodeAt(i).toString(16);
		}
		return result;
	}

	// Generate random value based on seed, max and minimum (for user colors)
	Math.seededRandom = function(seed, max = 1, min = 0) {
		// In order to work 'seed' must NOT be undefined,
		// So in any case, you HAVE to provide a Math.seed

		seed = (seed * 9301 + 49297) % 233280;
		var rnd = seed / 233280;

		return parseInt(min + rnd * (max - min));
	};

	// Message background alternation via js
	var rowAlternator = false;
	// Modify color by amount
	function LightenDarkenColor2(col, amt) {
		var r = col.slice(0,2);
		var g = col.slice(2,4);
		var b = col.slice(4,6);
		if (rowAlternator) amt+=10;   // TODO: Might want to rethink this
		var randR = (Math.seededRandom(r*100,120,175));
		var randG = (Math.seededRandom(g*100,120,175));
		var randB = (Math.seededRandom(b*100,120,175));

		// TODO-SUGGESTION: Code readability
		var suppress = (Math.seededRandom(col*r*10,0,6));
		var modAmt =2 ;
		switch(suppress) {
			case 0:
				randR/=modAmt;
				break;
			case 1:
				randG/=modAmt;
				break;
			case 2:
				randB/=modAmt;
				break;
			case 4:
				randR/=modAmt;
				randG/=modAmt;
				break;
			case 5:
				randR/=modAmt;
				randB/=modAmt;
				break;
			case 6:
				randG/=modAmt;
				randB/=modAmt;
				break;
			default:
				//console.log(suppress);
				//console.log("This shouldn't happen! (LightenDarkenColor2 switch case)");
				break;
		}

		var hexR = (parseInt(randR) + parseInt(amt)).toString(16);
		var hexG = (parseInt(randG) + parseInt(amt)).toString(16);
		var hexB = (parseInt(randB) + parseInt(amt)).toString(16);

		return hexR + hexG + hexB;
	}

	function messageMentionHandler(line, $usr, $el) {
		if (line.indexOf(robinUser) !== -1){
			// Add bold highlighting
			$el.addClass("user-mention");

		}
	}

	function alternateMsgBackground($el) {
		if (!GM_getValue("rlc-CSSBackgroundAlternation")) {
			if (loadingInitialMessages === 0) {
				var $child = $('.liveupdate-listing:not(.muted)').children()[1];
				rowAlternator=($($child).hasClass('alt-bgcolor'));
			}else{
				rowAlternator=!rowAlternator;
			}
			if(rowAlternator === false){
				$el.addClass("alt-bgcolor");
			}
		}
	}

	// emoji trigger list. supports multiple triggers for one emote(eg meh) and automaticly matches both upper and lower case letters(eg :o/:O)
	var emojiList={	":)": "smile",
					":((": "angry",
					":(": "frown",
					":s": "silly",
					":I": "meh",
					":|": "meh",
					":/": "meh",
					":o": "shocked",
					":D": "happy",
					"D:": "sad",
					";_;": "crying",
					"T_T": "crying",
					";)": "wink",
					"-_-": "zen",
					"X|": "annoyed",
					"X)": "xsmile",
					"X(": "xsad",
					"XD": "xhappy",
					":P": "tongue"};

	function emoteSupport(line, $msg, firstLine) {
		if (!GM_getValue("rlc-NoEmotes")){
			$.each(emojiList, function(emoji,replace){
				if (line.toLowerCase().indexOf(emoji.toLowerCase()) !== -1 && line.indexOf("http") === -1){
					if ($msg.has("h1").length === 0 && $msg.has("li").length === 0 && $msg.has("code").length === 0 && $msg.has("table").length === 0){
						firstLine.html(firstLine.html().split(emoji.toUpperCase()).join(emoji.toLowerCase()));
						firstLine.html(firstLine.html().split(emoji.toLowerCase()).join(`<span class='mrPumpkin mp_${replace}'></span>`));
					}
				}
			});
		}
	}

	// User color
	function messageUserColor($usr) {
		if (!GM_getValue("rlc-RobinColors")) {
			var hexName = toHex($usr.text()).split("");
			var adder = 1;
			$.each(hexName, function(ind,num){
				num = (parseInt(num) + 1);
				if (num !== 0 && !isNaN(num)){
					adder = adder * num;
				}
			});
			adder = adder.toString().replace(".", "").split("0").join("");
			let start = adder.length-10;
			let end = adder.length-4;
			var firstThree = adder.toString().substring(start, end);

			// Variable brigtening of colors based on dark mode setting
			if (GM_getValue("rlc-DarkMode")){
				var lighterColor = LightenDarkenColor2(firstThree, 60);
				$usr.css("color", "#"+lighterColor);
			}
			else {
				var darkerColor = LightenDarkenColor2(firstThree, -40);
				$usr.css("color", "#"+darkerColor);
			}
		} else {
			$usr.css("color", getColor($usr.text())); //ROBIN COLORS!!!!!
		}
	}

	// Timestamp modification & user activity tracking
	function timeAndUserTracking($el, $usr) {
		var shortTime = $el.find(".body time").attr("title").split(" ");
		var amPm = shortTime[4].toLowerCase();

		if (!(amPm === "am" || amPm === "pm")) { amPm = " "; }

		var militarytime = convertTo24Hour(shortTime[3] + " " + amPm);

		if ($("body").hasClass("rlc-24hrTimeStamps")) {
			shortTime = convertTo24Hour(shortTime[3] + " " + amPm);
		} else {
			shortTime = shortTime[3]+" "+amPm;
		}

		// Add simplified timestamps
		if ($el.find(".body .simpletime").length <= 0) {
			$el.find(".body time").before(`<div class='simpletime'>${shortTime}</div>`);
		}

		// Add info to activeuserarray
		activeUserArray.push($usr.text());
		activeUserTimes.push(militarytime);

		// Moved here to add user activity from any time rather than only once each 10 secs. (Was in tab tick function, place it back there if performance suffers)
		processActiveUsersList();
	}

	// I'm not even going to try to clear this up.
	function messageClickHandler($usr, $msg, $el) {
		var $menu = $("#myContextMenu");
		$usr.click(function(event){
			event.preventDefault();
			if ($menu.css("display") === "none" && !isNaN(divPos["left"]) && !isNaN(divPos["top"]) ) {
				if (window.innerHeight-100 > divPos["top"]){
					$menu.css({"left":divPos["left"], "top":divPos["top"], "display": "initial"}); //menu down
				} else {
					$menu.css({"left":divPos["left"], "top":divPos["top"]-70, "display": "initial"}); //menu up
				}

				var $button = $(this).parent().siblings().find(".delete").find("button");
				if ($button.length>0){
					$menu.find("#deleteCom").removeClass("disabled");
				} else {
					$menu.find("#deleteCom").addClass("disabled");
				}
				$menu.find("ul li").unbind("click");
				$menu.find("ul li").bind("click", function(){
					var $id = $(this).attr("id");
					if ($id === "deleteCom" && $(this).has(".disabled").length === 0){
						deleteComment($el);
					}
					if ($id === "PMUser"){
						OpenUserPM($usr.text());
					}
					if ($id === "mute"){
						var banusername = String($usr.text()).trim();
						mutedUsers.push(banusername);
						updateMutedUsers();
					}
					if ($id === "copyMessage"){
						var copystring = String($usr.text()).trim() + " : " + String($msg.text()).trim();
						$(".usertext-edit.md-container textarea").focus().val(copystring);
					}
                    if ($id === "copyEmbed"){
                        console.log($el.find("iframe"));
                        if ($el.find("iframe")) {   
                        $("#rlc-leftpanel").empty();
                            $("#rlc-leftpanel").append($el.find("iframe"));
                        }
                    }
					$menu.css({"left":0, "top":0, "display": "none"}); //close menu
				});
				$("body").unbind("click");
				$("body").bind("click", function(e) {
					if ($(e.target).closest($usr).length === 0) {
						$menu.css({"left":0, "top":0, "display": "none"});
					}
				});
			} else {
				$menu.css({"left":0, "top":0, "display": "none"}); //close menu
			}
		});
	}

	// Used differentiate initial and subsequent messages
	var loadingInitialMessages = 1;

	// Track if username has been mentioned
	var meMentioned = 0;
	// Message display handling for new and old (rescan) messages
	// Add any proccessing for new messages in here
	var handleNewMessage = function($el, rescan){
		//console.log(rescan);

		var $msg = $el.find(".body .md");
		var $usr = $el.find(".body .author");
		var line = $msg.text().toLowerCase();
		var firstLine = $msg.find("p").first();

		meMentioned = 0;

		// /me support
		if (line.indexOf("/me") === 0){
			$el.addClass("user-narration");
			firstLine.html(firstLine.html().replace("/me", " " + $usr.text().replace("/u/", "")));
			meMentioned = 1;
		}

		if($msg.text().length>250){
			$msg.addClass("longMessageClosed");
			firstLine.prepend("<input type='button' value='+' class='extendButton' style='width:18px;height:18px;padding:0px;font-size:0.8em'>");
			$msg.on('click', '.extendButton', function () {
				if($msg.hasClass("longMessageClosed")){
					$msg.removeClass("longMessageClosed");
					$msg.find('.extendButton').val('-');
				}else{
					$msg.addClass("longMessageClosed");
					$msg.find('.extendButton').val('+');
				}
			});
		}

		// Target blank all message links
		$msg.find("a").attr("target", "_blank");

		// Prevent embedly iframe link handling
		if (!$("body").hasClass("left-panel")) {
		firstLine.html(firstLine.html()+" ");
		$("#rlc-main iframe").remove();
		}

		// Insert time
		$usr.before($el.find("time"));

		// Remove the /u/ in author name
		$usr.text($usr.text().replace("/u/", ""));

		// Tag message with user identifier for muting
		$el.addClass("u_"+$usr.text());

		// Alternating background color
		alternateMsgBackground($el);

		// Current User name mentioned
		messageMentionHandler(line, $usr, $el);

		// Emote support
		emoteSupport(line, $msg, firstLine);

		// Easy (and hacky) multiline
		$msg.html($msg.html().split("\n").join("<br>"));
		$msg.html($msg.html().replace("<br><br>","<br>"));
		$msg.html($msg.html().replace("</p><br>", ""));

		// Track channels
		tabbedChannels.proccessLine(line, $el, rescan);

		// Remove separator
		$(".liveupdate-listing .separator").remove();

		// Timestamp modification & user activity tracking
		timeAndUserTracking($el, $usr);
		messageUserColor($usr); // User color

		messageClickHandler($usr, $msg, $el);  // Message click handling
		
		if(mutedUsers.indexOf($usr.text())!=-1){ //deal with muting
			$msg.parent().addClass('muted'); 
		}
		
		if (loadingInitialMessages === 0) {
			reAlternate();
			// Stuff that should not be done to messages loaded on init, like TTS handling
			if (rescan) {
				//console.log("This is the rescan. Do you copy? Not sure why we're reporting. Over and out.");
				// This is rescan, do nothing. rescans happen when channel tabs are changed
			}
			else {
				// Not rescan, read aloud if TTS enabled
				if (line.indexOf(robinUser) !== -1){
					if ($("body").hasClass("rlc-notificationsound")) {
						snd.play();
					}
					if ($("body").hasClass("rlc-notificationchrome")) {
						new Notification("Robin Live Chat",{
							icon: chromeNotificationImage,
							body: $usr.text() + ": " + line
						});
					}
				}
				if(!$msg.parent().hasClass('muted')){
					messageTextToSpeechHandler($msg, $usr);
				}
			}
		}
	};

	function getColor(username) {
		var colors = ["#e50000", "#db8e00", "#ccc100", "#02be01", "#0083c7", "#820080"];
		var e = username.toLowerCase(),
			t = e.replace(/[^a-z0-9]/g, ""),
			n = parseInt(t, 36) % 6;
		return colors[n];
	}
	function OpenUserPM(name) {
		var $url = "https://www.reddit.com/message/compose/?to=";
		var win = window.open($url+name, "_blank");
		win.focus();
	}
	function reAlternate($objComment){
		if($objComment===undefined){
			var alt=false;
			for(i=$('.liveupdate-listing').children().length;i>=0;i--){
				var obj=$('.liveupdate-listing').children()[i];
				if(!$(obj).hasClass('muted')){
					$(obj).removeClass('alt-bgcolor');
					if(alt){
						$(obj).addClass('alt-bgcolor');
					}
					alt=!alt;
				}
			}
		}else{
			var found;
			var alt;
			for(i=$('.liveupdate-listing').children().length;i>=0;i--){
				var obj=$('.liveupdate-listing').children()[i];
				if(obj == $objComment.context) {
					found=true;
					alt = $($('.liveupdate-listing').children()[i+1]).hasClass("alt-bgcolor");
				}
				if(found){
					$($('.liveupdate-listing').children()[i]).removeClass('alt-bgcolor');
					if(alt){
						$($('.liveupdate-listing').children()[i]).addClass('alt-bgcolor');
					}
					alt=!alt;
				}
			}
		}
	}
	function deleteComment($objComment){
		if ($objComment.has(".buttonrow").length>0){
			reAlternate($objComment);
			var $button = $objComment.find(".delete").find("button");
			$button.click();
			$button = $objComment.find(".delete").find(".yes");
			$button.click();
		}
	}
	var divPos = {};
	$(document).mousemove(function(e){
		divPos = {
			left: e.pageX,
			top: e.pageY
		};
	});


/*¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨
																			  RLC TEXT TO SPEECH FUNCTIONS SECTION BELOW
010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010
____________________________________________________________________________________________________________________________________________________________________________*/

    	// Numbers to english words for TTS
	var digits = ["", "one ", "two ", "three ", "four ", "five ", "six ", "seven ", "eight ", "nine ", "ten ", "eleven ", "twelve ", "thirteen ", "fourteen ", "fifteen ", "sixteen ", "seventeen ", "eighteen ", "nineteen "],
		tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

	function numberToEnglish (num) {
		if ((num = num.toString()).length > 9) return "Overflow in numberToEnglish function.";
		let n = ("000000000" + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);

        /* NOTE: IF YOU REPLACE != with !== below, the numbers are read wrong */
		if (!n) return; var str = "";
		str += (n[1] != 0) ? (digits[Number(n[1])] || tens[n[1][0]] + " " + digits[n[1][1]]) + "crore " : "";
		str += (n[2] != 0) ? (digits[Number(n[2])] || tens[n[2][0]] + " " + digits[n[2][1]]) + "lakh " : "";
		str += (n[3] != 0) ? (digits[Number(n[3])] || tens[n[3][0]] + " " + digits[n[3][1]]) + "thousand " : "";
		str += (n[4] != 0) ? (digits[Number(n[4])] || tens[n[4][0]] + " " + digits[n[4][1]]) + "hundred " : "";
		str += (n[5] != 0) ? ((str != "") ? "and " : "") + (digits[Number(n[5])] || tens[n[5][0]] + " " + digits[n[5][1]]) + " " : "";
		return str.trim();
	}
    
	function getNumbers(input) {
		return input.match(/[0-9]+/g);
	}

	// Select Emoji to narration tone
	var toneList = {"smile": "with a smile",
					"angry": "angrily",
					"frown": "while frowning",
					"silly": "pulling a silly face",
					"meh": " in a disinterested manner",
					"shocked": "in shock",
					"happy": "happily",
					"sad": "sadly",
					"crying": "tearfully",
					"wink": " while winking",
					"zen": "in zen mode",
					"annoyed": "expressing annoyance",
					"xsmile": "with a big smile",
					"xsad": "very sadly",
					"xhappy": "very happily",
					"tongue": "while sticking out a tongue"};
	// Abbreviation Expansion (All keys must be in uppercase)
	var replaceStrList = {	"WTF":
							"What The Fuck",
							"BTW": "By The Way",
							"NVM": "Nevermind",
							"AFAIK": "As Far As I Know",
							"OFC": "Of Course",
							"AFK": "Away From Keyboard",
							"AKA": "Also Known As",
							"ASAP": "As Soon As Possible",
							"CYA": "See Ya",
							"IKR": "I Know Right",
							"IMO": "In My Own Opinion",
							"JK": "Just Kidding",
							"OMG": "Oh My God",
							"RTFM": "Read The Fucking Manual",
							"TLDR": "Too Long, Didn't Read",
							"FTW": "For The Win",
							"FFS": "For Fucks Sake"};

	var langSupport = ["en", "en-US", "ja", "es-US", "hi-IN", "it-IT", "nl-NL", "pl-PL", "ru-RU"];

	function strSeededRandInt (str, min = 0, max = 256, code = 0){
		for(let i = 0; i < str.length; i++){
			code += str.charCodeAt(i);
		}
		return code % (1 + max - min) + min;
	}

	function messageTextToSpeechHandler($msg, $usr) {
		if (GM_getValue("rlc-TextToSpeechTTS")) { 
		if($msg.text().length<250){
				var linetoread = $msg.text().split("...").join("\u2026"); //replace 3 dots with elipsis character
				var hasTripple = /(.)\1\1/.test(linetoread);
				var numbermatches = getNumbers(linetoread);
				//RLClog("initial linetoread "+linetoread);
				$.each(numbermatches, function(i) {
					linetoread = linetoread.split(numbermatches[i]).join(numberToEnglish(numbermatches[i]));
				});
				if (!hasTripple) {
					// Narrator logic based on content (Btw: http://www.regexpal.com/ is useful for regex testing)
					var checkingStr = linetoread.trim(); // Trim spaces to make recognition easier
					linetoread = linetoread.split(" ").map(function(token){
						if ( token.toUpperCase() in replaceStrList ){return replaceStrList[token];} else {return token;}
					}).join(" ");
					// Emoji Detection (Btw: I am a little unconfortable with this function, since its relying on the second class of that span to always be the same )
					var msgemotes = $msg.find(".mrPumpkin"); // find all emotes in message
					var domEmoji = "";
					if (msgemotes.length) {
						var finalemote;
						$.each(msgemotes, function() {
							finalemote = $(this).attr("class");

						});
						var lastEmote = finalemote.split(" ")[1].split("mp_")[1]; // Btw `.split("mp_")[1]` means to get rid of the `mp_` bit in example `mp_happy` to get just `happy` (Note: This can be fragile if "mp_" is changed to something else)
						domEmoji = lastEmote;
					}
					var toneStr="";
					if ( domEmoji in toneList ){
						toneStr = " " + toneList[domEmoji];
					}
					// Narration Style
					var msg;
                    var usr = $usr.text();
                    if (usr == "741456963789852123") { usr = "7-41"; }
                    //RLClog("usr name for narration "+usr)
	                if (!GM_getValue("rlc-TTSUsernameNarration")) {
	                    msg = new SpeechSynthesisUtterance(linetoread + toneStr);
	                } else {
	                    switch (true) {   //These are causing AutoScroll not to work..? (FF)
	                        case /.+\?$/.test(checkingStr): // Questioned
	                            msg = new SpeechSynthesisUtterance(linetoread + " questioned " + usr + toneStr );
	                            break;
	                        case /.+\!$/.test(checkingStr):   // Exclaimed
	                            msg = new SpeechSynthesisUtterance(linetoread + " exclaimed " + usr + toneStr );
	                            break;
	                        case /.+[\\\/]s$/.test(checkingStr): // Sarcasm switch checks for /s or \s at the end of a sentence
	                            linetoread = linetoread.trim().slice(0, -2);
	                            msg = new SpeechSynthesisUtterance(linetoread + " stated " + usr + "sarcastically");
	                            break;
	                        case checkingStr === checkingStr.toUpperCase(): //Check for screaming
	                            msg = new SpeechSynthesisUtterance(linetoread + " shouted " + usr + toneStr );
	                            break;
	                        case meMentioned === 1: //Check for /me
	                            msg = new SpeechSynthesisUtterance( linetoread  + toneStr  );
	                            break;
	                        default: // said
	                            msg = new SpeechSynthesisUtterance(linetoread + " said " + usr + toneStr );
	                            break;
	                    }
                        //RLClog("message: "+ linetoread + " said " + $usr.text() + toneStr );
	                }
						// Now speak the sentence
					// msg.voiceURI = 'native';

					// Set variable voice type

					if (!$("body").hasClass("rlc-NoUserVoices")){ // You want to be able to disable this in options.
						// Select voices that english users can use, even if its not for english exactly...
						var voiceList = speechSynthesis.getVoices().filter(function(voice) {
							for (var key in langSupport) {
								if ( voice.lang.indexOf(langSupport[key]) > -1 ){ return true; }
							}
						});
						// Cheap String Seeded Psudo Random Int Hash (Author: mofosyne)

						msg.voice = voiceList[strSeededRandInt($usr.text(),0,voiceList.length-1)];
						msg.pitch = 0.0 + (1.6-0.0)*strSeededRandInt($usr.text()+" pitch salt ",0,10)/10; // random range: 0.5 to 1.5
						msg.rate  = 0.8 + (1.2-0.8)*strSeededRandInt($usr.text()+" rate salt ",0,10)/10; // random range: 0.5 to 1.5

						// pitch alteration is known to break firefox TTS, rate is reset for suspicion of the same behavior
						if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1)
						{
							msg.pitch = 1;
							msg.rate = 1;
						}

						//RLClog(msg.pitch);
						//RLClog(msg.rate);
						//RLClog(msg.voice);

					}
					msg.volume = 1; // 0 to 1
					//msg.rate = 1; // 0.1 to 10
					//msg.pitch = 1; //0 to 2
					window.speechSynthesis.speak(msg);
					// get supported voices
					/*speechSynthesis.getVoices().forEach(function(voice) {
							console.log(voice.lang, voice.name);
						});*/
				}
			}
		}
	}

/*¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨
																			  RLC TABBED CHANNELS FUNCTION SECTION BELOW
010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010
____________________________________________________________________________________________________________________________________________________________________________*/

	// rate limiter for prevention of message send withn 1 sec on previous user message, see Tick and Event Handlers
	var rateLimit = 0;
	// badmanfix tts (see channel Tick)
	//var badmanfixtts = 1;
	// channel tabs megafunction
	var tabbedChannels = new function(){
		/* Basic usage - tabbedChannels.init( dom_node_to_add_tabs_to );
	 * and hook up tabbedChannels.proccessLine(lower_case_text, jquery_of_line_container); to each line detected by the system */
		var _self = this;

		// Default options
		this.channels = ["%general", "%offtopic"];
		this.mode = "single";

		// internals
		this.unreadCounts = {};
		this.$el = null;
		this.$opt = null;
		this.defaultRoomClasses = "";
		this.channelMatchingCache = [];

		//channels user is in currently
		this.currentRooms = 0;

		// When channel is clicked, toggle it on or off
		this.toggleChannel = function(e){
			var channel = $(e.target).data("filter");
			if (channel===null)return; // no a channel

			if (!$("#rlc-chat").hasClass("rlc-filter-" + channel)){
				_self.enableChannel(channel);
				$(e.target).addClass("selected");
				// clear unread counter
				$(e.target).find("span").text(0);
				_self.unreadCounts[channel] = 0;
			} else {
				_self.disableChannel(channel);
				$(e.target).removeClass("selected");
			}

			// scroll everything correctly
			scollToBottom();
		};

		// Enable a channel
		this.enableChannel = function(channelID){
			// if using room type "single", deslect other rooms on change
			if (this.mode === "single"){
				this.disableAllChannels();
			}

			$("#rlc-chat").addClass("rlc-filter rlc-filter-" + channelID);
			$("#rlc-chat").attr("data-channel-key", this.channels[channelID]);
			this.currentRooms++;
			// unselect show all
			_self.$el.find("span.all").removeClass("selected");
		};

		// disable a channel
		this.disableChannel = function(channelID){
			$("#rlc-chat").removeClass("rlc-filter-" + channelID);
			this.currentRooms--;

			// no rooms selcted, run "show all"
			if (this.currentRooms === 0){
				this.disableAllChannels();
			} else {
				// Grab next channel name if u leave a room in multi mode
				$("#rlc-chat").attr("data-channel-key", $(".rlc-filters span.selected").first().data("filter-name"));
			}
		};

		// turn all channels off
		this.disableAllChannels = function(){
			$("#rlc-chat").attr("class", _self.defaultRoomClasses).attr("data-channel-key", "");
			_self.$el.find(".rlc-filters > span").removeClass("selected");
			this.currentRooms = 0;

			_self.$el.find("span.all").addClass("selected");
			scollToBottom();
		};

		// render tabs
		this.drawTabs = function(){
			var html = "";
			for(var i in this.channels){
				if (typeof this.channels[i] === "undefined") continue;
				html += `	<span data-filter="${i}" data-filter-name="${this.channels[i]}">
								${this.channels[i]}(<span>0</span>)
							</span> `;
			}
			this.$el.find(".rlc-filters").html(html);
		};

		// After creation of a new channel, go find if any content (not matched by a channel already) is relevant
		this.reScanChannels = function(){
			$("#rlc-chat").find("li.liveupdate").each(function(idx,item){
				var line = $(item).find(".body .md").text().toLowerCase();
				tabbedChannels.proccessLine(line, $(item), true);
			});
		};

		// Add new channel
		this.addChannel = function(newChannel){
			if (this.channels.indexOf(newChannel) === -1){
				this.channels.push(newChannel);
				this.unreadCounts[this.channels.length-1] = 0;
				this.updateChannelMatchCache();
				this.saveChannelList();
				this.drawTabs();

				// Populate content for channel
				this.reScanChannels();

				// refresh everything after redraw
				this.disableAllChannels();
			}
		};

		// remove existing channel
		this.removeChannel = function(channel){
			if (confirm("are you sure you wish to remove the " + channel + " channel?")){
				var idx = this.channels.indexOf(channel);
				delete this.channels[idx];
				this.updateChannelMatchCache();
				this.saveChannelList();
				this.drawTabs();

				// sub channels, will fall back to existing channels
				this.reScanChannels();

				// refresh everything after redraw
				this.disableAllChannels();
			}
		};


		// save channel list
		this.saveChannelList = function(){
			// clean array before save
			var channels = this.channels.filter(function (item) { return item !== undefined; });
			GM_setValue("rlc-channels", channels);
		};

		// Change chat mode
		this.changeChannelMode = function(){
			_self.mode = $(this).data("type");

			// swicth bolding
			$(this).parent().find("span").css("font-weight", "normal");
			$(this).css("font-weight", "bold");
			_self.disableAllChannels();

			// Update mode setting
			GM_setValue("rlc-mode", _self.mode);
		};

		this.updateChannelMatchCache = function(){
			var order = this.channels.slice(0);
			order.sort(function(a, b){
				return b.length - a.length; // ASC -> a - b; DESC -> b - a
			});
			for(var i in order){
				order[i] = this.channels.indexOf(order[i]);
			}
			// sorted array of channel name indexs

			this.channelMatchingCache = order;
		};

		// Procces each chat line to create text
		this.proccessLine = function(text, $elment, rescan){
			var i, idx, channel;

			// If rescanning, clear any existing "channel" classes
			if (typeof rescan !== "undefined" && rescan === true){
				$elment.removeClass("in-channel");

				for(i=0; i <= this.channels.length; i++){
					$elment.removeClass("rlc-filter-" + i);
				}
			}

			// Scan for channel identifiers
			for(i=0; i< this.channelMatchingCache.length; i++){ // Sorted so longer get picked out before shorter ones (sub channel matching)
				idx = this.channelMatchingCache[i];
				channel = this.channels[idx];

				if (typeof channel === "undefined") continue;

				// Handle channel prefix in message
				if (text.indexOf(channel) === 0){
					$elment.find(".body").append(`<a class='channelname'>&nbsp;in&nbsp;${channel}</a>`);
					$elment.addClass(`rlc-filter-${idx} in-channel`);
					this.unreadCounts[idx]++;

					// Remove channel name in messages
					var newele = $elment.find(".body .md p").html().replace(channel, "");
					$elment.find(".body .md p").html(newele);

					return;
				}
			}
		};

		// If in one channel, auto add channel keys
		this.submitHelper = function(){
			if ($("#rlc-chat").hasClass("rlc-filter")){
				// Auto add channel key
				let channelKey = $("#rlc-chat").attr("data-channel-key");

				if ($("#new-update-form textarea").val().indexOf("/me") === 0){
					$("#new-update-form textarea").val("/me " + channelKey + " " + $("#new-update-form textarea").val().substr(3));
				} else if ($("#new-update-form textarea").val().indexOf("/") !== 0){
					// If it's not a "/" command, add channel
					$("#new-update-form textarea").val(channelKey + " " + $("#new-update-form textarea").val());
				}
			}
			// else read from dropdown populated by channels
			else {
				let channelKey = $("#rlc-channel-dropdown option:selected" ).text();

				if (channelKey !== "") {
					if ($("#new-update-form textarea").val().indexOf("/me") === 0){
						$("#new-update-form textarea").val("/me " + channelKey + " " + $("#new-update-form textarea").val().substr(3));
					} else if ($("#new-update-form textarea").val().indexOf("/") !== 0){
						// If it's not a "/" command, add channel
						$("#new-update-form textarea").val(channelKey + " " + $("#new-update-form textarea").val());
					}
				}
			}
		};

		// Update everythang
		this.tick = function(){
			_self.$el.find(".rlc-filters span").each(function(){
				if ($(this).hasClass("selected")) return;
				$(this).find("span").text(_self.unreadCounts[$(this).data("filter")]);
				loadingInitialMessages = 0;
			});
			// Rate limit disable
			rateLimit = 0;
		};

		// Init tab zone
		this.init = function($el){
			// Load channels
			if (GM_getValue("rlc-channels")){
				this.channels = GM_getValue("rlc-channels");
			}
			if (GM_getValue("rlc-mode")){
				this.mode = GM_getValue("rlc-mode");
			}

			// Init counters
			for(var i in this.channels){
				this.unreadCounts[i] = 0;
			}

			// Update channel cache
			this.updateChannelMatchCache();

			this.$el = $el;
			// Create inital markup
			this.$el.html("<span class='all selected'>Global</span><span><div class='rlc-filters'></div></span><span class='more'>[Channels]</span>");
			this.$opt = $("<div class='rlc-channel-add' style='display:none'><input name='add-channel'><button>Add channel</button> <span class='channel-mode'>Channel Mode: <span title='View one channel at a time' data-type='single'>Single</span> | <span title='View many channels at once' data-type='multi'>Multi</span></span></div>").insertAfter(this.$el);

			// Attach events
			this.$el.find(".rlc-filters").click(this.toggleChannel);
			this.$el.find("span.all").click(this.disableAllChannels);
			this.$el.find("span.more").click(function(){ $(".rlc-channel-add").toggle(); $("body").toggleClass("rlc-addchanmenu"); });
			this.$el.find(".rlc-filters").bind("contextmenu", function(e){
				e.preventDefault();
				e.stopPropagation();
				var chanID = $(e.target).data("filter");
				if (chanID===null)return; // no a channel
				_self.removeChannel(_self.channels[chanID]);
			});

			// Form events
			this.$opt.find(".channel-mode span").click(this.changeChannelMode);
			this.$opt.find("button").click(function(){
				var newChan = _self.$opt.find("input[name='add-channel']").val();
				if (newChan !== "") _self.addChannel(newChan);
				_self.$opt.find("input[name='add-channel']").val("");
			});


			$(".save-button .btn").click(this.submitHelper);

			// Store default room class
			this.defaultRoomClasses = $("#rlc-chat").attr("class") ? $("#rlc-chat").attr("class") : "";

			// Redraw tabs
			this.drawTabs();

			// Start ticker
			setInterval(this.tick, 2000);
		};
	}();

/*¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨
																			  RLC EVENT HANDLING SECTION BELOW
010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010
____________________________________________________________________________________________________________________________________________________________________________*/

	// Message history
	var messageHistory = [],
		messageHistoryIndex = -1,
		lastTyped = "";

	// Messagebox event handling
	function messageboxEventHandling() {
		var textArea = $(".usertext-edit.md-container textarea");

		// On post message, add it to history
		$(".save-button .btn").click(function(){
			var userLastMessage = textArea.val();

			// If message history is to long, clear it out
			if (messageHistory.length === 25){
				messageHistory.shift();
			}
			messageHistory.push(removeChannelKeyFromMessage(userLastMessage));
			messageHistoryIndex = messageHistory.length;
		});

		// Handling of keypresses in messagebox textarea
		textArea.on("keydown", function(e) {
			// Tab autocomplete
			if (e.keyCode === 9) { // Stole my old code from Parrot
				processActiveUsersList();
				e.preventDefault();
				var sourceAlt= $(".usertext-edit textarea").val();
				var namePart = "";
				var space=sourceAlt.lastIndexOf(" ");
				namePart = sourceAlt.substring(space).trim();
				sourceAlt = sourceAlt.substring(0, sourceAlt.lastIndexOf(" "));
				var found=false;
				$.each(updateArray, function(ind,Lname){
					if (Lname.indexOf(namePart) === 0){
						namePart=Lname;
						if (space !== -1) namePart = " "+namePart;
						found = true;
						return true;
					} else if (Lname.toLowerCase().indexOf(namePart.toLowerCase()) === 0){ // This is in an else because it should give priority to case Sensitive tab completion
						namePart = Lname;
						if (space !== -1) namePart=" "+namePart;
						found = true;
						return true;
					}
				});
				if (found){
					$(".usertext-edit textarea").val(sourceAlt+namePart);
				}
			}
			// Enter message send
			if (e.keyCode === 13) {
				if (e.shiftKey) { /* Exit enter handling to allow shift+enter newline */  }
				else if (textArea.val() === "" ) { e.preventDefault();  }
				else if (rateLimit === 1) { e.preventDefault();console.log("rate limit hit");}
				else {
					if (textArea.val().indexOf("/version") === 0){
						/* eslint-disable camelcase */
						$(this).val(`RLC v.${GM_info.script.version} has been released. Use the link in the sidebar to update.`);
						/* eslint-enable camelcase */
					}
					e.preventDefault();
					$(".save-button .btn").click();
					$("#new-update-form textarea").val("");
					rateLimit = 1;
				}
			}
			else if (e.keyCode === 38) {
				e.preventDefault();
				if (messageHistoryIndex > 0) messageHistoryIndex--;
				if (messageHistoryIndex === messageHistory.length-1) lastTyped = $(this).val();
				if (messageHistoryIndex > -1) $(this).val(messageHistory[messageHistoryIndex]);
			}
			else if (e.keyCode === 40){
				e.preventDefault();
				if (messageHistoryIndex < messageHistory.length){
					messageHistoryIndex++;
					$(this).val(messageHistory[messageHistoryIndex]);
				}
				if (messageHistoryIndex === messageHistory.length) $(this).val(lastTyped);
			}
		});

	}


	function mouseClicksEventHandling() {
		// Right click author names in chat to copy to messagebox
		$("body").on("contextmenu", ".liveupdate .author", function (event) {
			if (!$("body").hasClass("rlc-altauthorclick")) {
				event.preventDefault();
				let username = String($(this).text()).trim();
				let source = String($(".usertext-edit.md-container textarea").val());
				// Focus textarea and set the value of textarea
				$(".usertext-edit.md-container textarea").focus().val(source + " " + username + " ");
			}
		});

		// Load old messages
		$("#loadmessages").click(function(){
			loadHistory();
		});

		// Easy access options
		$("#s2compactmode").click(function(){
			$( "#rlc-settings label:contains('Compact Mode') input" ).click();
		});
		$("#s2tts").click(function(){
			$( "#rlc-settings label:contains('Text To Speech (TTS)') input" ).click();
		});

		//$("#rlc-togglesidebar").click(function(){   $("body").toggleClass("rlc-hidesidebar");   scollToBottom();  });
		$("#rlc-toggleoptions").click(function(){   $("body").removeClass("rlc-showreadmebar"); $("body").toggleClass("rlc-showoptions");});
		$("#rlc-toggleguide").click(function(){     $("body").removeClass("rlc-showoptions");   $("body").toggleClass("rlc-showreadmebar");});
		$("#rlc-sendmessage").click(function(){     $(".save-button .btn").click();});

	}


/*¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨
																			  RLC INIT FUNCTIONS SECTION BELOW
010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010
____________________________________________________________________________________________________________________________________________________________________________*/


	function rlcSetupContainers() {
		$("body").append(htmlPayload);

		$(".liveupdate-listing").prependTo("#rlc-chat");
		$("#new-update-form").insertBefore("#rlc-sendmessage");
		$("#liveupdate-header").appendTo("#rlc-header #rlc-titlebar");
  		$("#liveupdate-statusbar").appendTo("#rlc-header #rlc-statusbar");        
		$("#liveupdate-resources").appendTo("#rlc-sidebar #rlc-main-sidebar");

		tabbedChannels.init($("<div id=\"filter_tabs\"></div>").insertBefore("#rlc-chat"));
	}

	function rlcParseSidebar() {
		// Put anything after -RLC-README- in the sidebar into the readme
		let str = $("#liveupdate-resources .md").html();
		let res = str.split("<p>--RLC-SIDEBAR-GUIDE--</p>");
		$("#liveupdate-resources .md").html(res[0]);
		$("#rlc-readmebar .md").append(res[1]);

		// Put anything before -RLC-MAIN- in the sidebar into the guide
		str = $("#liveupdate-resources .md").html();
		res = str.split("<p>--RLC-SIDEBAR-MAIN--</p>");
		$("#liveupdate-resources .md").html(res[1]);
		$("#rlc-guidebar .md").append(res[0]);

		$("#rlc-main-sidebar").append("<div id='rlc-activeusers'><ul></ul></div>");
		$("#rlc-main-sidebar").append("<div id='banlistcontainer'><div id='bannedlist'></div></div>");
		/* eslint-disable camelcase */
		$("#rlc-statusbar").append("<div id='versionnumber'>Reddit Live Chat (RLC) v." + GM_info.script.version + "</div>");
		/* eslint-enable camelcase */
	}

	function rlcDocReadyModifications() {
		// Show hint about invites if there is no messagebox
		if ($(".usertext-edit textarea").length <= 0) {
			$("#rlc-main").append("<p style='width:100%;text-align:center;'>If you can see this you need an invite to send messages, check the sidebar.</p>");
		}

		// Add placeholder text and focus messagebox
		$(".usertext-edit textarea").attr("placeholder", "Type here to chat");
		$(".usertext-edit textarea").focus();

		// Make links external
		$("#rlc-main a").attr("target", "_blank");
		$("#rlc-sidebar a").attr("target", "_blank");
		$("#rlc-readmebar a").attr("target", "_blank");
		$("#rlc-guidebar a").attr("target", "_blank");

		// Remove iframes
		if (!$("body").hasClass("left-panel")) {
		$("#rlc-main iframe").remove();
		}
	}

	function rlcInitEventListeners() {

		// Detect new content being added
		$(".liveupdate-listing").on("DOMNodeInserted", function(e) {
			if ($(e.target).is("li.liveupdate")) {
				// Apply changes to line
				handleNewMessage($(e.target), false);
				if ($(document.body).hasClass("AutoScroll")) {
					scollToBottom();
				}
			}
			// Remove separators
			else if ($(e.target).is(".separator")) {
				$(e.target).remove();
			}
		});

		// Pseudocode:
		/* on li.liveupdate removal(maybe its not removed? maybe detached?) call function UpdatealternateMsgBackground to fix alternation */

		messageboxEventHandling();
		mouseClicksEventHandling();
	}

/*¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨
																			  RLC WINDOW.LOAD SECTION BELOW
010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010
____________________________________________________________________________________________________________________________________________________________________________*/

	// Boot
	$(window).load(function() {
		// Move default elements into custom containers defined in htmlPayload
		rlcSetupContainers();
		// Setup sidebar based on content
		rlcParseSidebar();
		// Modify initial elements
		rlcDocReadyModifications();
		// Attach event listeners
		rlcInitEventListeners();

		// handle existing chat messages
		$("#rlc-chat").find("li.liveupdate").each(function(idx,item){
			handleNewMessage($(item), true);
		});
		updateMutedUsers();
		rowAlternator=!rowAlternator;
		scollToBottom();    //done adding/modding content, scroll to bottom

/*¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨
																			  RLC OPTIONS DEFINITION SECTION BELOW
010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010
____________________________________________________________________________________________________________________________________________________________________________*/

		/* Create options */
		createOption("Auto Scroll", function(checked){
			if (checked){
				$("body").addClass("AutoScroll");
			} else {
				$("body").removeClass("AutoScroll");
			}
		},false);
		createOption("Channel Colors", function(checked){
			if (checked){
				$("#rlc-main").addClass("show-colors");
			} else {
				$("#rlc-main").removeClass("show-colors");
			}
			// Correct scroll after spam filter change
			scollToBottom();
		},false);
		createOption("Dark Mode", function(checked){
			if (checked){
				$("body").addClass("dark-background");
			} else {
				$("body").removeClass("dark-background");
			}
		},false);
		createOption("Compact Mode", function(checked){
			if (checked){
				$("body").addClass("rlc-compact");
			} else {
				$("body").removeClass("rlc-compact");
			}
			scollToBottom();
		},false);
		createOption("Notification Sound", function(checked){
			if (checked){
				$("body").addClass("rlc-notificationsound");
			} else {
				$("body").removeClass("rlc-notificationsound");
			}
			scollToBottom();
		},false);
		createOption("Chrome Notifications", function(checked){
			if (checked && Notification && !Notification.permission !== "granted"){
				Notification.requestPermission();
				if (checked){
					$("body").addClass("rlc-notificationchrome");
				} else {
					$("body").removeClass("rlc-notificationchrome");
				}
			}
		},false);
		createOption("Custom Scroll Bars", function(checked){
			if (checked){
				$("body").addClass("rlc-customscrollbars");
			} else {
				$("body").removeClass("rlc-customscrollbars");
			}
			scollToBottom();
		},false);
		createOption("No Emotes", function(checked){
			if (checked){
				$("body").addClass("rlc-noemotes");
			} else {
				$("body").removeClass("rlc-noemotes");
			}
		},false);
		createOption("Text To Speech (TTS)", function(checked){
			if (checked){
				$("body").addClass("rlc-TextToSpeech");
			} else {
				$("body").removeClass("rlc-TextToSpeech");
				window.speechSynthesis && window.speechSynthesis.cancel && window.speechSynthesis.cancel();
			}
		},false);
           createOption("TTS Username Narration", function(checked){
			if (!checked) {

			} else {

			}
		},false);
		createOption("Disable User-based Voices", function(checked){
			if (checked){
				$("body").addClass("rlc-NoUserVoices");
			} else {
				$("body").removeClass("rlc-NoUserVoices");
			}
		},false);
		createOption("Robin Colors", function(checked){
			if (checked){
				$("body").addClass("rlc-RobinColors");
			} else {
				$("body").removeClass("rlc-RobinColors");
			}
		},false);
		createOption("24-hour Timestamps", function(checked){
			if (checked){
				$("body").addClass("rlc-24hrTimeStamps");
			} else {
				$("body").removeClass("rlc-24hrTimeStamps");
			}
		},false);
		createOption("CSS Background Alternation", function(checked){
			if (checked){
				$("body").addClass("rlc-CssBGAlternate");
			} else {
				$("body").removeClass("rlc-CssBGAlternate");
			}
		},false);
		createOption("Debug Mode", function(checked){
			if (checked){
				$("body").addClass("rlc-DebugMode");
			} else {
				$("body").removeClass("rlc-DebugMode");
			}
		},false);
        createOption("Left Panel", function(checked){
			if (checked){
				$("body").addClass("left-panel");
			} else {
				$("body").removeClass("left-panel");
			}
		},false);
        createOption("Full Width", function(checked){
			if (checked){
                $("body").addClass("rlc-fullwidth");
			} else {
				$("body").removeClass("rlc-fullwidth");
			}
		},false);
	});

	// Channel styles
	var color;
	for(var c = 0; c < 35; c++){
		color = colors[(c % (colors.length))];

		GM_addStyle(`#rlc-main.show-colors #rlc-chat li.liveupdate.rlc-filter-€{c} { background: ${color};}`, 0);
		GM_addStyle(`#rlc-chat.rlc-filter.rlc-filter-${c} li.liveupdate.rlc-filter-${c} { display:block;}`, 0);
	}
})();

 WebFontConfig = {
    google: { families: [ 'Open+Sans:400,400italic,600,600italic:latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();

/*¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨
																			  RLC CSS SECTION BELOW
010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010
____________________________________________________________________________________________________________________________________________________________________________*/

/* CSS tip: use cssminifier.com instead of messing around with line continuation, unpack in editor and re-minify before reinsertion via cssminifier.com */
GM_addStyle('div#rlc-settings label{display:block;margin-bottom:5px;font-size:1.4em;margin-left:10px}#hsts_pixel,.bottom-area,.content,.debuginfo,.footer-parent,.save-button{display:none}#rlc-messagebox .md,#rlc-messagebox .usertext,header#liveupdate-header{max-width:none}#rlc-sendmessage,#rlc-wrapper{-webkit-box-shadow:0 1px 2px 0 rgba(166,166,166,1);-moz-box-shadow:0 1px 2px 0 rgba(166,166,166,1);box-shadow:0 1px 2px 0 rgba(166,166,166,1)}#rlc-header,#rlc-wrapper,body{overflow:hidden}#rlc-chat,#rlc-header,#rlc-sidebar hr{background:#FCFCFC}#new-update-form{margin:0}.liveupdate time.live-timestamp,.liveupdate ul.buttonrow{display:none!important}#filter_tabs,#liveupdate-resources h2,#loadmessages,#myContextMenu,#rlc-guidebar,#rlc-readmebar,#rlc-settings,#s2compactmode,#s2tts,select#rlc-channel-dropdown{display:none}#rlc-messagebox .usertext-edit.md-container{max-width:none;padding:0;margin:0}header#liveupdate-header{margin:0!important;padding:15px}h1#liveupdate-title:before{content:"chat in ";color:#000}h1#liveupdate-title{font-size:1.5em;color:#9c9c9c;float:left;padding:0}#rlc-header #liveupdate-statusbar{margin:0;padding:0;border:none!important;background:0 0!important}#rlc-wrapper .liveupdate .body{max-width:none!important;margin:0;font-size:13px;font-family:"Open Sans",sans-serif}#rlc-wrapper{height:calc(100vh - 63px);max-width:1248px;max-height:600px;margin:0 auto;background-color:#EFEFED;border-radius:0 0 2px 2px;-moz-border-radius:0 0 2px 2px;-webkit-border-radius:0 0 2px 2px}#rlc-header{height:50px;border-bottom:1px solid #e3e3e0;border-top:0;box-sizing:border-box}#rlc-main,#rlc-titlebar{width:76%;float:left}#rlc-sidebar{width:24%;float:right;overflow-y:auto;height:calc(100vh - 114px);padding-top:20px;box-sizing:border-box;border-left:2px solid #FCFCFC}#rlc-chat{height:calc(100vh - 202px);overflow-y:scroll;max-height:461px}#rlc-main .liveupdate-listing{max-width:100%;padding:0 0 0 15px;box-sizing:border-box;display:flex;flex-direction:column-reverse;min-height:100%}#rlc-messagebox textarea{height:34px;margin:0;border-radius:2px;padding:6px}#rlc-messagebox{padding:10px}#rlc-sendmessage{background-color:#FCFCFC;height:32px;margin:0;border-radius:2px;-moz-border-radius:2px;-webkit-border-radius:2px;padding:6px;text-align:center;font-size:1.5em;box-sizing:border-box}#rlc-toggleguide,#rlc-toggleoptions,#rlc-update{float:left;box-sizing:border-box;text-align:center;padding:5px 0;cursor:pointer;border-radius:2px;-moz-border-radius:2px;-webkit-border-radius:2px;-webkit-box-shadow:0 1px 2px 0 rgba(166,166,166,1);-moz-box-shadow:0 1px 2px 0 rgba(166,166,166,1);box-shadow:0 1px 2px 0 rgba(166,166,166,1);background:#FCFCFC;width:100%;margin-bottom:8px}#rlc-toggleguide{margin-bottom:0}.liveupdate .simpletime{float:left;padding-left:5px;box-sizing:border-box;width:70px;text-transform:uppercase;color:#A7A6B8;line-height:25px}.liveupdate a.author{float:left;padding-right:10px;margin:0;padding-top:0;font-weight:600;width:130px}.liveupdate-listing li.liveupdate .body .md{float:right;width:calc(100% - 210px);max-width:none;box-sizing:border-box;padding-right:10px}#rlc-activeusers{padding:15px 20px 20px 40px;font-size:1.5em}#rlc-activeusers li{list-style:outside;padding:0 0 8px}#rlc-settingsbar{width:100%;height:auto;padding:0 10px;box-sizing:border-box;position:relative;top:-10px}#rlc-main-sidebar{float:right;width:100%}#rlc-sidebar hr{height:2px;width:100%;margin-left:0;color:#FCFCFC}#rlc-sidebar h3{padding:0 10px}#rlc-statusbar{width:24%;float:right;text-align:center;padding-top:8px}#versionnumber{padding-top:5px}.rlc-showoptions #rlc-settings{display:block}.rlc-showoptions #rlc-main-sidebar{display:none}.rlc-showreadmebar #rlc-readmebar{display:block}.rlc-showreadmebar #rlc-main-sidebar{display:none}.dark-background{background:#2a2a2a!important}.dark-background #rlc-wrapper{color:#f5f5f5}.dark-background h1#liveupdate-title:before{color:#ccc}.dark-background #rlc-wrapper a,.dark-background #rlc-wrapper h1#liveupdate-title,.dark-background #rlc-wrapper p{color:#EAEAEA}.dark-background #rlc-header,.dark-background #rlc-messagebox textarea,.dark-background #rlc-sendmessage,.dark-background #rlc-toggleguide,.dark-background #rlc-toggleoptions,.dark-background #rlc-update,.dark-background #rlc-wrapper #rlc-sidebar a{background:#383838;color:rgba(245,245,245,.74)}.dark-background #rlc-sidebar{border-color:transparent}.dark-background #rlc-chat,.dark-background #rlc-sidebar hr,.dark-background #rlc-wrapper{background:0 0}.alt-bgcolor{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGM6Uw8AAiABTnvshQUAAAAASUVORK5CYII=)!important}.dark-background .alt-bgcolor{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGM6YwwAAdQBAooJK6AAAAAASUVORK5CYII=)!important}.rlc-CssBGAlternate #rlc-main .liveupdate-listing li.liveupdate:nth-last-child(odd){background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGM6Uw8AAiABTnvshQUAAAAASUVORK5CYII=)!important}.rlc-CssBGAlternate .dark-background #rlc-main .liveupdate-listing li.liveupdate:nth-last-child(odd){background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGM6YwwAAdQBAooJK6AAAAAASUVORK5CYII=)!important}.liveupdate.user-narration .body .md{font-style:italic}.liveupdate.user-mention .body .md p{font-weight:700}body.allowHistoryScroll{height:105%;overflow:auto}.noselect{-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none}.rlc-customscrollbars ::-webkit-scrollbar{width:10px}.rlc-customscrollbars ::-webkit-scrollbar-track{background-color:#262626}.rlc-customscrollbars ::-webkit-scrollbar-thumb{background-color:#4C4C4C;border:1px solid #262626}#myContextMenu{display:none;position:absolute;background:#bbb;box-shadow:1px 1px 2px #888}#myContextMenu ul{list-style-type:none}#myContextMenu ul li a{padding:.5em 1em;color:#000;display:block}#myContextMenu ul li:not(.disabled) a:hover{background:#ccc;color:#333;cursor:pointer}#myContextMenu ul li.disabled a{background:#ddd;color:#666}.longMessageClosed{max-height:30px;overflow-y:hidden}.liveupdate pre{margin:0;padding:0;background:rgba(128,128,128,.5);border:#FCFCFC;box-sizing:border-box}.liveupdate a.author,.liveupdate p{line-height:25px;min-height:25px}#filter_tabs .rlc-filters>span:last-of-type{border-right:0}.rlc-channel-add button{background:0 0;border:1px solid #A9A9A9;margin:0;padding:4px;border-top:0;border-bottom:0}.mrPumpkin{height:24px;width:24px;display:inline-block;border-radius:3px;background-size:144px;margin-top:0!important;margin-bottom:-6px!important}.dark-background .mrPumpkin{border-radius:5px}.mp_frown{background-position:-24px 0}.mp_silly{background-position:-48px 0}.mp_meh{background-position:0 -24px}.mp_angry{background-position:-48px -24px}.mp_shocked{background-position:-24px -24px}.mp_happy{background-position:-72px 120px}.mp_sad{background-position:-72px 96px}.mp_crying{background-position:0 72px}.mp_tongue{background-position:0 24px}.mp_xhappy{background-position:-48px 48px}.mp_xsad{background-position:-24px 48px}.mp_xsmile{background-position:0 48px}.mp_annoyed{background-position:-72px 72px}.mp_zen{background-position:-48px 72px}.mp_wink{background-position:-24px 72px}#filter_tabs,div#rlc-sendmessage{border:none;box-sizing:border-box}.channelname{color:#A9A9A9!important;display:block;float:left;text-align:right;width:260px}#filter_tabs{table-layout:fixed;width:100%;height:26px;position:absolute;background:#404040;display:none;border-bottom:2px solid #262626}#filter_tabs>span{width:90%;display:table-cell}#filter_tabs>span.all,#filter_tabs>span.more{width:60px;text-align:center;vertical-align:middle;cursor:pointer}#filter_tabs .rlc-filters{display:table;width:100%;table-layout:fixed;height:24px}#filter_tabs .rlc-filters>span{padding:5px 2px;text-align:center;display:table-cell;cursor:pointer;vertical-align:middle;font-size:1.1em;border-right:2px solid #262626}#filter_tabs .rlc-filters>span>span{pointer-events:none}#filter_tabs>span.all{padding:0 30px;border-right:2px solid #262626}#filter_tabs>span.more{padding:0 30px;border-left:2px solid #262626}.rlc-channel-add input{border:0;padding:0;height:24px}#rlc-leftpanel{display:none}.left-panel #rlc-leftpanel{width:14%;float:left;display:block}.left-panel #rlc-sidebar{width:18%}.left-panel #rlc-main{width:68%}.rlc-fullwidth #rlc-wrapper{max-height:none;max-width:none;height:calc(100vh - 0px)}.rlc-compact #header{display:none}.rlc-compact #rlc-chat{height:calc(100vh - 205px);max-height:none}.rlc-compact.rlc-fullwidth #rlc-chat{height:calc(100vh - 135px)}.rlc-compact.rlc-fullwidth #rlc-sidebar{height:calc(100vh - 50px)}#liveupdate-description{margin-left:10px;float:left}.dark-background #rlc-sidebar h3{color:rgba(245,245,245,.67)}.md{max-width:none!important}');

/* base 64 encoded emote spritesheet - art by image author 741456963789852123/FlamingObsidian  */
GM_addStyle('#liveupdate-statusbar.live .state:before,#liveupdate-statusbar.reconnecting .state:before,.mrPumpkin{background-image:url(data:image/png;base64,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)}');
