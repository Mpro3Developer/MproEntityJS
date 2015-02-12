
/* 
 * Copyright (C) 2015 Matheus Castello
 * 
 *  There is no peace only passion
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

function MproEntity()
{
    var me = this;
    var joined = false;
    var namesRelation = new Array();
    this.cod = 2147483647;
    this.RefObject = null;
    // get name of class
    this.class = this.constructor.name;

    /*
        * Construct static help for fields in "class"
        */
    if (window[this.class].class === undefined)
    {
        window[this.class].class = {};
        for (var f in me)
        {
            if ((f !== "class") && (f !== "RefObject") && (typeof (me[f]) !== "function"))
            {
                window[this.class].class[f] = {field: f, class: this.class};
            }
        }
    }

    if (!MproEntity.serverSeted)
    {
        MproEntity.serverUrl = "server";
        MproEntity.serverTech = ".php";
    }

    if (this.class === undefined)
        this.class = "";

    this.Delete = function (classref, codref)
    {
        var dataRemove = new MproEntity.DataReference();

        //getValues();

        if (me.cod === 0)
        {
            return 0;
        }
        else
        {
            if (!me.RefObject)
            {
                dataRemove.Name = me.class;
                dataRemove.Cod = me.cod;
            }
            else
            {
                dataRemove.Name = me.class;
                dataRemove.Cod = me.cod;
                dataRemove.NameRef = me.RefObject.class;
                dataRemove.CodRef = me.RefObject.cod;
            }
        }

        var tmpNamesRelation = $.extend(true, [], namesRelation);

        if (!window.externalEnvironment)
        {
            var ajax = new Ajax();
            ajax.Url = MproEntity.serverUrl + "/dataRemoveService" + MproEntity.serverTech;
            ajax.setData({dataRemove: JSON.stringify(dataRemove), user: __projectUser__, cod: __projectCod__});
            ajax.onSucces(function (data)
            {
                //console.log(data); 

                if (joined)
                {
                    for (var i = 0; i < tmpNamesRelation.length; i++)
                    {
                        /** @type Array */
                        var arr = me[tmpNamesRelation[i]];
                        for (var j = 0; j < arr.length; j++)
                        {
                            arr[j].Delete(tmpNamesRelation[i], me.cod);
                        }
                    }
                }
            });
            ajax.execute();
        }
        else
        {
            externalEnvironment.setDataJSONObject(JSON.stringify(dataRecord));
            externalEnvironment.executeData();
            me.cod = 2147483647;

            if (joined)
            {
                for (var i = 0; i < tmpNamesRelation.length; i++)
                {
                    /** @type Array */
                    var arr = me[tmpNamesRelation[i]];
                    for (var j = 0; j < arr.length; j++)
                    {
                        arr[j].Delete(tmpNamesRelation[i], me.cod);
                    }
                }
            }
        }
    };

    this.Save = function (classref, codref, ix)
    {
        var insert = false;
        var dataRecord = new MproEntity.DataRecord();
        dataRecord.Cod = me.cod;

        if (me.cod === 2147483647)
        {
            dataRecord.Name = me.class;
            dataRecord.Fields = getValues();
            insert = true;
        }
        else
        {
            dataRecord.Name = me.class;
            dataRecord.Fields = getValuesUpdates();
        }

        var tmpNamesRelation = $.extend(true, [], namesRelation);

        if (!window.externalEnvironment)
        {
            var ajax = new Ajax();
            ajax.Url = MproEntity.serverUrl + "/dataRecordService" + MproEntity.serverTech;
            ajax.setData({dataRecord: JSON.stringify(dataRecord), user: __projectUser__, cod: __projectCod__});
            ajax.onSucces(function (data)
            {
                
                if (insert)
                {
                    me.cod = parseInt(data);
                }

                if (classref && codref)
                {
                    
                    var dataReference = new MproEntity.DataReference();
                    dataReference.Cod = me.cod;
                    dataReference.Name = me.class;
                    dataReference.NameRef = classref;
                    dataReference.Ix = ix;
                    dataReference.CodRef = codref;
                    
                    if (!window.externalEnvironment)
                    {
                        var ajax = new Ajax();
                        ajax.Url = MproEntity.serverUrl + "/dataRecordService" + MproEntity.serverTech;
                        ajax.setData({dataRecord: JSON.stringify(dataReference), user: __projectUser__, cod: __projectCod__});
                        ajax.onSucces(function (data) {
                        });
                        ajax.execute();
                    }
                    else
                        window.externalEnvironment.Table();
                }

                if (joined)
                {
                    for (var i = 0; i < tmpNamesRelation.length; i++)
                    {
                        /** @type Array */
                        var arr = me[tmpNamesRelation[i]];
                        for (var j = 0; j < arr.length; j++)
                        {
                            arr[j].Save(me.class, me.cod, tmpNamesRelation[i].match(/[0-9]+/)[0]);
                        }
                    }
                }
            });
            ajax.execute();
        }
        else
        {
            externalEnvironment.setDataJSONObject(JSON.stringify(dataRecord));
            
            if (insert)
                me.cod = externalEnvironment.executeData();
            else
                externalEnvironment.executeData();

            if (classref && codref)
            {
                var dataReference = new MproEntity.DataReference();
                dataReference.Cod = me.cod;
                dataReference.Name = me.class;
                dataReference.NameRef = classref;
                dataReference.Ix = ix;
                dataReference.CodRef = codref;
                
                externalEnvironment.setDataJSONObject(JSON.stringify(dataReference));
                externalEnvironment.executeData();
            }

            if (joined)
            {
                for (var i = 0; i < tmpNamesRelation.length; i++)
                {
                    /** @type Array */
                    var arr = me[tmpNamesRelation[i]];
                    for (var j = 0; j < arr.length; j++)
                    {
                        //arr[j].superCod = me.cod;
                        arr[j].Save(me.class, me.cod, tmpNamesRelation[i].match(/[0-9]+/)[0]);
                    }
                }
            }
        }
    };

    function getValues()
    {
        var string = "";
        namesRelation = new Array();
        for (var field in me)
        {
            if ((field !== "getAll") && (field !== "class") && (field !== "Save") && (field !== "cod") && (field !== "Delete")
                    && (field !== "RefObject") && ((typeof (me[field]) !== "function")))
            {
                if (!(me[field] instanceof Array))
                {
                    if (field.indexOf("Ref") !== -1)
                    {
                        var fieldTmp = me[field].cod;
                        string += (typeof (fieldTmp) === "string" ? "'" : "") + fieldTmp + (typeof (fieldTmp) === "string" ? "'" : "") + ", ";
                    }
                    else if (field.indexOf("Crypt") !== -1)
                    {
                        if (me[field].indexOf("{}") === -1)
                        {
                            me[field] = "{}" + CryptoJS.SHA1(me[field]);
                            string += (typeof (me[field]) === "string" ? "'" : "") + me[field] + (typeof (me[field]) === "string" ? "'" : "") + ", ";
                        }
                        else
                        {
                            string += (typeof (me[field]) === "string" ? "'" : "") + me[field] + (typeof (me[field]) === "string" ? "'" : "") + ", ";
                        }
                    }
                    else
                        string += (typeof (me[field]) === "string" ? "'" : "") + me[field] + (typeof (me[field]) === "string" ? "'" : "") + ", ";
                }
                else
                {
                    joined = true;
                    if (field.indexOf("Entity") !== -1)
                        namesRelation.push(field);
                }
            }
        }
        string = string.replace(/, $/, "");

        return string;
    }

    function getValuesUpdates()
    {
        var string = "";
        namesRelation = new Array();
        for (var field in me)
        {
            if ((field !== "getAll") && (field !== "class") && (field !== "Save") && (field !== "cod") && (field !== "Delete")
                    && (field !== "RefObject") && (typeof (me[field]) !== "function"))
            {
                if (!(me[field] instanceof Array))
                {
                    if (field.indexOf("Ref") !== -1)
                    {
                        var fieldTmp = me[field].cod;
                        string += field + " = " + (typeof (fieldTmp) === "string" ? "'" : "") + fieldTmp + (typeof (fieldTmp) === "string" ? "'" : "") + ", ";
                    }
                    else if (field.indexOf("Crypt") !== -1)
                    {
                        var fieldTmp = me[field];
                        if (fieldTmp.indexOf("{}") === -1)
                        {
                            fieldTmp = "{}" + CryptoJS.SHA1(fieldTmp);
                        }
                        string += field + " = " + (typeof (fieldTmp) === "string" ? "'" : "") + fieldTmp + (typeof (fieldTmp) === "string" ? "'" : "") + ", ";
                    }
                    else
                        string += field + " = " + (typeof (me[field]) === "string" ? "'" : "") + me[field] + (typeof (me[field]) === "string" ? "'" : "") + ", ";
                }
                else
                {
                    joined = true;
                    if (field.indexOf("Entity") !== -1)
                        namesRelation.push(field);
                }
            }
        }
        string = string.replace(/, $/, "");

        return string;
    }

    function init()
    {
        if(MproEntity.canCreateTables)
        {
            var sql = new Array();
            var createTable = new MproEntity.CreateTable();
            
            if (me.class !== "")
            {
                createTable.Name = me.class;

                for (var field in me)
                {
                    if ((field !== "getAll") && (field !== "cod") && (field !== "class") && (field !== "Save") && (field !== "Delete")
                            && (field !== "RefObject") && (typeof (me[field]) !== "function"))
                    {
                        if (!(me[field] instanceof Array))
                        {
                            createTable.Fields.push(field);
                            createTable.Types.push((typeof (me[field]) === "number" ? "NUMERIC" : "TEXT"));
                        }
                    }
                }

                if (!window.externalEnvironment)
                {
                    var ajax = new Ajax();
                    ajax.Url = MproEntity.serverUrl + "/createTableService" + MproEntity.serverTech;
                    ajax.setData({createTable: JSON.stringify(createTable), user: __projectUser__, cod: __projectCod__});
                    ajax.onSucces(function (data) {
                    });
                    ajax.execute();
                }
                else
                {
                    externalEnvironment.setDataJSONObject(JSON.stringify(createTable));
                    externalEnvironment.executeData();
                }
            }
        }
    }

    function toNull()
    {
        for (var field in me)
        {
            ////console.log(field);
            if ((field !== "getAll") && (field !== "class") && (field !== "Save") && (field !== "Delete") && (typeof (me[field]) !== "function")
                    && (field !== "RefObject") && (typeof (me[field]) !== "function"))
            {
                if (typeof (me[field]) === "string")
                    me[field] = null;
                else if (typeof (me[field]) === "number")
                    me[field] = 2147483647;
            }
        }
    }

    toNull();
    init();
}

