//
//  * cupofkaffee v.1 (https://github.com/kaboel/cupofkaffee)
//  * Copyright 2018 faiq.kaboel@gmail.com | In Effect
//

// MAIN REMOTE 


// ADMIN INDEX REMOTE
function loadAdm(target) {
    target = target+".php";
    $("#admIdx").load(target);
}

// ADMIN PAGES REMOTE
function __loadMenu() {
    var exec = "loadMenu";
    var cont = $("#mainMenu");

    $.ajax({
        type: 'GET',
        data: 'exec='+exec,
        url:  '../lib/handler',
        success: function(_e) {
            var obj = JSON.parse(_e);
            var list = "";
            $.each(obj, function(_key, _val) {
                list += "<li id='"+ _val['STR_ID'] +"' onclick='__loadSubMenu("+_val['ID_MENU']+")'  title='"+ _val['TITLE'] +"'>"
                     +      "<i class='"+ _val['ICON'] +"'></i>"
                     +  "</li>" 
            });
            list += "<li id='logoutTrig' onclick='logoutExec()' title='Logout'>"
                 +      "<i class='fas fa-power-off'></i>"
                 +  "</li>";
            cont.empty().append(list);
        }
    });
}
function __loadSubMenu(parent) {
    var exec = "loadSub";
    var cont = $("#subMenu");
    if(parent > 1) {
        $.ajax({
            type : 'GET',
            data : 'exec='+exec+'&parent='+parent,
            url  : '../lib/handler',
            success : function(_e) {
                toggleSub();  
                var obj = JSON.parse(_e);
                var list = "";
                $.each(obj, function(_key, _val) {
                    list += "<li>"+ _val['TITLE'] +"</li>";
                });
                cont.empty().append(list);
            }
        });
    } else {
        if($(".sub-menu").hasClass( "menu-collapse" )) {
            $(".sub-menu").removeClass( "menu-collapse" );
        }
    }
}
function __loadPage(param) {
    var target  = param+".php";
    $("#admPgs").load(target);    
}


// ADMIN EXECS
// --> Session Controls
// Login
function loginExec() {
    var exec = "loginReq";

    var user = $("#user").val();
    var pass = $("#pass").val();
    
    if(verFrm("login")) {
        $.ajax({
            type:   'POST',
            data:   'exec='+exec+'&user='+user+'&pass='+pass,
            url:    '../lib/handler',
            success: function(_e) {
                clrFrm("login");
                if(_e == "1") {
                    location.reload();
                } else {
                    msgOut(
                        "loginMsg",         // Target
                        "danger",           // Alert Type
                        "Login Failed ! ",  // Strong (Output)
                        _e                  // Details (Output)
                    );
                }
            }
        });
    } else {
        msgOut( 
            "loginMsg", 
            "warning", 
            "Can't Proceed !", 
            "Please fill all columns."
        );
    }
}

// Logout
function logoutExec() {
    var exec = "logoutReq";
    
    var obj = "<div> You sure you want to go ? </div>";
    $(obj).dialog({
        modal: true,
        resizable: false,
        draggable: false,
        title : ".barista.",
        buttons: [
            {
                text: "Yes, Log Me Out",
                click: function(_e) {
                    $.ajax({
                        type:   "POST",
                        data:   "exec="+exec,
                        url:    '../lib/handler',
                        success: function(_e){
                            if(_e == "1") {
                                location.reload(true);
                            } else {
                                alert(_e);
                            }
                        }
                    });
                    $( this ).dialog( "close" );
                }
            } ,
            {
                text: "Cancel",
                click: function() {
                    $( this ).dialog( "close" );
                }
            }
        ],
        position: { my: "center", at: "top+25%" }
    });
}

// OTHER(S)
function dismissSub() {
    if($("#subContainer").hasClass( "menu-collapse" )) {
        $("#subContainer").removeClass( "menu-collapse" );
    }
}
function toggleSub() {
    $("#subContainer").toggleClass( "menu-collapse" );
}

$(function(_e) {
    $( document ).tooltip({    
        position: { my: "left+10 center", at: "right center" },
        show: { effect: "fadeIn", duration: 200 },
        hide: { effect: "fadeOut", duration: 200 }
        // open: function(event, ui) {
        //     ui.tooltip.delay(5000).fadeTo(2000, 0);
        // }
    });
});

function verFrm(type) {
    switch(type) {
        case "login" : 
            var user = $("input[type='text']").val();
            var pass = $("input[type='password']").val();
            if(user != "" && pass != "") {
                return true;
            } else {
                return false;
            }
        break;
    }
}

function clrFrm(type) {
    switch(type) {
        case "login" : 
            $("input[type='text']").val("");
            $("input[type='password']").val("");
        break;
    }
}

function msgOut(target, type, info, msg) {
    var box = $("#"+target);
    switch(type) {
        case "danger" :
            type = "alert-danger";
        break;
        case "warning" :
            type = "alert-warning";
        break;
        case "success" :
            type = "alert-success";
        break;
    }
    var obj =    "<div class='alert "+ type +" alert-dismissible fade show gap-20' role='alert'>"
                +"  <div>"
                +"     <strong>"+ info +"</strong></br>"
                +"     <span>"+ msg +"</span>"
                +"  </div>"
                +"  <button type='button' class='close' data-dismiss='alert' aria-label='Close'>"
                +"      <span aria-hidden='true'>&times;</span>"
                +"  </button>"
                +"</div>";
    box.html(obj);
    box.show();
    if(box.is(':visible')) {
        box.fadeOut({ duration: 3000 });
    }
}