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


function InternalEnviroment(ixdb)
{
    var indexedDB = (ixdb == undefined ? false : ixdb);
    var db = new LauDB();

    function sqlBuilderFactory(obj)
    {
        var dataObject = JSON.parse(obj);
        var sqlBuilder = new SQLBuilder();
        sqlBuilder.setJSONObject(dataObject);
        return sqlBuilder;
    }
    
    this.removeService = function(obj)
    {
        var sqlBuilder = sqlBuilderFactory(obj);
        var sqls = sqlBuilder.delete();
        for(var i = 0; i < sqls.length; i++)
        {
            db.execute(sqls[i]);
        }
    };
    
    this.recordService = function(obj, callback)
    {
        var dataObject = JSON.parse(obj);
        var sqlBuilder = sqlBuilderFactory(obj);
        if(dataObject.CodRef)
        {
            db.execute(sqlBuilder.createRefTable());
            db.execute(sqlBuilder.insertRef());
            if(callback)
                callback();
        }
        else if(dataObject.Cod === 2147483647)
        {
            db.execute(sqlBuilder.insert());
            db.getLastInsertRowid(function(id)
            {
                if(callback)
                    callback(id);
            });
        }
        else
        {
            db.execute(sqlBuilder.update());
            if(callback)
                callback();
        }
    };
    
    this.requestAllService = function(obj, callback)
    {
        var sqlBuilder = sqlBuilderFactory(obj);
        db.query(sqlBuilder.selectAll(), function(res)
        {
            callback(res);
        });
    };
    
    this.requestService = function(obj, callback)
    {
        var sqlBuilder = sqlBuilderFactory(obj);
        db.query(sqlBuilder.selectWhere(), function(res)
        {
            callback(res);
        });
    };
    
    function parseTable(table){
        var s = table[4].split(',');
        s[0] = s[0].replace(new RegExp('create\\s+table\\s+' + table[1] + '\\s*\\(', 'i'),'');
        table.fields = s.map(function(i){
          return i.trim().split(/\s/).shift();
        })
        .filter(function(i){
          return (i.indexOf(')') === -1)
        });
        return table;
    }
    
    this.createTableService = function(obj)
    {
        var sqlBuilder = sqlBuilderFactory(obj);
        db.execute(sqlBuilder.createTable());
        db.execute(sqlBuilder.createRefTable());
        //db.disableFetch();
        db.query(sqlBuilder.describeTable(), function(res)
        {
            var o = parseTable(res[0]);
            res = [];
            for(var i = 0; i < o.fields.length; i++)
            {
                res.push(o.fields[i]);
            }
            var sqls = sqlBuilder.alterTable(res);
            for(var i = 0; i < sqls.length; i++)
            {
                db.execute(sqls[i]);
            }
            //db.enableFetch();
        });
    };
};