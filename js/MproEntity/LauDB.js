/* 
 * Copyright (C) 2015 matheus.bc
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

function LauDB()
{
    // private
    var _conn;
    var _fetched = true;
    // not used yet
    var _elems;
    var _elemArray;
    var _countArray;
    var _elem;
    
    // constructor
    _conn = openDatabase("MproEntity", "1.0", "MproEntityLauDB", 200000);
    
    if(!_conn)
        console.error("L.A.U Connect error"); 
    else
        /*_conn.transaction(function(transaction)
        {
            transaction.executeSql("PRAGMA synchronous=OFF", [[]], null, function(transaction, error)
            {
                console.error("L.A.U Query error: " + error.message + " :: cmd-> " + "PRAGMA synchronous=OFF");
            });
        });*/
    
    function fectch(res)
    {
        var arr = Object.keys(res).map(function (key) {return res[key]});
        for(var i = 0; i < arr.length; i++)
        {
            arr[i] = Object.keys(arr[i]).map(function (key) {return arr[i][key]});
        }
        return arr;
    }
    
    this.enableFetch = function()
    {
        _fetched = true;
    };
    
    this.disableFetch = function()
    {
        _fetched = false;
    };
    
    this.query = function(sql, callback)
    {
        _conn.transaction(function(transaction){
            transaction.executeSql(
                sql,
                null,
                function(transaction, result){
                    if(_fetched)
                        callback(fectch(result.rows));
                    else
                        callback(result.rows);
                },
                function(transaction, error){
                    if(LauDB.debug)
                    console.error("L.A.U Query error: " + error.message + " :: cmd-> " + sql);
                }
            );
        });
    };
    
    this.noReturnDataQuery = function(cmd)
    {
        _conn.transaction(function(transaction){
            transaction.executeSql(
                cmd,
                [[]],
                function(transaction, result){
                    
                },
                function(transaction, error){
                    if(LauDB.debug)
                    console.error("L.A.U Query error: " + error.message + " :: cmd-> " + cmd);
                }
            );
        });
    };
    
    this.row = function(row, table, callback)
    {
        if(LauDB.debug)
        console.error("Not implemented yet ...");
    };
    
    this.execute = function(cmd)
    {
        _conn.transaction(function(transaction)
        {
            transaction.executeSql(cmd, null, null, function(transaction, error)
            {
                if(LauDB.debug)
                console.error("L.A.U Query error: " + error.message + " :: cmd-> " + cmd);
            });
        });
    };
    
    this.getLastInsertRowid = function(callback)
    {
        this.query("SELECT last_insert_rowid();", function(res)
        {
            callback(res[0]);
        });
    };
    
    this.rowCount = function()
    {
        if(LauDB.debug)
        console.error("Not implemented yet ...");
    };
    
    this.prox = function()
    {
        if(LauDB.debug)
        console.error("Not implemented yet ...");
    };
    
    this.getActualObjectRow = function()
    {
        if(LauDB.debug)
        console.error("Not implemented yet ...");
    };
    
    this.close = function()
    {
        if(LauDB.debug)
        console.error("Is not necessary ...");
    };
};

LauDB.debug = false;