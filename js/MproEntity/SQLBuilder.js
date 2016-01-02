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

function SQLBuilder()
{
    var obj;
    
    function is_float(mixed_var) 
    {
        return +mixed_var === mixed_var && (!isFinite(mixed_var) || !! (mixed_var % 1));
    }
    
    function gettype(mixed_var) 
    {
        var s = typeof mixed_var,
          name;
        var getFuncName = function(fn) {
          var name = (/\W*function\s+([\w\$]+)\s*\(/)
            .exec(fn);
          if (!name) {
            return '(Anonymous)';
          }
          return name[1];
        };
        if (s === 'object') {
          if (mixed_var !== null) {
            if (typeof mixed_var.length === 'number' && !(mixed_var.propertyIsEnumerable('length')) && typeof mixed_var
              .splice === 'function') {
              s = 'array';
            } else if (mixed_var.constructor && getFuncName(mixed_var.constructor)) {
              name = getFuncName(mixed_var.constructor);
              if (name === 'Date') {
                s = 'date';
              } else if (name === 'RegExp') {
                s = 'regexp';
              } else if (name === 'PHPJS_Resource') {
                s = 'resource';
              }
            }
          } else {
            s = 'null';
          }
        } else if (s === 'number') {
          s = is_float(mixed_var) ? 'double' : 'integer';
        }
        return s;
    }
    
    this.delete = function() 
    {
        var sqls = [];
        if(this.obj.NameRef === "")
        {
            sqls.push("DELETE FROM " + this.obj.Name + " WHERE cod = " + this.obj.Cod + ";");
            sqls.push("DELETE FROM Reference WHERE cod = " + this.obj.Cod + "  AND class = '" + this.obj.Name + "';");
        }
        else
        {
            sqls.push("DELETE FROM Reference WHERE cod = " + this.obj.CodRef + " AND codref = " +
                        this.obj.Cod + " AND class = '" +
                        this.obj.NameRef + "' AND classref = '" + this.obj.Name + "';");
        }
        return sqls;
    };

    this.insertRef = function() 
    {
        return "INSERT INTO Reference VALUES('" +
                this.obj.NameRef + "', '" +
                this.obj.Name + "', " + 
                this.obj.Ix + ", " + 
                this.obj.CodRef + ", " + 
                this.obj.Cod + ");";
    };
    
    this.insert = function() 
    {
        return "INSERT INTO " + this.obj.Name + " VALUES(NULL, "
                 + 
                this.obj.Fields
                 + ")";
    };

    this.selectAll = function() 
    {
        var sql = "";
        if(this.obj.NameRef === "")
        {
            sql = "SELECT * FROM " + this.obj.Name + " "  +  (this.obj.Where === "" ? "ORDER BY " : (" WHERE (" + this.obj.Where + ") ORDER BY ")) + this.obj.OrderBy;
        }
        else
        {
            sql =  "SELECT * FROM " + this.obj.Name + " WHERE cod in " + 
                    "(SELECT codref FROM Reference WHERE class = '" + this.obj.NameRef + "' and cod = " + 
                    this.obj.CodRef + " AND classref = '" + this.obj.Name + "' " +  (this.obj.Ix !== 2147483647 ? " AND ix = " + this.obj.Ix + " " : "") + ") "
                     + " " + 
                    (this.obj.Where === "" ? "ORDER BY " : (" AND (" + this.obj.Where + ") ORDER BY ")) + this.obj.OrderBy;
        }
        
        if(this.obj.Limiter.length)
        {
            sql += " LIMIT "  +  this.obj.Limiter[0]  +  ", "  +  this.obj.Limiter[1];
        }
        
        return sql;
    };

    this.selectWhere = function() 
    {
        var sql = "SELECT " + this.obj.Name + ".cod, ";
        var sqlInner = "";
        var sqlWhere = "";
        
        for(var i = 0; i < this.obj.Fields.length; i++)
        {
            sql += this.obj.Name + "." + this.obj.Fields[i] + ", ";
        }
        
        sql = sql.replace(/, $/mg, "");
        sql += " FROM " + this.obj.Name + " ";
        
        // inner joins
        for(var i = 0; i < this.obj.NameRefs.length; i++)
        {
            sqlInner +=    " INNER JOIN Reference ON Reference.cod = " + 
                            this.obj.Name + ".cod " + 
                            "INNER JOIN " + this.obj.NameRefs[i] + " ON " + 
                            this.obj.NameRefs[i] + ".cod = Reference.codref AND Reference.classref = '" + 
                            this.obj.NameRefs[i] + "' ";
            
            sqlWhere +=    "" + this.obj.NameRefs[i] + "." + this.obj.FieldsRefs[i] + " " + 
                            this.obj.Comparators[i] + " " + 
                            (gettype(this.obj.LogicVals[i]) == "string" ? "'" + 
                                    (this.obj.Comparators[i] === " LIKE " ? "%" : "")
                                     + this.obj.LogicVals[i]
                                     + (this.obj.Comparators[i] === " LIKE " ? "%" : "") + "'" : this.obj.LogicVals[i]) + 
                            " " + (this.obj.LogicNexts[i] == null ? "" : this.obj.LogicNexts[i]);
        }
        
        sql += sqlInner + " WHERE " + sqlWhere + " " + this.obj.OrderBy;
        
        return sql;
    };

    this.setJSONObject = function(obj) 
    {
        this.obj = obj;
    };

    this.update = function() 
    {
        update = "UPDATE " + this.obj.Name + " SET " + this.obj.Fields;
        update += " WHERE cod = " + this.obj.Cod;
        
        return update;
    };

    this.createTable = function() 
    {
        return "CREATE TABLE " + this.obj.Name + " (cod INTEGER PRIMARY KEY)";
    };

    this.alterTable = function(res)
    {
        var sqlsField = [];
        var sqlsAlter = [];
        var canTempDrop = false;
        
        var fieldsFromDB = [];
        var fieldsTypesFromDB = [];
        var mapFromDB = [];

        for(var i = 1; i < res.length; i++)
        {
            mapFromDB[res[i]] = true;
        }
        
        for(var i = 0; i < this.obj.Fields.length; i++) 
        {
            sqlsField.push("ALTER TABLE " + this.obj.Name + " ADD " + this.obj.Fields[i] + " " + this.obj.Types[i]);
            
            if(mapFromDB[this.obj.Fields[i]])
            {
                fieldsFromDB.push(this.obj.Fields[i]);
                fieldsTypesFromDB.push(this.obj.Types[i]);
            }
            else
            {
                canTempDrop = true;
            }
        }
        
        if((res.length -1) > this.obj.Fields.length)
        {
            canTempDrop = true;
        }
        
        if(canTempDrop)
        {
            sqlsAlter.push("CREATE TABLE back_" + this.obj.Name + " (cod INTEGER PRIMARY KEY);");
            for(i = 0; i < fieldsFromDB.length; i++)
            {
                sqlsAlter.push("ALTER TABLE back_" + this.obj.Name + " ADD " + fieldsFromDB[i] + " " + fieldsTypesFromDB[i]);
            }
            sqlsAlter.push("INSERT INTO back_" + this.obj.Name + " SELECT cod, " + (fieldsFromDB.join(",")) + " FROM " + this.obj.Name + ";");
            sqlsAlter.push("DROP TABLE " + this.obj.Name + ";");
            sqlsAlter.push(this.createTable());
            sqlsAlter = sqlsAlter.concat(sqlsField);
            sqlsAlter.push("INSERT INTO " + this.obj.Name + "(cod, " + (fieldsFromDB.join(",")) + ") SELECT cod, " + (fieldsFromDB.join(",")) + " FROM back_" + this.obj.Name + ";");
            sqlsAlter.push("DROP TABLE back_" + this.obj.Name + ";");
        }
        
        return sqlsField.length > sqlsAlter.length ? sqlsField : sqlsAlter;
    };
    
    this.createRefTable = function() 
    {
        return "CREATE TABLE IF NOT EXISTS Reference (class TEXT, classref TEXT, ix INTEGER, cod INTEGER, codref INTEGER, PRIMARY KEY(class, classref, ix, cod, codref));";
    };

    this.describeTable = function()
    {
        //return "PRAGMA table_info([" + this.obj.Name + "])";
        return "SELECT * FROM sqlite_master WHERE name = '" + this.obj.Name + "'";
    };
};
