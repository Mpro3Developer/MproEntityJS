/*
MproEntity.enableIndexedDB();
MproEntity.indexedDBVersion = 13;*/

//MproEntity.enableWebSQL();

/**
 * TODO CREATE DBSOURCE REMOTE AND FORMCREATOR REMOTE
 */
//MproEntity.setRemoteServer("http://localhost/RemoteServer", "php");

/**
 * Initial config
 */

MproEntity.addUser("site", "123456");
//MproEntity.auth("site", "123456");


/*
 * Menu Buttons
 */

$("#buttonUsers").click(function()
{
    $("#userRow").show();
    $("#booksRow").hide();
    $("#loansRow").hide();
});

$("#buttonBooks").click(function()
{
    $("#userRow").hide();
    $("#booksRow").show();
    $("#loansRow").hide();
});

$("#buttonLoans").click(function()
{
    $("#userRow").hide();
    $("#booksRow").hide();
    $("#loansRow").show();
});