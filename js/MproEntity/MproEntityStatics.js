/*
 * Copyright (C) 2016 Matheus Castello
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

MproEntity.auth = function(user, key)
{
    if (!window.externalEnvironment)
    {
        var ajax = new Ajax();
        ajax.Url = MproEntity.serverUrl + "/auth" + MproEntity.serverTech;
        var crypted = "" + CryptoJS.SHA3(key);
        ajax.setData({login: user, password: crypted, time: Math.round(new Date().getTime()/1000)});
        ajax.onSucces(function(data)
        {
            console.log(data);
        });
        ajax.execute();
    }
    else // websql or bridge engine
    {

    }
    MproEntity.authDb = true;
};

MproEntity.authRemote = function(user, key)
{
     var ajax = new Ajax();
     ajax.Url = MproEntity.remoteServer + "/auth" + MproEntity.remoteServerTech;
};

/**
 * Add user, for each new user privelegies is 0
 * you need access to data base file to change table privilegies
 * @param {string} user
 * @param {string} key
 * @returns {undefined}
 */
MproEntity.addUser = function(user, key)
{
    var u = new EntityUserAuth();
    u.User____ = user;
    u.CryptKey____ = key;
    u.Save();
};

/**
 *
 * @param {Entity} classe
 * @returns {unresolved}
 */
