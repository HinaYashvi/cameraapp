// Initialize your app
var myApp = new Framework7({
modelTitle:'My First App',
pushState:true,
material:true,

onAjaxStart:function(xhr){
	myApp.showIndicator();
},
onAjaxComplete:function(xhr){
	myApp.hideIndicator();
}
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
	//domCache: true
	
});

var today = new Date();
var weekLater = new Date().setDate(today.getDate() + 7);
 
var calendarDisabled = myApp.calendar({
    input: '#calendar-disabled',
    dateFormat: 'M dd yyyy',
    disabled: {
      from: today,
      to: weekLater
    }
});
$( document ).ready(function() {  
		$('#searchform').show()
       //document.addEventListener("deviceready", getcontacts, false);
       //document.addEventListener("backbutton", onBackKeyDown, false);
       //document.addEventListener('touchstart', loadpush,false);
 
 });



// ------------------------ USER LOGIN ---------------------//


// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;
}
myApp.onPageInit('contacts', function (page) {
	  $('#searchform').hide();	
      getcontacts();
});
function getcontacts(){
   var value = window.localStorage.getItem("login");
   if(value==null) 
   {
     mainView.loadPage("index.html");
   }
   var output=''; 
   $.ajax({
						
		url: "http://starprojects.in/f7CI/Appcont/appcontroller/allcontacts",	
		dataType:'json',			
		success: function(result){
			//alert(result);
			var cont=result['allcontacts'];
			var firstletter=result['fletter'];
			//alert(firstletter);
			for(var i = 0; i < cont.length; i++) {
				var obj = cont[i];			
				output='<li><input type="hidden" value='+obj.contact_id+' name="hiddenid" id="cont_id"><a href="edit-contact.html?cont_id='+obj.contact_id+'" class="item-link item-content contacts-list" ><div class="item-media"><div class="roundfill"><div class="lettr">'+obj.fltr+'</div></div></div><div class="item-inner"><div class="item-title ttl">'+obj.name+'</div><div class="item-after"></div></div></a></li>';		
				$('#contacts').append(output);
			}
			
		}	
	}); 
}
function checkuser(){
	var username = $('#username').val();
	var password = $('#password').val();
	//alert(username+"-----"+password);
	if ((username=='') && (password=='')) {
		$('#unameerror').html('Please Enter Username');
        $('#passerror').html('Please Enter Password');
	}else if (username=='') 
    { 
		$('#unameerror').html('Please Enter Username');
		$('#passerror').html('');
      
    }else if (password=='') 
    { 
		$('#unameerror').html('');
		$('#passerror').html('Please Enter Password'); 
    }else{
		//console.log("in ajax");
		$.ajax({
			type : "POST",
			//url: "http://localhost/F7CI/Appcont/Appcontroller/checklogin",
			//url: "http://starprojects.in/f7CI/Appcont/Appcontroller/checklogin",
			url: "http://starprojects.in/f7CI/Appcont/appcontroller/checklogin",
			data : {'username' : username , 'password' : password },
			cache: false,
			success : function(html){
				//alert(html);
				if(html == 'success'){
					
					window.localStorage.setItem("login", username);
					//mainView.loadPage("dashboard.html");
					//document.location = "dashboard.html";
					//location.replace = "dashboard.html";
					//window.location.href = "dashboard.html";
					//window.location.href = "about.html";
					//mainView.loadPage("about.html");
					//console.log("success");
					myApp.showPreloader();
					mainView.loadPage("contacts.html");
					myApp.hidePreloader();
				}else if(html == ''){
					console.log("invalid email & password");
					//mainView.loadPage("index.html");
					//document.location = "index.html";
					//location.replace = "index.html";
					//window.location.href = "index.html";
					window.location.href = "index.html";
				}
				else
           {
                myApp.addNotification({
                    message: html
                });
           }
			}
		});
	}
}
function contactentry(){
	myApp.showPreloader();
	mainView.loadPage("contact-entry.html");
	myApp.hidePreloader();
}
function contactadd(){
	var mobile=$('#phone').val();
	//var photo=$('#file').val();
	//alert(photo+mobile);
	var reg = $("#contactForm" ).serialize();
	myApp.showPreloader();
	$.ajax({
             type: "POST",
             url: "http://starprojects.in/f7CI/Appcont/appcontroller/addcontact",
             data: reg,
			 //mimeType: "multipart/form-data",
             cache: false,
             success: function(html) {
				 alert(html);
                 if(html=='success')
                 {
                     window.localStorage.setItem("login", mobile);
					 myApp.hidePreloader();
                     mainView.loadPage("contacts.html");
					 myApp.addNotification({
                            message: 'Contact has been added successfully.'
                        });
                 }
                 else
                 {
                     myApp.addNotification({
                            message: 'Please Enter a Valid Data.'
                        });
					 myApp.hidePreloader();
                 }
              }
            });
	
}
function getlogout()
{
	myApp.showPreloader();	
    window.localStorage.removeItem("login"); 
	myApp.hidePreloader();
    mainView.loadPage("index.html");
}
function showsearchbar(){
	$('#searchform').slideDown();
}
function hideme(){
	$('#searchform').slideUp();
}
myApp.onPageInit('edit-contact', function (e) {
	   myApp.showIndicator();	
	   var contactid = e.query.cont_id;
	   
	   $.ajax({
             dataType: "json",
             url: "http://starprojects.in/f7CI/Appcont/appcontroller/getcontact/"+contactid,	 
             cache: false,
             success: function(res) {
				 //alert(res[0]["name"]);
				output='<input type="hidden" name="hiddenid" value="'+res[0]['contact_id']+'" id="hiddenid"><div class="contactimg"><i class="fa fa-user usericon"></i></div><li><div class="item-content"><div class="item-media"><i class="fa fa-user"></i></div><div class="item-inner"><div class="item-input"><input name="name" type="text" placeholder="Contact name" value="'+res[0]['name']+'" id="contactname"></div></div></div>	</li><li><div class="item-content"><div class="item-media"><i class="fa fa-envelope "></i></div><div class="item-inner"><div class="item-input"><input type="email" placeholder="E-mail" id="email" name="email" value="'+res[0]["email"]+'"></div></div></div></li><li><div class="item-content"><div class="item-media"><i class="fa fa-phone"></i></div><div class="item-inner"><div class="item-input"><input name="contact_no" type="text" placeholder="Phone" value="'+res[0]["contact_no"]+'" id="phone"></div></div></div></li><li><div class="item-content"><div class="item-media"><i class="fa fa-calendar"></i></div><div class="item-inner"><div class="item-input"><input type="date" placeholder="Birth day" value="'+res[0]["dob"]+'" id="dob" name="dob"></div></div></div></li>';					
				
				$('#editcontent').append(output);
			    myApp.hideIndicator(); 
              }
            });
});
function contactedit(){
	var id=$('#hiddenid').val();
	var reg = $("#editcontactForm").serialize();
    myApp.showIndicator();
    
          $.ajax({
             type: "POST",
             url: "http://starprojects.in/f7CI/Appcont/appcontroller/editcontact/"+id,
             data: reg,
             success: function(html) {
				 
                     myApp.addNotification({
                            message: 'Contact has been updated successfully.'
                        });
                     mainView.loadPage("contacts.html");
              }
            });
       myApp.hideIndicator();
    
}
function searchtext(){
	var searchtxt=$("#search").val();
	//var searchstring  = $(this).text('#search');
	//alert("seacrh text"+searchstring);
	$.ajax({
             type: "POST",
             url: "http://starprojects.in/f7CI/Appcont/appcontroller/search",
             data: {'searchtxt' : searchtxt },
             success: function(html) {
				 alert(html);
				 if(html == 'Result'){
					 var searchdata = html['searchdata'];
					 alert(searchdata+"!!!!!!!!!!!!!!!!!!!");
					 for(var i = 0; i < searchdata.length; i++) {
						var obj = searchdata[i];			
						output='<li><input type="hidden" value='+obj.contact_id+' name="hiddenid" id="cont_id"><a href="edit-contact.html?cont_id='+obj.contact_id+'" class="item-link item-content contacts-list" ><div class="item-media"><div class="roundfill"><div class="lettr">'+obj.fltr+'</div></div></div><div class="item-inner"><div class="item-title ttl">'+obj.name+'</div><div class="item-after"></div></div></a></li>';		
						$('#contacts').append(output);
					}
				 }else if(html == 'Noresult'){
					 myApp.addNotification({
                            message: 'No Result Found.'
                        });
				 }
                     
                 mainView.loadPage("contacts.html");
              }
            });
}