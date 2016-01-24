
/*MproEntity.enableIndexedDB();
MproEntity.indexedDBVersion = 13;*/

//MproEntity.enableWebSQL();

//MproEntity.setRemoteServer("http://localhost/MproEntityJS/server", "php");

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