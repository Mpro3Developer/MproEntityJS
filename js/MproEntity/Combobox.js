
/**
 * Declaração da Classe de Combobox BootStrap
 * Dependencias: JQUERY
 * @returns {Combobox}
 */
function Combobox()
{
    // campos privados

    var me = this;
    /**  
     * @type ItemModel 
     */
    var _model = null;

    /** 
     * @type $ 
     */
    var _elem = null;
    var _ix = 0;
    var _input = null;

    /**
     * @type Item
     */
    var _selected = null;
    var _funcMouseListener = null;
    var _propagate = true;

    function getVarName(v) {
        for (var key in window) {
            if (window[key] === v)
                return key;
        }
    }

    // construct
    function init()
    {
        var caretName = _elem.text();
        _elem.text("");
        _elem.attr("source", getVarName(me));
        _elem.append
                (
                        "<button type=\"button\" class=\"btn btn-default dropdown-toggle\" style=\"width: 100%;\" data-toggle=\"dropdown\">" +
                        "    " + caretName + "<span class=\"caret\"></span>" +
                        "</button>" +
                        "<ul class=\"dropdown-menu\" style=\"width: 100%;\" role=\"menu\"> " +
                        "</ul>"
                        );
    }

    function arrange()
    {
        _elem.find(".dropdown-menu").html("");
        for (var i = 0; i < _model.getTam(); i++)
        {
            var tmpElem = _model.get(i);
            _elem.find(".dropdown-menu").html(_elem.find(".dropdown-menu").html() + '<li><a href="javascript:void(0)" id="' + i + '" class="' +
                    _model.ObjectId + '">' + tmpElem.string + '</a></li>');
        }
        _elem.find("." + _model.ObjectId).click(function ()
        {
            var retObj = _model.get(parseInt($(this).attr('id')));
            _ix = parseInt($(this).attr('id'));
            _selected = retObj;
            _elem.find("button").html(_selected.string + ' <span class="caret"></span>');
            if (_funcMouseListener && _propagate)
                _funcMouseListener(retObj);
            _propagate = true;
        });
    }

    function doFilter()
    {
        if (_input !== null && _input.val() !== "")
        {
            _elem.find(".dropdown-menu").html("");
            for (var i = 0; i < _model.getTam(); i++)
            {
                var tmpElem = _model.get(i);
                if (tmpElem.string.toUpperCase().indexOf(_input.val().toUpperCase()) !== -1)
                {
                    _elem.find(".dropdown-menu").html(_elem.find(".dropdown-menu").html() + '<li><a href="javascript:void(0)" id="' + i + '" class="' +
                            _model.ObjectId + '">' + tmpElem.string + '</a></li>');
                }
            }
            _elem.find("." + _model.ObjectId).click(function ()
            {
                var retObj = _model.get(parseInt($(this).attr('id')));
                _ix = parseInt($(this).attr('id'));
                _selected = retObj;
                _elem.find("button").html(_selected.string + ' <span class="caret"></span>');
                if (_funcMouseListener && _propagate)
                    _funcMouseListener(retObj);
                _propagate = true;
            });
        }
        else
            arrange();
    }

    // Metodos publicos

    this.Fonte = "";
    this.Coluna = "";

    this.setDBsource = function (model, mapCollum)
    {
        this.Coluna = mapCollum;
        var me = this;
        model.setListener(function (model, me, _model)
        {
            return function ()
            {
                _model = new ItemModel();
                for (var i = 0; i < model.Data.length; i++)
                {
                    _model.add(new Item(model.Data[i][mapCollum], model.Data[i]));
                }
                me.setModel(_model);
            };
        }(model, me, _model));
    };

    /**
     * Seta um input para filtro
     */
    this.setInputFilter = function (elem)
    {
        _input = $(elem);
        _input.on('input', function ()
        {
            doFilter();
        });
    };

    /**
     * Seta o elemento DOM que sera o container da lista
     */
    this.setElement = function (elem)
    {
        _elem = $(elem);
        init();
    };

    /**
     * @param {ItemModel} model
     */
    this.setModel = function (model)
    {
        _model = model;
        _model.addEventListener(function ()
        {
            arrange();
        });
        arrange();
    };

    /**
     * @returns {ItemModel}
     */
    this.getModel = function()
    {
        return _model;
    };

    /**
     * Seta indice de item selecionado e dispara change
     * @param {Integer} ind
     */
    this.setSelectIndex = function (ind, propagate)
    {
        if (propagate !== undefined)
            _propagate = propagate;
        _elem.find("#" + ind).click();
    };

    this.getSelectIndex = function ()
    {
        return _ix;
    };

    /**
     * @returns {Item}
     */
    this.getSelectedItem = function ()
    {
        return _selected;
    };

    this.addMouseActionListener = function (func)
    {
        _funcMouseListener = func;
    };
}