MproEntity.getWhere = function (classe)
{
    if (!arguments.length <= 1)
    {
        var elems = new Array();
        var dataRequest = undefined;
        var callBack = undefined;
        var fields = new Array();
        var instance = new classe();
        var relations = new Array();
        var namesTransient = new Array();
        var namesBase64 = new Array();
        var remote = false;

        namesTransient = MproEntityAnnotations.getTransients(instance);
        relations = MproEntityAnnotations.getReferences(instance);
        namesBase64 = MproEntityAnnotations.getBase64(instance);

        if(arguments[1].constructor != MproEntity.DataRequest)
        {
            var logics = [];
            var tuples = [];
            var sync = true;
            var end = true;
            var order = "";
            dataRequest = new MproEntity.DataRequest();

            dataRequest.Name = instance.class;

            for (var field in instance)
            {
                if (!(instance[field] instanceof Array) && !(namesTransient[field]) && !(namesBase64[field]))
                {
                    if ((field !== "getAll") && (field !== "cod") && (field !== "codRemote") && (field !== "class") && (field !== "Save") && (field !== "Delete")
                            && (field !== "RefObject") && (typeof (instance[field]) !== "function"))
                    {
                        fields.push(field);
                        dataRequest.Fields.push(field);
                    }
                }
            }

            for (var i = 1; i < arguments.length - 1; i++)
            {
                if (!(typeof (arguments[i]) === "function"))
                {
                    if (i % 2 !== 0)
                    {
                        if (arguments[i].class !== instance.class)
                        {
                            dataRequest.NameRefs.push(arguments[i].class);
                            dataRequest.FieldsRefs.push(arguments[i].field);
                        }
                        else
                        {
                            throw new Error("Ambiguos class search " + instance.class + ". Instead, use the argument \"where\" of getAll.");
                            return null;
                        }
                    }
                    else
                    {
                        dataRequest.LogicVals.push(arguments[i].val);
                        dataRequest.Comparators.push(arguments[i].comparator);
                        dataRequest.LogicNexts.push(arguments[i].logicNext);
                    }
                }
            }

            /**
             * TRATAMENTO DE ERROS
             */

            if (dataRequest.LogicVals.length !== dataRequest.NameRefs.length)
            {
                throw new Error("Number of Related Entities not match the number of Logical Operations.");
                return null;
            }

            if (typeof (arguments[(dataRequest.LogicVals.length + dataRequest.NameRefs.length) + 1]) !== "function")
            {
                throw new Error("End Callback undefined.");
                return null;
            }

            if (typeof (arguments[arguments.length - 1]) !== "function")
            {
                /** @type MproEntity.Order */
                var orObj = arguments[arguments.length - 1];
                dataRequest.OrderBy += " ORDER BY " + orObj.Classe.class + "." + orObj.Classe.field + " " + orObj.OrderBy;
            }

            callBack = arguments[(dataRequest.LogicVals.length + dataRequest.NameRefs.length) + 1];
        }
        else
        {
            dataRequest = arguments[1];
            fields = dataRequest.Fields;
            if(arguments[2])
                callBack = arguments[2];
            else
                throw new Error("End Callback undefined.");

            if(arguments[3])
                remote = arguments[3];
        }

        if(MproEntity.indexedDB && !remote)
        {
            MproEntity.getAll(classe, function(data)
            {
                var res = data.filter(function(i){ return eval(dataRequest.IndexWhere); });
                var pts = [];
                var fid = "";

                if(dataRequest.OrderBy != "")
                {
                    pts = dataRequest.OrderBy.split(" ");
                    fid = pts[1];
                }

                function compareAsc(a, b)
                {
                    if (a[fid] < b[fid])
                        return -1;
                    else if (a[fid] > b[fid])
                        return 1;
                    else
                        return 0;
                }

                function compareDesc(a, b)
                {
                    if (a[fid] < b[fid])
                        return 1;
                    else if (a[fid] > b[fid])
                        return -1;
                    else
                        return 0;
                }

                if(pts.length && pts[2] == 'ASC')
                    res = res.sort(compareAsc);
                else if(pts.length && pts[2] == 'DESC')
                    res = res.sort(compareDesc);

                callBack(res);
            });
        }

        if (!window.externalEnvironment || remote)
        {
            var ajax = new Ajax();
            ajax.Url = (remote ? MproEntity.remoteServer : MproEntity.serverUrl) + "/dataRequestService" + (remote ? MproEntity.remoteServerTech : MproEntity.serverTech);
            ajax.setData({dataRequest: JSON.stringify(dataRequest), user: __projectUser__, cod: __projectCod__});
            ajax.onSucces(function (data)
            {
                /** @type Array */
                var arrTmp = [];
                try
                {
                    arrTmp = JSON.parse(data);
                }
                catch(e)
                {
                    throw new Error(data);
                }
                var refs = [];

                for (var j = 0; j < arrTmp.length; j++)
                {
                    refs = [];
                    /** @type Array */
                    var arrM = arrTmp[j];
                    /** @type MproEntity */
                    var objTmp = new classe();

                    if(!remote)
                        objTmp.cod = arrM[0];
                    else
                        objTmp.codRemote = arrM[0];

                    for (var i = 0; i < fields.length; i++)
                    {
                        if (fields[i].indexOf("Ref") === -1)
                            objTmp[fields[i]] = arrM[i + 1];
                        else
                        {
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

                            if(!remote)
                                MproEntity.getAll(window[fields[i].replace("Ref", "")], funcCall(objTmp, fields, i, callBack, elems, endi, refs.length), "cod = " + arrM[i + 1], undefined, 1, undefined, true, endi);
                            else
                                MproEntity.getAllRemote(window[fields[i].replace("Ref", "")], funcCall(objTmp, fields, i, callBack, elems, endi, refs.length), "cod = " + arrM[i + 1], undefined, 1, undefined, true, endi);
                        }
                    }

                    if (relations.length > 0)
                    {
                        var entitiesEqCount = [];
                        for (var k = 0; k < relations.length; k++)
                        {
                            var endi = false;

                            if (entitiesEqCount[relations[k].Name] !== undefined)
                                entitiesEqCount[relations[k].Name] += 1;
                            else
                                entitiesEqCount[relations[k].Name] = 1;


                            if (k >= relations.length - 1 && j >= arrTmp.length - 1)
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
                                        objTmp[relations[k].NameVar] = objR;
                                    }
                                    if (callBack && endi)
                                        setTimeout(function ()
                                        {
                                            callBack(elems);
                                        }, 500);
                                };
                            };

                            if(!remote)
                                MproEntity.getAll(window[relations[k].Name], funcCall2(objTmp, relations, k, callBack, endi, entitiesEqCount[relations[k].Name]), undefined, undefined, undefined, objTmp, true, undefined, entitiesEqCount[relations[k].Name]);
                            else
                                MproEntity.getAllRemote(window[relations[k].Name], funcCall2(objTmp, relations, k, callBack, endi, entitiesEqCount[relations[k].Name]), undefined, undefined, undefined, objTmp, true, undefined, entitiesEqCount[relations[k].Name]);
                        }
                    }

                    elems.push(objTmp);
                }

                if (!(relations.length !== 0 || refs.length !== 0))
                {
                    callBack(elems, end);
                }

                if (arrTmp.length === 0)
                    callBack(elems, end);
            });
            ajax.execute(sync);
        }

        if(window.externalEnvironment && !remote)
        {
            window.externalEnvironment.requestService(JSON.stringify(dataRequest), function(res)
            {
                /** @type Array */
                var arrTmp = res;
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

                            MproEntity.getAll(window[fields[i].replace("Ref", "")], funcCall(objTmp, fields, i, callBack, elems, endi, refs.length), "cod = " + arrM[i + 1], undefined, 1, undefined, true, endi);
                        }
                    }

                    if (relations.length > 0)
                    {
                        var entitiesEqCount = [];
                        for (var k = 0; k < relations.length; k++)
                        {
                            var endi = false;

                            if (entitiesEqCount[relations[k].Name] !== undefined)
                                entitiesEqCount[relations[k].Name] += 1;
                            else
                                entitiesEqCount[relations[k].Name] = 1;


                            if (k >= relations.length - 1 && j >= arrTmp.length - 1)
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
                                        objTmp[relations[k].NameVar] = objR;
                                    }
                                    if (callBack && endi)
                                        setTimeout(function ()
                                        {
                                            callBack(elems);
                                        }, 500);
                                };
                            };

                            MproEntity.getAll(window[relations[k].Name], funcCall2(objTmp, relations, k, callBack, endi, entitiesEqCount[relations[k].Name]), undefined, undefined, undefined, objTmp, true, undefined, entitiesEqCount[relations[k].Name]);
                        }
                    }

                    elems.push(objTmp);
                }

                if (!(relations.length !== 0 || refs.length !== 0))
                {
                    callBack(elems, end);
                }

                if (arrTmp.length === 0)
                    callBack(elems, end);
            });
        }

        return elems;
    }
    else
        return null;
};

