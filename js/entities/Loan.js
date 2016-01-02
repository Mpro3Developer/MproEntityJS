/* 
 * Copyright (C) 2015 matheus
 *
 * There is no peace only passion
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function Loan()
{
    this.LoanDate = "";
    this.ReturnDate = "";
    //@Reference<User>
    this.User = [];
    //@Reference<Book>
    this.Books = [];
 
    this.getUserName = function()
    {
        if(this.User[0])
            return this.User[0].Name;
        else
            return "ERROR";
    };
    
    this.getBooks = function()
    {
        var ret = "";
        if(this.Books.length)
        {
            for(var i = 0; i < this.Books.length; i++)
            {
                ret += this.Books[i].Name + "<br>";
            }
        }
        return ret;
    };
    
    /*
    * Inheritance constructor
    */
    MproEntity.call(this);
}