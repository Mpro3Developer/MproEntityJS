
var repeaterLoan = new Repeater("#loanList");
var dbLoan = new DBsource(Loan, 100, 0, '', 'DATE(LoanDate)');
var formLoan = new FormCreator(Loan, "#loanForm");
var comboUsers = new Combobox();
var listBooks = new List();
var tableBooks = new Table();
var objBooksSelected = [];

listBooks.setElement("#loanListBooks");
listBooks.setDBsource(dbBook, "Name");
listBooks.setInputFilter("#searchBook");

tableBooks.setElement("#loanBooksSelected");
tableBooks.setCollums(["Name"]);
tableBooks.setSourceArray(objBooksSelected);

comboUsers.setElement("#loanUsers");
comboUsers.setDBsource(dbUser, "Name");

repeaterLoan.setDBsource(dbLoan);

dbLoan.getData();
dbUser.getData();
dbBook.getData();

listBooks.addMouseActionListener(function(item)
{
    objBooksSelected.push(item.obj);
    tableBooks.setSourceArray(objBooksSelected);
});

formLoan.onSave(function()
{
    //alert("Loan saved!");
    dbLoan.getData();
});

$("#buttonNewLoan").click(function()
{
    objBooksSelected = [];
    formLoan.New();
});

$("#buttonSaveLoan").click(function()
{
    formLoan.Save();
});

function deleteLoan(cod)
{
    for(var i = 0; i < dbLoan.Data.length; i++)
    {
        if(dbLoan.Data[i].cod == cod)
        {
            dbLoan.Data[i].Delete();
        }
    }
    dbLoan.getData();
}

function editLoan(cod)
{
    for(var i = 0; i < dbLoan.Data.length; i++)
    {
        if(dbLoan.Data[i].cod == cod)
        {
            formLoan.setData(dbLoan.Data[i]);
            $('body').scrollTo("#loanForm");
        }
    }
}