MproEntity.getAllRemote = function(classe, callBack, where, ordBy, limiter, superFilter, sync, end, ix)
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
    var namesTransient = new Array();
    var fields = new Array();
    var elems = new Array();
    var sql = "";

    namesTransient = MproEntityAnnotations.getTransients(instance);

    for (var field in instance)
    {
        if (!(instance[field] instanceof Array) && !(namesTransient[field]))
        {
            if ((field !== "getAll") && (field !== "cod") && (field !== "codRemote") && (field !== "class") && (field !== "Save") && (field !== "Delete")
                    && (field !== "RefObject") && (typeof (instance[field]) !== "function"))
            {
                fields.push(field);
            }
        }
    }

    relations = MproEntityAnnotations.getReferences(instance);

    var dataRequest = new MproEntity.DataRequest();
    dataRequest.Name = instance.class;
    dataRequest.Where = where;
    dataRequest.OrderBy = ordBy;

    if (superFilter !== undefined)
    {
        dataRequest.NameRef = superFilter.class;
        dataRequest.CodRef = superFilter.codRemote;
        if (ix !== undefined)
            dataRequest.Ix = ix;
    }

    if (limiter && limiter.length && (limiter.length === 2))
    {
        dataRequest.Limiter[0] = limiter[0];
        dataRequest.Limiter[1] = limiter[1];
        sql += " LIMIT " + limiter[0] + ", " + limiter[1];
    }

    var ajax = new Ajax();
    ajax.Url = MproEntity.serverUrl + "/dataRequestAllService" + MproEntity.serverTech;
    ajax.setData({dataRequest: JSON.stringify(dataRequest), user: __projectUser__, cod: __projectCod__});
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

            objTmp.codRemote = arrM[0];

            for (var i = 0; i < fields.length; i++)
            {
                if (fields[i].indexOf("Ref") === -1)
                    objTmp[fields[i]] = arrM[i + 1];
                else
                {
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

                    MproEntity.getAllRemote(window[fields[i].replace("Ref", "")], funcCall(objTmp, fields, i, callBack, elems, endi, refs.length), "cod = " + arrM[i + 1], undefined, 1, undefined, true, endi);
                }
            }

            if (relations.length > 0)
            {
                var entitiesEqCount = [];
                for (var k = 0; k < relations.length; k++)
                {
                    var endi = false;

                    if (entitiesEqCount[relations[k].Name] !== undefined)
                        entitiesEqCount[relations[k].Name] += 1;
                    else
                        entitiesEqCount[relations[k].Name] = 1;


                    if (k >= relations.length - 1 && j >= arrTmp.length - 1)
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
                                objTmp[relations[k].NameVar] = objR;
                            }
                            if (callBack && endi)
                                setTimeout(function ()
                                {
                                    callBack(elems);
                                }, 500);
                        };
                    };

                    MproEntity.getAllRemote(window[relations[k].Name], funcCall2(objTmp, relations, k, callBack, endi, entitiesEqCount[relations[k].Name]), undefined, undefined, undefined, objTmp, true, undefined, entitiesEqCount[relations[k].Name]);
                }
            }

            elems.push(objTmp);
        }

        if (!(relations.length !== 0 || refs.length !== 0))
        {
            callBack(elems, end);
        }

        if (arrTmp.length === 0)
            callBack(elems, end);
    });
    ajax.execute(sync);
};

