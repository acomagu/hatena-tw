// JavaScript Document

function loginFunc(){
	'use strict';
	localStorage.htn_username = document.login.email.value;
	localStorage.htn_password = document.login.pass.value;
	localStorage.htn_blogdomain = document.login.domain.value;
}