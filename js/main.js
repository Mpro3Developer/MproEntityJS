
/*MproEntity.enableIndexedDB();
MproEntity.indexedDBVersion = 13;*/

//MproEntity.enableWebSQL();

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