MproEntity.getAll = function (classe, callBack, where, ordBy, limiter, superFilter, sync, end, ix)
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
    var namesTransient = new Array();
    var namesBase64 = new Array();
    var fields = new Array();
    var elems = new Array();
    var sql = "";

    namesTransient = MproEntityAnnotations.getTransients(instance);
    namesBase64 = MproEntityAnnotations.getBase64(instance);

    for (var field in instance)
    {
        if (!(instance[field] instanceof Array) && !(namesTransient[field]) && !(namesBase64[field]))
        {
            if ((field !== "getAll") && (field !== "cod") && (field !== "codRemote") && (field !== "class") && (field !== "Save") && (field !== "Delete")
                    && (field !== "RefObject") && (typeof (instance[field]) !== "function"))
            {
                fields.push(field);
            }
        }
    }

    relations = MproEntityAnnotations.getReferences(instance);

    var dataRequest = new MproEntity.DataRequest();
    dataRequest.Name = instance.class;
    dataRequest.Where = where;
    dataRequest.OrderBy = ordBy;

    if (superFilter !== undefined)
    {
        dataRequest.NameRef = superFilter.class;
        dataRequest.CodRef = superFilter.cod;
        if (ix !== undefined)
            dataRequest.Ix = ix;
    }

    if (limiter && limiter.length && (limiter.length === 2))
    {
        dataRequest.Limiter[0] = limiter[0];
        dataRequest.Limiter[1] = limiter[1];
        sql += " LIMIT " + limiter[0] + ", " + limiter[1];
    }

    if(MproEntity.indexedDB)
    {
        var db = new IDBLauDB();
        db.setJSONObject(dataRequest, function()
        {
            db.selectAll(function(res)
            {
                for(var i = 0; i < res.length; i++)
                {
                    res[i] = MproEntity.extend(window[dataRequest.Name], res[i]);
                }
                callBack(res);
            });
        });
    }
    else if (!window.externalEnvironment)
    {
        var ajax = new Ajax();
        ajax.Url = MproEntity.serverUrl + "/dataRequestAllService" + MproEntity.serverTech;
        ajax.setData({dataRequest: JSON.stringify(dataRequest), user: __projectUser__, cod: __projectCod__});
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

                        MproEntity.getAll(window[fields[i].replace("Ref", "")], funcCall(objTmp, fields, i, callBack, elems, endi, refs.length), "cod = " + arrM[i + 1], undefined, 1, undefined, true, endi);
                    }
                }

                if (relations.length > 0)
                {
                    var entitiesEqCount = [];
                    for (var k = 0; k < relations.length; k++)
                    {
                        var endi = false;

                        if (entitiesEqCount[relations[k].Name] !== undefined)
                            entitiesEqCount[relations[k].Name] += 1;
                        else
                            entitiesEqCount[relations[k].Name] = 1;


                        if (k >= relations.length - 1 && j >= arrTmp.length - 1)
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
                                    objTmp[relations[k].NameVar] = objR;
                                }
                                if (callBack && endi)
                                    setTimeout(function ()
                                    {
                                        callBack(elems);
                                    }, 500);
                            };
                        };

                        MproEntity.getAll(window[relations[k].Name], funcCall2(objTmp, relations, k, callBack, endi, entitiesEqCount[relations[k].Name]), undefined, undefined, undefined, objTmp, true, undefined, entitiesEqCount[relations[k].Name]);
                    }
                }

                elems.push(objTmp);
            }

            if (!(relations.length !== 0 || refs.length !== 0))
            {
                callBack(elems, end);
            }

            if (arrTmp.length === 0)
                callBack(elems, end);
        });
        ajax.execute(sync);
    }
    else
    {
        /** @type Array */
        window.externalEnvironment.requestAllService(JSON.stringify(dataRequest), function(res)
        {
            var arrTmp = res;
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

                        MproEntity.getAll(window[fields[i].replace("Ref", "")], funcCall(objTmp, fields, i, callBack, elems, endi, refs.length), "cod = " + arrM[i + 1], undefined, 1, undefined, true, endi);
                    }
                }

                if (relations.length > 0)
                {
                    var entitiesEqCount = [];
                    for (var k = 0; k < relations.length; k++)
                        {
                            var endi = false;

                            if (entitiesEqCount[relations[k].Name] !== undefined)
                                entitiesEqCount[relations[k].Name] += 1;
                            else
                                entitiesEqCount[relations[k].Name] = 1;


                            if (k >= relations.length - 1 && j >= arrTmp.length - 1)
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
                                        /*objTmp["Entity" + entityIx + "" + relations[k]] = objR;
                                        objTmp[relations[k + 1]] = objR;*/
                                        objTmp[relations[k].NameVar] = objR;
                                    }
                                    if (callBack && endi)
                                        setTimeout(function ()
                                        {
                                            callBack(elems);
                                        }, 500);
                                };
                            };

                            //if (k % 2 === 0)
                                MproEntity.getAll(window[relations[k].Name], funcCall2(objTmp, relations, k, callBack, endi, entitiesEqCount[relations[k].Name]), undefined, undefined, undefined, objTmp, true, undefined, entitiesEqCount[relations[k].Name]);
                        }
                }

                elems.push(objTmp);
            }

            if (!(relations.length !== 0 || refs.length !== 0))
            {
                callBack(elems, end);
            }

            if (arrTmp.length === 0)
                callBack(elems, end);
        });
    }

    return elems;
};

MproEntity.query = function(c)
{
    return new Query(c);
};

MproEntity.setServer = function (url, tec)
{
    window.externalEnvironment = undefined;
    MproEntity.serverUrl = url;
    MproEntity.serverTech = (tec == undefined ? "" : ("." + tec));
    MproEntity.serverSeted = true;
};

MproEntity.setRemoteServer = function(url, tec)
{
    MproEntity.remoteServer = url;
    MproEntity.remoteServerTech = (tec == undefined ? "" : ("." + tec));
};

MproEntity.enableWebSQL = function()
{
    window.externalEnvironment = new InternalEnviroment();
};

MproEntity.enableIndexedDB = function()
{
    MproEntity.indexedDB = true;
};

MproEntity.extend = function(clas, values)
{
    var obj = new clas();
    for(var field in values)
    {
        obj[field] = values[field];
    }
    return obj;
};
