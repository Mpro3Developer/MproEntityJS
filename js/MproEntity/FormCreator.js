
// $("#GTable1").clone().children().remove().end().text()

/**
 * Declaração da Classe que faz bind dos dados para um formulário seguindo o Gaia Tags
 * Dependencias: JQUERY
 * @returns {FormCreator}
 */
function FormCreator(classe, elem)
{
    // Campos privados

    /**
     * @type String
     */
    this.saveReload = null;

    /**
     * @type function
     */
    this.onSaveFunction = null;

    /**
     * @type MProEntity
     */
    this.Source = null;
    /**
     * @type MproEntity
     */
    this.Classe = classe;
    /**
     * @type $
     */
    this.Elem = $(elem);
    /**
     * @type Array
     */
    this.ElemsClone = new Array();

    // Construtor

    this.Elem.css("height", "auto");
    //this.Elem.hide();

    for (var i = 0; i < this.Elem.children().length; i++)
    {
        var tmp = $(this.Elem.children()[i]);
        if (tmp.hasClass("GInput") ||
                tmp.hasClass("GInputImage") ||
                tmp.hasClass("GTextArea") ||
                tmp.hasClass("GTextEditor") ||
                tmp.hasClass("GCheckBox") ||
                tmp.hasClass("GComboBox") ||
                tmp.hasClass("GTable"))
            this.ElemsClone.push(tmp);
    }

    // Metodos publicos

    this.onSave = function (func)
    {
        this.onSaveFunction = func;
    };

    this.setDataSourceReload = function (varName)
    {
        this.saveReload = varName;
    };

    /**
     *  Seta o dado a ser editado
     * @param {MproEntity} dado
     * @returns {undefined}
     */
    this.setData = function (dado)
    {
        this.Source = dado;

        // gogogo
        for (var i = 0; i < this.ElemsClone.length; i++)
        {
            var elemC = $(this.ElemsClone[i]);
            //elemC.css("height", "auto");

            var tags = $(this.ElemsClone[i]).attr("mprotag");

            if (tags !== undefined)
            {
                if (tags !== "undefined" && tags !== "")
                {
                    var clearTag = tags;
                    if (elemC.hasClass("GInput"))
                    {
                        elemC.val(this.Source[clearTag]);
                    }
                    else if (elemC.hasClass("GInputImage"))
                    {
                        // detach events
                        elemC.off("change");
                        // clear
                        elemC.val("");
                        $('#' + this.Source.class + clearTag + "TAG").remove();
                        // get image in base 64
                        elemC.after('<p id="' + this.Source.class + clearTag + 'TAG" class="FormCreatorPhoto"><img id="' + this.Source.class + clearTag + '" src="' + this.Source[clearTag] + '" class="img-responsive"></p>');
                    }
                    else if (elemC.hasClass("GTextArea"))
                    {
                        elemC.val(this.Source[clearTag]);
                    }
                    else if (elemC.hasClass("GTextEditor"))
                    {
                        elemC.find(".Container").code(this.Source[clearTag]);
                    }
                    else if (elemC.hasClass("GCheckBox"))
                    {
                        elemC.prop('checked',
                                (this.Source[clearTag] === 1 ? true : false)
                                );
                    }
                    else if (elemC.hasClass("GComboBox"))
                    {
                        var m = window[elemC.attr("source")].getModel();
                        var el = this.Source[clearTag] instanceof Array ? this.Source[clearTag][0] : this.Source[clearTag];
                        for(var j = 0; j < m.getTam(); j++)
                        {
                            if(m.get(j).obj.cod == el.cod)
                            {
                                window[elemC.attr("source")].setSelectIndex(j);
                            }
                        }
                    }
                    else if (elemC.hasClass("GTable"))
                    {
                        if (this.Source[clearTag] && this.Source[clearTag].length)
                            window[elemC.attr("source")].setSourceArray(this.Source[clearTag]);
                    }
                }
            }
        }
    };

    /**
     * Pega o objeto em edição
     * @returns {MproEntity|this.Classe}
     */
    this.getData = function ()
    {
        return this.Source;
    };

    /**
     * Factory um novo Objeto
     * @returns {MproEntity}
     */
    this.New = function ()
    {
        this.Source = new this.Classe();
        var focus = false;
        var Source = this.Source;

        // gogogo
        for (var i = 0; i < this.ElemsClone.length; i++)
        {
            var elemC = $(this.ElemsClone[i]);
            //elemC.css("height", "auto");

            var tags = $(this.ElemsClone[i]).attr("mprotag");

            if (tags !== undefined)
            {
                if (tags !== "undefined" && tags !== "")
                {
                    var clearTag = tags;
                    if (elemC.hasClass("GInput"))
                    {
                        elemC.val("");
                    }
                    else if (elemC.hasClass("GInputImage"))
                    {
                        // detach events
                        elemC.off("change");
                        // clear
                        elemC.val("");
                        $('#' + Source.class + clearTag + "TAG").remove();
                        // attach new events
                        elemC.on("change", function(e)
                        {
                            if (this.files && this.files[0])
                            {
                              // remove old
                              $('#' + Source.class + clearTag + "TAG").remove();
                              // add new
                              var FR = new FileReader();
                              FR.addEventListener("load", function(e)
                              {
                                  var img = elemC.after('<p id="' + Source.class + clearTag + 'TAG" class="FormCreatorPhoto"><img id="' + Source.class + clearTag + '" src="" class="img-responsive"></p>');
                                  document.getElementById(Source.class + clearTag).src = e.target.result;
                              });
                              FR.readAsDataURL(this.files[0]);
                            }
                        });
                    }
                    else if (elemC.hasClass("GTextArea"))
                    {
                        elemC.val("");
                    }
                    else if (elemC.hasClass("GTextEditor"))
                    {
                        elemC.find(".Container").code("");
                    }
                    else if (elemC.hasClass("GCheckBox"))
                    {
                        elemC.prop('checked', true);
                    }
                    else if (elemC.hasClass("GComboBox"))
                    {
                        window[elemC.attr("source")].setSelectIndex(0);
                    }
                    else if (elemC.hasClass("GTable"))
                    {
                        window[elemC.attr("source")].setSourceArray([]);
                    }
                }

                if (!focus)
                {
                    elemC.focus();
                    focus = true;
                }
            }
        }

        return this.Source;
    };

    /**
     * Salva objeto na edição
     * @returns {undefined}
     */
    this.Save = function ()
    {

        // gogogo
        for (var i = 0; i < this.ElemsClone.length; i++)
        {
            var elemC = $(this.ElemsClone[i]);
            //elemC.css("height", "auto");

            var tags = $(this.ElemsClone[i]).attr("mprotag");

            if (tags !== undefined)
            {
                if (tags !== "undefined" && tags !== "")
                {
                    var clearTag = tags;
                    if (elemC.hasClass("GInput"))
                    {
                        this.Source[clearTag] = elemC.val();
                    }
                    if (elemC.hasClass("GInputImage"))
                    {
                        // get image base 64
                        this.Source[clearTag] = $("#" + this.Source.class + clearTag).attr('src');
                    }
                    else if (elemC.hasClass("GTextArea"))
                    {
                        this.Source[clearTag] = elemC.val();
                    }
                    else if (elemC.hasClass("GTextEditor"))
                    {
                        this.Source[clearTag] = elemC.find(".Container").code();
                    }
                    else if (elemC.hasClass("GCheckBox"))
                    {
                        this.Source[clearTag] = elemC.prop('checked') ? 1 : 0;
                    }
                    else if (elemC.hasClass("GComboBox"))
                    {
                        /**
                         * Se caso a propiedade for uma coleção push
                         * Se não atribuição apenas
                         */
                        if (this.Source[clearTag] instanceof Array)
                            if(this.Source['cod'] == 2147483647)
                                this.Source[clearTag].push(window[elemC.attr("source")].getSelectedItem().obj);
                            else
                            {
                                this.Source[clearTag] = [];
                                this.Source[clearTag].push(window[elemC.attr("source")].getSelectedItem().obj);
                            }
                        else
                            this.Source[clearTag] = window[elemC.attr("source")].getSelectedItem().obj;
                    }
                    else if (elemC.hasClass("GTable"))
                    {
                        this.Source["set" + clearTag](window[elemC.attr("source")].getSourceArray());
                    }
                }
            }
        }

        this.Source.Save();

        if (this.saveReload)
        {
            /**
             * @type DBsource
             */
            window[this.saveReload].getData();
        }

        if (this.onSaveFunction)
        {
            this.onSaveFunction();
        }
    };
}