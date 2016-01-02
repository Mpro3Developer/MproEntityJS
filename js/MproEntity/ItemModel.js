
/**
 * Declaração da Classe de Modelo de Item
 * @returns {ItemModel}
 */
function ItemModel()
{
    // campos privados
    var _eventLista = new Lista();
    _eventLista.init();
    var _items = new Lista();
    _items.init();
    this.ObjectId = "List" + ItemModel.CounterObjectId;
    ItemModel.CounterObjectId++;

    this.init();

    this.addEventListener = function (func)
    {
        _eventLista.add(func);
    };

    /**
     * Adiciona o item
     * @param {Item} item
     */
    this.add = function (item, disable)
    {
        ItemModel.prototype.add.call(this, item);
        if ((disable === undefined) || (disable === false))
        {
            for (var i = 0; i < _eventLista.getTam(); i++)
            {
                _eventLista.get(i)();
            }
        }
    };

    /**
     * Dispacha o evento de fim
     */
    this.dispatchEvents = function ()
    {
        for (var i = 0; i < _eventLista.getTam(); i++)
        {
            _eventLista.get(i)();
        }
    };

    /**
     * Recupera um item pelo seu indice
     * @returns {Item}
     */
    this.get = function (i)
    {
        var obj = ItemModel.prototype.get.call(this, i);
        return obj;
    };

    /**
     * Remove elemento
     * @returns {Item}
     */
    this.rem = function (i)
    {
        var obj = ItemModel.prototype.rem.call(this, i);
        for (var i = 0; i < _eventLista.getTam(); i++)
        {
            _eventLista.get(i)();
        }
        return obj;
    };

    /**
     * Limpa os elementos
     */
    this.clear = function ()
    {
        ItemModel.prototype.clear.call(this);
        for (var i = 0; i < _eventLista.getTam(); i++)
        {
            _eventLista.get(i)();
        }
    };
}

// Herança
ItemModel.prototype = new Lista();

// Estatico
ItemModel.CounterObjectId = 0;