
/*
 * Vars and controls for User Div
 */

var dbUser = new DBsource(User, 100, 0, '', 'Name asc');
var repeaterUser = new Repeater("#userList");
var formUser = new FormCreator(User, "#userForm");

function deleteUser(cod)
{
    for(var i = 0; i < dbUser.Data.length; i++)
    {
        if(dbUser.Data[i].cod == cod)
        {
            dbUser.Data[i].Delete();
        }
    }
    dbUser.getData();
}

formUser.onSave(function()
{
    alert("User saved!");
    dbUser.getData();
});

$("#buttonNewUser").click(function()
{
    formUser.New();
});

$("#buttonSaveUser").click(function()
{
    formUser.Save();
});

repeaterUser.setDBsource(dbUser);
dbUser.getData();