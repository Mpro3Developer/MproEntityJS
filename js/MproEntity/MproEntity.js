
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
    var namesTransient = new Array();
    var namesBase64 = new Array();
    this.cod = 2147483647;
    this.codRemote = 2147483647;
    this.RefObject = null;
    // get name of class
    this.class = this.constructor.name;

    /**
     * CREAT AUTH USERS
     */
    if(MproEntity.authDb)
    {

    }

    /*
     * Construct static help for fields in "class" and getters and setters
     */
    if (window[this.class].class === undefined)
    {
        window[this.class].class = {};
        for (var f in me)
        {
            if ((f !== "class") && (f !== "RefObject") && (typeof (me[f]) !== "function"))
            {
                window[this.class].class[f] = {field: f, class: this.class};
                var me = this;
                window[this.class].getName = function(){ return me.class; };
                window[this.class].prototype["set" + f] = function (f)
                {
                    return function (x)
                    {
                        this[f] = x;
                    };
                }(f);
                window[this.class].prototype["get" + f] = function (f)
                {
                    return function ()
                    {
                        return this[f];
                    };
                }(f);
            }
        }
    }

    namesRelation = MproEntityAnnotations.getReferences(this);
    if(namesRelation.length > 0)
        joined = true;

    namesTransient = MproEntityAnnotations.getTransients(this);
    namesBase64 = MproEntityAnnotations.getBase64(this);

    if (!MproEntity.serverSeted)
    {
        MproEntity.serverUrl = "server";
        MproEntity.serverTech = ".php";
    }

    if (this.class === undefined)
        this.class = "";

    /**
     * This method is only used in instance for Query class
     * All other methods get field information all again TODO user this instead
     * This not get base64 fields
     **/
    this.getInfo = function()
    {
        var dataRequest = new MproEntity.DataRequest();
        //var namesTransient = MproEntityAnnotations.getTransients(this);

        dataRequest.Name = this.class;

        for (var field in this)
        {
            if (! (this[field] instanceof Array) && !(namesTransient[field]) && !(namesBase64[field]))
            {
                if ((field !== "getAll") && (field !== "cod") && (field !== "codRemote") && (field !== "class") && (field !== "Save") && (field !== "Delete")
                        && (field !== "RefObject") && (typeof (this[field]) !== "function"))
                {
                    dataRequest.Fields.push(field);
                }
            }
        }

        return dataRequest;
    };

    /**
     * This method is only used in instance for Query class
     * All other methods get field information all again STUPID PROGRAMMER I AM
     **/
    this.getInfoAll = function()
    {
        var dataRequest = new MproEntity.DataRequest();
        //var namesTransient = MproEntityAnnotations.getTransients(this);

        dataRequest.Name = this.class;

        for (var field in this)
        {
            if (! (this[field] instanceof Array) && !(namesTransient[field]))
            {
                if ((field !== "getAll") && (field !== "cod") && (field !== "codRemote") && (field !== "class") && (field !== "Save") && (field !== "Delete")
                        && (field !== "RefObject") && (typeof (this[field]) !== "function"))
                {
                    dataRequest.Fields.push(field);
                }
            }
        }

        return dataRequest;
    };

    this.DeleteRemote = function(classref, codref)
    {
        var dataRemove = new MproEntity.DataReference();

        //getValues();

        if (me.codRemote === 0)
        {
            return 0;
        }
        else
        {
            if (!me.RefObject)
            {
                dataRemove.Name = me.class;
                dataRemove.Cod = me.codRemote;
            }
            else
            {
                dataRemove.Name = me.class;
                dataRemove.Cod = me.codRemote;
                dataRemove.NameRef = me.RefObject.class;
                dataRemove.CodRef = me.RefObject.codRemote;
            }
        }

        var tmpNamesRelation = $.extend(true, [], namesRelation);

        var ajax = new Ajax();
        ajax.Url = MproEntity.remoteServer + "/dataRemoveService" + MproEntity.remoteServerTech;
        ajax.setData({dataRemove: JSON.stringify(dataRemove), user: __projectUser__, cod: __projectCod__});
        ajax.onSucces(function (data)
        {
            //console.log(data);

            if (joined)
            {
                for (var i = 0; i < tmpNamesRelation.length; i++)
                {
                    /** @type Array */
                    var arr = me[tmpNamesRelation[i].NameVar];
                    for (var j = 0; j < arr.length; j++)
                    {
                        arr[j].DeleteRemote(tmpNamesRelation[i].Name, me.codRemote);
                    }
                }
            }
        });
        ajax.execute();
    };

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

        if(MproEntity.indexedDB)
        {
            var db = new IDBLauDB();
            db.setJSONObject(dataRemove, function()
            {
                db.delete(me.cod, function()
                {
                    me.cod = null;
                });
            });
        }
        else if (!window.externalEnvironment)
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
                        var arr = me[tmpNamesRelation[i].NameVar];
                        for (var j = 0; j < arr.length; j++)
                        {
                            arr[j].Delete(tmpNamesRelation[i].Name, me.cod);
                        }
                    }
                }
            });
            ajax.execute();
        }
        else
        {
            window.externalEnvironment.removeService(JSON.stringify(dataRemove));
            me.cod = 2147483647;

            if (joined)
            {
                for (var i = 0; i < tmpNamesRelation.length; i++)
                {
                    /** @type Array */
                    var arr = me[tmpNamesRelation[i].NameVar];
                    for (var j = 0; j < arr.length; j++)
                    {
                        arr[j].Delete(tmpNamesRelation[i].Name, me.cod);
                    }
                }
            }
        }
    };

    this.SaveRemote = function(classref, codref, ix)
    {
        var insert = false;
        var dataRecord = new MproEntity.DataRecord();
        dataRecord.Cod = me.cod;
        dataRecord.Remote = true;
        var auxCod = me.cod;

        if(!arguments.length && me.codRemote === 2147483647)
            me.cod = 2147483647;
        else if(me.codRemote !== 2147483647)
            me.cod = me.codRemote;

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
        me.cod = auxCod;

        var ajax = new Ajax();
        ajax.Url = MproEntity.remoteServer + "/dataRecordService" + MproEntity.remoteServerTech;
        ajax.setData({dataRecord: JSON.stringify(dataRecord), user: __projectUser__, cod: __projectCod__});
        ajax.onSucces(function (data)
        {

            if (insert)
            {
                me.codRemote = parseInt(data);
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
                    ajax.Url = MproEntity.remoteServer + "/dataRecordService" + MproEntity.remoteServerTech;
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
                    var arr = me[tmpNamesRelation[i].NameVar];
                    for (var j = 0; j < arr.length; j++)
                    {
                        arr[j].SaveRemote(me.class, me.cod, tmpNamesRelation[i].Ix);
                    }
                }
            }
        });
        ajax.execute();
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

        if(MproEntity.indexedDB)
        {
            var db = new IDBLauDB();
            db.setJSONObject(dataRecord, function()
            {
                db.insert(JSON.parse(JSON.stringify(me)), function(id)
                {
                    me.cod = id;
                });
            });
        }
        else if (!window.externalEnvironment)
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
                        var arr = me[tmpNamesRelation[i].NameVar];
                        for (var j = 0; j < arr.length; j++)
                        {
                            arr[j].Save(me.class, me.cod, tmpNamesRelation[i].Ix);
                        }
                    }
                }
            });
            ajax.execute();
        }
        else
        {
            window.externalEnvironment.recordService(JSON.stringify(dataRecord), function(id)
            {
                if (insert)
                {
                    me.cod = id;
                }

                if (classref && codref)
                {
                    var dataReference = new MproEntity.DataReference();
                    dataReference.Cod = me.cod;
                    dataReference.Name = me.class;
                    dataReference.NameRef = classref;
                    dataReference.Ix = ix;
                    dataReference.CodRef = codref;

                    window.externalEnvironment.recordService(JSON.stringify(dataReference));
                }

                if (joined)
                {
                    for (var i = 0; i < tmpNamesRelation.length; i++)
                    {
                        /** @type Array */
                        var arr = me[tmpNamesRelation[i].NameVar];
                        for (var j = 0; j < arr.length; j++)
                        {
                            //arr[j].superCod = me.cod;
                            arr[j].Save(me.class, me.cod, tmpNamesRelation[i].Ix);
                        }
                    }
                }
            });
        }
    };

    function getValues()
    {
        var string = "";

        for (var field in me)
        {
            if ((field !== "getAll") && (field !== "class") && (field !== "Save") && (field !== "cod") && (field !== "codRemote") && (field !== "Delete")
                    && (field !== "RefObject") && ((typeof (me[field]) !== "function")))
            {
                if (!(me[field] instanceof Array) && !(namesTransient[field]))
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
                            me[field] = "" + CryptoJS.SHA3(me[field]);
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
            }
        }
        string = string.replace(/, $/, "");

        return string;
    }

    function getValuesUpdates()
    {
        var string = "";

        for (var field in me)
        {
            if ((field !== "getAll") && (field !== "class") && (field !== "Save") && (field !== "cod") && (field !== "codRemote") && (field !== "Delete")
                    && (field !== "RefObject") && (typeof (me[field]) !== "function"))
            {
                if (!(me[field] instanceof Array) && !(namesTransient[field]))
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
                            fieldTmp = "" + CryptoJS.SHA3(fieldTmp);
                        }
                        string += field + " = " + (typeof (fieldTmp) === "string" ? "'" : "") + fieldTmp + (typeof (fieldTmp) === "string" ? "'" : "") + ", ";
                    }
                    else
                        string += field + " = " + (typeof (me[field]) === "string" ? "'" : "") + me[field] + (typeof (me[field]) === "string" ? "'" : "") + ", ";
                }
            }
        }
        string = string.replace(/, $/, "");

        return string;
    }

    function init(remote)
    {
        if (MproEntity.canCreateTables)
        {
            var sql = new Array();
            var createTable = new MproEntity.CreateTable();

            if (me.class !== "")
            {
                createTable.Name = me.class;

                for (var field in me)
                {
                    if ((field !== "getAll") && (field !== "cod") && (field !== "codRemote") && (field !== "class") && (field !== "Save") && (field !== "Delete")
                            && (field !== "RefObject") && (typeof (me[field]) !== "function"))
                    {
                        if (!(me[field] instanceof Array) && !(namesTransient[field]))
                        {
                            createTable.Fields.push(field);
                            createTable.Types.push((typeof (me[field]) === "number" ? "NUMERIC" : "TEXT"));
                        }
                    }
                }

                if(MproEntity.indexedDB && !remote)
                {
                    var db = new IDBLauDB();
                    db.createIndexes(createTable);
                }

                if ((!window.externalEnvironment && !MproEntity.indexedDB) || remote)
                {
                    var ajax = new Ajax();
                    ajax.Url = (remote ? MproEntity.remoteServer : MproEntity.serverUrl) + "/createTableService" + (remote ? MproEntity.remoteServerTech : MproEntity.serverTech);
                    ajax.setData({createTable: JSON.stringify(createTable), user: __projectUser__, cod: __projectCod__});
                    ajax.onSucces(function (data) {
                    });
                    ajax.execute();
                }

                if(window.externalEnvironment && !remote)
                {
                    window.externalEnvironment.createTableService(JSON.stringify(createTable));
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

    if(MproEntity.remoteServer)
        init(true);
};
