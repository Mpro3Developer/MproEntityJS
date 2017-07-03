

/* *
 * Classe para Objeto de Fonte de dados
 * @return {DBsource}
 */
function DBsource(entity, max, begin, where, ord, asc)
{
    var __linkedObjs = new Array();
    var __max = max;
    var __begin = begin;
    var __dataLoaded = false;
    var __funcMouseListener = [];
    var __internData = false;
    var __iData = [];

    this.EntityName = entity;
    this.Data = new Array();
    this.Where = where;
    this.Rules = [];
    this.OrdBy = ord;
    this.Asc = asc;

    function dispatch(me)
    {
        if (!__internData)
        {
            setTimeout(function ()
            {
                //me.Data = MproEntity.getAll(me.EntityName, [__begin, __max], undefined, me.Where, me.OrdBy);
                //showLoading();

                // pass for Query
                var query = MproEntity.query(me.EntityName);

                if(me.Where)
                    query.where(me.Where);

                if(me.OrdBy)
                {
                    query.orderBy(me.OrdBy);

                    if(me.Asc)
                        query.asc();
                    else
                        query.desc();
                }

                query.limit(__begin, __max);

                query.execute(function (data)
                {
                    me.Data = data;
                    addDataToModel(me);
                    __dataLoaded = true;
                    for (var i = 0; i < __funcMouseListener.length; i++)
                        __funcMouseListener[i]();
                    //hideLoading();
                    //magic();
                });
            }, 100);
        }
        else
        {
            addDataToModel(me);
            __dataLoaded = true;
            for (var i = 0; i < __funcMouseListener.length; i++)
                __funcMouseListener[i]();
        }
    }

    function addDataToModel(me)
    {
        if (!__internData)
        {
            for (var i = 0; i < __linkedObjs.length; i++)
            {
                var mdTmp = __linkedObjs[i];
                mdTmp.model.clear();

                for (var j = 0; j < me.Data.length; j++)
                {
                    mdTmp.model.add(new Item(me.Data[j][mdTmp.collum], me.Data[j]));
                }
            }
        }
        else
        {
            if ((__begin) < __iData.length)
            {
                me.Data = [];
                for (var i = 0, j = __begin; j < (__begin + __max); j++, i++)
                {
                    if (i < __max)
                        me.Data.push(__iData[j]);
                    else
                        break;
                }

                for (var i = 0; i < __linkedObjs.length; i++)
                {
                    var mdTmp = __linkedObjs[i];
                    mdTmp.model.clear();

                    for (var j = __begin; j < me.Data.length; j++)
                    {
                        mdTmp.model.add(new Item(me.Data[j][mdTmp.collum], me.Data[j]));
                    }
                }
            }
            else
            {
                __begin -= __max;
            }
        }
    }

    this.addLink = function (obj)
    {
        __linkedObjs.push(obj);
        if (!__dataLoaded)
            dispatch(this);
        else
            addDataToModel(this);
    };

    this.setMaxResults = function (max, can)
    {
        __max = max;
        if (can === undefined || can === true)
            dispatch(this);
    };

    this.setBegin = function (begin, can)
    {
        __begin = begin;
        if (can === undefined || can === true)
            dispatch(this);
    };

    this.setWhere = function (wh, can)
    {
        __internData = false;
        this.Where = wh;
        __begin = 0;
        if (can === undefined || can === true)
            dispatch(this);
    };

    this.addRule = function (entity, field, value)
    {
        this.Rules.push([entity, field, value]);
    };

    this.setOrdBy = function (ord, can)
    {
        __internData = false;
        this.OrdBy = ord;
        if (can === undefined || can === true)
            dispatch(this);
    };

    this.setListener = function (func)
    {
        __funcMouseListener.push(func);
    };

    this.removeListener = function (func)
    {
        for (var i = 0; i < __funcMouseListener.length; i++)
        {
            if (__funcMouseListener[i] == func)
            {
                __funcMouseListener.splice(i, 1);
            }
            console.log(__funcMouseListener.length);
        }
    };

    this.prox = function ()
    {
        if (this.Data.length >= __max)
            __begin += __max;
        dispatch(this);
    };

    this.back = function ()
    {
        if (__begin > 0)
            __begin -= __max;
        dispatch(this);
    };

    this.getData = function ()
    {
        __internData = false;
        dispatch(this);
    };

    this.setData = function (data)
    {
        __iData = data;
        this.Data = [];
        __begin = 0;
        __internData = true;

        for (var i = 0; i < __iData.length; i++)
        {
            if (i < __max)
                this.Data.push(__iData[i]);
            else
                break;
        }
    };

    this.refresh = function ()
    {
        addDataToModel(this);
        __dataLoaded = true;
        for (var i = 0; i < __funcMouseListener.length; i++)
            __funcMouseListener[i]();
    };

    //dispatch(this);
}