/*
 * Copyright (C) 2015 matheus
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

window.MproEntityAnnotations = {};

MproEntityAnnotations.getBase64 = function(obj)
{
  var mapTransients = [];
  /*
   * Transient annotations
   */

  if(!obj.class)
      throw new Error("Instance of object is not an MproEntity.");

  var strClass = window[obj.class].toString();
  var annotations = strClass.locations("@Base64");
  for(var i = 0; i < annotations.length; i++)
  {
      var varName = "";

      varName =   strClass.substring
                  (
                      annotations[i] + (strClass.substring(annotations[i], strClass.length).indexOf("this")),
                      annotations[i] + (strClass.substring(annotations[i], strClass.length).indexOf("="))
                  )
                  .replace("this.", "")
                  .trim();

      if(varName !== "")
          mapTransients[varName] = true;
  }

  return mapTransients;
}

MproEntityAnnotations.getTransients = function(obj)
{
    var mapTransients = [];
    /*
     * Transient annotations
     */

    if(!obj.class)
        throw new Error("Instance of object is not an MproEntity.");

    var strClass = window[obj.class].toString();
    var annotations = strClass.locations("@Transient");
    for(var i = 0; i < annotations.length; i++)
    {
        var varName = "";

        varName =   strClass.substring
                    (
                        annotations[i] + (strClass.substring(annotations[i], strClass.length).indexOf("this")),
                        annotations[i] + (strClass.substring(annotations[i], strClass.length).indexOf("="))
                    )
                    .replace("this.", "")
                    .trim();

        if(varName !== "")
            mapTransients[varName] = true;
    }

    return mapTransients;
};

MproEntityAnnotations.getReferences = function(obj)
{
    var refs = [];
    /*
     * Reference annotations
     */

    if(!obj.class)
        throw new Error("Instance of object is not an MproEntity.");

    var strClass = window[obj.class].toString();
    var annotations = strClass.locations("@Reference");
    var mapRef = [];
    for(var i = 0; i < annotations.length; i++)
    {
        var ref = {};
        ref.Name =  strClass.substring
                    (
                        annotations[i],
                        annotations[i] + (strClass.substring(annotations[i], strClass.length).indexOf("this"))
                    )
                    .replace(/.*\@Reference<|\>/gi, "")
                    .trim();

        if(mapRef[ref.Name])
            mapRef[ref.Name] += 1;
        else
            mapRef[ref.Name] = 1;

        ref.Ix = mapRef[ref.Name];

        ref.NameVar =   strClass.substring
                        (
                            annotations[i] + (strClass.substring(annotations[i], strClass.length).indexOf("this")),
                            annotations[i] + (strClass.substring(annotations[i], strClass.length).indexOf("="))
                        )
                        .replace("this.", "")
                        .trim();

        if(!window[ref.Name])
            throw new Error(ref.Name + " is not an MproEntity or is not load.");

        if(!(obj[ref.NameVar] instanceof Array))
            throw new Error(obj.class + "." + ref.NameVar + " is not a collection.");

        refs.push(ref);
    }
    return refs;
};

String.prototype.locations = function (substring)
{
    var a = [], i = -1;
    while ((i = this.indexOf(substring, i + 1)) >= 0)
        a.push(i);
    return a;
};
