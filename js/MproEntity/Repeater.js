
/**
 * Declaração da Classe Repeater para repetir elementos dentro de um DivStatic
 * Dependencias: JQUERY
 * @returns {Repeater}
 */
function Repeater(elem)
{
    // Campos privados
    var __arrangeAno;

    /**
     * @type DBsource
     */
    this.Source = null;
    /**
     * @type $
     */
    this.Elem = $(elem);
    /**
     * @type Array
     */
    this.ElemsClone = new Array();
    /**
     * @type function
     */
    this.completeListener = null;

    // Construtor

    this.Elem.css("height", "auto");
    //this.Elem.hide();

    for (var i = 0; i < this.Elem.children().length; i++)
    {
        var tmp = $(this.Elem.children()[i]);
        this.ElemsClone.push(tmp.clone());
    }

    // Metodos privados

    function arrange(me)
    {
        me.Elem.html("");
        if (me.Source)
        {
            for (var j = 0; j < me.Source.Data.length; j++)
            {
                for (var i = 0; i < me.ElemsClone.length; i++)
                {
                    var elemC = $(me.ElemsClone[i]).clone();
                    elemC.css("height", "auto");
                    //elemC.attr("id", $(_elemsClone[i]).text() + "cod" + me.Source.Data[j][$(_elemsClone[i]).text().replace(/\n/g, "")].cod);
                    //elemC.html(me.Source.Data[j][$(_elemsClone[i]).text().replace(/\n/g, "")]);
                    var tags = $(me.ElemsClone[i]).html().match(/@{(.*?)}/g);
                    if (tags)
                    {
                        for (var k = 0; k < tags.length; k++)
                        {
                            var clearTag = tags[k].replace("@{", "").replace("}", "");
                            var clearTagTmp = clearTag + "";
                            var splitAttr = clearTag.split(".");

                            if (splitAttr.length > 0)
                            {
                                clearTag = splitAttr[0];
                            }
                            var oTmp = me.Source.Data[j][clearTag];
                            for (var h = 1; h < splitAttr.length; h++)
                            {
                                var objRef = oTmp;
                                oTmp = oTmp[splitAttr[h]];
                                if (typeof (oTmp) === "function")
                                {
                                    oTmp = oTmp.call(objRef, objRef);
                                }
                            }

                            if (typeof (oTmp) === "function")
                            {
                                oTmp = oTmp.call(me.Source.Data[j], me.Source.Data[j]);
                            }

                            var rx = new RegExp("@{" + clearTagTmp + "}", "g");
                            elemC.addClass(me.Elem.attr("id"));
                            elemC.attr("id", me.Source.Data[j].cod);
                            elemC.html(elemC.html().replace(rx, oTmp));
                        }
                        me.Elem.append(elemC);
                    }
                    else
                        me.Elem.append(elemC);
                }
            }
        }
        //me.Elem.show();
        if (me.completeListener)
            me.completeListener();
        //magic();
    }

    // Metodos publicos

    this.reArrange = function ()
    {
        arrange(this);
    };

    /**
     * @param {DBsource} model
     */
    this.setDBsource = function (model)
    {
        this.Source = model;
        var me = this;
        this.Source.setListener(function ()
        {
            arrange(me);
            __arrangeAno = arguments.callee;
        });
        //this.Source.getData();
        //arrange();
    };

    this.setSourceArray = function (data)
    {
        this.Source = {};
        this.Source.Data = data;
        arrange(this);
    };

    this.addCompleteListener = function (func)
    {
        this.completeListener = func;
    };

    this.removeCompleteListener = function (func)
    {
        this.Source.removeListener(__arrangeAno);
    };
}