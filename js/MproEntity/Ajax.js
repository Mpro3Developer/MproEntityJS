
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

function Ajax()
{
    this.Url = "";
    var _data = "";
    var _funcS = null;
    var _funcE = null;
    $.ajaxSetup({cache: false});

    /**
        * Seta os parametros para o Ajax
        * @param {Object} data
        */
    this.setData = function (data)
    {
        _data = data;
    };

    /**
        * Seta listener de sucesso
        */
    this.onSucces = function (funcs)
    {
        _funcS = funcs;
    };

    /**
        * Seta listener de erro
        */
    this.onError = function (funce)
    {
        _funcE = funce;
    };

    /**
     * Serialize object to a QueryString for pass as ajax arguments
     */
    this.serialize = function(obj, prefix) 
    {
        var str = [], p;
        for(p in obj) {
          if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push((v !== null && typeof v === "object") ?
              serialize(v, k) :
              encodeURIComponent(k) + "=" + encodeURIComponent(v));
          }
        }
        return str.join("&");
    };

    /**
        * Executa a transação Ajax
        */
    this.execute = function (_async)
    {
        if (_async === undefined)
            _async = true;

        var ajx = new XMLHttpRequest();

        ajx.open(
            "POST",
            (this.Url + "?cache=" + new Date().getTime() + Math.random()),
            _async
        );

        ajx.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        ajx.send(this.serialize(_data));

        ajx.onreadystatechange = function()
        {
            if(ajx.readyState == 4 && ajx.status == 200)
            {
                var data = ajx.responseText;
                if (_funcS !== null)
                    _funcS(data);
            }
        };

        ajx.onerror = function()
        {
            var data = ajx.responseText;
            console.log(data);
            if (_funcE !== null)
                _funcE(data);
        };
    };
}