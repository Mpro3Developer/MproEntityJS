function Ajax(){this.Url="";var e="",t=null,n=null;$.ajaxSetup({cache:!1}),this.setData=function(t){e=t},this.onSucces=function(e){t=e},this.onError=function(e){n=e},this.execute=function(r){void 0===r&&(r=!0),$.ajax({async:r,type:"post",cache:!1,url:this.Url+"?cache="+(new Date).getTime()+Math.random(),data:e,success:function(e){null!==t&&t(e)},error:function(e){console.log(e),null!==n&&n(e)}})}}function LauDB(){function e(e){for(var t=Object.keys(e).map(function(t){return e[t]}),n=0;n<t.length;n++)t[n]=Object.keys(t[n]).map(function(e){return t[n][e]});return t}var t,n=!0;t=openDatabase("MproEntity","1.0","MproEntityLauDB",2e5),t||console.error("L.A.U Connect error"),this.enableFetch=function(){n=!0},this.disableFetch=function(){n=!1},this.query=function(r,o){t.transaction(function(t){t.executeSql(r,null,function(t,r){o(n?e(r.rows):r.rows)},function(e,t){console.error("L.A.U Query error: "+t.message+" :: cmd-> "+r)})})},this.noReturnDataQuery=function(e){t.transaction(function(t){t.executeSql(e,[[]],function(e,t){},function(t,n){console.error("L.A.U Query error: "+n.message+" :: cmd-> "+e)})})},this.row=function(e,t,n){console.error("Not implemented yet ...")},this.execute=function(e){t.transaction(function(t){t.executeSql(e,null,null,function(t,n){console.error("L.A.U Query error: "+n.message+" :: cmd-> "+e)})})},this.getLastInsertRowid=function(e){this.query("SELECT last_insert_rowid();",function(t){e(t[0])})},this.rowCount=function(){console.error("Not implemented yet ...")},this.prox=function(){console.error("Not implemented yet ...")},this.getActualObjectRow=function(){console.error("Not implemented yet ...")},this.close=function(){console.error("Is not necessary ...")}}function InternalEnviroment(){function e(e){var t=JSON.parse(e),n=new SQLBuilder;return n.setJSONObject(t),n}function t(e){var t=e[4].split(",");return t[0]=t[0].replace(new RegExp("create\\s+table\\s+"+e[1]+"\\s*\\(","i"),""),e.fields=t.map(function(e){return e.trim().split(/\s/).shift()}).filter(function(e){return-1===e.indexOf(")")}),e}var n=new LauDB;this.removeService=function(t){for(var r=e(t),o=r["delete"](),i=0;i<o.length;i++)n.execute(o[i])},this.recordService=function(t,r){var o=JSON.parse(t),i=e(t);o.CodRef?(n.execute(i.createRefTable()),n.execute(i.insertRef()),r&&r()):2147483647===o.Cod?(n.execute(i.insert()),n.getLastInsertRowid(function(e){r&&r(e)})):(n.execute(i.update()),r&&r())},this.requestAllService=function(t,r){var o=e(t);n.query(o.selectAll(),function(e){r(e)})},this.requestService=function(t,r){var o=e(t);n.query(o.selectWhere(),function(e){r(e)})},this.createTableService=function(r){var o=e(r);n.execute(o.createTable()),n.execute(o.createRefTable()),n.query(o.describeTable(),function(e){var r=t(e[0]);e=[];for(var i=0;i<r.fields.length;i++)e.push(r.fields[i]);for(var s=o.alterTable(e),i=0;i<s.length;i++)n.execute(s[i])})}}function SQLBuilder(){function e(e){return!(+e!==e||isFinite(e)&&!(e%1))}function t(t){var n,r=typeof t,o=function(e){var t=/\W*function\s+([\w\$]+)\s*\(/.exec(e);return t?t[1]:"(Anonymous)"};return"object"===r?null!==t?"number"!=typeof t.length||t.propertyIsEnumerable("length")||"function"!=typeof t.splice?t.constructor&&o(t.constructor)&&(n=o(t.constructor),"Date"===n?r="date":"RegExp"===n?r="regexp":"PHPJS_Resource"===n&&(r="resource")):r="array":r="null":"number"===r&&(r=e(t)?"double":"integer"),r}this["delete"]=function(){var e=[];return""===this.obj.NameRef?(e.push("DELETE FROM "+this.obj.Name+" WHERE cod = "+this.obj.Cod+";"),e.push("DELETE FROM Reference WHERE cod = "+this.obj.Cod+"  AND class = '"+this.obj.Name+"';")):e.push("DELETE FROM Reference WHERE cod = "+this.obj.CodRef+" AND codref = "+this.obj.Cod+" AND class = '"+this.obj.NameRef+"' AND classref = '"+this.obj.Name+"';"),e},this.insertRef=function(){return"INSERT INTO Reference VALUES('"+this.obj.NameRef+"', '"+this.obj.Name+"', "+this.obj.Ix+", "+this.obj.CodRef+", "+this.obj.Cod+");"},this.insert=function(){return"INSERT INTO "+this.obj.Name+" VALUES(NULL, "+this.obj.Fields+")"},this.selectAll=function(){var e="";return e=""===this.obj.NameRef?"SELECT * FROM "+this.obj.Name+" "+(""===this.obj.Where?"ORDER BY ":" WHERE ("+this.obj.Where+") ORDER BY ")+this.obj.OrderBy:"SELECT * FROM "+this.obj.Name+" WHERE cod in (SELECT codref FROM Reference WHERE class = '"+this.obj.NameRef+"' and cod = "+this.obj.CodRef+" AND classref = '"+this.obj.Name+"' "+(2147483647!==this.obj.Ix?" AND ix = "+this.obj.Ix+" ":"")+")  "+(""===this.obj.Where?"ORDER BY ":" AND ("+this.obj.Where+") ORDER BY ")+this.obj.OrderBy,this.obj.Limiter.length&&(e+=" LIMIT "+this.obj.Limiter[0]+", "+this.obj.Limiter[1]),e},this.selectWhere=function(){for(var e="SELECT "+this.obj.Name+".cod, ",n="",r="",o=0;o<this.obj.Fields.length;o++)e+=this.obj.Name+"."+this.obj.Fields[o]+", ";e=e.replace(/, $/gm,""),e+=" FROM "+this.obj.Name+" ";for(var o=0;o<this.obj.NameRefs.length;o++)n+=" INNER JOIN Reference ON Reference.cod = "+this.obj.Name+".cod INNER JOIN "+this.obj.NameRefs[o]+" ON "+this.obj.NameRefs[o]+".cod = Reference.codref AND Reference.classref = '"+this.obj.NameRefs[o]+"' ",r+=""+this.obj.NameRefs[o]+"."+this.obj.FieldsRefs[o]+" "+this.obj.Comparators[o]+" "+("string"==t(this.obj.LogicVals[o])?"'"+(" LIKE "===this.obj.Comparators[o]?"%":"")+this.obj.LogicVals[o]+(" LIKE "===this.obj.Comparators[o]?"%":"")+"'":this.obj.LogicVals[o])+" "+(null==this.obj.LogicNexts[o]?"":this.obj.LogicNexts[o]);return e+=n+" WHERE "+r+" "+this.obj.OrderBy},this.setJSONObject=function(e){this.obj=e},this.update=function(){return update="UPDATE "+this.obj.Name+" SET "+this.obj.Fields,update+=" WHERE cod = "+this.obj.Cod,update},this.createTable=function(){return"CREATE TABLE "+this.obj.Name+" (cod INTEGER PRIMARY KEY)"},this.alterTable=function(e){for(var t=[],n=[],r=!1,o=[],i=[],s=[],a=1;a<e.length;a++)s[e[a]]=!0;for(var a=0;a<this.obj.Fields.length;a++)t.push("ALTER TABLE "+this.obj.Name+" ADD "+this.obj.Fields[a]+" "+this.obj.Types[a]),s[this.obj.Fields[a]]?(o.push(this.obj.Fields[a]),i.push(this.obj.Types[a])):r=!0;if(e.length-1>this.obj.Fields.length&&(r=!0),r){for(n.push("CREATE TABLE back_"+this.obj.Name+" (cod INTEGER PRIMARY KEY);"),a=0;a<o.length;a++)n.push("ALTER TABLE back_"+this.obj.Name+" ADD "+o[a]+" "+i[a]);n.push("INSERT INTO back_"+this.obj.Name+" SELECT cod, "+o.join(",")+" FROM "+this.obj.Name+";"),n.push("DROP TABLE "+this.obj.Name+";"),n.push(this.createTable()),n=n.concat(t),n.push("INSERT INTO "+this.obj.Name+"(cod, "+o.join(",")+") SELECT cod, "+o.join(",")+" FROM back_"+this.obj.Name+";"),n.push("DROP TABLE back_"+this.obj.Name+";")}return t.length>n.length?t:n},this.createRefTable=function(){return"CREATE TABLE IF NOT EXISTS Reference (class TEXT, classref TEXT, ix INTEGER, cod INTEGER, codref INTEGER, PRIMARY KEY(class, classref, ix, cod, codref));"},this.describeTable=function(){return"SELECT * FROM sqlite_master WHERE name = '"+this.obj.Name+"'"}}function MproEntity(){function e(){var e="";for(var t in o)if("getAll"!==t&&"class"!==t&&"Save"!==t&&"cod"!==t&&"Delete"!==t&&"RefObject"!==t&&"function"!=typeof o[t]&&!(o[t]instanceof Array||a[t]))if(-1!==t.indexOf("Ref")){var n=o[t].cod;e+=("string"==typeof n?"'":"")+n+("string"==typeof n?"'":"")+", "}else-1!==t.indexOf("Crypt")&&-1===o[t].indexOf("{}")?(o[t]="{}"+CryptoJS.SHA1(o[t]),e+=("string"==typeof o[t]?"'":"")+o[t]+("string"==typeof o[t]?"'":"")+", "):e+=("string"==typeof o[t]?"'":"")+o[t]+("string"==typeof o[t]?"'":"")+", ";return e=e.replace(/, $/,"")}function t(){var e="";for(var t in o)if("getAll"!==t&&"class"!==t&&"Save"!==t&&"cod"!==t&&"Delete"!==t&&"RefObject"!==t&&"function"!=typeof o[t]&&!(o[t]instanceof Array||a[t]))if(-1!==t.indexOf("Ref")){var n=o[t].cod;e+=t+" = "+("string"==typeof n?"'":"")+n+("string"==typeof n?"'":"")+", "}else if(-1!==t.indexOf("Crypt")){var n=o[t];-1===n.indexOf("{}")&&(n="{}"+CryptoJS.SHA1(n)),e+=t+" = "+("string"==typeof n?"'":"")+n+("string"==typeof n?"'":"")+", "}else e+=t+" = "+("string"==typeof o[t]?"'":"")+o[t]+("string"==typeof o[t]?"'":"")+", ";return e=e.replace(/, $/,"")}function n(){if(MproEntity.canCreateTables){var e=(new Array,new MproEntity.CreateTable);if(""!==o["class"]){e.Name=o["class"];for(var t in o)"getAll"!==t&&"cod"!==t&&"class"!==t&&"Save"!==t&&"Delete"!==t&&"RefObject"!==t&&"function"!=typeof o[t]&&(o[t]instanceof Array||a[t]||(e.Fields.push(t),e.Types.push("number"==typeof o[t]?"NUMERIC":"TEXT")));if(window.externalEnvironment)externalEnvironment.createTableService(JSON.stringify(e));else{var n=new Ajax;n.Url=MproEntity.serverUrl+"/createTableService"+MproEntity.serverTech,n.setData({createTable:JSON.stringify(e),user:__projectUser__,cod:__projectCod__}),n.onSucces(function(e){}),n.execute()}}}}function r(){for(var e in o)"getAll"!==e&&"class"!==e&&"Save"!==e&&"Delete"!==e&&"function"!=typeof o[e]&&"RefObject"!==e&&"function"!=typeof o[e]&&("string"==typeof o[e]?o[e]=null:"number"==typeof o[e]&&(o[e]=2147483647))}var o=this,i=!1,s=new Array,a=new Array;if(this.cod=2147483647,this.RefObject=null,this["class"]=this.constructor.name,void 0===window[this["class"]]["class"]){window[this["class"]]["class"]={};for(var c in o)"class"!==c&&"RefObject"!==c&&"function"!=typeof o[c]&&(window[this["class"]]["class"][c]={field:c,"class":this["class"]},window[this["class"]].prototype["set"+c]=function(e){return function(t){this[e]=t}}(c),window[this["class"]].prototype["get"+c]=function(e){return function(){return this[e]}}(c))}s=MproEntityAnnotations.getReferences(this),s.length>0&&(i=!0),a=MproEntityAnnotations.getTransients(this),MproEntity.serverSeted||(MproEntity.serverUrl="server",MproEntity.serverTech=".php"),void 0===this["class"]&&(this["class"]=""),this.Delete=function(e,t){var n=new MproEntity.DataReference;if(0===o.cod)return 0;o.RefObject?(n.Name=o["class"],n.Cod=o.cod,n.NameRef=o.RefObject["class"],n.CodRef=o.RefObject.cod):(n.Name=o["class"],n.Cod=o.cod);var r=$.extend(!0,[],s);if(window.externalEnvironment){if(externalEnvironment.removeService(JSON.stringify(n)),o.cod=2147483647,i)for(var a=0;a<r.length;a++)for(var c=o[r[a].NameVar],l=0;l<c.length;l++)c[l].Delete(r[a].Name,o.cod)}else{var f=new Ajax;f.Url=MproEntity.serverUrl+"/dataRemoveService"+MproEntity.serverTech,f.setData({dataRemove:JSON.stringify(n),user:__projectUser__,cod:__projectCod__}),f.onSucces(function(e){if(i)for(var t=0;t<r.length;t++)for(var n=o[r[t].NameVar],s=0;s<n.length;s++)n[s].Delete(r[t].Name,o.cod)}),f.execute()}},this.Save=function(n,r,a){var c=!1,l=new MproEntity.DataRecord;l.Cod=o.cod,2147483647===o.cod?(l.Name=o["class"],l.Fields=e(),c=!0):(l.Name=o["class"],l.Fields=t());var f=$.extend(!0,[],s);if(window.externalEnvironment)externalEnvironment.recordService(JSON.stringify(l),function(e){if(c&&(o.cod=e),n&&r){var t=new MproEntity.DataReference;t.Cod=o.cod,t.Name=o["class"],t.NameRef=n,t.Ix=a,t.CodRef=r,externalEnvironment.recordService(JSON.stringify(t))}if(i)for(var s=0;s<f.length;s++)for(var l=o[f[s].NameVar],h=0;h<l.length;h++)l[h].Save(o["class"],o.cod,f[s].Ix)});else{var h=new Ajax;h.Url=MproEntity.serverUrl+"/dataRecordService"+MproEntity.serverTech,h.setData({dataRecord:JSON.stringify(l),user:__projectUser__,cod:__projectCod__}),h.onSucces(function(e){if(c&&(o.cod=parseInt(e)),n&&r){var t=new MproEntity.DataReference;if(t.Cod=o.cod,t.Name=o["class"],t.NameRef=n,t.Ix=a,t.CodRef=r,window.externalEnvironment)window.externalEnvironment.Table();else{var s=new Ajax;s.Url=MproEntity.serverUrl+"/dataRecordService"+MproEntity.serverTech,s.setData({dataRecord:JSON.stringify(t),user:__projectUser__,cod:__projectCod__}),s.onSucces(function(e){}),s.execute()}}if(i)for(var l=0;l<f.length;l++)for(var h=o[f[l].NameVar],u=0;u<h.length;u++)h[u].Save(o["class"],o.cod,f[l].Ix)}),h.execute()}},r(),n()}MproEntity.getWhere=function(e){if(!arguments.length<=1){var t=new e,n=new Array,r=new Array,o=new Array,i=new Array,s=!0,a=!0,c=new MproEntity.DataRequest;c.Name=t["class"],r=MproEntityAnnotations.getTransients(t);for(var l in t)t[l]instanceof Array||r[l]||"getAll"!==l&&"cod"!==l&&"class"!==l&&"Save"!==l&&"Delete"!==l&&"RefObject"!==l&&"function"!=typeof t[l]&&(o.push(l),c.Fields.push(l));n=MproEntityAnnotations.getReferences(t);for(var f=1;f<arguments.length-1;f++)if("function"!=typeof arguments[f])if(f%2!==0){if(arguments[f]["class"]===t["class"])throw new Error("Ambiguos class search "+t["class"]+'. Instead, use the argument "where" of getAll.');c.NameRefs.push(arguments[f]["class"]),c.FieldsRefs.push(arguments[f].field)}else c.LogicVals.push(arguments[f].val),c.Comparators.push(arguments[f].comparator),c.LogicNexts.push(arguments[f].logicNext);if(c.LogicVals.length!==c.NameRefs.length)throw new Error("Number of Related Entities not match the number of Logical Operations.");if("function"!=typeof arguments[c.LogicVals.length+c.NameRefs.length+1])throw new Error("End Callback undefined.");if("function"!=typeof arguments[arguments.length-1]){var h=arguments[arguments.length-1];c.OrderBy+=" ORDER BY "+h.Classe["class"]+"."+h.Classe.field+" "+h.OrderBy}var u=arguments[c.LogicVals.length+c.NameRefs.length+1];if(window.externalEnvironment)externalEnvironment.requestService(JSON.stringify(c),function(t){for(var r=t,s=[],c=0;c<r.length;c++){s=[];var l=r[c],f=new e;f.cod=l[0];for(var h=0;h<o.length;h++)if(-1===o[h].indexOf("Ref"))f[o[h]]=l[h+1];else{s.push(o[h]);var d=!1;c>=r.length-1&&(d=!0);var v=function(e,t,n,r,o,i,a){return function(c){c&&(e[t[n]]=c[0]),r&&i&&s.length===a&&r(o)}};MproEntity.getAll(window[o[h].replace("Ref","")],v(f,o,h,u,i,d,s.length),"cod = "+l[h+1],void 0,1,void 0,!0,d)}if(n.length>0)for(var p=[],g=0;g<n.length;g++){var d=!1;void 0!==p[n[g].Name]?p[n[g].Name]+=1:p[n[g].Name]=1,g>=n.length-1&&c>=r.length-1&&(d=!0);var E=function(e,t,n,r,o,s){return function(s,a){for(var c=0;c<s.length;c++)s[c].RefObject=e;null!==s&&(e[t[n].NameVar]=s),r&&o&&setTimeout(function(){r(i)},500)}};MproEntity.getAll(window[n[g].Name],E(f,n,g,u,d,p[n[g].Name]),void 0,void 0,void 0,f,!0,void 0,p[n[g].Name])}i.push(f)}0===n.length&&0===s.length&&u(i,a),0===r.length&&u(i,a)});else{var d=new Ajax;d.Url=MproEntity.serverUrl+"/dataRequestService"+MproEntity.serverTech,d.setData({dataRequest:JSON.stringify(c),user:__projectUser__,cod:__projectCod__}),d.onSucces(function(t){for(var r=JSON.parse(t),s=[],c=0;c<r.length;c++){s=[];var l=r[c],f=new e;f.cod=l[0];for(var h=0;h<o.length;h++)if(-1===o[h].indexOf("Ref"))f[o[h]]=l[h+1];else{s.push(o[h]);var d=!1;c>=r.length-1&&(d=!0);var v=function(e,t,n,r,o,i,a){return function(c){c&&(e[t[n]]=c[0]),r&&i&&s.length===a&&r(o)}};MproEntity.getAll(window[o[h].replace("Ref","")],v(f,o,h,u,i,d,s.length),"cod = "+l[h+1],void 0,1,void 0,!0,d)}if(n.length>0)for(var p=[],g=0;g<n.length;g++){var d=!1;void 0!==p[n[g].Name]?p[n[g].Name]+=1:p[n[g].Name]=1,g>=n.length-1&&c>=r.length-1&&(d=!0);var E=function(e,t,n,r,o,s){return function(s,a){for(var c=0;c<s.length;c++)s[c].RefObject=e;null!==s&&(e[t[n].NameVar]=s),r&&o&&setTimeout(function(){r(i)},500)}};MproEntity.getAll(window[n[g].Name],E(f,n,g,u,d,p[n[g].Name]),void 0,void 0,void 0,f,!0,void 0,p[n[g].Name])}i.push(f)}0===n.length&&0===s.length&&u(i,a),0===r.length&&u(i,a)}),d.execute(s)}return i}return null},MproEntity.getAll=function(e,t,n,r,o,i,s,a,c){if(void 0===e)return null;void 0===n&&(n=""),(void 0===r||""===r)&&(r="cod asc"),void 0===s&&(s=!0),void 0===a&&(a=!0);var l=new e,f=new Array,h=new Array,u=new Array,d=new Array,v="";h=MproEntityAnnotations.getTransients(l);for(var p in l)l[p]instanceof Array||h[p]||"getAll"!==p&&"cod"!==p&&"class"!==p&&"Save"!==p&&"Delete"!==p&&"RefObject"!==p&&"function"!=typeof l[p]&&u.push(p);f=MproEntityAnnotations.getReferences(l);var g=new MproEntity.DataRequest;if(g.Name=l["class"],g.Where=n,g.OrderBy=r,void 0!==i&&(g.NameRef=i["class"],g.CodRef=i.cod,void 0!==c&&(g.Ix=c)),o&&o.length&&2===o.length&&(g.Limiter[0]=o[0],g.Limiter[1]=o[1],v+=" LIMIT "+o[0]+", "+o[1]),window.externalEnvironment)externalEnvironment.requestAllService(JSON.stringify(g),function(n){for(var r=n,o=[],i=0;i<r.length;i++){o=[];var s=r[i],c=new e;c.cod=s[0];for(var l=0;l<u.length;l++)if(-1===u[l].indexOf("Ref"))c[u[l]]=s[l+1];else{o.push(u[l]);var h=!1;i>=r.length-1&&(h=!0);var v=function(e,t,n,r,i,s,a){return function(c){c&&(e[t[n]]=c[0]),r&&s&&o.length===a&&r(i)}};MproEntity.getAll(window[u[l].replace("Ref","")],v(c,u,l,t,d,h,o.length),"cod = "+s[l+1],void 0,1,void 0,!0,h)}if(f.length>0)for(var p=[],g=0;g<f.length;g++){var h=!1;void 0!==p[f[g].Name]?p[f[g].Name]+=1:p[f[g].Name]=1,g>=f.length-1&&i>=r.length-1&&(h=!0);var E=function(e,t,n,r,o,i){return function(i,s){for(var a=0;a<i.length;a++)i[a].RefObject=e;null!==i&&(e[t[n].NameVar]=i),r&&o&&setTimeout(function(){r(d)},500)}};MproEntity.getAll(window[f[g].Name],E(c,f,g,t,h,p[f[g].Name]),void 0,void 0,void 0,c,!0,void 0,p[f[g].Name])}d.push(c)}0===f.length&&0===o.length&&t(d,a),0===r.length&&t(d,a)});else{var E=new Ajax;E.Url=MproEntity.serverUrl+"/dataRequestAllService"+MproEntity.serverTech,E.setData({dataRequest:JSON.stringify(g),user:__projectUser__,cod:__projectCod__}),E.onSucces(function(n){for(var r=JSON.parse(n),o=[],i=0;i<r.length;i++){o=[];var s=r[i],c=new e;c.cod=s[0];for(var l=0;l<u.length;l++)if(-1===u[l].indexOf("Ref"))c[u[l]]=s[l+1];else{o.push(u[l]);var h=!1;i>=r.length-1&&(h=!0);var v=function(e,t,n,r,i,s,a){return function(c){c&&(e[t[n]]=c[0]),r&&s&&o.length===a&&r(i)}};MproEntity.getAll(window[u[l].replace("Ref","")],v(c,u,l,t,d,h,o.length),"cod = "+s[l+1],void 0,1,void 0,!0,h)}if(f.length>0)for(var p=[],g=0;g<f.length;g++){var h=!1;void 0!==p[f[g].Name]?p[f[g].Name]+=1:p[f[g].Name]=1,g>=f.length-1&&i>=r.length-1&&(h=!0);var E=function(e,t,n,r,o,i){return function(i,s){for(var a=0;a<i.length;a++)i[a].RefObject=e;null!==i&&(e[t[n].NameVar]=i),r&&o&&setTimeout(function(){r(d)},500)}};MproEntity.getAll(window[f[g].Name],E(c,f,g,t,h,p[f[g].Name]),void 0,void 0,void 0,c,!0,void 0,p[f[g].Name])}d.push(c)}0===f.length&&0===o.length&&t(d,a),0===r.length&&t(d,a)}),E.execute(s)}return d},MproEntity.serverUrl="",MproEntity.serverTech="",MproEntity.serverSeted=!1,MproEntity.canCreateTables=!0,MproEntity.setServer=function(e,t){window.externalEnvironment=void 0,MproEntity.serverUrl=e,MproEntity.serverTech=void 0==t?"":"."+t,MproEntity.serverSeted=!0},MproEntity.enableInternalEnvironment=function(){window.externalEnvironment=new InternalEnviroment},MproEntity.Logic=function(e,t,n){this.val=e,this.comparator=t,this.logicNext=n},MproEntity.Order=function(e,t){this.Classe=e,this.OrderBy=t},MproEntity.DataRecord=function(){this.Name="",this.Cod=2147483647,this.Fields=[],this.Data=[]},MproEntity.DataReference=function(){this.NameRef="",this.Name="",this.Ix=2147483647,this.CodRef=2147483647,this.Cod=2147483647},MproEntity.DataRequest=function(){this.Name="",this.Where="",this.OrderBy="",this.Ix=2147483647,this.NameRef="",this.CodRef=2147483647,this.Limiter=[],this.NameRefs=[],this.FieldsRefs=[],this.LogicVals=[],this.Comparators=[],this.LogicNexts=[],this.Fields=[]},MproEntity.CreateTable=function(){this.Name="",this.Fields=[],this.Types=[]},MproEntity.GT=" > ",MproEntity.GTE=" >= ",MproEntity.LT=" < ",MproEntity.LTE=" <= ",MproEntity.LIKE=" LIKE ",MproEntity.EQUAL=" = ",MproEntity.AND=" AND ",MproEntity.OR=" OR ",__projectUser__=0,__projectCod__=0,window.MproEntityAnnotations={},MproEntityAnnotations.getTransients=function(e){var t=[];if(!e["class"])throw new Error("Instance of object is not an MproEntity.");for(var n=window[e["class"]].toString(),r=n.locations("@Transient"),o=0;o<r.length;o++){var i="";i=n.substring(r[o]+n.substring(r[o],n.length).indexOf("this"),r[o]+n.substring(r[o],n.length).indexOf("=")).replace("this.","").trim(),""!==i&&(t[i]=!0)}return t},MproEntityAnnotations.getReferences=function(e){var t=[];if(!e["class"])throw new Error("Instance of object is not an MproEntity.");for(var n=window[e["class"]].toString(),r=n.locations("@Reference"),o=[],i=0;i<r.length;i++){var s={};if(s.Name=n.substring(r[i],r[i]+n.substring(r[i],n.length).indexOf("this")).replace(/.*\@Reference<|\>/gi,"").trim(),o[s.Name]?o[s.Name]+=1:o[s.Name]=1,s.Ix=o[s.Name],s.NameVar=n.substring(r[i]+n.substring(r[i],n.length).indexOf("this"),r[i]+n.substring(r[i],n.length).indexOf("=")).replace("this.","").trim(),!window[s.Name])throw new Error(s.Name+" is not an MproEntity or is not load.");if(!(e[s.NameVar]instanceof Array))throw new Error(e["class"]+"."+s.NameVar+" is not a collection.");t.push(s)}return t},String.prototype.locations=function(e){for(var t=[],n=-1;(n=this.indexOf(e,n+1))>=0;)t.push(n);return t};