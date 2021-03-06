/*
Writes the cookie that stores class data
*/
function writeCookie(cookieName, data) {
    if (data != null) {
	var exDate = new Date();
	if (data == '') {
	    exDate.setDate(exDate.getDate() - 1); // erase
	} else {
	    exDate.setDate(exDate.getDate() + 7); // default expiration in a week
	}
	var newData = parseIllegalCharacters(data);
	document.cookie = cookieName+'='+newData+'; expires='+exDate+'; path=/';
    }
}

//Reads a cookie to get the saved class sections
function readCookie(cookieName) {
    var start = document.cookie.indexOf(cookieName + '=');
    if (start != -1) {
        start = start + cookieName.length + 1
        var end = document.cookie.indexOf(';', start);
        if (end == -1) {
            end = document.cookie.length;
        }
        var content = unescape(document.cookie.substring(start, end));
        if (content != '') {
	    var readableContent = parseCookie(content);
            return readableContent;
        }
        return null;
    }
    return null;
}

//updates the database with data stored in cookies
function updateStoredDataFromExhibit() {
    var picked_classes = readCookie("picked-classes");
    var saved_data = parseSavedClasses(picked_classes);

    if (window.database.getObject('user', 'userid') != null) {
        for (i in saved_data) {
            var clss = saved_data[i];
    		$.post("scripts/post.php",
    			{ addingClass: true,
                  userid: window.database.getObject('user', 'userid'),
                  sectionID: clss.sectionID,
    			  classID: clss.classID,
                  color: clss.color,
                  type: clss.type,
                  classLabel: clss.classLabel,
                  timeandplace: clss.timeandplace,
                  sectionData: clss.sectionData,
                  userathena: window.database.getObject('user', 'athena'),
                  semester: term + current_year
    			});
        }
    }
    updateMiniTimegrid(false);
}

//Deletes a class from the database if the user is logged in
function deleteClassFromStoredData(sectionID) {
    if (window.database.getObject('user', 'userid') != null) {
        $.post("scripts/post.php",
            {   deletingClass: true,
                userid: window.database.getObject('user', 'userid'),
                sectionID: sectionID,
                semester: term + current_year
            });
    }
}

// Checks to see if an array contains only unique elements
function uniqueArray(array) {
    var a = array.concat();
    for(var i=0; i < a.length; i++) {
        for(var j = i+1; j < a.length; j++) {
            if (a[i] === a[j]) {
                a.splice(j--, 1);
            }
        }
    }
    return a;
}

// Checks to see if an array of objects only contains unique elements
function uniqueObjArray(array) {
    var a = array.concat();
    for (var i=0; i < a.length; i++) {
        if (a[i] && a[i] != "undefined") {
            for (var j = i+1; j < a.length; j++) {
                if (a[j] && a[j] != "undefined") {
                    if (compareObject(a[i], a[j])) {
                        a.splice(j--, 1);
                    }
                }
            }
        }
    }
    return a;
}

//Compares two objects to see if they are equal
function compareObject(o1, o2){
    for(var p in o1){
        if(o1[p] !== o2[p] && p != "color"){
            return false;
        }
    }
    for(var p in o2){
        if(o1[p] !== o2[p] && p != "color"){
            return false;
        }
    }
    return true;
}

//function for parsing the write cookie and read cookie methods to get rid of illegal characters
function parseIllegalCharacters(data) {
    data = data.replace(new RegExp(' ', 'g'), '&#32').replace(new RegExp(';', 'g'), '&#59').replace(new RegExp(',', 'g'), '&#44');
    return data;
}

//function to parse cookie back to readable data
function parseCookie(data) {
    data = data.replace(new RegExp('&#32', 'g'), ' ').replace(new RegExp('&#59', 'g'), ';').replace(new RegExp('&#44', 'g'), ',');
    return data;
}
