/* 
 * Copyright (C) 2016 matheus.bc
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

IDBLauDB.__indexedsUsed = [];

function IDBLauDB()
{
    this.obj = null;
    this.conn = null;
    
    this.delete = function(bjeto, callback) 
    {
        this.conn.remove(bjeto, function(res)
        {
            callback(res);
        }, function(e)
        {
            console.error("L.A.U indexedDB :: " + e);
        });
    };

    this.createIndexes = function(obj) 
    {
        var stf = JSON.stringify(obj);
        this.obj = JSON.parse(stf);
        var ixs = [];
        
        for(var i = 0; i < this.obj.Fields.length; i++)
            ixs.push({name: this.obj.Fields[i], keyPath: this.obj.Fields[i], unique: false, multiEntry: true});
        
        IDBLauDB.__indexedsUsed[this.obj.Name] = ixs;
        
        this.conn = new IDBStore({
            dbVersion: MproEntity.indexedDBVersion,
            storeName: this.obj.Name,
            keyPath: 'cod',
            autoIncrement: true,
            indexes: ixs,
            onStoreReady: function(){}
        });
    };
    
    this.insert = function(bjeto, callback) 
    {
        if(bjeto.cod == 2147483647)
            bjeto.cod = undefined;
        this.conn.put(bjeto, function(id)
        {
            callback(id);
        }, function(e)
        {
            console.error("L.A.U indexedDB :: " + e);
        });
    };

    this.selectAll = function(callback) 
    {
        this.conn.getAll(function(data)
        {
            callback(data);
        }, function(e)
        {
            console.error("L.A.U indexedDB :: " + e);
        });
    };

    this.selectWhere = function() 
    {
        
    };

    this.setJSONObject = function(obj, callback) 
    {
        var stf = JSON.stringify(obj);
        this.obj = JSON.parse(stf);
        this.createTable(callback);
    };

    this.createTable = function(callback) 
    {
        this.conn = new IDBStore({
            dbVersion: MproEntity.indexedDBVersion,
            storeName: this.obj.Name,
            keyPath: 'cod',
            autoIncrement: true,
            indexes: IDBLauDB.__indexedsUsed[this.obj.Name],
            onStoreReady: function(){
                callback();
            }
        });
    };
}