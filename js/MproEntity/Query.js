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

function Query(t)
{
    var steps = [];
    this.objectInfo = new MproEntity.DataRequest();
    var queryString = "";
    var indexString = "";
    var fieldTmp = "";

    this.newInstanceOfT = function()
    {
        var ft = new t();
        var fieldsInfo = ft.getInfo();
        this.objectInfo = fieldsInfo;
        return ft;
    };

    var obj = this.newInstanceOfT();

    function checkThat()
    {
        return  steps[steps.length -1] == "eq" ||
                steps[steps.length -1] == "neq" ||
                steps[steps.length -1] == "like" ||
                steps[steps.length -1] == "bigger" ||
                steps[steps.length -1] == "less" ||
                steps[steps.length -1] == "biggerEq" ||
                steps[steps.length -1] == "lessEq" ||
                steps[steps.length -1] == "between";
    }

    function checkOperator()
    {
        return  steps[steps.length -1] == "and" ||
                steps[steps.length -1] == "or";
    }

    //this.where = function(cl, field)
    function whereo(cl, field, objectInfo, obj)
    {
        if(steps.length == 0)
        {
            steps.push("whereo");
            objectInfo.NameRefs.push(cl.getName());
            objectInfo.FieldsRefs.push(field);
        }
        else
        {
            throw new Error("(where) can not be called after other method");
        }
        return obj;
    }

    this.where = function(field)
    {
        if(arguments.length == 2)
            return whereo(arguments[0], arguments[1], this.objectInfo, this);
        
        if(steps.length == 0)
        {
            steps.push("where");
            queryString += "" + field + " ";
            indexString += "i." + field + " ";
            fieldTmp = field;
        }
        else
        {
            throw new Error("(where) can not be called after other method");
        }
        return this;
    };

    this.equal = function(value)
    {
        if(steps.length > 0 && (steps[steps.length -1] == "where" || checkOperator()) && (steps.indexOf("whereo") == -1))
        {
            queryString += " = " + (typeof(value) == "string" ? "'" + value.toString() + "'" : value.toString()) + " ";
            indexString += " == " + (typeof(value) == "string" ? "'" + value.toString() + "'" : value.toString()) + " ";
        }
        else if((steps.indexOf("whereo") != -1) && !checkThat())
        {
            this.objectInfo.Comparators.push(" = ");
            this.objectInfo.LogicVals.push(value);
            this.objectInfo.LogicNexts.push(null);
        }
        else
            throw new Error("(equal) only can be called after where or after (or, and)");

        steps.push("eq");

        return this;
    };

    this.notEqual = function(value)
    {
        if(steps.length > 0 && (steps[steps.length -1] == "where" || checkOperator()) && (steps.indexOf("whereo") == -1))
        {
            queryString += " <> " + (typeof(value) == "string" ? "'" + value.toString() + "'" : value.toString()) + " ";
            indexString += " != " + (typeof(value) == "string" ? "'" + value.toString() + "'" : value.toString()) + " ";
        }
        else if((steps.indexOf("whereo") != -1) && !checkThat())
        {
            this.objectInfo.Comparators.push(" <> ");
            this.objectInfo.LogicVals.push(value);
            this.objectInfo.LogicNexts.push(null);
        }
        else
            throw new Error("(notEqual) only can be called after where or after (or, and)");

        steps.push("neq");

        return this;
    };

    this.like = function(value)
    {
        if(steps.length > 0 && (steps[steps.length -1] == "where" || checkOperator()) && (steps.indexOf("whereo") == -1))
        {
            queryString += " LIKE " + (typeof(value) == "string" ? "'%" + value.toString() + "%'" : value.toString()) + " ";
            indexString += " .indexOf( " + (typeof(value) == "string" ? "'" + value.toString() + "'" : value.toString()) + ") != -1 ";
        }
        else if((steps.indexOf("whereo") != -1) && !checkThat())
        {
            this.objectInfo.Comparators.push(" LIKE ");
            this.objectInfo.LogicVals.push(value);
            this.objectInfo.LogicNexts.push(null);
        }
        else
            throw new Error("(like) only can be called after where or after (or, and)");

        steps.push("like");

        return this;
    }

    this.between = function(value1, value2)
    {
        if(steps.length > 0 && (steps[steps.length -1] == "where" || checkOperator()) && (steps.indexOf("whereo") == -1))
        {
            queryString += " BETWEEN " +
                    (typeof(value1) == "string" ? "'%" + value1.toString() + "%'" : value1.toString()) +
                    " AND " +
                    (typeof(value2) == "string" ? "'%" + value1.toString() + "%'" : value2.toString()) + " ";
            indexString += " >= " + 
                    (typeof(value1) == "string" ? "'%" + value1.toString() + "%'" : value1.toString()) +
                    " && i." + fieldTmp + " <= " + 
                    (typeof(value2) == "string" ? "'%" + value1.toString() + "%'" : value2.toString()) + " ";
        }
        else if((steps.indexOf("whereo") != -1) && !checkThat())
        {
            this.objectInfo.Comparators.push(" BETWEEN " +
                    (typeof(value1) == "string" ? "'%" + value1.toString() + "%'" : value1.toString()) +
                    " AND ");
            this.objectInfo.LogicVals.push(value2);
            this.objectInfo.LogicNexts.push(null);
        }
        else
            throw new Error("(between) only can be called after where or after (or, and)");

        steps.push("between");

        return this;
    };

    this.bigger = function(value)
    {
        if(steps.length > 0 && (steps[steps.length -1] == "where" || checkOperator()) && (steps.indexOf("whereo") == -1))
        {
            queryString += " > " + (typeof(value) == "string" ? "'" + value.toString() + "'" : value.toString()) + " ";
            indexString += " > " + (typeof(value) == "string" ? "'" + value.toString() + "'" : value.toString()) + " ";
        }
        else if((steps.indexOf("whereo") != -1) && !checkThat())
        {
            this.objectInfo.Comparators.push(" > ");
            this.objectInfo.LogicVals.push(value);
            this.objectInfo.LogicNexts.push(null);
        }
        else
            throw new Error("(bigger) only can be called after where or after (or, and)");

        steps.push("bigger");

        return this;
    }

    this.less = function(value)
    {
        if(steps.length > 0 && (steps[steps.length -1] == "where" || checkOperator()) && (steps.indexOf("whereo") == -1))
        {
            queryString += " < " + (typeof(value) == "string" ? "'" + value.toString() + "'" : value.toString()) + " ";
            indexString += " > " + (typeof(value) == "string" ? "'" + value.toString() + "'" : value.toString()) + " ";
        }
        else if((steps.indexOf("whereo") != -1) && !checkThat())
        {
            this.objectInfo.Comparators.push(" < ");
            this.objectInfo.LogicVals.push(value);
            this.objectInfo.LogicNexts.push(null);
        }
        else
            throw new Error("(less) only can be called after where or after (or, and)");

        steps.push("less");

        return this;
    }

    this.biggerAndEqual = function(value)
    {
        if(steps.length > 0 && (steps[steps.length -1] == "where" || checkOperator()) && (steps.indexOf("whereo") == -1))
        {
            queryString += " >= " + (typeof(value) == "string" ? "'" + value.toString() + "'" : value.toString()) + " ";
            indexString += " >= " + (typeof(value) == "string" ? "'" + value.toString() + "'" : value.toString()) + " ";
        }
        else if((steps.indexOf("whereo") != -1) && !checkThat())
        {
            this.objectInfo.Comparators.push(" >= ");
            this.objectInfo.LogicVals.push(value);
            this.objectInfo.LogicNexts.push(null);
        }
        else
            throw new Error("(biggerAndEqual) only can be called after where or after (or, and)");

        steps.push("biggerEq");

        return this;
    };
    
    this.lessAndEqual = function(value)
    {
        if(steps.length > 0 && (steps[steps.length -1] == "where" || checkOperator()) && (steps.indexOf("whereo") == -1))
        {
            queryString += " <= " + (typeof(value) == "string" ? "'" + value.toString() + "'" : value.toString()) + " ";
            indexString += " <= " + (typeof(value) == "string" ? "'" + value.toString() + "'" : value.toString()) + " ";
        }
        else if((steps.indexOf("whereo") != -1) && !checkThat())
        {
            this.objectInfo.Comparators.push(" <= ");
            this.objectInfo.LogicVals.push(value);
            this.objectInfo.LogicNexts.push(null);
        }
        else
            throw new Error("(lessAndEqual) only can be called after where or after (or, and)");

        steps.push("lessEq");

        return this;
    };

    this.and = function(field)
    {
        if(arguments.length == 2)
            return ando(arguments[0], arguments[1], this.objectInfo);
        
        if(steps.length > 0 && checkThat() && (steps.indexOf("whereo") == -1))
        {
            queryString += "AND " + field + " ";
            indexString += " && i." + field + " ";
            fieldTmp = field;
        }
        else if(checkThat() && (steps.indexOf("whereo") != -1))
        {
            this.objectInfo.LogicNexts[this.objectInfo.LogicNexts.lenght -1] =  " AND ";
        }
        else
            throw new Error("(and) only can be called after (like, equal, bigger, less etc ...)");

        steps.push("and");

        return this;
    };

    function ando(cl, field, objectInfo, obj)
    {
        if(checkThat() && (steps.indexOf("whereo") != -1))
        {
            objectInfo.LogicNexts[objectInfo.LogicNexts.length -1] = " AND ";
            objectInfo.NameRefs.push(cl.getName());
            objectInfo.FieldsRefs.push(field);
        }
        else
            throw new Error("(and) only can be called after (like, equal, bigger, less etc ...)");

        steps.push("or");

        return obj;
    };

    this.or = function(field)
    {
        if(arguments.length == 2)
            return oro(arguments[0], arguments[1], this.objectInfo, this);
        
        if(steps.length > 0 && checkThat() && (steps.indexOf("whereo") == -1))
        {
            queryString += "OR " + field + " ";
            indexString += " || i." + field + " ";
            fieldTmp = field;
        }
        else if(checkThat() && (steps.indexOf("whereo") != -1))
        {
            throw new Error("(or) used without class reference in (where) with reference");
        }
        else
            throw new Error("(and) only can be called after (like, equal, bigger, less etc ...)");

        steps.push("or");

        return this;
    }

    function oro(cl, field, objectInfo, obj)
    {
        if(checkThat() && (steps.indexOf("whereo") != -1))
        {
            objectInfo.LogicNexts[objectInfo.LogicNexts.length -1] = " OR ";
            objectInfo.NamesRef.push(cl.getName());
            objectInfo.FieldsRef.push(field);
        }
        else
            throw new Error("(or) only can be called after (like, equal, bigger, less etc ...)");

        steps.push("or");

        return obj;
    }

    this.orderBy = function(field)
    {
        this.objectInfo.OrderBy = " " + field;
        steps.push("order");
        return this;
    }

    this.asc = function()
    {
        if(steps[steps.length -1] == "order")
        {
            this.objectInfo.OrderBy += " ASC";
        }
        else
            throw new Error("(asc) only can be called after (orderBy)");
        steps.push("asc");
        return this;
    }
    
    this.desc = function()
    {
        if(steps[steps.length -1] == "order")
        {
            this.objectInfo.OrderBy += " DESC";
        }
        else
            throw new Error("(desc) only can be called after (orderBy)");
        steps.push("desc");
        return this;
    }

    this.limit = function(limitInf, limitSup)
    {
        this.objectInfo.Limiter = [];
        this.objectInfo.Limiter[0] = limitInf;
        this.objectInfo.Limiter[1] = limitSup;
        steps.push("limit");
        return this;
    }

    function checkTuples()
    {
        if(steps.length > 0)
        {
            if(steps.length % 2 == 0)
            {
                return true;
            }
            else if(steps[steps.length -1] == "limit")
            {
                return true;
            }
            else
                return false;
        }
        return true;
    }

    this.debug = function()
    {
        this.objectInfo.Where = queryString;
        this.objectInfo.IndexWhere = indexString;
        
        if(MproEntity.indexedDB)
            console.log("FILTER -> " + this.objectInfo.IndexWhere);
        else
            console.log("SQL -> " + this.objectInfo.Where);
    };

    this.execute = function(callback)
    {
        if(checkTuples())
        {
            this.objectInfo.Where = queryString;
            this.objectInfo.IndexWhere = indexString;
            MproEntity.getWhere(t, this.objectInfo, callback);
        }
        else
            throw new Error("Your query appears incomplete. Make sure you are not missing after (where, or, and) one comparator (like, equal, notEqual, bigger, less, between) or missing after (orderBy) one order (asc, desc)");
    };
}