//MproEntity.getWhere = function(classe, superFilter, objFilter)
/**
 * 
 * @param {Entity} classe
 * @returns {unresolved}
 */
MproEntity.getWhere = function (classe)
{
    if (!arguments.length <= 1)
    {
        var instance = new classe();
        var relations = new Array();
        var fields = new Array();
        var logics = [];
        var tuples = [];
        var elems = new Array();
        var sync = true;
        var end = true;
        var order = "";
        var sql = "SELECT " + instance.class + ".cod, ";

        for (var field in instance)
        {
            if (instance[field] instanceof Array)
            {
                //relations.push(field.replace("Entity", ""));
                relations.push(field.replace(/Entity[0-9]*/, ""));
            }
            else
            {
                if ((field !== "getAll") && (field !== "cod") && (field !== "class") && (field !== "Save") && (field !== "Delete")
                        && (field !== "RefObject") && (typeof (instance[field]) !== "function"))
                {
                    fields.push(field);
                    sql += instance.class + "." + field + ", ";
                }
            }
        }

        sql = sql.replace(/, $/, "");
        sql += " FROM " + instance.class + " ";

        // INNER JOINS
        for (var i = 1; i < arguments.length - 1; i++)
        {
            if (!(typeof (arguments[i]) === "function"))
            {
                if (i % 2 !== 0)
                {
                    if (arguments[i].class !== instance.class)
                    {
                        sql += " INNER JOIN Reference ON Reference.cod = "
                                + instance.class + ".cod "
                                + "INNER JOIN " + arguments[i].class + " ON "
                                + arguments[i].class + ".cod = Reference.codref AND Reference.classref = '" +
                                arguments[i].class + "' ";
                    }
                    tuples.push(arguments[i]);
                }
                else
                {
                    logics.push(arguments[i]);
                }
            }
        }

        /**
                * TRATAMENTO DE ERROS
                */

        if (logics.length !== tuples.length)
        {
            throw new Error("Número de Entidades relacionadas não corresponde ao número de operações Lógicas!");
            return null;
        }

        if (typeof (arguments[(logics.length + tuples.length) + 1]) !== "function")
        {
            throw new Error("Callback de termino não definido!");
            return null;
        }

        if (typeof (arguments[arguments.length - 1]) !== "function")
        {
            /** @type MproEntity.Order */
            var orObj = arguments[arguments.length - 1];
            order += " ORDER BY " + orObj.Classe.class + "." + orObj.Classe.field + " " + orObj.OrderBy;
        }

        var callBack = arguments[(logics.length + tuples.length) + 1];
        sql += " WHERE ";

        // WHERES
        for (var i = 0; i < logics.length; i++)
        {
            sql += "" + tuples[i].class + "." + tuples[i].field + " "
                    + logics[i].comparator + " " +
                    (typeof (logics[i].val) == "string" ? "'" +
                            (logics[i].comparator === " LIKE " ? "%" : "")
                            + logics[i].val
                            + (logics[i].comparator === " LIKE " ? "%" : "") + "'" : logics[i].val) +
                    " " + (logics[i].logicNext === null ? "" : logics[i].logicNext);
        }

        sql += " " + order;

        if (!window.externalEnvironment)
        {
            var ajax = new Ajax();
            ajax.Url = MproEntity.scriptQuery;
            ajax.setData({cmd: sql, user: __projectUser__, cod: __projectCod__});
            ajax.onSucces(function (data)
            {
                //console.log(data);
                /** @type Array */
                var arrTmp = JSON.parse(data);
                var refs = [];

                for (var j = 0; j < arrTmp.length; j++)
                {
                    refs = [];
                    /** @type Array */
                    var arrM = arrTmp[j];
                    /** @type MproEntity */
                    var objTmp = new classe();

                    objTmp.cod = arrM[0];

                    for (var i = 0; i < fields.length; i++)
                    {
                        if (fields[i].indexOf("Ref") === -1)
                            objTmp[fields[i]] = arrM[i + 1];
                        else
                        {
                            //var ret = MproEntity.getAll(window[fields[i].replace("Ref", "")], null, 1, undefined, "cod = " + arrM[i+1], undefined, false);
                            refs.push(fields[i]);
                            var endi = false;
                            if (j >= arrTmp.length - 1)
                                endi = true;

                            var funcCall = function (objTmp, fields, i, callBack, elems, endi, len) {
                                return function (ret)
                                {
                                    if (ret)
                                        objTmp[fields[i]] = ret[0];

                                    if (callBack && endi && refs.length === len)
                                        callBack(elems);
                                };
                            };

                            MproEntity.getAll(window[fields[i].replace("Ref", "")], funcCall(objTmp, fields, i, callBack, elems, endi, refs.length), 1, undefined, "cod = " + arrM[i + 1], undefined, true, endi);
                        }
                    }

                    if (relations.length > 0)
                    {
                        var entitiesEqCount = [];
                        for (var k = 0; k < relations.length; k++)
                        {
                            //var objR = MproEntity.getAll(window[relations[k]], undefined, undefined, objTmp, undefined, undefined, false);
                            var endi = false;

                            if (entitiesEqCount[relations[k]] !== undefined)
                                entitiesEqCount[relations[k]] += 1;
                            else
                                entitiesEqCount[relations[k]] = 1;


                            if (k >= relations.length - 2 && j >= arrTmp.length - 1)
                                endi = true;

                            var funcCall2 = function (objTmp, relations, k, callBack, endi, entityIx)
                            {
                                return function (objR, stop)
                                {
                                    for (var i = 0; i < objR.length; i++)
                                    {
                                        objR[i].RefObject = objTmp;
                                    }

                                    if (objR !== null)
                                    {
                                        objTmp["Entity" + entityIx + "" + relations[k]] = objR;
                                        objTmp[relations[k + 1]] = objR;
                                        //objTmp.RefObject = me;
                                        //k++;
                                    }
                                    if (callBack && endi)
                                        setTimeout(function ()
                                        {
                                            callBack(elems);
                                        }, 500);
                                };
                            };

                            if (k % 2 === 0)
                                MproEntity.getAll(window[relations[k]], funcCall2(objTmp, relations, k, callBack, endi, entitiesEqCount[relations[k]]), undefined, objTmp, undefined, undefined, true, undefined, entitiesEqCount[relations[k]]);
                            //objTmp["Entity" + relations[k]].push(objR[0]);
                        }
                    }

                    elems.push(objTmp);
                }

                if (relations.length !== 0 || refs.length !== 0)
                {
                    // se tem referencias não faz nada
                    //callBack(elems);
                }
                else
                {
                    //hideLoading();
                    callBack(elems, end);
                }

                if (arrTmp.length === 0)
                    callBack(elems, end);
            });
            ajax.execute(sync);
            //showLoading();
        }
        else
        {
            /** @type Array */
            var arrTmp = JSON.parse(externalEnvironment.query(sql));
            var refs = [];

            for (var j = 0; j < arrTmp.length; j++)
            {
                refs = [];
                /** @type Array */
                var arrM = arrTmp[j];
                /** @type MproEntity */
                var objTmp = new classe();

                objTmp.cod = arrM[0];

                for (var i = 0; i < fields.length; i++)
                {
                    if (fields[i].indexOf("Ref") === -1)
                        objTmp[fields[i]] = arrM[i + 1];
                    else
                    {
                        //var ret = MproEntity.getAll(window[fields[i].replace("Ref", "")], null, 1, undefined, "cod = " + arrM[i+1], undefined, false);
                        refs.push(fields[i]);
                        var endi = false;
                        if (j >= arrTmp.length - 1)
                            endi = true;

                        var funcCall = function (objTmp, fields, i, callBack, elems, endi, len) {
                            return function (ret)
                            {
                                if (ret)
                                    objTmp[fields[i]] = ret[0];

                                if (callBack && endi && refs.length === len)
                                    callBack(elems);
                            };
                        };

                        MproEntity.getAll(window[fields[i].replace("Ref", "")], funcCall(objTmp, fields, i, callBack, elems, endi, refs.length), 1, undefined, "cod = " + arrM[i + 1], undefined, true, endi);
                    }
                }

                if (relations.length > 0)
                {
                    var entitiesEqCount = [];
                    for (var k = 0; k < relations.length; k++)
                    {
                        //var objR = MproEntity.getAll(window[relations[k]], undefined, undefined, objTmp, undefined, undefined, false);
                        var endi = false;

                        if (entitiesEqCount[relations[k]] !== undefined)
                            entitiesEqCount[relations[k]] += 1;
                        else
                            entitiesEqCount[relations[k]] = 1;


                        if (k >= relations.length - 2 && j >= arrTmp.length - 1)
                            endi = true;

                        var funcCall2 = function (objTmp, relations, k, callBack, endi, entityIx)
                        {
                            return function (objR, stop)
                            {
                                for (var i = 0; i < objR.length; i++)
                                {
                                    objR[i].RefObject = objTmp;
                                }

                                if (objR !== null)
                                {
                                    objTmp["Entity" + entityIx + "" + relations[k]] = objR;
                                    objTmp[relations[k + 1]] = objR;
                                    //objTmp.RefObject = me;
                                    //k++;
                                }
                                if (callBack && endi)
                                    setTimeout(function ()
                                    {
                                        callBack(elems);
                                    }, 500);
                            };
                        };

                        if (k % 2 === 0)
                            MproEntity.getAll(window[relations[k]], funcCall2(objTmp, relations, k, callBack, endi, entitiesEqCount[relations[k]]), undefined, objTmp, undefined, undefined, true, undefined, entitiesEqCount[relations[k]]);
                        //objTmp["Entity" + relations[k]].push(objR[0]);
                    }
                }

                elems.push(objTmp);
            }

            if (relations.length !== 0 || refs.length !== 0)
            {
                // se tem referencias não faz nada
                //callBack(elems);
            }
            else
            {
                //hideLoading();
                callBack(elems, end);
            }

            if (arrTmp.length === 0)
                callBack(elems, end);
        }

        return elems;
    }
    else
        return null;
};

