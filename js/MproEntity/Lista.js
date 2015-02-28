
/**
 * Declaração da Classe Lista
 * @returns {Lista}
 */
function Lista()
{
    this.lista_ = [];
    this.tam = 0;

    this.init = function ()
    {
        this.lista_ = new Array();
        this.tam = 0;
    };

    this.add = function (str)
    {
        this.lista_.push(str);
        this.tam++;
    };

    this.get = function (i)
    {
        return this.lista_[i];
    };

    this.rem = function (i)
    {
        var tmp;
        if (tmp = this.lista_.splice(i, 1))
        {
            this.tam--;
            return tmp[0];
        }
    };

    this.clear = function ()
    {
        this.tam = 0;
        this.lista_ = new Array();
    };

    this.array = function ()
    {
        return this.lista_;
    };

    this.getTam = function ()
    {
        return this.tam;
    };

    this.verifi100 = function ()
    {
        var selecao = "";
        var lista_aux1 = this.lista_;
        var lista_aux2 = new Array();
        var aux = "";
        var last = 0;
        var sp = 0;
        var num = 0;

        for (var j = 0; j < this.lista_aux1.length; j++)
        {
            selecao = this.lista_[j];
            var list = new Array();

            if (selecao.length > 100)
            {
                num = Math.ceil(selecao.length / 100);

                for (var i = 0; i < num; i++)
                {
                    aux = selecao.substr(sp, 100);
                    last = strrpos(aux, " ");
                    list[i] = aux.substring(0, last);
                    //console.log(sp + " : " + last + " : " + list[i].length + " : " + (sp + list[i].length));
                    sp += list[i].length;
                }

                list[num - 1] += selecao.substr(sp, 100);

                // e agora meu fio
                for (var k = 0; k < j; k++)
                {
                    this.lista_aux2.push(this.lista_aux1[k]);
                }

                this.lista_aux2 = this.lista_aux2.concat(list);

                // pega o resto
                for (var k = (j + 1); k < this.lista_aux1.length; k++)
                {
                    this.lista_aux2.push(this.lista_aux1[k]);
                }

                this.lista_aux1 = this.lista_aux2;

                j += list.length;
            }
        }

        this.lista_ = this.lista_aux1;
    };

    this.toString = function ()
    {
        var str = "";

        for (var i = 0; i < this.lista_.length; i++)
        {
            str += this.lista_[i] + " ";
        }

        return str;
    };
}

Lista.toList = function (string)
{
    var listAux = new Lista();
    var frase = string;
    var aux = "";

    for (var i = 0; i < frase.length; i++)
    {
        if ((frase.charAt(i) != ",") && (frase.charAt(i) != " "))
        {
            aux += frase.charAt(i);
        }
        else
        {
            if (frase.charAt(i) == " ")
            {
                listAux.add(aux);
                aux = "";
            }
        }
    }
    listAux.add(aux);

    return listAux;
};