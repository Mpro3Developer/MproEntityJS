
/**
 * Declaração da Classe Listas BootStrap
 * Dependencias: JQUERY
 * @argument {String} elem id from container of table
 * @returns {Table}
 */
function Table(elem)
{
    // Campos privados
    var me = this;
    var myId = Table.ID;
    Table.ID++;
    /**
     * @type DBsource
     */
    var Source = null;
    /**
     * @type $
     */
    var Elem = $(elem);
    /**
     * @type $
     */
    var Input = null;
    /**
     * @type Array
     */
    var Collums = [];
    var OverrideDelete = null;
    var _funcMouseListener = null;
    var _removeEnable = true;

    function getVarName(v) {
        for (var key in window) {
            if (window[key] === v)
                return key;
        }
    }

    reArrange = function ()
    {
        arrange();
    };

    // Metodos privados

    /**
     * 
     * @returns {undefined}
     */
    function arrange()
    {
        Elem.html("");
        // cria as colunas
        Elem.append("<thead><tr></tr></thead>");
        for (var i = 0; i < Collums.length; i++)
        {
            Elem.find("thead").find("tr:last").append("<th><b>" + Collums[i] + "</b></th>");
        }
        if (_removeEnable)
            Elem.find("thead").find("tr:last").append("<th><b>Remove</b></th>");
        Elem.append("<tbody></tbody>");

        if (Source)
        {
            if (Source.length)
            {
                Source.Data = Source;
            }

            // coloca os dados
            if (Source.Data)
            {
                for (var i = 0; i < Source.Data.length; i++)
                {
                    var objTmp = Source.Data[i];
                    Elem.find("tbody").append("<tr id='" + i + "' class='mEnti" + myId + "' style='cursor: pointer;'></tr>");
                    for (var j = 0; j < Collums.length; j++)
                    {
                        if (Collums[j].indexOf(".") === -1)
                            if (typeof (objTmp[Collums[j]]) !== "function")
                                Elem.find("tbody").find("tr:last").append("<td>" + objTmp[Collums[j]] + "</td>");
                            else
                                Elem.find("tbody").find("tr:last").append("<td>" + objTmp[Collums[j]]() + "</td>");
                        else
                        {
                            var splits = Collums[j].split(".");
                            for (var o = 0; o < splits.length; o++)
                            {
                                if (objTmp)
                                    objTmp = objTmp[splits[o]];
                                if ((objTmp) && (typeof (objTmp) === "function"))
                                    objTmp = objTmp();
                            }
                            Elem.find("tbody").find("tr:last").append("<td>" + objTmp + "</td>");
                        }
                    }
                    if (_removeEnable)
                        Elem.find("tbody").find("tr:last").append('<td width="10%"><center><button id="' + i + '" class="btn btn-default remEnti' + myId + '" title="Remover" style="width:  100%;"><i class="glyphicon glyphicon-remove-circle"></i></button></center></td>');
                }
                Elem.append('<span id="back' + myId + '" class="glyphicon glyphicon-chevron-left" style="cursor: pointer; padding-left: 20px; padding-bottom: 20px; padding-top: 20px;"></span>' +
                        '<span id="prox' + myId + '" class="glyphicon glyphicon-chevron-right" style="cursor: pointer; padding-left: 20px; padding-bottom: 20px; padding-top: 20px;"></span>');

                $(".remEnti" + myId).unbind();
                $(".remEnti" + myId).click(function (evt)
                {
                    evt.stopPropagation();

                    if (!OverrideDelete && Source.Data[parseInt($(this).attr("id"))].Delete)
                    {
                        Source.Data[parseInt($(this).attr("id"))].Delete();
                        Source.Data.splice(parseInt($(this).attr("id")), 1);
                    }
                    else if (!OverrideDelete)
                        Source.Data.splice(parseInt($(this).attr("id")), 1);
                    else
                        OverrideDelete(Source.Data[parseInt($(this).attr("id"))]);

                    $(this).closest("tr").remove();
                });

                $(".mEnti" + myId).unbind();
                $(".mEnti" + myId).click(function ()
                {
                    if (_funcMouseListener)
                        _funcMouseListener(Source.Data[parseInt($(this).attr("id"))]);
                });

                $("#prox" + myId).unbind();
                $("#prox" + myId).click(function ()
                {
                    if (Source.prox)
                        Source.prox();
                });

                $("#back" + myId).unbind();
                $("#back" + myId).click(function ()
                {
                    if (Source.prox)
                        Source.back();
                });
            }
        }
    }

    /**
     * 
     * @returns {undefined}
     */
    function doFilter()
    {
        if (Input !== null && Input.val() !== "")
        {
            var strQuery = "";
            for (var i = 0; i < Collums.length; i++)
            {
                if (Collums[i].indexOf(".") === -1)
                {
                    if (i < Collums.length - 1)
                        strQuery += Collums[i] + " LIKE '%" + Input.val() + "%' OR ";
                    else
                        strQuery += Collums[i] + " LIKE '%" + Input.val() + "%' ";
                }
                else
                {
                    if (!(i < Collums.length - 1))
                        strQuery = strQuery.replace(/ OR $/, "");
                }
            }
            Source.setWhere(strQuery);
        }
        else
            Source.setWhere("");
    }

    // Metodos publicos

    /**
     * Seta o elethisnto DOM que sera o container da lista
     */
    this.setElement = function (elem)
    {
        Elem = $(elem);
        Elem.attr("source", getVarName(me));
    };

    /**
     * @param {DBsource} model
     */
    this.setDBsource = function (model)
    {
        Source = model;
        //var this = this;
        Source.setListener(function ()
        {
            arrange();
        });
        //Source.getData();
        //arrange();
    };

    this.setSourceArray = function (model)
    {
        Source = model;
        arrange();
    };

    this.getSourceArray = function ()
    {
        if (Source instanceof DBsource)
        {
            return Source.Data;
        }
        else
        {
            return Source;
        }
    };

    /**
     * 
     * @param {Array} cols
     * @returns {undefined}
     */
    this.setCollums = function (cols)
    {
        Collums = cols;
        arrange();
    };

    /**
     * Seta um input para filtro
     */
    this.setInputFilter = function (elem)
    {
        Input = $(elem);
        //var this = this;
        Input.on('input', function ()
        {
            doFilter();
        });
    };

    this.setOverridedDelete = function (func)
    {
        OverrideDelete = func;
        //arrange();
    };

    this.addMouseActionListener = function (func)
    {
        _funcMouseListener = func;
        //arrange();
    };

    this.removeEnable = function (bol)
    {
        _removeEnable = bol;
    };
}

Table.ID = 0;