function Lista(){this.lista_=[],this.tam=0,this.init=function(){this.lista_=new Array,this.tam=0},this.add=function(t){this.lista_.push(t),this.tam++},this.get=function(t){return this.lista_[t]},this.rem=function(t){var e;return(e=this.lista_.splice(t,1))?(this.tam--,e[0]):void 0},this.clear=function(){this.tam=0,this.lista_=new Array},this.array=function(){return this.lista_},this.getTam=function(){return this.tam},this.verifi100=function(){for(var t="",e=(this.lista_,new Array,""),i=0,n=0,s=0,a=0;a<this.lista_aux1.length;a++){t=this.lista_[a];var o=new Array;if(t.length>100){s=Math.ceil(t.length/100);for(var r=0;s>r;r++)e=t.substr(n,100),i=strrpos(e," "),o[r]=e.substring(0,i),n+=o[r].length;o[s-1]+=t.substr(n,100);for(var l=0;a>l;l++)this.lista_aux2.push(this.lista_aux1[l]);this.lista_aux2=this.lista_aux2.concat(o);for(var l=a+1;l<this.lista_aux1.length;l++)this.lista_aux2.push(this.lista_aux1[l]);this.lista_aux1=this.lista_aux2,a+=o.length}}this.lista_=this.lista_aux1},this.toString=function(){for(var t="",e=0;e<this.lista_.length;e++)t+=this.lista_[e]+" ";return t}}function Item(t,e,i,n){this.string=t,this.obj=e,this.icon=i,this.size=n}function ItemModel(){var t=new Lista;t.init();var e=new Lista;e.init(),this.ObjectId="List"+ItemModel.CounterObjectId,ItemModel.CounterObjectId++,this.init(),this.addEventListener=function(e){t.add(e)},this.add=function(e,i){if(ItemModel.prototype.add.call(this,e),void 0===i||i===!1)for(var n=0;n<t.getTam();n++)t.get(n)()},this.dispatchEvents=function(){for(var e=0;e<t.getTam();e++)t.get(e)()},this.get=function(t){var e=ItemModel.prototype.get.call(this,t);return e},this.rem=function(e){for(var i=ItemModel.prototype.rem.call(this,e),e=0;e<t.getTam();e++)t.get(e)();return i},this.clear=function(){ItemModel.prototype.clear.call(this);for(var e=0;e<t.getTam();e++)t.get(e)()}}function DBsource(t,e,i,n,s){function a(t){if(d){o(t),c=!0;for(var e=0;e<u.length;e++)u[e]()}else setTimeout(function(){MproEntity.getAll(t.EntityName,function(e){t.Data=e,o(t),c=!0;for(var i=0;i<u.length;i++)u[i]()},t.Where,t.OrdBy,[h,l],void 0)},100)}function o(t){if(d)if(h<f.length){t.Data=[];for(var e=0,i=h;h+l>i&&l>e;i++,e++)t.Data.push(f[i]);for(var e=0;e<r.length;e++){var n=r[e];n.model.clear();for(var i=h;i<t.Data.length;i++)n.model.add(new Item(t.Data[i][n.collum],t.Data[i]))}}else h-=l;else for(var e=0;e<r.length;e++){var n=r[e];n.model.clear();for(var i=0;i<t.Data.length;i++)n.model.add(new Item(t.Data[i][n.collum],t.Data[i]))}}var r=new Array,l=e,h=i,c=!1,u=[],d=!1,f=[];this.EntityName=t,this.Data=new Array,this.Where=n,this.Rules=[],this.OrdBy=s,this.addLink=function(t){r.push(t),c?o(this):a(this)},this.setMaxResults=function(t,e){l=t,(void 0===e||e===!0)&&a(this)},this.setBegin=function(t,e){h=t,(void 0===e||e===!0)&&a(this)},this.setWhere=function(t,e){d=!1,this.Where=t,h=0,(void 0===e||e===!0)&&a(this)},this.addRule=function(t,e,i){this.Rules.push([t,e,i])},this.setOrdBy=function(t,e){d=!1,this.OrdBy=t,(void 0===e||e===!0)&&a(this)},this.setListener=function(t){u.push(t)},this.removeListener=function(t){for(var e=0;e<u.length;e++)u[e]==t&&u.splice(e,1),console.log(u.length)},this.prox=function(){this.Data.length>=l&&(h+=l),a(this)},this.back=function(){h>0&&(h-=l),a(this)},this.getData=function(){d=!1,a(this)},this.setData=function(t){f=t,this.Data=[],h=0,d=!0;for(var e=0;e<f.length&&l>e;e++)this.Data.push(f[e])},this.refresh=function(){o(this),c=!0;for(var t=0;t<u.length;t++)u[t]()}}function List(){function t(){n.html("");for(var t=!1,e=0;e<i.getTam();e++){var s=i.get(e);"check"!==s.icon?n.html(n.html()+'<a href="javascript:void(0)" id="'+e+'" class="list-group-item '+i.ObjectId+'">'+(void 0!==s.icon?'<i class="glyphicon "><img src="'+s.icon+'" '+(void 0!==s.size?'width="'+s.size+'" height="'+s.size+'"':"")+" /></i>  ":"")+s.string+"</a>"):(t=!0,n.html(n.html()+'<a href="javascript:void(0)" id="'+e+'" class="list-group-item labelis"><input type="checkbox" id="'+e+'" class="'+i.ObjectId+'">  '+s.string+"</a>"))}t?($("."+i.ObjectId).click(function(){var t=i.get(parseInt($(this).attr("id")));a&&a(t,$(this).is(":checked"))}),$(".labelis").mousedown(function(t){var e=i.get(parseInt($(this).attr("id")));t.stopPropagation(),a(e,null,2)})):$("."+i.ObjectId).click(function(){var t=i.get(parseInt($(this).attr("id")));a&&a(t)})}function e(){if(null!==s&&""!==s.val()){n.html("");for(var e=!1,o=0;o<i.getTam();o++){var r=i.get(o);-1!==r.string.toUpperCase().indexOf(s.val().toUpperCase())&&("check"!==r.icon?n.html(n.html()+'<a href="#" id="'+o+'" class="list-group-item '+i.ObjectId+'">'+(void 0!==r.icon?'<i class="glyphicon "><img src="'+r.icon+'" '+(void 0!==r.size?'width="'+r.size+'" height="'+r.size+'"':"")+" /></i>  ":"")+r.string+"</a>"):(e=!0,n.html(n.html()+'<a href="#" id="'+o+'" class="list-group-item"><input type="checkbox" id="'+o+'" class="'+i.ObjectId+'">  '+r.string+"</a>")))}e?$("."+i.ObjectId).change(function(){var t=i.get(parseInt($(this).attr("id")));a&&a(t,$(this).is(":checked"))}):$("."+i.ObjectId).click(function(){var t=i.get(parseInt($(this).attr("id")));a&&a(t)})}else t()}List.ID;List.ID++;var i=null,n=null,s=null,a=null;this.reArrange=function(){t()},this.setDBsource=function(t,e){var n=this;t.setListener(function(t,i,n){return function(){n=new ItemModel;for(var s=0;s<t.Data.length;s++)n.add(new Item(t.Data[s][e],t.Data[s]));i.setModel(n)}}(t,n,i))},this.setElement=function(t){n=$(t)},this.setModel=function(e){i=e,i.addEventListener(function(){t()}),t()},this.setInputFilter=function(t){s=$(t),s.on("input",function(){e()})},this.addMouseActionListener=function(t){a=t},this.click=this.addMouseActionListener}function Combobox(){function t(t){for(var e in window)if(window[e]===t)return e}function e(){var e=o.text();o.text(""),o.attr("source",t(s)),o.append('<button type="button" class="btn btn-default dropdown-toggle" style="width: 100%;" data-toggle="dropdown">    '+e+'<span class="caret"></span></button><ul class="dropdown-menu" style="width: 100%;" role="menu"> </ul>')}function i(){o.find(".dropdown-menu").html("");for(var t=0;t<a.getTam();t++){var e=a.get(t);o.find(".dropdown-menu").html(o.find(".dropdown-menu").html()+'<li><a href="javascript:void(0)" id="'+t+'" class="'+a.ObjectId+'">'+e.string+"</a></li>")}o.find("."+a.ObjectId).click(function(){var t=a.get(parseInt($(this).attr("id")));r=parseInt($(this).attr("id")),h=t,o.find("button").html(h.string+' <span class="caret"></span>'),c&&u&&c(t),u=!0})}function n(){if(null!==l&&""!==l.val()){o.find(".dropdown-menu").html("");for(var t=0;t<a.getTam();t++){var e=a.get(t);-1!==e.string.toUpperCase().indexOf(l.val().toUpperCase())&&o.find(".dropdown-menu").html(o.find(".dropdown-menu").html()+'<li><a href="javascript:void(0)" id="'+t+'" class="'+a.ObjectId+'">'+e.string+"</a></li>")}o.find("."+a.ObjectId).click(function(){var t=a.get(parseInt($(this).attr("id")));r=parseInt($(this).attr("id")),h=t,o.find("button").html(h.string+' <span class="caret"></span>'),c&&u&&c(t),u=!0})}else i()}var s=this,a=null,o=null,r=0,l=null,h=null,c=null,u=!0;this.Fonte="",this.Coluna="",this.setDBsource=function(t,e){this.Coluna=e;var i=this;t.setListener(function(t,i,n){return function(){n=new ItemModel;for(var s=0;s<t.Data.length;s++)n.add(new Item(t.Data[s][e],t.Data[s]));i.setModel(n)}}(t,i,a))},this.setInputFilter=function(t){l=$(t),l.on("input",function(){n()})},this.setElement=function(t){o=$(t),e()},this.setModel=function(t){a=t,a.addEventListener(function(){i()}),i()},this.getModel=function(){return a},this.setSelectIndex=function(t,e){void 0!==e&&(u=e),o.find("#"+t).click()},this.getSelectIndex=function(){return r},this.getSelectedItem=function(){return h},this.addMouseActionListener=function(t){c=t}}function Table(t){function e(t){for(var e in window)if(window[e]===t)return e}function i(){r.html(""),r.append("<thead><tr></tr></thead>");for(var t=0;t<h.length;t++)r.find("thead").find("tr:last").append("<th><b>"+h[t]+"</b></th>");if(d&&r.find("thead").find("tr:last").append("<th><b>Remove</b></th>"),r.append("<tbody></tbody>"),o&&(o.length&&(o.Data=o),o.Data)){for(var t=0;t<o.Data.length;t++){var e=o.Data[t];r.find("tbody").append("<tr id='"+t+"' class='mEnti"+a+"' style='cursor: pointer;'></tr>");for(var i=0;i<h.length;i++)if(-1===h[i].indexOf("."))"function"!=typeof e[h[i]]?r.find("tbody").find("tr:last").append("<td>"+e[h[i]]+"</td>"):r.find("tbody").find("tr:last").append("<td>"+e[h[i]]()+"</td>");else{for(var n=h[i].split("."),s=0;s<n.length;s++)e&&(e=e[n[s]]),e&&"function"==typeof e&&(e=e());r.find("tbody").find("tr:last").append("<td>"+e+"</td>")}d&&r.find("tbody").find("tr:last").append('<td width="10%"><center><button id="'+t+'" class="btn btn-default remEnti'+a+'" title="Remover" style="width:  100%;"><i class="glyphicon glyphicon-remove-circle"></i></button></center></td>')}r.append('<span id="back'+a+'" class="glyphicon glyphicon-chevron-left" style="cursor: pointer; padding-left: 20px; padding-bottom: 20px; padding-top: 20px;"></span><span id="prox'+a+'" class="glyphicon glyphicon-chevron-right" style="cursor: pointer; padding-left: 20px; padding-bottom: 20px; padding-top: 20px;"></span>'),$(".remEnti"+a).unbind(),$(".remEnti"+a).click(function(t){t.stopPropagation(),!c&&o.Data[parseInt($(this).attr("id"))].Delete?(o.Data[parseInt($(this).attr("id"))].Delete(),o.Data.splice(parseInt($(this).attr("id")),1)):c?c(o.Data[parseInt($(this).attr("id"))]):o.Data.splice(parseInt($(this).attr("id")),1),$(this).closest("tr").remove()}),$(".mEnti"+a).unbind(),$(".mEnti"+a).click(function(){u&&u(o.Data[parseInt($(this).attr("id"))])}),$("#prox"+a).unbind(),$("#prox"+a).click(function(){o.prox&&o.prox()}),$("#back"+a).unbind(),$("#back"+a).click(function(){o.prox&&o.back()})}}function n(){if(null!==l&&""!==l.val()){for(var t="",e=0;e<h.length;e++)-1===h[e].indexOf(".")?t+=e<h.length-1?h[e]+" LIKE '%"+l.val()+"%' OR ":h[e]+" LIKE '%"+l.val()+"%' ":e<h.length-1||(t=t.replace(/ OR $/,""));o.setWhere(t)}else o.setWhere("")}var s=this,a=Table.ID;Table.ID++;var o=null,r=$(t),l=null,h=[],c=null,u=null,d=!0;reArrange=function(){i()},this.setElement=function(t){r=$(t),r.attr("source",e(s))},this.setDBsource=function(t){o=t,o.setListener(function(){i()})},this.setSourceArray=function(t){o=t,i()},this.getSourceArray=function(){return o instanceof DBsource?o.Data:o},this.setCollums=function(t){h=t,i()},this.setInputFilter=function(t){l=$(t),l.on("input",function(){n()})},this.setOverridedDelete=function(t){c=t},this.addMouseActionListener=function(t){u=t},this.removeEnable=function(t){d=t}}function FormCreator(t,e){this.saveReload=null,this.onSaveFunction=null,this.Source=null,this.Classe=t,this.Elem=$(e),this.ElemsClone=new Array,this.Elem.css("height","auto");for(var i=0;i<this.Elem.children().length;i++){var n=$(this.Elem.children()[i]);(n.hasClass("GInput")||n.hasClass("GTextArea")||n.hasClass("GTextEditor")||n.hasClass("GCheckBox")||n.hasClass("GComboBox")||n.hasClass("GTable"))&&this.ElemsClone.push(n)}this.onSave=function(t){this.onSaveFunction=t},this.setDataSourceReload=function(t){this.saveReload=t},this.setData=function(t){this.Source=t;for(var e=0;e<this.ElemsClone.length;e++){var i=$(this.ElemsClone[e]),n=$(this.ElemsClone[e]).attr("mprotag");if(void 0!==n&&"undefined"!==n&&""!==n){var s=n;if(i.hasClass("GInput"))i.val(this.Source[s]);else if(i.hasClass("GTextArea"))i.val(this.Source[s]);else if(i.hasClass("GTextEditor"))i.find(".Container").code(this.Source[s]);else if(i.hasClass("GCheckBox"))i.prop("checked",1===this.Source[s]?!0:!1);else if(i.hasClass("GComboBox"))for(var a=window[i.attr("source")].getModel(),o=this.Source[s]instanceof Array?this.Source[s][0]:this.Source[s],r=0;r<a.getTam();r++)a.get(r).obj.cod==o.cod&&window[i.attr("source")].setSelectIndex(r);else i.hasClass("GTable")&&this.Source[s]&&this.Source[s].length&&window[i.attr("source")].setSourceArray(this.Source[s])}}},this.getData=function(){return this.Source},this.New=function(){this.Source=new this.Classe;for(var t=!1,e=0;e<this.ElemsClone.length;e++){var i=$(this.ElemsClone[e]),n=$(this.ElemsClone[e]).attr("mprotag");if(void 0!==n){if("undefined"!==n&&""!==n){i.hasClass("GInput")?i.val(""):i.hasClass("GTextArea")?i.val(""):i.hasClass("GTextEditor")?i.find(".Container").code(""):i.hasClass("GCheckBox")?i.prop("checked",!0):i.hasClass("GComboBox")?window[i.attr("source")].setSelectIndex(0):i.hasClass("GTable")&&window[i.attr("source")].setSourceArray([])}t||(i.focus(),t=!0)}}return this.Source},this.Save=function(){for(var t=0;t<this.ElemsClone.length;t++){var e=$(this.ElemsClone[t]),i=$(this.ElemsClone[t]).attr("mprotag");if(void 0!==i&&"undefined"!==i&&""!==i){var n=i;e.hasClass("GInput")?this.Source[n]=e.val():e.hasClass("GTextArea")?this.Source[n]=e.val():e.hasClass("GTextEditor")?this.Source[n]=e.find(".Container").code():e.hasClass("GCheckBox")?this.Source[n]=e.prop("checked")?1:0:e.hasClass("GComboBox")?this.Source[n]instanceof Array?2147483647==this.Source.cod?this.Source[n].push(window[e.attr("source")].getSelectedItem().obj):(this.Source[n]=[],this.Source[n].push(window[e.attr("source")].getSelectedItem().obj)):this.Source[n]=window[e.attr("source")].getSelectedItem().obj:e.hasClass("GTable")&&this.Source["set"+n](window[e.attr("source")].getSourceArray())}}this.Source.Save(),this.saveReload&&window[this.saveReload].getData(),this.onSaveFunction&&this.onSaveFunction()}}function Repeater(t){function e(t){if(t.Elem.html(""),t.Source)for(var e=0;e<t.Source.Data.length;e++)for(var i=0;i<t.ElemsClone.length;i++){var n=$(t.ElemsClone[i]).clone();n.css("height","auto");var s=$(t.ElemsClone[i]).html().match(/@{(.*?)}/g);if(s){for(var a=0;a<s.length;a++){var o=s[a].replace("@{","").replace("}",""),r=o+"",l=o.split(".");l.length>0&&(o=l[0]);for(var h=t.Source.Data[e][o],c=1;c<l.length;c++){var u=h;h=h[l[c]],"function"==typeof h&&(h=h.call(u,u))}"function"==typeof h&&(h=h.call(t.Source.Data[e],t.Source.Data[e]));var d=new RegExp("@{"+r+"}","g");n.addClass(t.Elem.attr("id")),n.attr("id",t.Source.Data[e].cod),n.html(n.html().replace(d,h))}t.Elem.append(n)}else t.Elem.append(n)}t.completeListener&&t.completeListener()}var i;this.Source=null,this.Elem=$(t),this.ElemsClone=new Array,this.completeListener=null,this.Elem.css("height","auto");for(var n=0;n<this.Elem.children().length;n++){var s=$(this.Elem.children()[n]);this.ElemsClone.push(s.clone())}this.reArrange=function(){e(this)},this.setDBsource=function(t){this.Source=t;var n=this;this.Source.setListener(function(){e(n),i=arguments.callee})},this.setSourceArray=function(t){this.Source={},this.Source.Data=t,e(this)},this.addCompleteListener=function(t){this.completeListener=t},this.removeCompleteListener=function(t){this.Source.removeListener(i)}}Lista.toList=function(t){for(var e=new Lista,i=t,n="",s=0;s<i.length;s++)","!=i.charAt(s)&&" "!=i.charAt(s)?n+=i.charAt(s):" "==i.charAt(s)&&(e.add(n),n="");return e.add(n),e},ItemModel.prototype=new Lista,ItemModel.CounterObjectId=0,List.ID=0,Table.ID=0;