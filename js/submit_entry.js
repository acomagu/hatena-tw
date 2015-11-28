// JavaScript Document
var hatena_xml = null;
function date_able(){
	"use strict";
	var dateboo = $("[name=date_boo]").prop("checked");
	if(dateboo === true){
		document.entry.dateboo.disable = true;
	}
	else{
		document.entry.dateboo.disable = false;
	}
} 

function submit(){
	"use strict";
	var title = document.entry.title.value;
	var content = document.entry.content.value;
	var date = document.entry.update.value;
	var datetf = $("[name=datetf]").prop("checked");
	var draft = "no";
	var updated = null;
	
	var name = name;
	if(datetf === true){
		updated = '<updated>' + date + '</updated>';
	}
	else{
		updated = null;
	} 
	
	var category = document.entry.category.value;
	
	var drafttf = $("[name=draft]").prop("checked");
	if(drafttf === true){
		draft = "yes";
	}
	else{
		draft = "no";
	} 
	var xml = '<?xml version="1.0" encoding="utf-8"?><entry xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app"><title>' + title + '</title><author><name>'+ name +'</name></author><content type="text/plain">'+ content +'</content>' + updated + '<category term="' + category + '" /><app:control><app:draft>'+ draft +'</app:draft></app:control> </entry>';
	alert.
        hatena_xml = $.parseXML(xml);
        $.ajax({
          url: "http://example.com/",
          success: function(data){
            location.href="./posted.html";
          },
          error: function(jqXHR, textStatus, errorThrown){
            alert(textStatus+": "+errorThrown);
          },
          beforeSend: function(xhr) {
            var credentials = $.base64.encode(localStorage.htn_username + ":" + localStorage.htn_password);
            xhr.setRequestHeader("Authorization", "Basic " + credentials);
          },
        });
	return 0;
}
