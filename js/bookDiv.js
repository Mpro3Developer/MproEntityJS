

/*
 * Vars and controls for Book Div
 */

var dbBook = new DBsource(Book, 100, 0, '', 'Name asc');
var repeaterBook = new Repeater("#bookList");
var formBook = new FormCreator(Book, "#bookForm");

function deleteBook(cod)
{
    for(var i = 0; i < dbBook.Data.length; i++)
    {
        if(dbBook.Data[i].cod == cod)
        {
            dbBook.Data[i].Delete();
        }
    }
    dbBook.getData();
}

formBook.onSave(function()
{
    //alert("Book saved!");
    dbBook.getData();
});

$("#buttonNewBook").click(function()
{
    formBook.New();
});

$("#buttonSaveBook").click(function()
{
    formBook.Save();
});

repeaterBook.setDBsource(dbBook);
dbBook.getData();