MproEntity.getAll = function (classe, callBack, limiter, superFilter, where, ordBy, sync, end, ix)
{

    if (classe === undefined)
        return null;

    if (where === undefined)
        where = "";

    if ((ordBy === undefined) || (ordBy === ""))
        ordBy = "cod asc";

    if (sync === undefined)
        sync = true;

    if (end === undefined)
        end = true;

    var instance = new classe();
    var relations = new Array();
    var fields = new Array();
    var elems = new Array();
    var sql = "";

    for (var field in instance)
    {
        if (instance[field] instanceof Array)
        {
            //relations.push(field.replace("Entity", ""));
            relations.push(field.replace(/Entity[0-9]*/, ""));
        }
        else
        {
            if ((field !== "getAll") && (field !== "cod") && (field !== "class") && (field !== "Save") && (field !== "Delete")
                    && (field !== "RefObject") && (typeof (instance[field]) !== "function"))
            {
                fields.push(field);
            }
        }
    }

    if (superFilter === undefined)
        sql = "SELECT * FROM " + instance.class + " " + (where === "" ? "ORDER BY " : (" WHERE (" + where + ") ORDER BY ")) + ordBy;
    else
    {
        sql = "SELECT * FROM " + instance.class + " WHERE cod in "
                + "(SELECT codref FROM Reference WHERE class = '" + superFilter.class + "' and cod = " +
                superFilter.cod + " AND classref = '" + instance.class + "' " + (ix !== undefined ? " AND ix = " + ix + " " : "") + ") "
                + " " +
                (where === "" ? "ORDER BY " : (" AND (" + where + ") ORDER BY ")) + ordBy;
    }

    if (limiter && limiter.length && (limiter.length === 2))
    {
        sql += " LIMIT " + limiter[0] + ", " + limiter[1];
    }

    if (!window.externalEnvironment)
    {
        var ajax = new Ajax();
        ajax.Url = MproEntity.scriptQuery;
        ajax.setData({cmd: sql, user: __projectUser__, cod: __projectCod__});
        ajax.onSucces(function (data)
        {
            //console.log(data);
            /** @type Array */
            var arrTmp = JSON.parse(data);
            var refs = [];

            for (var j = 0; j < arrTmp.length; j++)
            {
                refs = [];
                /** @type Array */
                var arrM = arrTmp[j];
                /** @type MproEntity */
                var objTmp = new classe();

                objTmp.cod = arrM[0];

                for (var i = 0; i < fields.length; i++)
                {
                    if (fields[i].indexOf("Ref") === -1)
                        objTmp[fields[i]] = arrM[i + 1];
                    else
                    {
                        //var ret = MproEntity.getAll(window[fields[i].replace("Ref", "")], null, 1, undefined, "cod = " + arrM[i+1], undefined, false);
                        refs.push(fields[i]);
                        var endi = false;
                        if (j >= arrTmp.length - 1)
                            endi = true;

                        var funcCall = function (objTmp, fields, i, callBack, elems, endi, len) {
                            return function (ret)
                            {
                                if (ret)
                                    objTmp[fields[i]] = ret[0];

                                if (callBack && endi && refs.length === len)
                                    callBack(elems);
                            }
                        };

                        MproEntity.getAll(window[fields[i].replace("Ref", "")], funcCall(objTmp, fields, i, callBack, elems, endi, refs.length), 1, undefined, "cod = " + arrM[i + 1], undefined, true, endi);
                    }
                }

                if (relations.length > 0)
                {
                    var entitiesEqCount = [];
                    for (var k = 0; k < relations.length; k++)
                    {
                        //var objR = MproEntity.getAll(window[relations[k]], undefined, undefined, objTmp, undefined, undefined, false);
                        var endi = false;

                        if (entitiesEqCount[relations[k]] !== undefined)
                            entitiesEqCount[relations[k]] += 1;
                        else
                            entitiesEqCount[relations[k]] = 1;


                        if (k >= relations.length - 2 && j >= arrTmp.length - 1)
                            endi = true;

                        var funcCall2 = function (objTmp, relations, k, callBack, endi, entityIx)
                        {
                            return function (objR, stop)
                            {
                                for (var i = 0; i < objR.length; i++)
                                {
                                    objR[i].RefObject = objTmp;
                                }

                                if (objR !== null)
                                {
                                    objTmp["Entity" + entityIx + "" + relations[k]] = objR;
                                    objTmp[relations[k + 1]] = objR;
                                    //objTmp.RefObject = me;
                                    //k++;
                                }
                                if (callBack && endi)
                                    setTimeout(function ()
                                    {
                                        callBack(elems);
                                    }, 500);
                            };
                        };

                        if (k % 2 === 0)
                            MproEntity.getAll(window[relations[k]], funcCall2(objTmp, relations, k, callBack, endi, entitiesEqCount[relations[k]]), undefined, objTmp, undefined, undefined, true, undefined, entitiesEqCount[relations[k]]);
                        //objTmp["Entity" + relations[k]].push(objR[0]);
                    }
                }

                elems.push(objTmp);
            }

            if (relations.length !== 0 || refs.length !== 0)
            {
                // se tem referencias não faz nada
                //callBack(elems);
            }
            else
            {
                //hideLoading();
                callBack(elems, end);
            }

            if (arrTmp.length === 0)
                callBack(elems, end);
        });
        ajax.execute(sync);
        //showLoading();
    }
    else
    {
        /** @type Array */
        var arrTmp = JSON.parse(externalEnvironment.query(sql));
        var refs = [];

        for (var j = 0; j < arrTmp.length; j++)
        {
            refs = [];
            /** @type Array */
            var arrM = arrTmp[j];
            /** @type MproEntity */
            var objTmp = new classe();

            objTmp.cod = arrM[0];

            for (var i = 0; i < fields.length; i++)
            {
                if (fields[i].indexOf("Ref") === -1)
                    objTmp[fields[i]] = arrM[i + 1];
                else
                {
                    //var ret = MproEntity.getAll(window[fields[i].replace("Ref", "")], null, 1, undefined, "cod = " + arrM[i+1], undefined, false);
                    refs.push(fields[i]);
                    var endi = false;
                    if (j >= arrTmp.length - 1)
                        endi = true;

                    var funcCall = function (objTmp, fields, i, callBack, elems, endi, len) {
                        return function (ret)
                        {
                            if (ret)
                                objTmp[fields[i]] = ret[0];

                            if (callBack && endi && refs.length === len)
                                callBack(elems);
                        }
                    };

                    MproEntity.getAll(window[fields[i].replace("Ref", "")], funcCall(objTmp, fields, i, callBack, elems, endi, refs.length), 1, undefined, "cod = " + arrM[i + 1], undefined, true, endi);
                }
            }

            if (relations.length > 0)
            {
                var entitiesEqCount = [];
                for (var k = 0; k < relations.length; k++)
                {
                    //var objR = MproEntity.getAll(window[relations[k]], undefined, undefined, objTmp, undefined, undefined, false);
                    var endi = false;

                    if (entitiesEqCount[relations[k]] !== undefined)
                        entitiesEqCount[relations[k]] += 1;
                    else
                        entitiesEqCount[relations[k]] = 1;


                    if (k >= relations.length - 2 && j >= arrTmp.length - 1)
                        endi = true;

                    var funcCall2 = function (objTmp, relations, k, callBack, endi, entityIx)
                    {
                        return function (objR, stop)
                        {
                            for (var i = 0; i < objR.length; i++)
                            {
                                objR[i].RefObject = objTmp;
                            }

                            if (objR !== null)
                            {
                                objTmp["Entity" + entityIx + "" + relations[k]] = objR;
                                objTmp[relations[k + 1]] = objR;
                                //objTmp.RefObject = me;
                                //k++;
                            }
                            if (callBack && endi)
                                setTimeout(function ()
                                {
                                    callBack(elems);
                                }, 500);
                        };
                    };

                    if (k % 2 === 0)
                        MproEntity.getAll(window[relations[k]], funcCall2(objTmp, relations, k, callBack, endi, entitiesEqCount[relations[k]]), undefined, objTmp, undefined, undefined, true, undefined, entitiesEqCount[relations[k]]);
                    //objTmp["Entity" + relations[k]].push(objR[0]);
                }
            }

            elems.push(objTmp);
        }

        if (relations.length !== 0 || refs.length !== 0)
        {
            // se tem referencias não faz nada
            //callBack(elems);
        }
        else
        {
            //hideLoading();
            callBack(elems, end);
        }

        if (arrTmp.length === 0)
            callBack(elems, end);
    }

    return elems;
};

MproEntity.serverUrl = "";
MproEntity.serverTech = "";
MproEntity.serverSeted = false;
MproEntity.canCreateTables = true;

MproEntity.setServer = function (url, tec)
{
    window.externalEnvironment = undefined;
    MproEntity.serverUrl = url;
    MproEntity.serverTech = (tec == undefined ? "" : ("." + tec));
    MproEntity.serverSeted = true;
};

MproEntity.Logic = function (val, comparator, logicNext)
{
    this.val = val;
    this.comparator = comparator;
    this.logicNext = logicNext;
};

MproEntity.Order = function (classType, desc)
{
    this.Classe = classType;
    this.OrderBy = desc;
};

MproEntity.DataRecord = function ()
{
    this.Name = "";
    this.Cod = 2147483647;
    this.Fields = [];
    this.Data = [];
};

MproEntity.DataReference = function ()
{
    this.NameRef = "";
    this.Name = "";
    this.Ix = 2147483647;
    this.CodRef = 2147483647;
    this.Cod = 2147483647;
};

MproEntity.DataRequest = function ()
{
    this.Name = "";
    this.Where = "";
    this.OrderBy = "";
    this.Ix = 2147483647;
    this.NameRef = "";
    this.NameRefs = [];
    this.LogicVals = [];
    this.Comparators = [];
    this.LogicNexts = [];
    this.Fields = [];
};

MproEntity.CreateTable = function ()
{
    this.Name = "";
    this.Fields = [];
    this.Types = [];
};

MproEntity.GT = " > ";
MproEntity.GTE = " >= ";
MproEntity.LT = " < ";
MproEntity.LTE = " <= ";
MproEntity.LIKE = " LIKE ";
MproEntity.EQUAL = " = ";
MproEntity.AND = " AND ";
MproEntity.OR = " OR ";

/*
 * Automatic entity creator variables
 */
__projectUser__ = 0;
__projectCod__ = 0;