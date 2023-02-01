import { Component, OnInit } from '@angular/core';
import { HtmlBuilderModel } from 'src/app/core/models/htmlBuilderModel';
@Component({
  selector: 'app-web-designer-builder',
  //template: '<router-outlet></router-outlet>',
  templateUrl: './web-designer-builder.component.html',
  styleUrls: ['./web-designer-builder.component.scss'],
})
export class WebDesignerBuilderComponent implements OnInit {
  constructor() { }
  ngOnInit(): void {
  }
  dataModel: HtmlBuilderModel = new HtmlBuilderModel();

  //   configPathMvcCms = "";
  //   configPathApiCms = "";
  //   configPathMvcViewPage = "";
  //   _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  //   Base64Encode(e) {
  //     var t = "";
  //     var n, r, i, s, o, u, a;
  //     var f = 0;
  //     e = this.Base64Utf8_encode(e);
  //     while (f < e.length) {
  //       n = e.charCodeAt(f++);
  //       r = e.charCodeAt(f++);
  //       i = e.charCodeAt(f++);
  //       s = n >> 2;
  //       o = ((n & 3) << 4) | (r >> 4);
  //       u = ((r & 15) << 2) | (i >> 6);
  //       a = i & 63;
  //       if (isNaN(r)) {
  //         u = a = 64;
  //       } else if (isNaN(i)) {
  //         a = 64;
  //       }
  //       t =
  //         t +
  //         this._keyStr.charAt(s) +
  //         this._keyStr.charAt(o) +
  //         this._keyStr.charAt(u) +
  //         this._keyStr.charAt(a);
  //     }
  //     return t;
  //   }
  //   Base64Decode(e) {
  //     var t = "";
  //     var n, r, i;
  //     var s, o, u, a;
  //     var f = 0;
  //     e = e.replace(/[^A-Za-z0-9+/=]/g, "");
  //     while (f < e.length) {
  //       s = this._keyStr.indexOf(e.charAt(f++));
  //       o = this._keyStr.indexOf(e.charAt(f++));
  //       u = this._keyStr.indexOf(e.charAt(f++));
  //       a = this._keyStr.indexOf(e.charAt(f++));
  //       n = (s << 2) | (o >> 4);
  //       r = ((o & 15) << 4) | (u >> 2);
  //       i = ((u & 3) << 6) | a;
  //       t = t + String.fromCharCode(n);
  //       if (u != 64) {
  //         t = t + String.fromCharCode(r);
  //       }
  //       if (a != 64) {
  //         t = t + String.fromCharCode(i);
  //       }
  //     }
  //     t = this.Base64Utf8_decode(t);
  //     return t;
  //   }
  //   Base64Utf8_encode(e) {
  //     e = e.replace(/rn/g, "n");
  //     var t = "";
  //     for (var n = 0; n < e.length; n++) {
  //       var r = e.charCodeAt(n);
  //       if (r < 128) {
  //         t += String.fromCharCode(r);
  //       } else if (r > 127 && r < 2048) {
  //         t += String.fromCharCode((r >> 6) | 192);
  //         t += String.fromCharCode((r & 63) | 128);
  //       } else {
  //         t += String.fromCharCode((r >> 12) | 224);
  //         t += String.fromCharCode(((r >> 6) & 63) | 128);
  //         t += String.fromCharCode((r & 63) | 128);
  //       }
  //     }
  //     return t;
  //   }
  //   Base64Utf8_decode(e) {
  //     var t = "";
  //     var n = 0;
  //     var r = 0;
  //     var c1 = 0;
  //     var c2 = 0;
  //     var c3 = 0;
  //     while (n < e.length) {
  //       r = e.charCodeAt(n);
  //       if (r < 128) {
  //         t += String.fromCharCode(r);
  //         n++;
  //       } else if (r > 191 && r < 224) {
  //         c2 = e.charCodeAt(n + 1);
  //         t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
  //         n += 2;
  //       } else {
  //         c2 = e.charCodeAt(n + 1);
  //         c3 = e.charCodeAt(n + 2);
  //         t += String.fromCharCode(
  //           ((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
  //         );
  //         n += 3;
  //       }
  //     }
  //     return t;
  //   }


  //   PageSafeList = [];
  //   PageGuideList = [];
  //   PageSafeListPage = 1;
  //   sizeAllowListOld = ["1/12", "1/6", "1/5", "1/4", "1/3", "2/5", "1/2", "3/5", "2/3", "3/4", "4/5", "5/6", "1/1"];
  //   sizeAllowList = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  //   // Sizes ----------------------------------------
  //   sizeListItems = {
  //     default: [
  //       "0",
  //       "1",
  //       "2",
  //       "3",
  //       "4",
  //       "5",
  //       "6",
  //       "7",
  //       "8",
  //       "9",
  //       "10",
  //       "11",
  //       "12",
  //     ],
  //   };
  //   sizes12 = {
  //     "0": 0,
  //     "1": 1,
  //     "2": 2,
  //     "3": 3,
  //     "4": 4,
  //     "5": 5,
  //     "6": 6,
  //     "7": 7,
  //     "8": 8,
  //     "9": 9,
  //     "10": 10,
  //     "11": 11,
  //     "12": 12
  //   };
  //   WidgetsConvert = {
  //     "htmlaccordion": "corehtmlaccordion",
  //     "htmlblockquote": "corehtmlblockquote",
  //     "htmlbutton": "corehtmlbutton",
  //     "htmlcalltoaction": "corehtmlcalltoaction",
  //     "htmlcountdown": "corehtmlcountdown",
  //     "htmlcounter": "corehtmlcounter",
  //     "htmldateview": "corehtmldateview",
  //     "htmldivider": "corehtmldivider",
  //     "htmlfeedreader": "corehtmlfeedreader",
  //     "htmlfooterview": "corehtmlfooterview",
  //     "htmlheaderview": "corehtmlheaderview",
  //     "htmlimage": "corehtmlimage",
  //     "htmlmap": "corehtmlmap",
  //     "htmlmenu": "corehtmlmenu",
  //     "htmlourteam": "corehtmlourteam",
  //     "htmlparagraph": "corehtmlparagraph",
  //     "htmlprogressbars": "corehtmlprogressbars",
  //     "htmlqrcode": "corehtmlqrcode",
  //     "htmlscriptplace": "corehtmlscriptplace",
  //     "htmlsection": "corehtmlsection",
  //     "htmlslideshow": "corehtmlslideshow",
  //     "htmlsocialicons": "corehtmlsocialicons",
  //     "htmltabs": "corehtmltabs",
  //     "htmlvideo": "corehtmlvideo",
  //     "htmlview": "corehtmlview",
  //     "aboutus": "coreaboutus",
  //     "location": "corelocation",
  //     "privacy": "coreprivacy",
  //     "accordion": "corehtmlaccordion",
  //     "blockquote": "corehtmlblockquote",
  //     "button": "corehtmlbutton",
  //     "calltoaction": "corehtmlcalltoaction",
  //     "countdown": "corehtmlcountdown",
  //     "counter": "corehtmlcounter",
  //     "dateview": "corehtmldateview",
  //     "divider": "corehtmldivider",
  //     "feedreader": "corehtmlfeedreader",
  //     "footerview": "corehtmlfooterview",
  //     "headerview": "corehtmlheaderview",
  //     "image": "corehtmlimage",
  //     "map": "corehtmlmap",
  //     "menu": "corehtmlmenu",
  //     "ourteam": "corehtmlourteam",
  //     "paragraph": "corehtmlparagraph",
  //     "progressbars": "corehtmlprogressbars",
  //     "qrcode": "corehtmlqrcode",
  //     "scriptplace": "corehtmlscriptplace",
  //     "section": "corehtmlsection",
  //     "slideshow": "corehtmlslideshow",
  //     "socialicons": "corehtmlsocialicons",
  //     "tabs": "corehtmltabs",
  //     "video": "corehtmlvideo",
  //     "view": "corehtmlview",
  //     "maintemplatewithembeddedchild": "coremaintemplatewithembeddedchild",
  //     "search": "coresearch",
  //     "usercplogin": "coreusercplogin",
  //     "userwidgetlogin": "coreuserwidgetlogin",
  //     "Template": "coremaintemplatewithembeddedchild"
  //   }
  //   WidgetsConvertFind = function (name) {
  //     name = name.toLowerCase();
  //     var ret =this. WidgetsConvert[name];
  //     if (ret != undefined && ret.length > 0)
  //       return ret;
  //     return name
  //   }
  //   //lg (for laptops and desktops - screens equal to or greater than 1200px wide)
  //   //md (for small laptops - screens equal to or greater than 992px wide)
  //   //sm (for tablets - screens equal to or greater than 768px wide)
  //   //xs (for phones - screens less than 768px wide)
  //   //var sizeList = [lg, md, sm, xs];
  //   sizeNeedListDefault = "12,12,12,12";
  //   previewIndex = 1;
  //   regexContainerId = /(\[containerId_\d+])/;
  //   regexElementId = /(\[elementId_\d+])/;
  //   regexWidgetId = /(\[widgetId_\d+])/;
  //   regexNumber = /\d+/;
  //   desktop;
  //   publicContainerId;
  //   publicElementId;
  //   publicWidgetId;
  //   myAlert = "";
  //   previewIndexSetStyle = "color: #0d49f1;font-size: large;font-weight: bold;font-style: italic;";
  //   RenderModuleName_last = "";
  //   RenderWidgetCsharpClass_last = "";
  //   CmsFileCategoryCash = [];
  //   CmsFileCash = [];
  //   SiteModuleListCash = [];


  //   popupAlert(message, icon, popupTitle) {
  //     $("#popupAlert").show();
  //     $("#myModalTitle").html(popupTitle);
  //     $("#popupAlertMessage").html(message);
  //     $("#popupAlertIcon").attr("src", icon);
  //     $("#myModal").modal("show");
  //   };


  //   guideShow(area) {

  //     if (this.PageGuideList && this.PageGuideList._introItems && this.PageGuideList._introItems.length > 0) {
  //       //#help// در صورتی که قبلا دریافت شده باشد
  //       this.PageGuideList.start();

  //       //#help// در صورتی که قبلا دریافت شده باشد
  //     }
  //     else {
  //       //#help// در صورتی که قبلا دریافت نشده باشد

  //       var filterModel = new FilterModel();
  //       filterModel.totalRowData = 100;
  //       filterModel.filters = null;
  //       filterModel.filters = [];
  //       var guideList = [];
  //       var selectArea = $('*[data-guide]');
  //       selectArea.each(function () {
  //         var retId = $(this).data('guide');
  //         if (Number.isInteger(retId))
  //           filterModel.filters.push({ propertyName: "Id", searchType: 0, value: parseInt(retId), clauseType: 1 });
  //       });


  //       if (filterModel.filters.length > 0) {
  //         //#help# یافت شد
  //         $.ajax({
  //           type: "Post",
  //           //async: false,
  //           data: JSON.stringify(filterModel),
  //           url: configPathApiCms + "cmsguide/getall",
  //           contentType: "application/json",
  //           success: function (response) {
  //             var introSteps = [];
  //             if (response.IsSuccess) {
  //               $.each(response.ListItems, function (i, item) {
  //                 introSteps.push({
  //                   element: document.querySelectorAll('*[data-guide="' + item.Id + '"]')[0],
  //                   intro: "<h3>" + item.Title + "</h3><br/>" + item.BodyFa
  //                 });
  //                 var index = guideList.indexOf(item.Id);
  //                 if (index > -1) {
  //                   guideList.splice(index, 1);
  //                 }
  //               });


  //               PageGuideList = introJs();
  //               PageGuideList.setOptions({ 'skipLabel': 'بازگشت', 'nextLabel': 'بعدی', 'prevLabel': 'قبلی' });
  //               PageGuideList.setOption('tooltipPosition', 'auto');
  //               PageGuideList.setOption('positionPrecedence', ['left', 'right', 'bottom', 'top']);
  //               PageGuideList.setOptions({ steps: introSteps });
  //               PageGuideList.start();

  //             }
  //           },
  //           error: function (data, errCode, c, d) {
  //             popupAlert("برروز خطا در دریافت اطلاعات", "");
  //           }
  //         });
  //         //#help# یافت شد
  //       } else {
  //         popupAlert("راهنمایی برای این بخش در نظر گرفته نشده است", "");
  //       }

  //       //#help// در صورتی که قبلا دریافت نشده باشد
  //     }
  //   }
  //   popupAlertClose() {
  //     $("#popupAlertMessage").html("");
  //     $("#popupAlertIcon").attr("src", "");
  //     $("#myModalTitle").html("");
  //     $("#myModal").modal("hide");
  //   };

  //   // Sortable | Desktop - this is: main desktop - accepted: sections
  //   sortableDesk(el) {
  //     el.sortable({
  //       items: ".mfn-row",
  //       forcePlaceholderSize: true,
  //       placeholder: "mfn-placeholder",
  //       opacity: 0.9,
  //       cursor: "move",
  //       distance: 5
  //     });
  //   }

  //   // Sortable | Container - this is: section - accepted: wrap, divider
  //   sortableContainer(el) {
  //     el.sortable({
  //       connectWith: ".mfn-sortable-container",
  //       items: ".mfn-wrap",
  //       forcePlaceholderSize: true,
  //       placeholder: "mfn-placeholder",
  //       opacity: 0.9,
  //       cursor: "move",
  //       cursorAt: { top: 20, left: 20 },
  //       distance: 5,
  //       receive: sortableContainerReceive // on drop into, NOT on update position after drag
  //     });
  //   }
  //   sortableContainerReceive(event, ui) {
  //     var targetContainerID = jQuery(this).siblings(".mfn-container-id").val();
  //     //ui.item.find('.mfn-element-containerId').val(targetContainerID);

  //     var oldContainerId = ui.item.attr("data-containerId");
  //     var newContainerId = jQuery(this)
  //       .parents(".mfn-element")
  //       .attr("data-containerId");
  //     ui.item.attr("data-containerId", newContainerId);

  //     ui.item.find("input, select, textarea").each(function () {
  //       var name = jQuery(this).attr("data-name") + "";
  //       if (name != undefined && name != "undefined") {
  //         name = name.replace(
  //           "containerId_" + oldContainerId,
  //           "containerId_" + newContainerId
  //         );

  //         jQuery(this).attr("name", name);
  //         jQuery(this).attr("data-name", name);

  //         if (name.indexOf("][containerId]") > 1) jQuery(this).val(newContainerId);

  //         if (name == "data-containerId")
  //           jQuery(this).attr("data-containerId", newContainerId);
  //       }
  //     });
  //   }

  //   // Sortable | Element - this is: wrap - accepted: item
  //   sortableElement(el) {
  //     el.sortable({
  //       connectWith: ".mfn-sortable-element",

  //       items: ".mfn-widget",
  //       cancel: ".mfn-popup",

  //       forcePlaceholderSize: true,
  //       placeholder: "mfn-placeholder",

  //       forceHelperSize: false,
  //       helper: function (event, ui) {
  //         var title = ui.attr("data-WidgetTitle");

  //         var helper = jQuery(
  //           '<div class="mfn-helper">' + title + "</div>"
  //         ).prependTo("body");
  //         return helper;
  //       },

  //       opacity: 0.9,
  //       cursor: "move",
  //       cursorAt: { top: 20, left: 20 },
  //       distance: 5,
  //       over: function (event, ui) {

  //       },

  //       receive: sortableElementReceive // on drop into, NOT on update position after drag
  //     });
  //   }

  //   sortableElementReceive(event, ui) {

  //     var oldElementId = ui.item.attr("data-elementId");
  //     var oldContainerId = ui.item.attr("data-containerId");
  //     var newElementId = jQuery(this)
  //       .parents(".mfn-element")
  //       .attr("data-elementId");
  //     var newContainerId = jQuery(this)
  //       .parents(".mfn-element")
  //       .attr("data-containerId");
  //     ui.item.attr("data-elementId", newElementId);
  //     ui.item.attr("data-containerId", newContainerId);

  //     ui.item.find("input, select, textarea").each(function () {
  //       var name = jQuery(this).attr("data-name") + "";
  //       if (name != undefined && name != "undefined") {
  //         name = name.replace(
  //           "containerId_" + oldContainerId,
  //           "containerId_" + newContainerId
  //         );
  //         name = name.replace(
  //           "elementId_" + oldElementId,
  //           "elementId_" + newElementId
  //         );

  //         jQuery(this).attr("name", name);
  //         jQuery(this).attr("data-name", name);

  //         if (name.indexOf("][containerId]") > 1) jQuery(this).val(newContainerId);
  //         if (name.indexOf("][elementId]") > 1) jQuery(this).val(newElementId);

  //         if (name == "data-containerId")
  //           jQuery(this).attr("data-containerId", newContainerId);
  //         if (name == "data-elementId")
  //           jQuery(this).attr("data-elementId", newElementId);
  //       }
  //     });
  //   }
  //   jQuery(document).mouseup(function(e) {
  //     if (jQuery(".mfn-sc-add").has(e.target).length === 0) {
  //       jQuery(".mfn-sc-add").removeClass("focus");
  //     }
  //   });
  //   // Container ===================================================

  //   // size  size  size =======================================================
  //   previewIndexSet() {

  //     $('[class^="descDataSize"]').attr('style', '');
  //     $(".descDataSize" + previewIndex).attr('style', previewIndexSetStyle);

  //     $("[data-size]").each(function (i, opt) {
  //       if ($(opt).attr('data-size-' + previewIndex))
  //         $(opt).attr('data-size', $(opt).attr('data-size-' + previewIndex));
  //     });
  //   }

  //   sizeAllowListCheck(size) {
  //     for (var i = 0; i < sizeAllowList.length; i++) {
  //       if (sizeAllowList[i] == size) {
  //         return i;
  //       }
  //     }
  //     for (var i = 0; i < sizeAllowListOld.length; i++) {
  //       if (sizeAllowListOld[i] == size) {
  //         if (sizeAllowList.length > i)
  //           return sizeAllowList[i];
  //       }
  //     }
  //     return sizeAllowList[0];
  //   }
  //   widgetDataSizeSetFirst(jQuerythis, content, existSizeValue) {
  //     var sizeNeedList = sizeNeedListDefault.split(',');
  //     var jQuerythisFirst = jQuerythis.find(content).first();
  //     var lastSizeFind = '';
  //     for (var j = 0; j < sizeNeedList.length; j++) {
  //       if (existSizeValue.length > j) {
  //         lastSizeFind = sizeAllowListCheck(existSizeValue[j]);
  //         sizeNeedList[j] = lastSizeFind;
  //       }
  //       else if (lastSizeFind != '') {
  //         sizeNeedList[j] = lastSizeFind;
  //       }
  //     }
  //     for (var j = 0; j < sizeNeedList.length; j++) {
  //       jQuerythis.attr("data-size-" + (j + 1), sizeNeedList[j]);
  //     }
  //     jQuerythis.attr("data-size", sizeNeedList[previewIndex - 1]);
  //     jQuerythisFirst.val(sizeNeedList);
  //     return sizeNeedList;
  //   }
  //   widgetDataSizeSet(jQuerythis, content, size, setForAll) {
  //     var sizeNeedList = sizeNeedListDefault.split(',');
  //     var jQuerythisFirst = jQuerythis.find(content).first();
  //     var existValue = jQuerythisFirst.val().split(",");
  //     for (var j = 0; j < sizeNeedList.length; j++) {
  //       if (existValue.length > j) {
  //         sizeNeedList[j] = sizeAllowListCheck(existValue[j]);
  //       } else {
  //         sizeNeedList[j] = size;
  //       }
  //     }
  //     if (setForAll) {
  //       for (var j = 0; j < sizeNeedList.length; j++) {
  //         sizeNeedList[j] = size;
  //         jQuerythis.attr("data-size-" + (j + 1), size);
  //       }
  //     } else {
  //       sizeNeedList[previewIndex - 1] = size;
  //       jQuerythis.attr("data-size-" + previewIndex, size);
  //     }
  //     jQuerythis.attr("data-size", size);
  //     jQuerythisFirst.val(sizeNeedList);
  //     return sizeNeedList;
  //   }
  //   descDataSizeSet(size) {
  //     var retOut = "";
  //     for (var i = 0; i < size.length; i++) {
  //       if (retOut != "")
  //         retOut += " | ";
  //       if ((i + 1) == previewIndex)
  //         retOut += '<span class="descDataSize' + (i + 1) + '" style="' + previewIndexSetStyle + '" >' + size[i] + '</span>';
  //       else
  //         retOut += '<span class="descDataSize' + (i + 1) + '" >' + size[i] + '</span>';
  //     }
  //     return retOut;
  //   }
  //   dataSizeGet(jQuerythis, content) {
  //     var sizeNeedList = sizeNeedListDefault.split(',');
  //     var existValue = jQuerythis.find(content).first().val().split(",");
  //     if (existValue.length >= previewIndex)
  //       return existValue[previewIndex - 1];
  //     if (existValue.length > 0)
  //       return existValue[0];
  //     if (sizeNeedList.length > 0)
  //       return sizeNeedList[previewIndex - 1];

  //     return 1;
  //   }
  //   // size  size  size =======================================================
  //   //[_____containerId_____][_____elementId_____][_____widgetId_____]

  //   SetValueElement(jQueryThis, val) {
  //     if (jQueryThis.is("input")) {
  //       if (jQueryThis.is("[type=text]")) {
  //         jQueryThis.val(val);
  //         return;
  //       } else if (jQueryThis.is("[type=hidden]")) {
  //         jQueryThis.val(val);
  //         return;
  //       } else if (jQueryThis.is("[type=checkbox]")) {
  //         if (val == "1" || val == "true" || val)
  //           jQueryThis.attr("checked", true);
  //         return;
  //       }
  //     } else if (jQueryThis.is("select")) {
  //       jQueryThis.attr("value", val);
  //       jQueryThis.find("option").each(function (i, opt) {
  //         if (opt.value === val) $(opt).attr("selected", "selected");
  //       });
  //       return;
  //     }

  //     jQueryThis.val(val);
  //     jQueryThis.attr("value", val);
  //     return;
  //   }
  //   tabIdCoreted(clone, widgetId, oldwidgetId, tagId) {

  //     clone.find("div").each(function () {
  //       var name = jQuery(this).attr("id") + "";
  //       if (name != "undefined") {
  //         name = name.replace(oldwidgetId, tagId + "_" + widgetId);

  //         jQuery(this).attr("id", name);
  //       }
  //     });
  //     clone.find("a").each(function () {
  //       var name = jQuery(this).attr("href") + "";
  //       if (name != "undefined") {
  //         name = name.replace(oldwidgetId, tagId + "_" + widgetId);

  //         jQuery(this).attr("href", name);
  //       }
  //     });

  //   }
  //   // Build  Build  Build =======================================================
  //   BuildContainer(jQueryThis, clone, myJsonSeting) {

  //     publicContainerId.val(publicContainerId.val() * 1 + 1);

  //     // clone; sortable init
  //     sortableContainer(clone.find(".mfn-sortable-container"));
  //     clone.attr("data-containerId", publicContainerId.val());

  //     clone.hide();

  //     // type, size, parent
  //     clone.find(".mfn-element-content input").each(function () {
  //       jQuery(this).attr("name", jQuery(this).attr("class") + "[]");
  //     });

  //     if (myJsonSeting != undefined && myJsonSeting["WidgetTitle"] != undefined) {
  //       clone.find(".mfn-container-label").first().html(myJsonSeting["WidgetTitle"]);
  //     }

  //     clone
  //       .find(".mfn-element-meta")
  //       .append(
  //         '<input type="hidden" data-name="mfn-container[_____containerId_____][containerId]"  value="' +
  //         publicContainerId.val() +
  //         '"  />'
  //       );
  //     //example : mfn-container[containerId_1][bg_position]
  //     var myJsonSetingNew = new Object();
  //     if (myJsonSeting != undefined) {
  //       $.each(myJsonSeting, function (i, obj) {
  //         if (i == "containerId") obj = publicContainerId.val();
  //         var Key_ = "mfn-container[containerId_" + publicContainerId.val() + "][" + i + "]";
  //         myJsonSetingNew[Key_] = obj;
  //       });
  //     }
  //     clone.find("input, select, textarea").each(function () {
  //       var name = jQuery(this).attr("data-name") + "";
  //       name = name.replace("_____containerId_____", "containerId_" + publicContainerId.val());

  //       jQuery(this).attr("data-name", name);
  //       if (myJsonSetingNew != undefined && myJsonSetingNew[name] != undefined)
  //         SetValueElement(jQuery(this), myJsonSetingNew[name]);
  //     });



  //     // data-name -> name
  //     clone
  //       .find(".mfn-element-meta")
  //       .find("input, select, textarea")
  //       .each(function () {
  //         jQuery(this).attr("name", jQuery(this).attr("data-name"));
  //       });
  //     tabIdCoreted(clone, publicContainerId.val(), "[_____containerId_____]", "containerId");

  //     desktop.append(clone).find(".mfn-row").fadeIn(300);
  //   }

  //   BuildElementWidgetContainer(jQueryThis, clone, myJsonSeting, childWidgets) {
  //     publicElementId.val(publicElementId.val() * 1 + 1);

  //     // parent
  //     var parentDesktop = jQuery(jQueryThis)
  //       .closest(".mfn-row")
  //       .find(".mfn-sortable-container")
  //       .first();
  //     var containerId = jQuery(jQueryThis).closest(".mfn-row").attr("data-containerId");
  //     clone.attr("data-containerId", containerId);
  //     clone.attr("data-elementId", publicElementId.val());

  //     var el_type = "wrap";
  //     var el_sizes = sizeListItems[el_type];
  //     if (el_sizes == undefined) el_sizes = sizeListItems["default"];
  //     var mySize = el_sizes[el_sizes.length - 1];
  //     if (myJsonSeting != undefined && myJsonSeting["Size"] != undefined)
  //       mySize = myJsonSeting["Size"];
  //     if (myJsonSeting != undefined && myJsonSeting["WidgetTitle"] != undefined) {
  //       clone.find(".mfn-element-label").first().html(myJsonSeting["WidgetTitle"]);
  //     }

  //     var sizeListUpdated = widgetDataSizeSetFirst(clone, ".mfn-element-size", mySize.split(","));
  //     //clone.find("input.mfn-widget-size").val(mySize);
  //     clone.find(".mfn-widget-size span").html(descDataSizeSet(sizeListUpdated));
  //     // clone; sortable init
  //     //var clone = jQuery('#mfn-element .mfn-wrap').clone(true);

  //     sortableElement(clone.find(".mfn-sortable-element"));

  //     clone
  //       .find(".mfn-element-meta")
  //       .append(
  //         '<input type="hidden" data-name="mfn-element[_____containerId_____][_____elementId_____][containerId]" value="' +
  //         containerId +
  //         '"  "/>'
  //       ); //add input box
  //     clone
  //       .find(".mfn-element-meta")
  //       .append(
  //         '<input type="hidden" data-name="mfn-element[_____containerId_____][_____elementId_____][elementId]" value="' +
  //         publicElementId.val() +
  //         '"  "/>'
  //       ); //add input box
  //     clone
  //       .find(".mfn-element-meta")
  //       .append(
  //         '<input type="hidden" data-name="mfn-element[_____containerId_____][_____elementId_____][type]" value="' +
  //         "2" +
  //         '"  "/>'
  //       ); //add input box
  //     clone
  //       .find(".mfn-element-meta")
  //       .append(
  //         '<input type="hidden" data-name="mfn-element[_____containerId_____][_____elementId_____][Size]" value="' +
  //         sizeListUpdated +
  //         '"  "/>'
  //       ); //add input box

  //     //example : data-name="mfn-element[containerId_2][elementId_2][bg_color]"
  //     var myJsonSetingNew = new Object();
  //     if (myJsonSeting != undefined) {
  //       $.each(myJsonSeting, function (i, obj) {
  //         if (i == "containerId") obj = containerId;
  //         if (i == "elementId") obj = publicElementId.val();

  //         var Key_ =
  //           "mfn-element[containerId_" +
  //           containerId +
  //           "][elementId_" +
  //           publicElementId.val() +
  //           "][" +
  //           i +
  //           "]";
  //         myJsonSetingNew[Key_] = obj;
  //       });
  //     }
  //     clone.find("input, select, textarea").each(function () {
  //       var name = jQuery(this).attr("data-name") + "";
  //       name = name.replace("_____containerId_____", "containerId_" + containerId);
  //       name = name.replace("_____elementId_____", "elementId_" + publicElementId.val());
  //       jQuery(this).attr("data-name", name);
  //       if (myJsonSetingNew != undefined && myJsonSetingNew[name] != undefined)
  //         SetValueElement(jQuery(this), myJsonSetingNew[name]);
  //     });

  //     clone.hide();

  //     // type, size, parent
  //     clone.find(".mfn-element-content > input").each(function () {
  //       jQuery(this).attr("name", jQuery(this).attr("class") + "[]");
  //     });

  //     // data-name -> name
  //     clone
  //       .find(".mfn-element-meta")
  //       .find("input, select, textarea")
  //       .each(function () {
  //         jQuery(this).attr("name", jQuery(this).attr("data-name"));
  //       });

  //     if (childWidgets != undefined) {
  //       loadWidgets(clone, childWidgets);
  //     }
  //     tabIdCoreted(clone, containerId, "[_____containerId_____]", "containerId");
  //     tabIdCoreted(clone, publicElementId.val(), "[_____elementId_____]", "elementId");
  //     parentDesktop.append(clone).find(".mfn-wrap").fadeIn(300);
  //   }

  //   BuildWidgeTab(jQueryThis, clone, myJsonSeting) {
  //     if (
  //       myJsonSeting == undefined ||
  //       myJsonSeting["ContentSetting"] == undefined ||
  //       myJsonSeting["ContentSetting"]["TabTitle"] == undefined
  //     )
  //       return;

  //     $.each(myJsonSeting["ContentSetting"]["TabTitle"], function (i, v) {
  //       // increase tabs counter
  //       var tabs_counter = clone.find(".mfn-tabs-count");
  //       tabs_counter.val(tabs_counter.val() * 1 + 1);
  //       var tabs_counterVal = tabs_counter.val();
  //       if (tabs_counterVal == undefined) tabs_counterVal = 1;
  //       //var name = $(this).attr('data-name');
  //       var tabs_container = clone.find(".tabs-ul");
  //       var new_tab = tabs_container.children("li.tabs-default").clone(true);

  //       //var name = '';
  //       new_tab.removeClass("tabs-default");
  //       new_tab.find("input,textarea").each(function (i, opt) {
  //         name = $(this).attr("data-name").replace("[X]", "");
  //         $(this).attr("name", name + "[" + tabs_counterVal + "]");
  //         $(this).attr("data-name", name + "[" + tabs_counterVal + "]");

  //         var dateValueName = "";
  //         if (name.lastIndexOf("][") > 0)
  //           dateValueName = name.substring(
  //             name.lastIndexOf("][") + 2,
  //             name.length - 1
  //           );
  //         var thisValue = "";
  //         try {
  //           thisValue =
  //             myJsonSeting["ContentSetting"][dateValueName][tabs_counterVal];
  //         } catch (e) {
  //           thisValue = "";
  //         }

  //         $(this).attr("value", thisValue);
  //         $(this).val(thisValue);
  //       });

  //       tabs_container.append(new_tab).children("li:last").fadeIn(500);
  //     });
  //   }
  //   BuildWidge(jQueryThis, clone, item, myJsonSeting) {
  //     publicWidgetId.val(publicWidgetId.val() * 1 + 1);
  //     var widgetId = publicWidgetId.val();

  //     var parentDesktop = jQueryThis.find(".mfn-sortable-element").first();
  //     var containerId = jQueryThis.attr("data-containerId");
  //     var elementId = jQueryThis.attr("data-elementId");

  //     var searchtag = "[ContentSetting][X]".toLowerCase();
  //     if (clone.html() && clone.html().toLowerCase().indexOf(searchtag) > 0)
  //       BuildWidgeTab(jQueryThis, clone, myJsonSeting);

  //     clone.attr("data-containerId", containerId);
  //     clone.attr("data-elementId", elementId);
  //     clone.attr("data-widgetId", widgetId);

  //     jQuery("#mfn-widget-add").fadeOut(300);

  //     // enable background content scrolling & dragging
  //     jQuery("body").removeClass("mfn-popup-open");
  //     jQuery("#mfn-content").find(".ui-sortable").sortable("enable");

  //     // parent


  //     var el_type = clone.find(".mfn-widget-type").first().val();
  //     var el_sizes = sizeListItems[el_type];
  //     if (el_sizes == undefined) el_sizes = sizeListItems["default"];
  //     var mySize = el_sizes[el_sizes.length - 1];

  //     //var mySize = clone.find("input.mfn-widget-size").val();
  //     if (myJsonSeting != undefined && myJsonSeting["Size"] != undefined)
  //       mySize = myJsonSeting["Size"];


  //     var sizeListUpdated = widgetDataSizeSetFirst(clone, ".mfn-widget-size", mySize.split(","));
  //     clone.find(".mfn-widget-size span").html(descDataSizeSet(sizeListUpdated));



  //     var myTitle = "";
  //     // myJsonSeting.ContentSetting.WidgetTitle
  //     if (myJsonSeting != undefined && myJsonSeting["ContentSetting"] != undefined) {
  //       myTitle = myJsonSeting["ContentSetting"].WidgetTitle;
  //       clone.find(".mfn-widget-label").first().html(myTitle);
  //     }


  //     clone
  //       .find(".mfn-element-meta")
  //       .append(
  //         '<input type="hidden" data-name="mfn-widgets[_____containerId_____][_____elementId_____][_____widgetId_____][containerId]" value="' +
  //         containerId +
  //         '"  />'
  //       ); //add input box
  //     clone
  //       .find(".mfn-element-meta")
  //       .append(
  //         '<input type="hidden" data-name="mfn-widgets[_____containerId_____][_____elementId_____][_____widgetId_____][elementId]" value="' +
  //         elementId +
  //         '"  />'
  //       ); //add input box
  //     clone
  //       .find(".mfn-element-meta")
  //       .append(
  //         '<input type="hidden" data-name="mfn-widgets[_____containerId_____][_____elementId_____][_____widgetId_____][widgetId]" value="' +
  //         widgetId +
  //         '"  />'
  //       ); //add input box
  //     clone
  //       .find(".mfn-element-meta")
  //       .append(
  //         '<input type="hidden" data-name="mfn-widgets[_____containerId_____][_____elementId_____][_____widgetId_____][type]" value="' +
  //         item +
  //         '"  />'
  //       ); //add input box
  //     clone
  //       .find(".mfn-element-meta")
  //       .append(
  //         '<input type="hidden" data-name="mfn-widgets[_____containerId_____][_____elementId_____][_____widgetId_____][Size]" value="' +
  //         sizeListUpdated +
  //         '"   />'
  //       ); //add input box


  //     var myJsonSetingNew = new Object();
  //     if (myJsonSeting != undefined) {
  //       $.each(myJsonSeting, function (i, obj) {
  //         if (i == "containerId") obj = containerId;
  //         if (i == "elementId") obj = elementId;
  //         if (i == "widgetId") obj = widgetId;

  //         var Key_ =
  //           "mfn-widgets[containerId_" +
  //           containerId +
  //           "][elementId_" +
  //           elementId +
  //           "][widgetId_" +
  //           widgetId +
  //           "][" +
  //           item +
  //           "][" +
  //           i +
  //           "]";
  //         myJsonSetingNew[Key_] = obj;
  //         if (
  //           myJsonSeting[i] != undefined &&
  //           typeof myJsonSeting[i] == "object"
  //         ) {
  //           $.each(myJsonSeting[i], function (iChild, objChild) {
  //             var Key_ =
  //               "mfn-widgets[containerId_" +
  //               containerId +
  //               "][elementId_" +
  //               elementId +
  //               "][widgetId_" +
  //               widgetId +
  //               "][" +
  //               item +
  //               "][" +
  //               i +
  //               "][" +
  //               iChild +
  //               "]";
  //             myJsonSetingNew[Key_] = objChild;
  //           });
  //         }
  //       });
  //     }
  //     clone.find("input, select, textarea").each(function () {
  //       var name = jQuery(this).attr("data-name") + "";
  //       name = name.replace("_____containerId_____", "containerId_" + containerId);
  //       name = name.replace("_____elementId_____", "elementId_" + elementId);
  //       name = name.replace("_____widgetId_____", "widgetId_" + widgetId);

  //       jQuery(this).attr("data-name", name);
  //       if (myJsonSetingNew != undefined && myJsonSetingNew[name] != undefined)
  //         SetValueElement(jQuery(this), myJsonSetingNew[name]);
  //     });

  //     clone.find("input, select, textarea").each(function () {
  //       var name = jQuery(this).attr("data-name") + "";
  //       name = name.replace("[" + item + "]", "");
  //       jQuery(this).attr("data-name", name);
  //     });
  //     tabIdCoreted(clone, widgetId, "[_____widgetId_____]", "widgetId");
  //     clone.hide();

  //     // type, size, parent
  //     clone.find(".mfn-element-content input").each(function () {
  //       jQuery(this).attr("name", jQuery(this).attr("class") + "[]");
  //     }); // TODO: (future) change it to use data-name

  //     // data-name -> name
  //     clone
  //       .find(".mfn-element-meta")
  //       .find("input, select, textarea")
  //       .each(function () {
  //         jQuery(this).attr("name", jQuery(this).attr("data-name"));
  //       });

  //     // parent wrap ID
  //     clone.find(".mfn-widget-elementId").val(elementId);

  //     parentDesktop.append(clone).find(".mfn-widget").fadeIn(300);
  //   }
  //   // Build  Build  Build =======================================================

  //   // load  load  load =======================================================
  //   loadPage(myJson) {
  //     $("#mfn-desk").empty();
  //     publicContainerId.val(0);
  //     publicElementId.val(0);
  //     publicWidgetId.val(0);
  //     //@help@ بارگزاری تنظیمات ذخیره شده از صفحه اصلی
  //     if (myJson == undefined) {
  //       popupAlert("اطلاعاتی یافت نشد");
  //       return;
  //     }
  //     var model = {};
  //     try {
  //       model = JSON.parse(myJson)
  //     } catch (e) {
  //     }
  //     if (model.Containers == undefined) {
  //       popupAlert("اطلاعاتی یافت نشد");
  //       return;
  //     }
  //     loadPageSetting(model.Setting);
  //     loadContainers(jQuery(this), model.Containers);
  //   }
  //   //@help@ تنظیمات اصلی صفحه
  //   loadPageSetting(myJsonSeting) {

  //     if (!myJsonSeting)
  //       return;
  //     $("#formBouilderSetting").find("input, select, textarea").each(function () {
  //       var name = jQuery(this).attr("name") + "";
  //       if (myJsonSeting != undefined && myJsonSeting[name] != undefined)
  //         SetValueElement(jQuery(this), myJsonSeting[name]);
  //     });
  //   }
  // //#help// Load from Safe  Log
  // var LoadLogPageSafe = function (page) {
  //   PageSafeList = [];

  //   var Filter_value = {
  //     PropertyName: "LinkCoreCmsPageId",
  //     value: window.id,
  //     SearchType: 0,
  //     IntValueForceNullSearch: true
  //   };
  //   var filterModel = {};
  //   filterModel.SortColumn = "Id";
  //   filterModel.SortType = 0;
  //   filterModel.TotalRowData = 10;
  //   filterModel.Filters = null;
  //   filterModel.Filters = [];
  //   document.getElementById("myListhistory").innerHTML = 'در حال دریافت اطلاعات ..'
  //   filterModel.Filters.push(Filter_value);
  //   $.ajax({
  //     type: "Post",
  //     //async: false,
  //     data: JSON.stringify(filterModel),
  //     dataType: "json",
  //     contentType: "application/json",
  //     url: configPathApiCms + "WebDesignerLogPageSafe/getall",
  //     success: function (request) {
  //       if (request.IsSuccess) {
  //         //alert("Safe Count :" + request.ListItems.length);
  //         PageSafeList = request.ListItems;
  //         PageSafeListPage = request.CurrentPageNumber;
  //         document.getElementById("myListhistory").innerHTML = '';
  //         $.each(request.ListItems, function (index, element) {
  //           var e = document.createElement('div');
  //           e.innerHTML = '<button type="button" onclick="loadPageSafe(' + index + ')"  >' + element.CreatedDate + '</button>';
  //           document.getElementById("myListhistory").appendChild(e.firstChild);
  //         });

  //       }
  //     },
  //     error: function (msg) {
  //       document.getElementById("myListhistory").innerHTML = 'برروز خطا'

  //       console.log(msg);
  //     }
  //   });
  // }
  // var loadContainers = function (jQueryThis, Containers) {

  //   $.each(Containers, function (i, v) {
  //     var clone = jQuery("#mfn-container .mfn-row").clone(true);
  //     BuildContainer(jQueryThis, clone, v.Setting);
  //     loadRows(clone, v.Rows);
  //   });
  // }
  // var loadRows = function (parentClone, Elements) {

  //   if (Elements)
  //     $.each(Elements, function (i, v) {
  //       if (v.ElementType == "WidgetContainer" || v.ElementType == "2") {
  //         loadElementWidgetContainer(parentClone, v);
  //       }
  //     });
  // }
  // var loadElementWidgetContainer = function (parentClone, Element) {
  //   var clone = jQuery("#mfn-element .mfn-wrap").clone(true);
  //   BuildElementWidgetContainer(parentClone, clone, Element.Setting, Element.Widgets);
  // }
  // var loadWidgets = function (parentClone, Widgets) {
  //   $.each(Widgets, function (i, v) {
  //     var item = WidgetsConvertFind(v.Type);
  //     var clone = jQuery("#mfn-widgets")
  //       .find("div.mfn-widget-" + item)
  //       .clone(parentClone);
  //     if (clone == undefined || clone.length == 0)
  //       console.log("widget Not Find : " + v.Type);
  //     BuildWidge(jQuery(parentClone), clone, item, JSON.parse(v.FullSetting));
  //   });
  // }
  // // load  load  load =======================================================





  // // Clone  Clone  Clone =======================================================
  // var CloneContainer = function (jQuery_this) {
  //   publicContainerId.val(publicContainerId.val() * 1 + 1);
  //   var myClosest = jQuery_this.closest(".mfn-row");

  //   var clone = myClosest.clone(true);

  //   var oldWapperId = clone.attr("data-containerId");
  //   var oldElementId = 0;
  //   var oldWidgetId = 0;

  //   clone.attr("data-containerId", publicContainerId.val());

  //   var LastWidgetId = 0;
  //   var LastElementId = 0;
  //   clone.find("input, select, textarea , a").each(function () {
  //     var name = jQuery(this).attr("data-name") + "";
  //     if (name != undefined && name != "undefined") {
  //       //find New ElementId
  //       if (
  //         name.match(regexElementId) != undefined &&
  //         name.match(regexElementId) != null
  //       )
  //         oldElementId = name.match(regexElementId)[0].match(regexNumber)[0];
  //       if (oldElementId != undefined && oldElementId != LastElementId) {
  //         LastElementId = oldElementId;
  //         publicElementId.val(publicElementId.val() * 1 + 1);
  //       }
  //       //find New ElementId

  //       //find New WidgetId
  //       if (
  //         name.match(regexWidgetId) != undefined &&
  //         name.match(regexWidgetId) != null
  //       )
  //         oldWidgetId = name.match(regexWidgetId)[0].match(regexNumber)[0];
  //       if (oldWidgetId != undefined && oldWidgetId != LastWidgetId) {
  //         LastWidgetId = oldWidgetId;
  //         publicWidgetId.val(publicWidgetId.val() * 1 + 1);
  //       }
  //       //find New WidgetId

  //       name = name.replace(
  //         "containerId_" + oldWapperId,
  //         "containerId_" + publicContainerId.val()
  //       );
  //       name = name.replace(
  //         "elementId_" + oldElementId,
  //         "elementId_" + publicElementId.val()
  //       );
  //       name = name.replace(
  //         "widgetId_" + oldWidgetId,
  //         "widgetId_" + publicWidgetId.val()
  //       );

  //       jQuery(this).attr("name", name);
  //       jQuery(this).attr("data-name", name);

  //       if (name.indexOf("][wapperId]") > 1)
  //         jQuery(this).val(publicContainerId.val());
  //       if (name.indexOf("][elementId]") > 1)
  //         jQuery(this).val(publicElementId.val());
  //       if (name.indexOf("][widgetId]") > 1)
  //         jQuery(this).val(publicWidgetId.val());

  //       if (name == "data-containerId")
  //         jQuery(this).attr("data-containerId", publicContainerId.val());
  //       if (name == "data-elementId")
  //         jQuery(this).attr("data-elementId", publicElementId.val());
  //       if (name == "data-widgetId")
  //         jQuery(this).attr("data-widgetId", publicWidgetId.val());
  //     }
  //   });

  //   tabIdCoreted(clone, publicWidgetId.val(), "widgetId_" + oldWidgetId, "widgetId");

  //   myClosest.after(clone);
  // }
  // var CloneElement = function (jQuery_this) {
  //   publicElementId.val(publicElementId.val() * 1 + 1);
  //   var myClosest = jQuery_this.closest(".mfn-wrap");
  //   var clone = myClosest.clone(true);

  //   var containerId = clone.attr("data-containerId");
  //   var oldElementId = clone.attr("data-elementId");
  //   var oldWidgetId = 0;

  //   clone.attr("data-containerId", containerId);
  //   clone.attr("data-elementId", publicElementId.val());

  //   var LastWidgetId = 0;
  //   clone.find("input, select, textarea").each(function () {
  //     var name = jQuery(this).attr("data-name") + "";
  //     if (name != undefined && name != "undefined") {
  //       //find New WidgetId
  //       if (
  //         name.match(regexWidgetId) != undefined &&
  //         name.match(regexWidgetId) != null
  //       )
  //         oldWidgetId = name.match(regexWidgetId)[0].match(regexNumber)[0];
  //       if (oldWidgetId != undefined && oldWidgetId != LastWidgetId) {
  //         LastWidgetId = oldWidgetId;
  //         publicWidgetId.val(publicWidgetId.val() * 1 + 1);
  //       }
  //       //find New WidgetId
  //       name = name.replace(
  //         "elementId_" + oldElementId,
  //         "elementId_" + publicElementId.val()
  //       );
  //       name = name.replace(
  //         "widgetId_" + oldWidgetId,
  //         "widgetId_" + publicWidgetId.val()
  //       );

  //       jQuery(this).attr("name", name);
  //       jQuery(this).attr("data-name", name);

  //       if (name.indexOf("][elementId]") > 1) jQuery(this).val(publicElementId.val());
  //       if (name.indexOf("][widgetId]") > 1)
  //         jQuery(this).val(publicWidgetId.val());

  //       if (name == "data-containerId")
  //         jQuery(this).attr("data-containerId", containerId);
  //       if (name == "data-elementId")
  //         jQuery(this).attr("data-elementId", publicElementId.val());
  //       if (name == "data-widgetId")
  //         jQuery(this).attr("data-widgetId", publicWidgetId.val());
  //     }

  //     tabIdCoreted(clone, publicWidgetId.val(), "widgetId_" + oldWidgetId, "widgetId");
  //   });
  //   clone
  //     .find("[data-elementId='" + oldElementId + "']")
  //     .attr("data-elementId", publicElementId.val());
  //   clone
  //     .find("[data-widgetId='" + oldWidgetId + "']")
  //     .attr("data-widgetId", publicWidgetId.val());
  //   myClosest.after(clone);
  // }
  // var CloneWidgets = function (jQuery_this) {
  //   publicWidgetId.val(publicWidgetId.val() * 1 + 1);
  //   var widgetId = publicWidgetId.val();
  //   var myClosest = jQuery_this.closest(".mfn-element");
  //   var clone = myClosest.clone(true);
  //   var oldWidgetId = clone.attr("data-widgetId");

  //   clone.attr("data-widgetId", widgetId);

  //   clone.find("input, select, textarea").each(function () {
  //     var name = jQuery(this).attr("data-name") + "";
  //     if (name != undefined && name != "undefined") {
  //       name = name.replace("widgetId_" + oldWidgetId, "widgetId_" + widgetId);

  //       jQuery(this).attr("name", name);
  //       jQuery(this).attr("data-name", name);

  //       if (name.indexOf("][widgetId]") > 1) jQuery(this).val(widgetId);

  //       if (name == "data-widgetId")
  //         jQuery(this).attr("data-widgetId", widgetId);
  //     }
  //   });
  //   tabIdCoreted(clone, widgetId, "widgetId_" + oldWidgetId, "widgetId");
  //   myClosest.after(clone);
  // }

  // // Clone  Clone  Clone =======================================================


  // var funcJsonPageMaker = function () {
  //   var ret = makeJson_page();
  //   return ret;
  // }
  // var get = function (name) {
  //   if (
  //     (name = new RegExp("[?&]" + encodeURIComponent(name) + "=([^&]*)").exec(
  //       location.search
  //     ))
  //   )
  //     return decodeURIComponent(name[1]);
  //   return "";
  // }
  // var b64EncodeUnicode = function (str) {
  //   return Base64Encode(str);
  // }
  // var b64DecodeUnicode = function (str) {
  //   return Base64Decode(str);
  // }
  // var onMapMouseleaveHandler = function (event) {
  //   var that = $(this);
  //   that.on('click', onMapClickHandler);
  //   that.off('mouseleave', onMapMouseleaveHandler);
  //   that.find('iframe').css("pointer-events", "none");
  // }
  // var onMapClickHandler = function (event) {
  //   var that = $(this);
  //   that.off('click', onMapClickHandler);
  //   that.find('iframe').css("pointer-events", "auto");
  //   that.on('mouseleave', onMapMouseleaveHandler);
  // }
  // var loadPageSafe = function (id) {
  //   var dataDecode = JSON.parse(PageSafeList[id].PageJsonValue);
  //   loadPage(dataDecode);
  // }
  // var import_data = function () {
  //   $("#aaa").attr("id", "importCode");
  //   var myClone = $("#import_text").clone(true);
  //   $("#importCode").attr("id", "aaa");
  //   popupAlert(myClone, "/images/import.png", "درون ریزی");


  // }
  // var export_data = function () {
  //   $("#bbb").attr("id", "exportCode");
  //   var myClone = $("#export_text").clone(true);
  //   $("#exportCode").attr("id", "bbb");
  //   popupAlert(myClone, "/images/export.png", "برون ریزی");

  //   $(window).scroll(function () {
  //     if ($(this).scrollTop() > 0) {
  //       $(".close-exp").fadeOut();
  //       $(".close-exp").fadeOut();
  //     } else {

  //     }
  //   });

  //   $(".boroon").click(function () {
  //     $("#import_text").select();
  //     document.execCommand("copy");
  //     $(".close-exp").fadeIn();
  //   });
  // }
  // var ExportCodeDb = function (ExportNumber) {
  //   var model = {
  //     LinkpageId: window.id,
  //     ExportNumber: ExportNumber,
  //     ExportCod: $('#exportCode').val()
  //   };
  //   $.ajax({
  //     type: "Post",
  //     //async: false,
  //     data: JSON.stringify(model),
  //     dataType: "json",
  //     contentType: "application/json",
  //     url: configPathMvcCms + "HtmlBuilder/EditHtmlExport",

  //     success: function (response) {
  //       var introSteps = [];
  //       if (response.IsSuccess) {
  //         popupAlert("ذخیره سازی با موفقیت انجام شد ", "");
  //       }

  //     },
  //     error: function (data, errCode, c, d) {
  //       popupAlert("errorin export", "");
  //     }
  //   });

  // }

  // var ImportCodeDb = function (ExportNumber) {

  //   $.ajax({
  //     type: "GET",
  //     url: configPathApiCms + "cmspage/GetViewModel/" + window.id,
  //     success: function (msg) {
  //       if (msg.IsSuccess) {
  //         switch (ExportNumber) {
  //           case 1:
  //             if (msg.Item.Export1 !== null && msg.Item.Export1.length > 0) {
  //               $("#importCode").val(msg.Item.Export1);
  //             }
  //             else {
  //               $("#importCode").val("مقداری یافت نشد");
  //             }
  //             break;
  //           case 2:
  //             if (msg.Item.Export2 !== null && msg.Item.Export2.length > 0) {
  //               $("#importCode").val(msg.Item.Export2);
  //             }
  //             else {
  //               $("#importCode").val("مقداری یافت نشد");
  //             }
  //             break;
  //           case 3:
  //             if (msg.Item.Export3 !== null && msg.Item.Export3.length > 0) {
  //               $("#importCode").val(msg.Item.Export3);
  //             }
  //             else {
  //               $("#importCode").val("مقداری یافت نشد");
  //             }
  //             break;
  //         }

  //       }
  //     },
  //     error: function (data, errCode, c, d) {
  //       popupAlert("errorin import", "");
  //     }
  //   });

  // }
  // var guid = function () {
  //   function s4() {
  //     return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  //   }
  //   return 'n' + s4() + s4() + s4() + s4() + s4();
  // }
  // var makeJson_page = function () {
  //   $("#formBouilder").find("input").each(function (i, opt) {
  //     if ($(this).is("[type=checkbox]")) {
  //       if ($(this).val() == "1" || $(this).attr("value") == "1" || $(this).prop("checked"))
  //         $(this).attr("value", "true");
  //     }
  //   });
  //   $("#formBouilderSetting").find("input").each(function (i, opt) {
  //     if ($(this).is("[type=checkbox]")) {
  //       if ($(this).val() == "1" || $(this).attr("value") == "1" || $(this).prop("checked"))
  //         $(this).attr("value", "true");
  //     }
  //   });
  //   var dataForm = $("#formBouilder").serializeForm();
  //   var dataFormSetting = $("#formBouilderSetting").serializeForm();


  //   if (jQuery.isEmptyObject(dataForm))
  //     return '';

  //   return {
  //     Setting: dataFormSetting,
  //     Containers: makeJson_container(dataForm)
  //   };
  // }
  // var makeJson_container = function (formData) {
  //   var container = new Array();
  //   $.each(formData.mfn_container, function (i, v) {
  //     container.push({
  //       Id: v.containerId,
  //       Guid: guid(),
  //       WidgetTitle: v.WidgetTitle,
  //       Setting: v,
  //       Rows: makeJson_row(formData, v.containerId)
  //     });
  //   });
  //   return container;
  // }
  // var makeJson_row = function (formData, containerId) {
  //   var element = new Array();
  //   if (formData.mfn_element === undefined) return null;

  //   if (
  //     typeof formData.mfn_element["containerId_" + containerId] == "undefined" ||
  //     formData.mfn_element["containerId_" + containerId] instanceof Array
  //   ) {
  //     return null;
  //   }
  //   $.each(formData.mfn_element["containerId_" + containerId], function (i, v) {
  //     element.push({
  //       Id: v.elementId,
  //       Guid: guid(),
  //       ElementType: v.type,
  //       Size: v.Size,
  //       Setting: v,
  //       Widgets: makeJson_widget(formData, v.containerId, v.elementId)
  //     });
  //   });

  //   return element;
  // }
  // var makeJson_widget = function (formData, containerId, elementId) {
  //   var widget = new Array();
  //   if (formData.mfn_widgets === undefined) return null;

  //   if (
  //     typeof formData.mfn_widgets["containerId_" + containerId] == "undefined" ||
  //     formData.mfn_widgets["containerId_" + containerId] instanceof Array
  //   ) {
  //     return null;
  //   }
  //   if (
  //     typeof formData.mfn_widgets["containerId_" + containerId][
  //     "elementId_" + elementId
  //     ] == "undefined" ||
  //     formData.mfn_widgets["containerId_" + containerId][
  //     "elementId_" + elementId
  //     ] instanceof Array
  //   ) {
  //     return null;
  //   }

  //   $.each(
  //     formData.mfn_widgets["containerId_" + containerId]["elementId_" + elementId],
  //     function (i, v) {
  //       widget.push({
  //         FullSetting: JSON.stringify(v),
  //         Id: v.widgetId,
  //         Guid: guid(),
  //         Type: v.type,
  //         WidgetTitle: v.WidgetTitle,
  //         Size: v.Size,
  //         Setting: {
  //           RenderModule: v.RenderModuleName,
  //           RenderCshtml: v.RenderWidgetCshtml,
  //           RenderClass: v.RenderWidgetCsharpClass,
  //           WidgetVersion: v.WidgetVersion,
  //           ContentSetting: JSON.stringify(v.ContentSetting)
  //         }
  //       });
  //     }
  //   );

  //   return widget;
  // }
  // var getChildren = function (obj, Title) {
  //   if (obj == undefined || obj.length === 0) return [];
  //   var node = new Array();
  //   $.each(obj, function (index, key) {
  //     node.push({
  //       name: key["Title"],
  //       _id: key.Id,
  //       children: getChildren(key.Children)
  //     });
  //   });
  //   return node;
  // };
  // var getWidgetVer = function (src) {
  //   src = src.substring(src.lastIndexOf("/") + 1);
  //   if (src.indexOf("_") > 0) {
  //     src = src.substring(src.indexOf("_") + 1);
  //     src = src.substring(0, src.lastIndexOf("."));
  //   } else {
  //     src = "";
  //   }
  //   return src;
  // };
  // var FileMangerList = function (id, extension) {
  //   var ret =
  //     '<ul class="jqueryFileTree" style="margin-top:10px;font-family:\'IRANSans\';"><li class="file ext_no_file"><a rel="">بدون عکس</a></li>';
  //   //#help# برای دسته بندی
  //   var FindCat = false;
  //   $.each(CmsFileCategoryCash, function (index, item) {
  //     if (item.id == id + "") {
  //       $.each(item.value, function (index, element) {
  //         ret +=
  //           '<li class="directory collapsed"><a rel="' +
  //           element.Id +
  //           '">' +
  //           element.Title +
  //           "</a></li>";
  //       });
  //       FindCat = true;
  //     }
  //   });
  //   if (!FindCat) {
  //     var Filter_value = {
  //       PropertyName: "LinkParentId",
  //       value: id,
  //       SearchType: 0,
  //       IntValueForceNullSearch: true
  //     };
  //     var filterModel = {};
  //     filterModel.RowPerPage = 100;
  //     filterModel.Filters = null;
  //     filterModel.Filters = [];
  //     filterModel.Filters.push(Filter_value);
  //     $.ajax({
  //       type: "Post",
  //       //async: false,
  //       data: JSON.stringify(filterModel),
  //       dataType: "json",
  //       contentType: "application/json",
  //       url: configPathApiCms + "FileCategory/getall",
  //       success: function (request) {
  //         CmsFileCategoryCash.push({ id: id + "", value: request.ListItems });
  //         $.each(request.ListItems, function (index, element) {
  //           ret +=
  //             '<li class="directory collapsed"><a rel="' +
  //             element.Id +
  //             '">' +
  //             element.Title +
  //             "</a></li>";
  //         });
  //       },
  //       error: function (msg) {
  //         console.log(msg);
  //       }
  //     });
  //   }
  //   //#help# برای دسته بندی

  //   //#help# برای فایل ها
  //   var findfiles = false;
  //   $.each(CmsFileCash, function (index, item) {
  //     if (item.id == id + "") {
  //       $.each(item.value, function (index, element) {
  //         var ext_ = "";
  //         if (element.Extension) ext_ = element.Extension.toLowerCase();
  //         if (
  //           extension == undefined ||
  //           extension.length == 0 ||
  //           extension.indexOf(ext_) >= 0
  //         ) {
  //           ret +=
  //             '<li class="file ext_' +
  //             ext_ +
  //             '"><a rel="' +
  //             element.FileSrc +
  //             "." +
  //             element.Extension +
  //             ' ">' +
  //             element.FileName +
  //             "</a></li>";
  //         }
  //       });
  //       findfiles = true;
  //     }
  //   });
  //   if (!findfiles) {
  //     var Filter_value = {
  //       PropertyName: "LinkCategoryId",
  //       value: id,
  //       SearchType: 0,
  //       IntValueForceNullSearch: true
  //     };
  //     var filterModel = {};
  //     filterModel.RowPerPage = 100;
  //     filterModel.Filters = null;
  //     filterModel.Filters = [];
  //     filterModel.Filters.push(Filter_value);
  //     $.ajax({
  //       type: "Post",
  //       //async: false,
  //       data: JSON.stringify(filterModel),
  //       dataType: "json",
  //       contentType: "application/json",
  //       url: configPathApiCms + "FileContent/getall",
  //       success: function (request2) {
  //         CmsFileCash.push({ id: id + "", value: request2.ListItems });
  //         $.each(request2.ListItems, function (index, element) {
  //           var ext_ = "";
  //           if (element.Extension) ext_ = element.Extension.toLowerCase();
  //           if (
  //             extension == undefined ||
  //             extension.length == 0 ||
  //             extension.indexOf(ext_) >= 0
  //           ) {
  //             ret +=
  //               '<li class="file ext_' +
  //               ext_ +
  //               '"><a rel="' +
  //               element.FileSrc +
  //               "." +
  //               element.Extension +
  //               ' ">' +
  //               element.FileName +
  //               "</a></li>";
  //           }
  //         });
  //         ret = ret + "</ul>";
  //       },
  //       error: function (msg) {
  //         console.log(msg);
  //       }
  //     });
  //   }
  //   return ret;
  // };
  // var runFileManger = function (el) {
  //   el.find(".treeFile").each(function () {
  //     $(this).remove();
  //   });
  //   el.find(".regular-file").each(function () {
  //     var idGuid = guid();
  //     $('<div class="treeFile" id="' + idGuid + '" ></div>').insertAfter(this);
  //     $(
  //       '<div class="treeFile image" id="image' + idGuid + '" ></div>'
  //     ).insertAfter(this);
  //     runFileMangerEach($("#" + idGuid), $("#image" + idGuid), this);
  //   });
  // };
  // var runFileMangerEach = function (obj, onclickViewImage, onclick) {
  //   if ($(onclick).val() != undefined && $(onclick).val() != "")
  //     $(onclickViewImage).append(
  //       '<img height=100 border="1" class="img-rounded" style="box-shadow: 6px 6px 7px #a9a9a9;" src="' + window.ConfigRouteFileStorage +
  //       $(onclick).val() +
  //       '"/>'
  //     );
  //   var extensionStr = $(onclick).attr("data-extension");
  //   var extension = [];
  //   if (extensionStr != undefined && extensionStr != "")
  //     extension = extensionStr.toLowerCase().split(",");
  //   obj.fileTree(
  //     {
  //       script: function (id) {
  //         if (id.dir === "/") {
  //           return FileMangerList(undefined, extension);
  //         } else {
  //           return FileMangerList(id.dir, extension);
  //         }
  //       },
  //       expandSpeed: 500,
  //       collapseSpeed: 500,
  //       multiFolder: false
  //     },
  //     function (file) {
  //       $(onclick).val(file);
  //       $(onclickViewImage).empty();
  //       $(onclickViewImage).append(
  //         '<img width=100 height=100 border="1" src="' + window.ConfigRouteFileStorage + file + '"/>'
  //       );
  //     }
  //   );
  // };
  // var runWidgetHelper = function (el) {
  //   var RenderModuleName = el.attr("data-RenderModuleName") + ""; // 'ModuleCore';
  //   var RenderModuleCshtml = el.attr("data-RenderModuleCshtml") + ""; // 'ModulePublic';
  //   var RenderWidgetName = el.attr("data-RenderWidgetName") + ""; // 'ModuleCore';
  //   var RenderWidgetCshtml = el.attr("data-RenderWidgetCshtml") + ""; // 'CoreHtmlAccordion';
  //   var RenderWidgetCsharpClass = el.attr("data-RenderWidgetCsharpClass") + ""; //'CoreHtmlAccordion';

  //   if (RenderWidgetCshtml != "undefined" && RenderWidgetCshtml.length > 0) RenderWidgetCsharpClass = RenderWidgetCshtml;
  //   if (RenderModuleName_last == RenderModuleName && RenderWidgetCsharpClass_last == RenderWidgetCsharpClass)
  //     return;

  //   RenderModuleName_last = RenderModuleName;
  //   RenderWidgetCsharpClass_last = RenderWidgetCsharpClass;

  //   var model = {
  //     RenderTemplate: window.theme,
  //     RenderModuleName: RenderModuleName,
  //     RenderModuleCshtml: RenderModuleCshtml,
  //     RenderWidgetName: RenderWidgetName,
  //     RenderWidgetCshtml: RenderWidgetCshtml,
  //     RenderWidgetCsharpClass: RenderWidgetCsharpClass,
  //   };
  //   $.ajax({
  //     type: "Post",
  //     //async: false,
  //     data: JSON.stringify(model),
  //     dataType: "json",
  //     contentType: "application/json",
  //     url: configPathMvcCms + "HtmlBuilder/EditHtmlWidgetHelper/",
  //     success: function (request) {
  //       $(".mfn-popup-items-helper").html(request);
  //     },
  //     error: function (msg) {
  //       $(".mfn-popup-items-helper").html("....");
  //     }
  //   });
  // };
  // var runWidgetVersion = function (el) {
  //   el.find(".WidgetVersion").each(function () {
  //     $(this).remove();
  //   });

  //   var RenderTemplate = "";
  //   var RenderModuleName = "";
  //   var RenderModuleCshtml = "";
  //   var RenderWidgetName = "";
  //   var RenderWidgetCshtml = "";
  //   var RenderWidgetCsharpClass = "";
  //   var RenderWidgetVersion;

  //   el.find("input, select, textarea").each(function () {
  //     var name = jQuery(this).attr("data-name") + "";

  //     if (jQuery(this).attr("data-hide") + "" == "hide") jQuery(this).hide();

  //     if (name != undefined && name != "undefined") {
  //       if (name.indexOf("][RenderModuleName]") > 1) {
  //         RenderModuleName = jQuery(this).val();
  //         jQuery(this).hide();
  //       }

  //       if (name.indexOf("][RenderModuleCshtml]") > 1) {
  //         RenderModuleCshtml = jQuery(this).val();
  //         jQuery(this).hide();
  //       }

  //       if (name.indexOf("][RenderWidgetName]") > 1) {
  //         RenderWidgetName = jQuery(this).val();
  //         jQuery(this).hide();
  //       }
  //       if (name.indexOf("][RenderWidgetCshtml]") > 1) {
  //         RenderWidgetCshtml = jQuery(this).val();
  //         jQuery(this).hide();
  //       }
  //       if (name.indexOf("][RenderWidgetCsharpClass]") > 1) {
  //         RenderWidgetCsharpClass = jQuery(this).val();
  //         jQuery(this).hide();
  //       }

  //       if (name.indexOf("][WidgetVersion]") > 1) {
  //         RenderWidgetVersion = jQuery(this);
  //         jQuery(this).hide();
  //       }
  //     }
  //   });
  //   var idGuid = guid();
  //   //@help@ درصورت داشتن امکان ورژن بندی اجرا می شود
  //   if (RenderWidgetVersion) {
  //     $(
  //       '<div class="WidgetVersion col-xs-12" style="height: 300px;display: inline-flex;" data-hide="none" id="' + idGuid + '" ></div>'
  //     ).insertAfter(RenderWidgetVersion);

  //     var model = {
  //       RenderTemplate: window.theme,
  //       RenderModuleName: RenderModuleName,
  //       RenderModuleCshtml: RenderModuleCshtml,
  //       RenderWidgetName: RenderWidgetName,
  //       RenderWidgetCshtml: RenderWidgetCshtml,
  //       RenderWidgetCsharpClass: RenderWidgetCsharpClass,
  //     };
  //     if (RenderWidgetVersion.val() == "" || RenderWidgetVersion.val() == undefined)
  //       RenderWidgetVersion.val("1");

  //     $.ajax({
  //       type: "Post",
  //       //async: false,
  //       data: JSON.stringify(model),
  //       dataType: "json",
  //       contentType: "application/json",
  //       url: configPathMvcCms + "HtmlBuilder/EditHtmlWidgetInfo/",
  //       success: function (request) {
  //         var findWidgetVer = false;
  //         $.each(request, function (index, element) {
  //           if (getWidgetVer(element.image) == RenderWidgetVersion.val())
  //             findWidgetVer = true;
  //         });
  //         $.each(request, function (index, element) {
  //           var classAdd = "";
  //           if (getWidgetVer(element.image) == RenderWidgetVersion.val() || !findWidgetVer) {
  //             classAdd = "Selected";
  //             runShowInputByInfoFilter(el, element.info);
  //             findWidgetVer = true;
  //           }
  //           $("#" + idGuid).append('<div style="width:160px;height:180px;margin: 10px;"><img class="widgetVer imageWidgetInfo' + classAdd + '"  data-hide="none"   WidgetTitle="' + element.WidgetTitle + '"  info="' + element.info + '"  src="' + element.image + '" style="width:160px;height:100%;"/></div>');
  //         });
  //       },
  //       error: function (msg) {
  //         var myAlert = "خطا در دریافت اطلاعات لیست نمونه نمایش ها ";
  //         popupAlert(myAlert);
  //       }
  //     });
  //     el.find(".WidgetVersion").on("click", "a,img", function (e) {
  //       e.preventDefault();
  //       runShowInputByInfoFilter(el, $(this).attr("info"));
  //       var src = getWidgetVer($(this).attr("src"));
  //       el
  //         .find(".WidgetVersion")
  //         .find("img")
  //         .removeClass("imageWidgetInfoSelected")
  //         .addClass("imageWidgetInfo");
  //       $(this).removeClass("imageWidgetInfo").addClass("imageWidgetInfoSelected");
  //       RenderWidgetVersion.val(src);
  //     });
  //   }
  //   //@help@ درصورت داشتن امکان ورژن بندی اجرا می شود
  // };
  // var runShowInputByInfoFilter = function (el, info) {
  //   el.find("input, select, textarea").each(function () {
  //     var name = jQuery(this).attr("data-name") + "";
  //     var data_hide = jQuery(this).attr("data-hide") + "";
  //     if (
  //       name != undefined &&
  //       name != "undefined" &&
  //       name.indexOf("mfn-widgets") >= 0
  //     ) {
  //       name = name.toLowerCase();
  //       if (data_hide == "" || data_hide == "undefined") {
  //         if (!WidgetfindInInfo(name, info)) {
  //           $(this).parents(".widgetInputField:first").fadeOut(5);
  //         } else {
  //           $(this).parents(".widgetInputField:first").fadeIn(5);
  //         }
  //       }
  //     }
  //   });
  // };
  // var WidgetfindInInfo = function (name, info) {
  //   if (info == undefined || info == "all") return true;
  //   var infos = info.toLowerCase().split(",");
  //   var s1 = name.substring(0, name.lastIndexOf("]"));
  //   var s2 = s1.substring(name.lastIndexOf("[") + 1);
  //   if (infos.indexOf(s2) >= 0) return true;
  //   return false;
  // };
  // var runWidgetCategoryOrContent = function (el, Elemnt) {
  //   //var RenderWidgetCat;
  //   var ContentSettingElemnt;
  //   var ControlerName = Elemnt.attr("data-Controler");
  //   var ControlerFilter = [];
  //   var contentFilterValueStr = Elemnt.attr("data-ControlerFilter");
  //   if (
  //     contentFilterValueStr != undefined &&
  //     contentFilterValueStr != "" &&
  //     contentFilterValueStr != null
  //   )
  //     var ControlerFilter = JSON.parse(contentFilterValueStr);
  //   var ControlerDateTitle = Elemnt.attr("data-WidgetTitle");

  //   var name = Elemnt.attr("data-name") + "";
  //   if (name != undefined && name != "undefined") {
  //     if (name.lastIndexOf("][") > 0 && name.lastIndexOf("]") > 0)
  //       ContentSettingElemnt = name.substring(
  //         name.lastIndexOf("][") + 2,
  //         name.lastIndexOf("]")
  //       );
  //   }
  //   var ElemntVal = Elemnt.val();
  //   if (ContentSettingElemnt != undefined) {
  //     var CatTree = el.find("div.tree_box." + ContentSettingElemnt);
  //     if (ControlerDateTitle == undefined || ControlerDateTitle == "")
  //       ControlerDateTitle = "WidgetTitle";

  //     var defaltFilter = [
  //       {
  //         PropertyName: "LinkParentId",
  //         SearchType: 0,
  //         value: null,
  //         IntValueForceNullSearch: true
  //       }
  //     ];
  //     if (ControlerFilter) defaltFilter = ControlerFilter;

  //     if (ControlerName != undefined) {
  //       var model = {
  //         CurrentPageNumber: 1,
  //         SortColumn: "Id",
  //         SortType: 1,
  //         RowPerPage: 500,
  //         Filters: defaltFilter
  //       };
  //       $.ajax({
  //         type: "Post",
  //         //async: false,
  //         url: configPathApiCms + ControlerName + "/getall",
  //         data: JSON.stringify(model),
  //         dataType: "json",
  //         contentType: "application/json",
  //         success: function (msg) {
  //           var data = new Array();
  //           data.push({
  //             name: "...",
  //             _id: 0,
  //             children: getChildren(msg.ListItems, ControlerDateTitle)
  //           });

  //           var $tree = CatTree.tree({
  //             data: data,
  //             rtl: true,
  //             autoOpen: false
  //           });

  //           CatTree.bind("tree.click", function (event) {
  //             var node = event.node;
  //             Elemnt.val(node._id);
  //           });

  //           if (Elemnt.val()) {
  //             var node = $tree.tree(
  //               "getNodesByProperty",
  //               "_id",
  //               Elemnt.val()
  //             );
  //             if (node)
  //               $tree.tree("selectNode", node[0]);
  //           }
  //         },
  //         error: function (msg) {
  //           console.log(msg);
  //           var myAlert = "خطا در بارگذاری";
  //           popupAlert(myAlert, "", "خطا");
  //         }
  //       });
  //     }
  //   }
  // };
  // var translate = function (jsdata) {
  //   $("[tkey]").each(function (index) {
  //     var this_ = $(this);
  //     var strTr = jsdata[this_.attr("tkey").toLowerCase()];
  //     if (!strTr || strTr == '')
  //       strTr = this_.attr("tkey");
  //     if (this_.is("l") || this_.is("option"))
  //       this_.html(strTr);
  //     if (this_.attr("placeholder") == this_.attr("tkey"))
  //       this_.attr("placeholder", strTr);
  //     if (this_.attr("data-WidgetTitle") == this_.attr("tkey"))
  //       this_.attr("data-WidgetTitle", strTr);
  //     if (this_.attr("data-search") == this_.attr("tkey"))
  //       this_.attr("data-search", strTr);
  //   });

  // };
  // //scroll
  // $(window).scroll(function () {
  //   if ($(document).scrollTop() > 50) {
  //     $(".navbar-fixed-top").addClass("shrink-html");
  //   } else {
  //     $(".navbar-fixed-top").removeClass("shrink-html");
  //   }
  // });
  // //در آخر
  // var onLoadPageRun = function () {

  //   desktop = jQuery("#mfn-desk");
  //   if (!desktop.length) return false; // Exit if Builder HTML does not exist

  //   publicContainerId = jQuery("#mfn-publicContainer-id");
  //   publicElementId = jQuery("#mfn-publicElement-id");
  //   publicWidgetId = jQuery("#mfn-publicWidget-id");

  //   // Sortable Init ---------------------------------
  //   sortableDesk(desktop);
  //   sortableContainer(desktop.find(".mfn-sortable-container"));
  //   sortableElement(desktop.find(".mfn-sortable-element"));


  //   $(".menu-toggle").click(function (e) {
  //     e.preventDefault();
  //     $("#sidebar-container").toggleClass("active");
  //     $(".menu-toggle > .fa-bars, .menu-toggle > .fa-times").toggleClass("fa-bars fa-times");
  //     $(this).toggleClass("active");
  //     if ($(this).hasClass("active")) {
  //       LoadLogPageSafe();
  //     }
  //   });
  //   $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
  //     if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
  //       var target = $(this.hash);
  //       target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
  //       if (target.length) {
  //         $('html, body').animate({
  //           scrollTop: target.offset().top
  //         }, 1000, "easeInOutExpo");
  //         return false;
  //       }
  //     }
  //   });
  //   $('#sidebar-container .js-scroll-trigger').click(function () {
  //     $("#sidebar-container").removeClass("active");
  //     $(".menu-toggle").removeClass("active");
  //     $(".menu-toggle > .fa-bars, .menu-toggle > .fa-times").toggleClass("fa-bars fa-times");
  //   });
  //   $('a.dropdown-toggle').on('click', function (e) {
  //     var $el = $(this);
  //     var $parent = $(this).offsetParent(".dropdown-menu");
  //     $(this).parent("li").toggleClass('open');

  //     if (!$parent.parent().hasClass('nav')) {
  //       $el.next().css({ "top": $el[0].offsetTop, "left": $parent.outerWidth() - 0 });
  //     }

  //     $('.nav li.open').not($(this).parents("li")).removeClass("open");

  //     return false;
  //   });

  //   var onMapMouseleaveHandler = function (event) {
  //     var that = $(this);
  //     that.on('click', onMapClickHandler);
  //     that.off('mouseleave', onMapMouseleaveHandler);
  //     that.find('iframe').css("pointer-events", "none");
  //   }
  //   var onMapClickHandler = function (event) {
  //     var that = $(this);
  //     that.off('click', onMapClickHandler);
  //     that.find('iframe').css("pointer-events", "auto");
  //     that.on('mouseleave', onMapMouseleaveHandler);
  //   }

  //   $(".mfn-container-preview-lg-btn").click(function () {
  //     previewIndex = 1;
  //     previewIndexSet();
  //   });
  //   $(".mfn-container-preview-md-btn").click(function () {
  //     previewIndex = 2;
  //     previewIndexSet();
  //   });
  //   $(".mfn-container-preview-sm-btn").click(function () {
  //     previewIndex = 3;
  //     previewIndexSet();
  //   });
  //   $(".mfn-container-preview-xs-btn").click(function () {
  //     previewIndex = 4;
  //     previewIndexSet();
  //   });
  //   // Container | Add -----------------------------------------------
  //   jQuery(".mfn-container-add-btn").click(function () {
  //     var clone = jQuery("#mfn-container .mfn-row").clone(true);
  //     BuildContainer(jQuery(this), clone);
  //   });
  //   // Container | Load -----------------------------------------------

  //   jQuery(".mfn-container-load-btn").click(function () {
  //     onLoadDataRun("");
  //   });
  //   jQuery(".mfn-container-load-admin-value-btn").click(function () {
  //     onLoadDataRun("admin");
  //   });
  //   jQuery(".mfn-container-clean-btn").click(function () {
  //     var IsDelete = confirm("آیا می خواهید محتوا حذف شود؟");
  //     if (IsDelete == true) {
  //       $("#mfn-desk").empty();
  //       myAlert = "حذف محتوا با موفقیت انجام شد .";
  //       popupAlert(myAlert, "/images/delete-big.jpg", "حذف");
  //     }
  //   });
  //   //#help// Load from Safe  Log
  //   jQuery(".mfn-container-import-data").click(function () {
  //     var dataImport = $("#importCode").val();
  //     if (dataImport.length === 0 || !dataImport.trim()) {
  //       $("#popupAlertMessage").css("color:red");
  //       popupAlert("کد درون ریزی استاندارد نمی باشد", "/images/import.png", "درون ریزی");
  //       return;
  //     }

  //     try {
  //       var dataDecode = Base64.decode(dataImport);
  //       loadPage(dataDecode);
  //       $("#popupAlertMessage").css("color:green");
  //       popupAlert("درون ریزی انجام شد", "/images/import.png", "درون ریزی");
  //     }
  //     catch (err) {

  //       $("#popupAlertMessage").css("color:red");
  //       popupAlert("کد درون ریزی استاندارد نمی باشد", "/images/import.png", "درون ریزی");
  //     }

  //   });

  //   // Container | Clone ---------------------------------------------
  //   jQuery(".mfn-row .mfn-container-clone").click(function () {
  //     CloneContainer(jQuery(this));
  //     var dataDecode = JSON.parse(funcJsonPageMaker());
  //     loadPage(dataDecode);
  //   });
  //   // Element | Clone ---------------------------------------------
  //   jQuery(".mfn-wrap .mfn-element-clone").click(function () {
  //     CloneElement(jQuery(this));
  //     var dataDecode = JSON.parse(funcJsonPageMaker());
  //     loadPage(dataDecode);
  //   });
  //   // Widget | Clone ---------------------------------------------
  //   jQuery(".mfn-widget .mfn-widget-clone").click(function () {
  //     CloneWidgets(jQuery(this));
  //     var dataDecode = JSON.parse(funcJsonPageMaker());
  //     loadPage(dataDecode);
  //   });
  //   // Container | Show/Hide --------------------------------------------
  //   jQuery(".mfn-element-hide").click(function () {
  //     var item = jQuery(this).closest(".mfn-element");

  //     if (item.hasClass("hide")) {
  //       // Show
  //       jQuery(this)
  //         .removeClass("dashicons-hidden")
  //         .addClass("dashicons-visibility");
  //       item.removeClass("hide").css("opacity", 1);

  //       item.find('tr.hidden input[name="mfn-container[hide][]"]').val(0);
  //     } else {
  //       // Hide
  //       jQuery(this)
  //         .removeClass("dashicons-visibility")
  //         .addClass("dashicons-hidden");
  //       item.addClass("hide");

  //       item.find('tr.hidden input[name="mfn-container[hide][]"]').val(1);
  //     }
  //   });
  //   // Element =======================================================
  //   // Element | Add ---------------------------------------------------
  //   jQuery(".mfn-add-wrap").click(function () {
  //     var clone = jQuery("#mfn-element .mfn-wrap").clone(true);
  //     BuildElementWidgetContainer(jQuery(this), clone);
  //   });
  //   // Widget =======================================================
  //   var clicked = false;
  //   // Popup | Open -----------------------------------------
  //   jQuery(".mfn-add-item").click(function () {
  //     // disable background content scrolling & dragging
  //     jQuery("body").addClass("mfn-popup-open");
  //     jQuery("#mfn-content").find(".ui-sortable").sortable("disable");

  //     jQuery("#mfn-widget-add").fadeIn(300);
  //     clicked = jQuery(this).closest(".mfn-wrap");
  //     jQuery("#mfn-widget-add").find(".mfn-popup-tabs li:first").addClass("active");
  //   });
  //   // Widget Popup | Close -----------------------------------------
  //   jQuery("#mfn-widget-add .mfn-ph-close").click(function () {
  //     // enable background content scrolling & dragging
  //     jQuery("body").removeClass("mfn-popup-open");
  //     jQuery("#mfn-content").find(".ui-sortable").sortable("enable");

  //     jQuery("#mfn-widget-add").fadeOut(300);
  //     clicked = false;
  //   });
  //   // Widget | Filters ----------------------------------------
  //   jQuery("#mfn-widget-add .mfn-popup-tabs li").click(function () {
  //     var filter = jQuery(this).attr("data-filter");
  //     var items = jQuery(this)
  //       .closest(".mfn-popup-content")
  //       .find(".mfn-popup-items");

  //     // search | clear
  //     jQuery("#mfn-widget-add .mfn-search-item").val("");

  //     jQuery(this).addClass("active").siblings().removeClass("active");

  //     if (filter == "*") {
  //       items.find("li").show();
  //     } else {
  //       items.find("li.category-" + filter).show();
  //       items.find("li").not(".category-" + filter).hide();
  //     }
  //   });
  //   // Widget | Search ----------------------------------------
  //   jQuery("#mfn-widget-add .mfn-search-item").on("keyup", function () {
  //     var filter = jQuery(this).val().toLowerCase();
  //     var items = jQuery(this)
  //       .closest(".mfn-popup-content")
  //       .find(".mfn-popup-items");

  //     if (filter.length) {
  //       filter = filter.toLowerCase();

  //       var attr = "";
  //       var childTitle = "";
  //       $.each(items.find("li"), function (index, item) {
  //         if ($(this).attr("data-search"))
  //           attr = $(this).attr("data-search").toLowerCase();
  //         childTitle = $(".WidgetTitle:first-child", $(this)).html();

  //         if (attr.indexOf(filter) >= 0 || childTitle.indexOf(filter) >= 0) {
  //           $(this).show();
  //         } else {
  //           $(this).hide();
  //         }
  //       });

  //       // tabs | remove active
  //       jQuery("#mfn-widget-add .mfn-popup-tabs li").removeClass("active");
  //     } else {
  //       items.find("li").show();

  //       // tabs | active first
  //       jQuery("#mfn-widget-add .mfn-popup-tabs li:first").addClass("active");
  //     }
  //   });
  //   // Widget | Add --------------------------------------------
  //   jQuery("#mfn-widget-add .mfn-popup-items li a").click(function () {
  //     var item = jQuery(this).attr("data-type");
  //     var clone = jQuery("#mfn-widgets")
  //       .find("div.mfn-widget-" + item)
  //       .clone(this);
  //     var jQueryThis = jQuery(clicked); //.closest('.mfn-row');
  //     BuildWidge(jQueryThis, clone, item);
  //   });
  //   // widget | Resize ++ -------------------------------------
  //   jQuery(".mfn-widget-size-inc").click(function () {
  //     var el = jQuery(this).closest(".mfn-element");
  //     var el_type = el.find(".mfn-widget-type").first().val();
  //     var el_sizes = sizeListItems[el_type];
  //     if (el_sizes == undefined) el_sizes = sizeListItems["default"];

  //     var newSize = "";
  //     var existSize = dataSizeGet(el, ".mfn-widget-size");
  //     var indexOld = el_sizes.indexOf(existSize);
  //     if (indexOld != undefined) {
  //       newSize = el_sizes[indexOld + 1];
  //     }
  //     if ((newSize == "" || newSize === undefined) && el_sizes.length > 0)
  //       newSize = el_sizes[el_sizes.length - 1];

  //     var sizeListUpdated = widgetDataSizeSet(el, ".mfn-widget-size", newSize);
  //     el.find(".mfn-widget-desc").first().html(descDataSizeSet(sizeListUpdated));
  //     el.find("input[name*='mfn-widgets['][name*='][Size]']").val(sizeListUpdated);
  //   });
  //   // widget | Resize -- -------------------------------------
  //   jQuery(".mfn-widget-size-dec").click(function () {
  //     var el = jQuery(this).closest(".mfn-element");
  //     var el_type = el.find(".mfn-widget-type").first().val();
  //     var el_sizes = sizeListItems[el_type];
  //     if (el_sizes == undefined) el_sizes = sizeListItems["default"];

  //     var newSize = "";
  //     var existSize = dataSizeGet(el, ".mfn-widget-size");
  //     var indexOld = el_sizes.indexOf(existSize);
  //     if (indexOld != undefined) {
  //       newSize = el_sizes[indexOld - 1];
  //     }

  //     if ((newSize == "" || newSize === undefined) && el_sizes.length > 0)
  //       newSize = el_sizes[0];
  //     var sizeListUpdated = widgetDataSizeSet(el, ".mfn-widget-size", newSize);
  //     el.find(".mfn-widget-desc").first().html(descDataSizeSet(sizeListUpdated));
  //     el.find("input[name*='mfn-widgets['][name*='][Size]']").val(sizeListUpdated);
  //   });
  //   // Element =======================================================
  //   // Element | Resize ++ -------------------------------------
  //   jQuery(".mfn-element-size-inc").click(function () {
  //     var el = jQuery(this).closest(".mfn-element");
  //     var el_type = "wrap";
  //     var el_sizes = sizeListItems[el_type];
  //     if (el_sizes == undefined) el_sizes = sizeListItems["default"];


  //     var newSize = "";
  //     var existSize = dataSizeGet(el, ".mfn-element-size");
  //     var indexOld = el_sizes.indexOf(existSize);
  //     if (indexOld != undefined) {
  //       newSize = el_sizes[indexOld + 1];
  //     }
  //     if ((newSize == "" || newSize === undefined) && el_sizes.length > 0)
  //       newSize = el_sizes[el_sizes.length - 1];

  //     var sizeListUpdated = widgetDataSizeSet(el, ".mfn-element-size", newSize);
  //     el.find(".mfn-element-desc").first().html(descDataSizeSet(sizeListUpdated));
  //     el.find("input[name*='mfn-element['][name*='][Size]']").val(sizeListUpdated);

  //   });
  //   // Element | Resize -- -------------------------------------
  //   jQuery(".mfn-element-size-dec").click(function () {
  //     var el = jQuery(this).closest(".mfn-element");
  //     var el_type = "wrap";
  //     var el_sizes = sizeListItems[el_type];
  //     if (el_sizes == undefined) el_sizes = sizeListItems["default"];

  //     var newSize = "";
  //     var existSize = dataSizeGet(el, ".mfn-element-size");
  //     var indexOld = el_sizes.indexOf(existSize);
  //     if (indexOld != undefined) {
  //       newSize = el_sizes[indexOld - 1];
  //     }

  //     if ((newSize == "" || newSize === undefined) && el_sizes.length > 0)
  //       newSize = el_sizes[0];
  //     var sizeListUpdated = widgetDataSizeSet(el, ".mfn-element-size", newSize);

  //     el.find(".mfn-element-desc").first().html(descDataSizeSet(sizeListUpdated));
  //     el.find("input[name*='mfn-element['][name*='][Size]']").val(sizeListUpdated);
  //   });
  //   // Element | CopySize -- -------------------------------------
  //   jQuery(".mfn-element-size-clone").click(function () {
  //     var el = jQuery(this).closest(".mfn-element");
  //     var el_type = "wrap";
  //     var el_sizes = sizeListItems[el_type];
  //     if (el_sizes == undefined) el_sizes = sizeListItems["default"];


  //     var newSize = "";
  //     var existSize = dataSizeGet(el, ".mfn-element-size");
  //     var indexOld = el_sizes.indexOf(existSize);
  //     if (indexOld != undefined) {
  //       newSize = el_sizes[indexOld];
  //     }
  //     if ((newSize == "" || newSize === undefined) && el_sizes.length > 0)
  //       newSize = el_sizes[el_sizes.length - 1];

  //     var sizeListUpdated = widgetDataSizeSet(el, ".mfn-element-size", newSize, true);
  //     el.find(".mfn-element-desc").first().html(descDataSizeSet(sizeListUpdated));
  //     el.find("input[name*='mfn-element['][name*='][Size]']").val(sizeListUpdated);
  //   });
  //   // Widget | CopySize -- -------------------------------------
  //   jQuery(".mfn-widget-size-clone").click(function () {
  //     var el = jQuery(this).closest(".mfn-widget");
  //     var el_type = "wrap";
  //     var el_sizes = sizeListItems[el_type];
  //     if (el_sizes == undefined) el_sizes = sizeListItems["default"];


  //     var newSize = "";
  //     var existSize = dataSizeGet(el, ".mfn-widget-size");
  //     var indexOld = el_sizes.indexOf(existSize);
  //     if (indexOld != undefined) {
  //       newSize = el_sizes[indexOld];
  //     }
  //     if ((newSize == "" || newSize === undefined) && el_sizes.length > 0)
  //       newSize = el_sizes[el_sizes.length - 1];

  //     var sizeListUpdated = widgetDataSizeSet(el, ".mfn-widget-size", newSize, true);
  //     el.find(".mfn-widget-desc").first().html(descDataSizeSet(sizeListUpdated));
  //     el.find("input[name*='mfn-widgets['][name*='][Size]']").val(sizeListUpdated);
  //   });
  //   // element | Delete --------------------------------------------
  //   jQuery(".mfn-element-delete").click(function () {
  //     var item = jQuery(this).closest(".mfn-element");

  //     if (
  //       confirm(
  //         "You are about to delete this element.\nIt can not be restored at a later time! Continue?"
  //       )
  //     ) {
  //       item.fadeOut(300, function () {
  //         jQuery(this).remove();
  //       });
  //     } else {
  //       return false;
  //     }
  //   });
  //   // Element | Edit --------------------------------------------
  //   jQuery(".mfn-element-edit").click(function () {
  //     var el = jQuery(this).closest(".mfn-element");

  //     tinymce.remove();

  //     el.find(".regular-color").each(function () {
  //       var this_ = $(this);
  //       //#help برای جلوگیری از اصافه شدن مجدد
  //       if (this_.attr('data-regular-color'))
  //         return;
  //       this_.attr('data-regular-color', 'run');
  //       //#help برای جلوگیری از اصافه شدن مجدد
  //       this_.spectrum({
  //         preferredFormat: "name",
  //         showInput: true,
  //         showPalette: true,
  //         showRenderInput: true
  //       });
  //     });
  //     el.find(".regular-file").each(function () {
  //       $(this).hide();
  //     });

  //     el.find(".regular-NumberPicker").each(function () {
  //       var this_ = $(this);
  //       if (this_.val() == "") this_.val(0);
  //       //#help برای جلوگیری از اصافه شدن مجدد
  //       if (this_.attr('data-regular-NumberPicker'))
  //         return;
  //       this_.attr('data-regular-NumberPicker', 'run');
  //       //#help برای جلوگیری از اصافه شدن مجدد
  //       this_.bootstrapNumber({
  //         upClass: "default",
  //         downClass: "default",
  //         center: true
  //       });
  //     });

  //     el.find("input[data-Controler]").each(function () {
  //       runWidgetCategoryOrContent(el, $(this));
  //     });


  //     runWidgetVersion(el);
  //     runFileManger(el);

  //     ////Load Category


  //     var meta = el.children(".mfn-element-meta");
  //     // disable background content scrolling & dragging
  //     jQuery("body").addClass("mfn-popup-open");
  //     jQuery("#mfn-content").find(".ui-sortable").sortable("disable");
  //     jQuery(this).closest(".mfn-row").addClass("editing");

  //     meta.wrap(
  //       '<div class="mfn-popup mfn-popup-item-edit"><div class="mfn-popup-inside"><div class="mfn-popup-content"></div></div></div>'
  //     );
  //     meta.show();

  //     var popup = meta.closest(".mfn-popup");

  //     var title = el.attr("data-Title");
  //     if (!title || title == "undefined")
  //       title = el.attr("data-WidgetTitle");

  //     popup
  //       .find(".mfn-popup-inside")
  //       .prepend(
  //         '<div class="mfn-popup-header"><div class="mfn-ph-left"><span class="mfn-ph-btn mfn-ph-desc">' +
  //         title +
  //         '</span></div><div class="mfn-ph-right"><a class="mfn-ph-btn mfn-ph-close dashicons dashicons-no" href="#"></a></div></div>'
  //       );

  //     popup
  //       .find(".mfn-popup-content")
  //       .append(
  //         '<div class="col-xs-12"><div class="mfn-popup-close mfn-ph-close" href="#">ذخیره تغییرات</div></div>'
  //       );


  //     tinymce.init({
  //       selector: ".editor",
  //       height: 500,
  //       plugins: [
  //         "advlist autolink lists link image charmap print preview anchor",
  //         "searchreplace visualblocks code fullscreen",
  //         "insertdatetime media table contextmenu paste code"
  //       ],
  //       toolbar:
  //         "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
  //       content_css: [
  //         "//www.tinymce.com/css/codepen.min.css"
  //       ]
  //     });

  //     popup.fadeIn(300);
  //   });
  //   // Element | Setting --------------------------------------------
  //   jQuery(".mfn-main-btn-setting").click(function () {
  //     var el = jQuery("#main-setting");
  //     el.show();

  //     el.find(".regular-color").each(function () {
  //       var this_ = $(this);
  //       //#help برای جلوگیری از اصافه شدن مجدد
  //       if (this_.attr('data-regular-color'))
  //         return;
  //       this_.attr('data-regular-color', 'run');
  //       //#help برای جلوگیری از اصافه شدن مجدد
  //       this_.spectrum({
  //         preferredFormat: "name",
  //         showInput: true,
  //         showPalette: true,
  //         showRenderInput: true
  //       });
  //     });
  //     el.find(".regular-file").each(function () {
  //       $(this).hide();
  //     });
  //   });
  //   jQuery("body").on("click", ".mfn-popup-main-setting .mfn-main-close", function (e) {
  //     var elMain = jQuery("#main-setting");
  //     elMain.hide();
  //   });
  //   // Element | Close -----------------------------------------
  //   jQuery("body").on("click", ".mfn-popup-item-edit .mfn-ph-close", function (e) {
  //     e.preventDefault();
  //     var elMain = jQuery("#main-setting");
  //     elMain.hide();
  //     //jQuery('.mfn-switch-editor').remove();
  //     //jQuery('#mfn-editor').removeAttr('id');

  //     jQuery(".editor").each(function () {
  //       var name = jQuery(this).attr("data-name") + "";
  //       if (tinymce.get(name)) {
  //         var tinyHTML = tinymce.get(name).getContent();
  //         tinymce.execCommand("mceRemoveEditor", false, name);
  //         jQuery(this).attr("value", tinyHTML);
  //       } else {
  //         tinymce.execCommand("mceAddEditor", false, name);
  //       }
  //     });

  //     // Tabs | destroy sortable
  //     jQuery(".tabs-ul.ui-sortable").sortable("destroy");

  //     // Background Scrolling & Dragging | enable
  //     jQuery("body").removeClass("mfn-popup-open");
  //     jQuery("#mfn-content").find(".ui-sortable").sortable("enable");
  //     jQuery(this).closest(".mfn-row").removeClass("editing");

  //     var popup = jQuery(this).closest(".mfn-popup");
  //     popup.fadeOut(300);

  //     if (jQuery(popup.hasClass("mfn-popup-item-edit"))) {
  //       // Label | update
  //       var label_container = popup.find("input.mfn-container-title").first().val();
  //       var label_widget = popup.find("input.mfn-widget-title").first().val();

  //       popup
  //         .closest(".mfn-element")
  //         .find(".mfn-container-label")
  //         .first()
  //         .html(label_container);
  //       if (label_widget != undefined) {
  //         popup
  //           .closest(".mfn-element")
  //           .find(".mfn-widget-label")
  //           .first()
  //           .html(label_widget);
  //         popup.closest(".mfn-element").find("input").each(function () {
  //           var name = jQuery(this).attr("data-name") + "";
  //           if (name != undefined && name != "undefined") {
  //             if (name.indexOf("][WidgetTitle]") > 1 && name.indexOf("[widgetId_") > 1)
  //               jQuery(this).val(label_widget);
  //           }
  //         });
  //       }

  //       setTimeout(function () {
  //         var meta = popup.find(".mfn-element-meta");

  //         popup.find(".mfn-popup-header").remove();
  //         popup.find(".mfn-popup-close").remove();

  //         meta.unwrap().unwrap().unwrap();

  //         meta.hide();
  //       }, 300);
  //     }
  //   });
  //   // Popup | Click Outside Popup ----------------------------------
  //   jQuery("body").on("click", ".mfn-popup", function (e) {
  //     var target = jQuery(e.target);

  //     if (target.hasClass("mfn-popup")) {
  //       jQuery(this).find(".mfn-ph-close").click();
  //       jQuery(this).find(".mfn-main-close").click();
  //     }
  //   });
  //   //-------------
  //   //--------------------

  //   // sortable init
  //   $(".tabs-ul").hover(function () {
  //     $(".tabs-ul").sortable({
  //       cursor: "move",
  //       opacity: 0.9
  //     });
  //   });

  //   // add
  //   $(".mfn-add-tab").click(function () {
  //     // increase tabs counter
  //     var tabs_counter = $(this).siblings(".mfn-tabs-count");
  //     tabs_counter.val(tabs_counter.val() * 1 + 1);

  //     var tabs_container = $(this).siblings(".tabs-ul");
  //     var new_tab = tabs_container.children("li.tabs-default").clone(true);

  //     new_tab.removeClass("tabs-default");
  //     new_tab.find("input,textarea").each(function (i, opt) {
  //       name = $(this).attr("name").replace("[X]", "");
  //       $(this).attr("data-name", name + "[" + tabs_counter.val() + "]");
  //       $(this).attr("name", $(this).attr("data-name"));
  //     });

  //     tabs_container.append(new_tab).children("li:last").fadeIn(500);
  //   });



  //   // delete
  //   $(".mfn-remove-tab").click(function (e) {
  //     e.preventDefault();

  //     // decrease tabs counter
  //     var tabs_counter = $(this).parents("td").children(".mfn-tabs-count");
  //     tabs_counter.val(tabs_counter.val() * 1 - 1);

  //     $(this).parent().fadeOut(300, function () {
  //       $(this).remove();
  //     });
  //   });

  //   //window
  //   configPathMvcCms = document.getElementById('data-PathMvcCms').value;
  //   configPathApiCms = document.getElementById('data-PathApiCms').value;
  //   configPathMvcViewPage = document.getElementById('data-PathMvcViewPage').value;

  //   document.getElementById('data-PathMvcCms').remove();
  //   document.getElementById('data-PathApiCms').remove();
  //   document.getElementById('data-PathMvcViewPage').remove();

  //   window.PageJsonValue = document.getElementById('data-PageJsonValue').value;
  //   document.getElementById('data-PageJsonValue').remove();

  //   window.PageJsonValueDefaultByAdmin = document.getElementById('data-PageJsonValueDefaultByAdmin').value;
  //   document.getElementById('data-PageJsonValueDefaultByAdmin').remove();

  //   window.id = document.getElementById('data-id').value;
  //   document.getElementById('data-id').remove();

  //   window.theme = document.getElementById('data-theme').value;
  //   document.getElementById('data-theme').remove();

  //   window.ConfigRouteTemplateFileImage = document.getElementById('data-ConfigRouteTemplateFileImage').value;
  //   window.ConfigRouteFileStorage = document.getElementById('data-ConfigRouteFileStorage').value;
  //   document.getElementById('data-ConfigRouteTemplateFileImage').remove();
  //   document.getElementById('data-ConfigRouteFileStorage').remove();

  //   //window
  //   //var userToken = localStorage.getItem("Authorization");
  //   var Authorization = document.getElementById('data-Authorization').value;
  //   var DeviceToken = document.getElementById('data-DeviceToken').value;
  //   document.getElementById('data-Authorization').remove();
  //   document.getElementById('data-DeviceToken').remove();
  //   $.ajaxSetup({
  //     beforeSend: function (xhr) {
  //       xhr.setRequestHeader("Authorization", Authorization);
  //       xhr.setRequestHeader("DeviceToken", DeviceToken);
  //     }
  //   });

  //   // Load the icons inside div with ".mfn-icon-select" class//
  //   $(".mfn-icon-select").html(
  //     "<span class='mfn-icon' data-rel='icon-acrobat'><i class='icon-acrobat'></i></span><span class='mfn-icon' data-rel='icon-address'><i class='icon-address'></i></span><span class='mfn-icon' data-rel='icon-adjust'><i class='icon-adjust'></i></span><span class='mfn-icon' data-rel='icon-aim'><i class='icon-aim'></i></span><span class='mfn-icon' data-rel='icon-air'><i class='icon-air'></i></span><span class='mfn-icon' data-rel='icon-alert'><i class='icon-alert'></i></span><span class='mfn-icon' data-rel='icon-amazon'><i class='icon-amazon'></i></span><span class='mfn-icon' data-rel='icon-android'><i class='icon-android'></i></span><span class='mfn-icon' data-rel='icon-angellist'><i class='icon-angellist'></i></span><span class='mfn-icon' data-rel='icon-appnet'>\n    <i class='icon-appnet'></i>\n</span><span class='mfn-icon' data-rel='icon-appstore'>\n<i class='icon-appstore'></i>\n</span><span class='mfn-icon' data-rel='icon-archive'>\n<i class='icon-archive'></i>\n</span><span class='mfn-icon'\n         data-rel='icon-arrow-combo'>\n<i class='icon-arrow-combo'></i>\n</span>        <span class='mfn-icon' data-rel='icon-attach'>\n<i class='icon-attach'></i>\n</span><span class='mfn-icon' data-rel='icon-attach-line'>\n<i class='icon-attach-line'></i>\n</span><span class='mfn-icon'\n         data-rel='icon-attention'>\n<i class='icon-attention'></i>\n</span><span class='mfn-icon' data-rel='icon-back'>\n<i class='icon-back'></i>\n</span><span class='mfn-icon' data-rel='icon-back-in-time'>\n<i class='icon-back-in-time'></i>\n</span><span class='mfn-icon' data-rel='icon-bag'>\n<i class='icon-bag'></i>\n</span><span class='mfn-icon' data-rel='icon-basket'>\n<i class='icon-basket'></i>\n</span><span class='mfn-icon' data-rel='icon-battery'>\n<i class='icon-battery'></i>\n</span><span class='mfn-icon'\n         data-rel='icon-beaker-line'>\n<i class='icon-beaker-line'></i>\n</span><span class='mfn-icon'\n         data-rel='icon-behance'>\n<i class='icon-behance'></i>\n</span><span class='mfn-icon' data-rel='icon-bell'>\n<i class='icon-bell'></i>\n</span><span class='mfn-icon' data-rel='icon-bitbucket'>\n<i class='icon-bitbucket'></i>\n</span><span class='mfn-icon' data-rel='icon-bitcoin'>\n<i class='icon-bitcoin'></i>\n</span><span class='mfn-icon' data-rel='icon-block'>\n<i class='icon-block'></i>\n</span><span class='mfn-icon' data-rel='icon-blogger'>\n<i class='icon-blogger'></i>\n</span><span class='mfn-icon' data-rel='icon-book'>\n<i class='icon-book'></i>\n</span><span class='mfn-icon' data-rel='icon-book-open'>\n<i class='icon-book-open'></i>\n</span><span class='mfn-icon' data-rel='icon-bookmark'>\n<i class='icon-bookmark'></i>\n</span><span class='mfn-icon' data-rel='icon-bookmarks'>\n<i class='icon-bookmarks'></i>\n</span><span class='mfn-icon' data-rel='icon-box'>\n<i class='icon-box'></i>\n</span><span class='mfn-icon' data-rel='icon-briefcase'>\n<i class='icon-briefcase'></i>\n</span><span class='mfn-icon' data-rel='icon-brush'>\n<i class='icon-brush'></i>\n</span><span class='mfn-icon' data-rel='icon-bucket'>\n<i class='icon-bucket'></i>\n</span><span class='mfn-icon' data-rel='icon-buffer'>\n<i class='icon-buffer'></i>\n</span><span class='mfn-icon' data-rel='icon-calendar'>\n<i class='icon-calendar'></i>\n</span><span class='mfn-icon'\n         data-rel='icon-calendar-line'>\n<i class='icon-calendar-line'></i>\n</span><span class='mfn-icon' data-rel='icon-call'>\n<i class='icon-call'></i>\n</span><span class='mfn-icon' data-rel='icon-camera'>\n<i class='icon-camera'></i>\n</span><span class='mfn-icon' data-rel='icon-camera-line'>\n<i class='icon-camera-line'></i>\n</span><span class='mfn-icon' data-rel='icon-cancel'>\n<i class='icon-cancel'></i>\n</span><span class='mfn-icon'\n         data-rel='icon-cancel-circled'>\n<i class='icon-cancel-circled'></i>\n</span><span class='mfn-icon'\n         data-rel='icon-cancel-squared'>\n<i class='icon-cancel-squared'></i>\n</span><span class='mfn-icon'\n         data-rel='icon-cart'>\n<i class='icon-cart'></i>\n</span>     <span class='mfn-icon' data-rel='icon-cc-nc'>\n<i class='icon-cc-nc'></i>\n</span><span class='mfn-icon' data-rel='icon-cc-nc-eu'>\n<i class='icon-cc-nc-eu'></i>\n</span><span class='mfn-icon' data-rel='icon-cc-nc-jp'>\n<i class='icon-cc-nc-jp'></i>\n</span><span class='mfn-icon' data-rel='icon-cc-nd'>\n<i class='icon-cc-nd'></i>\n</span><span class='mfn-icon' data-rel='icon-cc-pd'>\n<i class='icon-cc-pd'></i>\n</span><span class='mfn-icon' data-rel='icon-cc-remix'>\n<i class='icon-cc-remix'></i>\n</span><span class='mfn-icon' data-rel='icon-cc-sa'>\n<i class='icon-cc-sa'></i>\n</span><span class='mfn-icon' data-rel='icon-cc-share'>\n<i class='icon-cc-share'></i>\n</span><span class='mfn-icon' data-rel='icon-cc-zero'>\n<i class='icon-cc-zero'></i>\n</span><span class='mfn-icon' data-rel='icon-ccw'>\n<i class='icon-ccw'></i>\n</span><span class='mfn-icon' data-rel='icon-cd'>\n<i class='icon-cd'></i>\n</span><span class='mfn-icon' data-rel='icon-cd-line'>\n<i class='icon-cd-line'></i>\n</span><span class='mfn-icon' data-rel='icon-chart-area'>\n<i class='icon-chart-area'></i>\n</span><span class='mfn-icon' data-rel='icon-chart-bar'>\n<i class='icon-chart-bar'></i>\n</span><span class='mfn-icon' data-rel='icon-chart-line'>\n<i class='icon-chart-line'></i>\n</span><span class='mfn-icon' data-rel='icon-chart-pie'>\n<i class='icon-chart-pie'></i>\n</span><span class='mfn-icon' data-rel='icon-chat'>\n<i class='icon-chat'></i>\n</span><span class='mfn-icon' data-rel='icon-check'>\n<i class='icon-check'></i>\n</span><span class='mfn-icon' data-rel='icon-chrome'>\n<i class='icon-chrome'></i>\n</span><span class='mfn-icon' data-rel='icon-clipboard'>\n<i class='icon-clipboard'></i>\n</span><span class='mfn-icon' data-rel='icon-clock'>\n<i class='icon-clock'></i>\n</span><span class='mfn-icon' data-rel='icon-clock-line'>\n<i class='icon-clock-line'></i>\n</span><span class='mfn-icon' data-rel='icon-cloud'>\n<i class='icon-cloud'></i>\n</span><span class='mfn-icon' data-rel='icon-cloud-line'>\n<i class='icon-cloud-line'></i>\n</span><span class='mfn-icon'\n data-rel='icon-cloud-thunder'>\n<i class='icon-cloud-thunder'></i>\n</span><span class='mfn-icon'\n data-rel='icon-cloudapp'>\n<i class='icon-cloudapp'></i>\n</span><span class='mfn-icon' data-rel='icon-code'>\n<i class='icon-code'></i>\n</span><span class='mfn-icon' data-rel='icon-cog'>\n<i class='icon-cog'></i>\n</span><span class='mfn-icon' data-rel='icon-cog-line'>\n<i class='icon-cog-line'></i>\n</span><span class='mfn-icon'\n data-rel='icon-comment-empty-fa'>\n<i class='icon-comment-empty-fa'></i>\n</span><span class='mfn-icon'\n data-rel='icon-comment-fa'>\n<i class='icon-comment-fa'></i>\n</span><span class='mfn-icon'\n data-rel='icon-comment-line'>\n<i class='icon-comment-line'></i>\n</span><span class='mfn-icon' data-rel='icon-compass'>\n<i class='icon-compass'></i>\n</span><span class='mfn-icon'\n data-rel='icon-credit-card'>\n<i class='icon-credit-card'></i>\n</span><span class='mfn-icon' data-rel='icon-cup'>\n<i class='icon-cup'></i>\n</span><span class='mfn-icon' data-rel='icon-cup-line'>\n<i class='icon-cup-line'></i>\n</span><span class='mfn-icon' data-rel='icon-cw'>\n<i class='icon-cw'></i>\n</span><span class='mfn-icon' data-rel='icon-database'>\n<i class='icon-database'></i>\n</span><span class='mfn-icon'\n data-rel='icon-database-line'>\n<i class='icon-database-line'></i>\n</span><span class='mfn-icon'\n data-rel='icon-db-shape'>\n<i class='icon-db-shape'></i>\n</span><span class='mfn-icon' data-rel='icon-delicious'>\n<i class='icon-delicious'></i>\n</span><span class='mfn-icon'\n data-rel='icon-desktop-line'>\n<i class='icon-desktop-line'></i>\n</span><span class='mfn-icon'\n data-rel='icon-diamond-line'>\n<i class='icon-diamond-line'></i>\n</span><span class='mfn-icon' data-rel='icon-digg'>\n<i class='icon-digg'></i>\n</span><span class='mfn-icon' data-rel='icon-direction'>\n<i class='icon-direction'></i>\n</span><span class='mfn-icon' data-rel='icon-disqus'>\n<i class='icon-disqus'></i>\n</span><span class='mfn-icon' data-rel='icon-doc'>\n<i class='icon-doc'></i>\n</span><span class='mfn-icon' data-rel='icon-doc-landscape'>\n<i class='icon-doc-landscape'></i>\n</span><span class='mfn-icon'\n data-rel='icon-doc-line'>\n<i class='icon-doc-line'></i>\n</span><span class='mfn-icon' data-rel='icon-doc-text'>\n<i class='icon-doc-text'></i>\n</span><span class='mfn-icon'\n data-rel='icon-doc-text-inv'>\n<i class='icon-doc-text-inv'></i>\n</span><span class='mfn-icon' data-rel='icon-docs'>\n<i class='icon-docs'></i>\n</span><span class='mfn-icon' data-rel='icon-dot'>\n<i class='icon-dot'></i>\n</span><span class='mfn-icon' data-rel='icon-dot-2'>\n<i class='icon-dot-2'></i>\n</span><span class='mfn-icon' data-rel='icon-dot-3'>\n<i class='icon-dot-3'></i>\n</span><span class='mfn-icon' data-rel='icon-down'>\n<i class='icon-down'></i>\n</span><span class='mfn-icon' data-rel='icon-down-bold'>\n<i class='icon-down-bold'></i>\n</span><span class='mfn-icon'\n data-rel='icon-down-circled'>\n<i class='icon-down-circled'></i>\n</span><span class='mfn-icon'\n data-rel='icon-down-dir'>\n<i class='icon-down-dir'></i>\n</span><span class='mfn-icon' data-rel='icon-down-open'>\n<i class='icon-down-open'></i>\n</span><span class='mfn-icon'\n data-rel='icon-down-open-big'>\n<i class='icon-down-open-big'></i>\n</span><span class='mfn-icon'\n data-rel='icon-down-open-mini'>\n<i class='icon-down-open-mini'></i>\n</span><span class='mfn-icon'\n data-rel='icon-down-thin'>\n<i class='icon-down-thin'></i>\n</span><span class='mfn-icon' data-rel='icon-download'>\n<i class='icon-download'></i>\n</span><span class='mfn-icon' data-rel='icon-dribbble'>\n<i class='icon-dribbble'></i>\n</span><span class='mfn-icon'\n data-rel='icon-dribbble-circled'>\n<i class='icon-dribbble-circled'></i>\n</span><span class='mfn-icon'\n data-rel='icon-drive'>\n<i class='icon-drive'></i>\n</span><span class='mfn-icon' data-rel='icon-dropbox'>\n<i class='icon-dropbox'></i>\n</span><span class='mfn-icon' data-rel='icon-droplet'>\n<i class='icon-droplet'></i>\n</span><span class='mfn-icon' data-rel='icon-drupal'>\n<i class='icon-drupal'></i>\n</span><span class='mfn-icon' data-rel='icon-duckduckgo'>\n<i class='icon-duckduckgo'></i>\n</span><span class='mfn-icon' data-rel='icon-dwolla'>\n<i class='icon-dwolla'></i>\n</span><span class='mfn-icon' data-rel='icon-ebay'>\n<i class='icon-ebay'></i>\n</span><span class='mfn-icon' data-rel='icon-email'>\n<i class='icon-email'></i>\n</span><span class='mfn-icon' data-rel='icon-erase'>\n<i class='icon-erase'></i>\n</span><span class='mfn-icon' data-rel='icon-eventasaurus'>\n<i class='icon-eventasaurus'></i>\n</span><span class='mfn-icon'\n data-rel='icon-eventbrite'>\n<i class='icon-eventbrite'></i>\n</span><span class='mfn-icon'\n data-rel='icon-eventful'>\n<i class='icon-eventful'></i>\n</span><span class='mfn-icon' data-rel='icon-evernote'>\n<i class='icon-evernote'></i>\n</span><span class='mfn-icon' data-rel='icon-export'>\n<i class='icon-export'></i>\n</span><span class='mfn-icon' data-rel='icon-eye'>\n<i class='icon-eye'></i>\n</span><span class='mfn-icon' data-rel='icon-eye-line'>\n<i class='icon-eye-line'></i>\n</span><span class='mfn-icon' data-rel='icon-facebook'>\n<i class='icon-facebook'></i>\n</span><span class='mfn-icon'\n data-rel='icon-facebook-circled'>\n<i class='icon-facebook-circled'></i>\n</span><span class='mfn-icon'\n data-rel='icon-facebook-squared'>\n<i class='icon-facebook-squared'></i>\n</span><span class='mfn-icon'\n data-rel='icon-fast-backward'>\n<i class='icon-fast-backward'></i>\n</span><span class='mfn-icon'\n data-rel='icon-fast-forward'>\n<i class='icon-fast-forward'></i>\n</span><span class='mfn-icon' data-rel='icon-feather'>\n<i class='icon-feather'></i>\n</span><span class='mfn-icon' data-rel='icon-fire-line'>\n<i class='icon-fire-line'></i>\n</span><span class='mfn-icon'\n data-rel='icon-fivehundredpx'>\n<i class='icon-fivehundredpx'></i>\n</span><span class='mfn-icon' data-rel='icon-flag'>\n<i class='icon-flag'></i>\n</span><span class='mfn-icon' data-rel='icon-flash'>\n<i class='icon-flash'></i>\n</span><span class='mfn-icon' data-rel='icon-flashlight'>\n<i class='icon-flashlight'></i>\n</span><span class='mfn-icon' data-rel='icon-flattr'>\n<i class='icon-flattr'></i>\n</span><span class='mfn-icon' data-rel='icon-flickr'>\n<i class='icon-flickr'></i>\n</span><span class='mfn-icon'\n data-rel='icon-flickr-circled'>\n<i class='icon-flickr-circled'></i>\n</span><span class='mfn-icon'\n data-rel='icon-flight'>\n<i class='icon-flight'></i>\n</span><span class='mfn-icon' data-rel='icon-floppy'>\n<i class='icon-floppy'></i>\n</span><span class='mfn-icon' data-rel='icon-flow-branch'>\n<i class='icon-flow-branch'></i>\n</span><span class='mfn-icon'\n data-rel='icon-flow-cascade'>\n<i class='icon-flow-cascade'></i>\n</span><span class='mfn-icon'\n data-rel='icon-flow-line'>\n<i class='icon-flow-line'></i>\n</span><span class='mfn-icon'\n data-rel='icon-flow-parallel'>\n<i class='icon-flow-parallel'></i>\n</span><span class='mfn-icon'\n data-rel='icon-flow-tree'>\n<i class='icon-flow-tree'></i>\n</span><span class='mfn-icon' data-rel='icon-folder'>\n<i class='icon-folder'></i>\n</span><span class='mfn-icon' data-rel='icon-food-line'>\n<i class='icon-food-line'></i>\n</span><span class='mfn-icon' data-rel='icon-forrst'>\n<i class='icon-forrst'></i>\n</span><span class='mfn-icon' data-rel='icon-forward'>\n<i class='icon-forward'></i>\n</span><span class='mfn-icon' data-rel='icon-foursquare'>\n<i class='icon-foursquare'></i>\n</span><span class='mfn-icon' data-rel='icon-gauge'>\n<i class='icon-gauge'></i>\n</span><span class='mfn-icon' data-rel='icon-github'>\n<i class='icon-github'></i>\n</span><span class='mfn-icon'\n data-rel='icon-github-circled'>\n<i class='icon-github-circled'></i>\n</span><span class='mfn-icon' data-rel='icon-globe'>\n<i class='icon-globe'></i>\n</span><span class='mfn-icon' data-rel='icon-globe-line'>\n<i class='icon-globe-line'></i>\n</span><span class='mfn-icon' data-rel='icon-gmail'>\n<i class='icon-gmail'></i>\n</span><span class='mfn-icon' data-rel='icon-google'>\n<i class='icon-google'></i>\n</span><span class='mfn-icon'\n data-rel='icon-google-circles'>\n<i class='icon-google-circles'></i>\n</span><span class='mfn-icon'\n data-rel='icon-googleplay'>\n<i class='icon-googleplay'></i>\n</span><span class='mfn-icon' data-rel='icon-gowalla'>\n<i class='icon-gowalla'></i>\n</span><span class='mfn-icon' data-rel='icon-gplus'>\n<i class='icon-gplus'></i>\n</span><span class='mfn-icon'\n data-rel='icon-gplus-circled'>\n<i class='icon-gplus-circled'></i>\n</span><span class='mfn-icon'\n data-rel='icon-graduation-cap'>\n<i class='icon-graduation-cap'></i>\n</span><span class='mfn-icon'\n data-rel='icon-graduation-cap-line'>\n<i class='icon-graduation-cap-line'></i>\n</span><span class='mfn-icon'\n data-rel='icon-grooveshark'>\n<i class='icon-grooveshark'></i>\n</span><span class='mfn-icon' data-rel='icon-guest'>\n<i class='icon-guest'></i>\n</span><span class='mfn-icon' data-rel='icon-hackernews'>\n<i class='icon-hackernews'></i>\n</span><span class='mfn-icon'\n data-rel='icon-heart-empty-fa'>\n<i class='icon-heart-empty-fa'></i>\n</span><span class='mfn-icon'\n data-rel='icon-heart-fa'>\n<i class='icon-heart-fa'></i>\n</span><span class='mfn-icon'\n data-rel='icon-heart-line'>\n<i class='icon-heart-line'></i>\n</span><span class='mfn-icon' data-rel='icon-help'>\n<i class='icon-help'></i>\n</span><span class='mfn-icon' data-rel='icon-help-circled'>\n<i class='icon-help-circled'></i>\n</span><span class='mfn-icon' data-rel='icon-home'>\n<i class='icon-home'></i>\n</span><span class='mfn-icon' data-rel='icon-hourglass'>\n<i class='icon-hourglass'></i>\n</span><span class='mfn-icon' data-rel='icon-html5'>\n<i class='icon-html5'></i>\n</span><span class='mfn-icon' data-rel='icon-ie'>\n<i class='icon-ie'></i>\n</span><span class='mfn-icon' data-rel='icon-inbox'>\n<i class='icon-inbox'></i>\n</span><span class='mfn-icon' data-rel='icon-inbox-line'>\n<i class='icon-inbox-line'></i>\n</span><span class='mfn-icon'\n data-rel='icon-infinity'>\n<i class='icon-infinity'></i>\n</span><span class='mfn-icon' data-rel='icon-info'>\n<i class='icon-info'></i>\n</span><span class='mfn-icon' data-rel='icon-info-circled'>\n<i class='icon-info-circled'></i>\n</span><span class='mfn-icon'\n data-rel='icon-instagram'>\n<i class='icon-instagram'></i>\n</span><span class='mfn-icon' data-rel='icon-install'>\n<i class='icon-install'></i>\n</span><span class='mfn-icon' data-rel='icon-instapaper'>\n<i class='icon-instapaper'></i>\n</span><span class='mfn-icon'\n data-rel='icon-intensedebate'>\n<i class='icon-intensedebate'></i>\n</span><span class='mfn-icon' data-rel='icon-itunes'>\n<i class='icon-itunes'></i>\n</span><span class='mfn-icon' data-rel='icon-key'>\n<i class='icon-key'></i>\n</span><span class='mfn-icon' data-rel='icon-key-line'>\n<i class='icon-key-line'></i>\n</span><span class='mfn-icon' data-rel='icon-keyboard'>\n<i class='icon-keyboard'></i>\n</span><span class='mfn-icon' data-rel='icon-klout'>\n<i class='icon-klout'></i>\n</span><span class='mfn-icon' data-rel='icon-lamp'>\n<i class='icon-lamp'></i>\n</span><span class='mfn-icon' data-rel='icon-language'>\n<i class='icon-language'></i>\n</span><span class='mfn-icon' data-rel='icon-lanyrd'>\n<i class='icon-lanyrd'></i>\n</span><span class='mfn-icon' data-rel='icon-lastfm'>\n<i class='icon-lastfm'></i>\n</span><span class='mfn-icon'\n data-rel='icon-lastfm-circled'>\n<i class='icon-lastfm-circled'></i>\n</span><span class='mfn-icon'\n data-rel='icon-layout'>\n<i class='icon-layout'></i>\n</span><span class='mfn-icon' data-rel='icon-leaf'>\n<i class='icon-leaf'></i>\n</span><span class='mfn-icon' data-rel='icon-left'>\n<i class='icon-left'></i>\n</span><span class='mfn-icon' data-rel='icon-left-bold'>\n<i class='icon-left-bold'></i>\n</span><span class='mfn-icon'\n data-rel='icon-left-circled'>\n<i class='icon-left-circled'></i>\n</span><span class='mfn-icon'\n data-rel='icon-left-dir'>\n<i class='icon-left-dir'></i>\n</span><span class='mfn-icon' data-rel='icon-left-open'>\n<i class='icon-left-open'></i>\n</span><span class='mfn-icon'\n data-rel='icon-left-open-big'>\n<i class='icon-left-open-big'></i>\n</span><span class='mfn-icon'\n data-rel='icon-left-open-mini'>\n<i class='icon-left-open-mini'></i>\n</span><span class='mfn-icon'\n data-rel='icon-left-thin'>\n<i class='icon-left-thin'></i>\n</span><span class='mfn-icon' data-rel='icon-lego'>\n<i class='icon-lego'></i>\n</span><span class='mfn-icon' data-rel='icon-level-down'>\n<i class='icon-level-down'></i>\n</span><span class='mfn-icon'\n data-rel='icon-level-up'>\n<i class='icon-level-up'></i>\n</span><span class='mfn-icon' data-rel='icon-lifebuoy'>\n<i class='icon-lifebuoy'></i>\n</span><span class='mfn-icon'\n data-rel='icon-light-down'>\n<i class='icon-light-down'></i>\n</span><span class='mfn-icon'\n data-rel='icon-light-up'>\n<i class='icon-light-up'></i>\n</span><span class='mfn-icon'\n data-rel='icon-lightbulb-line'>\n<i class='icon-lightbulb-line'></i>\n</span><span class='mfn-icon'\n data-rel='icon-link'>\n<i class='icon-link'></i>\n</span><span class='mfn-icon' data-rel='icon-linkedin'>\n<i class='icon-linkedin'></i>\n</span><span class='mfn-icon'\n data-rel='icon-linkedin-circled'>\n<i class='icon-linkedin-circled'></i>\n</span><span class='mfn-icon'\n data-rel='icon-list'>\n<i class='icon-list'></i>\n</span><span class='mfn-icon' data-rel='icon-list-add'>\n<i class='icon-list-add'></i>\n</span><span class='mfn-icon' data-rel='icon-lkdto'>\n<i class='icon-lkdto'></i>\n</span><span class='mfn-icon' data-rel='icon-location'>\n<i class='icon-location'></i>\n</span><span class='mfn-icon'\n data-rel='icon-location-line'>\n<i class='icon-location-line'></i>\n</span><span class='mfn-icon' data-rel='icon-lock'>\n<i class='icon-lock'></i>\n</span><span class='mfn-icon' data-rel='icon-lock-line'>\n<i class='icon-lock-line'></i>\n</span><span class='mfn-icon'\n data-rel='icon-lock-open'>\n<i class='icon-lock-open'></i>\n</span><span class='mfn-icon' data-rel='icon-login'>\n<i class='icon-login'></i>\n</span><span class='mfn-icon' data-rel='icon-logo-db'>\n<i class='icon-logo-db'></i>\n</span><span class='mfn-icon' data-rel='icon-logout'>\n<i class='icon-logout'></i>\n</span><span class='mfn-icon' data-rel='icon-loop'>\n<i class='icon-loop'></i>\n</span><span class='mfn-icon' data-rel='icon-macstore'>\n<i class='icon-macstore'></i>\n</span><span class='mfn-icon' data-rel='icon-magnet'>\n<i class='icon-magnet'></i>\n</span><span class='mfn-icon' data-rel='icon-mail'>\n<i class='icon-mail'></i>\n</span><span class='mfn-icon' data-rel='icon-mail-line'>\n<i class='icon-mail-line'></i>\n</span><span class='mfn-icon' data-rel='icon-map'>\n<i class='icon-map'></i>\n</span><span class='mfn-icon' data-rel='icon-meetup'>\n<i class='icon-meetup'></i>\n</span><span class='mfn-icon' data-rel='icon-megaphone'>\n<i class='icon-megaphone'></i>\n</span><span class='mfn-icon'\n data-rel='icon-megaphone-line'>\n<i class='icon-megaphone-line'></i>\n</span><span class='mfn-icon'\n data-rel='icon-menu'>\n<i class='icon-menu'></i>\n</span><span class='mfn-icon' data-rel='icon-mic'>\n<i class='icon-mic'></i>\n</span><span class='mfn-icon' data-rel='icon-minus'>\n<i class='icon-minus'></i>\n</span><span class='mfn-icon'\n data-rel='icon-minus-circled'>\n<i class='icon-minus-circled'></i>\n</span><span class='mfn-icon'\n data-rel='icon-minus-squared'>\n<i class='icon-minus-squared'></i>\n</span><span class='mfn-icon' data-rel='icon-mixi'>\n<i class='icon-mixi'></i>\n</span><span class='mfn-icon' data-rel='icon-mobile'>\n<i class='icon-mobile'></i>\n</span><span class='mfn-icon' data-rel='icon-mobile-line'>\n<i class='icon-mobile-line'></i>\n</span><span class='mfn-icon'\n data-rel='icon-money-line'>\n<i class='icon-money-line'></i>\n</span><span class='mfn-icon' data-rel='icon-monitor'>\n<i class='icon-monitor'></i>\n</span><span class='mfn-icon' data-rel='icon-moon'>\n<i class='icon-moon'></i>\n</span><span class='mfn-icon' data-rel='icon-mouse'>\n<i class='icon-mouse'></i>\n</span><span class='mfn-icon' data-rel='icon-music'>\n<i class='icon-music'></i>\n</span><span class='mfn-icon' data-rel='icon-music-line'>\n<i class='icon-music-line'></i>\n</span><span class='mfn-icon' data-rel='icon-mute'>\n<i class='icon-mute'></i>\n</span><span class='mfn-icon' data-rel='icon-myspace'>\n<i class='icon-myspace'></i>\n</span><span class='mfn-icon' data-rel='icon-network'>\n<i class='icon-network'></i>\n</span><span class='mfn-icon' data-rel='icon-newspaper'>\n<i class='icon-newspaper'></i>\n</span><span class='mfn-icon'\n data-rel='icon-ninetyninedesigns'>\n<i class='icon-ninetyninedesigns'></i>\n</span><span class='mfn-icon'\n data-rel='icon-note'>\n<i class='icon-note'></i>\n</span><span class='mfn-icon' data-rel='icon-note-beamed'>\n<i class='icon-note-beamed'></i>\n</span><span class='mfn-icon'\n data-rel='icon-note-line'>\n<i class='icon-note-line'></i>\n</span><span class='mfn-icon' data-rel='icon-openid'>\n<i class='icon-openid'></i>\n</span><span class='mfn-icon' data-rel='icon-opentable'>\n<i class='icon-opentable'></i>\n</span><span class='mfn-icon' data-rel='icon-palette'>\n<i class='icon-palette'></i>\n</span><span class='mfn-icon'\n data-rel='icon-paper-plane'>\n<i class='icon-paper-plane'></i>\n</span><span class='mfn-icon'\n data-rel='icon-paper-plane-line'>\n<i class='icon-paper-plane-line'></i>\n</span><span class='mfn-icon'\n data-rel='icon-params-line'>\n<i class='icon-params-line'></i>\n</span><span class='mfn-icon' data-rel='icon-pause'>\n<i class='icon-pause'></i>\n</span><span class='mfn-icon' data-rel='icon-paypal'>\n<i class='icon-paypal'></i>\n</span><span class='mfn-icon' data-rel='icon-pencil'>\n<i class='icon-pencil'></i>\n</span><span class='mfn-icon' data-rel='icon-pencil-line'>\n<i class='icon-pencil-line'></i>\n</span><span class='mfn-icon' data-rel='icon-phone'>\n<i class='icon-phone'></i>\n</span><span class='mfn-icon' data-rel='icon-photo-line'>\n<i class='icon-photo-line'></i>\n</span><span class='mfn-icon' data-rel='icon-picasa'>\n<i class='icon-picasa'></i>\n</span><span class='mfn-icon' data-rel='icon-picture'>\n<i class='icon-picture'></i>\n</span><span class='mfn-icon' data-rel='icon-pinboard'>\n<i class='icon-pinboard'></i>\n</span><span class='mfn-icon' data-rel='icon-pinterest'>\n<i class='icon-pinterest'></i>\n</span><span class='mfn-icon'\n data-rel='icon-pinterest-circled'>\n<i class='icon-pinterest-circled'></i>\n</span><span class='mfn-icon'\n data-rel='icon-plancast'>\n<i class='icon-plancast'></i>\n</span><span class='mfn-icon' data-rel='icon-play'>\n<i class='icon-play'></i>\n</span><span class='mfn-icon' data-rel='icon-plurk'>\n<i class='icon-plurk'></i>\n</span><span class='mfn-icon' data-rel='icon-plus'>\n<i class='icon-plus'></i>\n</span><span class='mfn-icon' data-rel='icon-plus-circled'>\n<i class='icon-plus-circled'></i>\n</span><span class='mfn-icon'\n data-rel='icon-plus-squared'>\n<i class='icon-plus-squared'></i>\n</span><span class='mfn-icon'\n data-rel='icon-pocket'>\n<i class='icon-pocket'></i>\n</span><span class='mfn-icon' data-rel='icon-podcast'>\n<i class='icon-podcast'></i>\n</span><span class='mfn-icon' data-rel='icon-popup'>\n<i class='icon-popup'></i>\n</span><span class='mfn-icon' data-rel='icon-posterous'>\n<i class='icon-posterous'></i>\n</span><span class='mfn-icon' data-rel='icon-print'>\n<i class='icon-print'></i>\n</span><span class='mfn-icon' data-rel='icon-progress-0'>\n<i class='icon-progress-0'></i>\n</span><span class='mfn-icon'\n data-rel='icon-progress-1'>\n<i class='icon-progress-1'></i>\n</span><span class='mfn-icon'\n data-rel='icon-progress-2'>\n<i class='icon-progress-2'></i>\n</span><span class='mfn-icon'\n data-rel='icon-progress-3'>\n<i class='icon-progress-3'></i>\n</span><span class='mfn-icon' data-rel='icon-publish'>\n<i class='icon-publish'></i>\n</span><span class='mfn-icon' data-rel='icon-qq'>\n<i class='icon-qq'></i>\n</span><span class='mfn-icon' data-rel='icon-quora'>\n<i class='icon-quora'></i>\n</span><span class='mfn-icon' data-rel='icon-quote'>\n<i class='icon-quote'></i>\n</span><span class='mfn-icon' data-rel='icon-rdio'>\n<i class='icon-rdio'></i>\n</span><span class='mfn-icon' data-rel='icon-rdio-circled'>\n<i class='icon-rdio-circled'></i>\n</span><span class='mfn-icon'\n data-rel='icon-record'>\n<i class='icon-record'></i>\n</span><span class='mfn-icon' data-rel='icon-reddit'>\n<i class='icon-reddit'></i>\n</span><span class='mfn-icon' data-rel='icon-renren'>\n<i class='icon-renren'></i>\n</span><span class='mfn-icon' data-rel='icon-reply'>\n<i class='icon-reply'></i>\n</span><span class='mfn-icon' data-rel='icon-reply-all'>\n<i class='icon-reply-all'></i>\n</span><span class='mfn-icon'\n data-rel='icon-resize-full'>\n<i class='icon-resize-full'></i>\n</span><span class='mfn-icon'\n data-rel='icon-resize-small'>\n<i class='icon-resize-small'></i>\n</span><span class='mfn-icon' data-rel='icon-retweet'>\n<i class='icon-retweet'></i>\n</span><span class='mfn-icon' data-rel='icon-right'>\n<i class='icon-right'></i>\n</span><span class='mfn-icon' data-rel='icon-right-bold'>\n<i class='icon-right-bold'></i>\n</span><span class='mfn-icon'\n data-rel='icon-right-circled'>\n<i class='icon-right-circled'></i>\n</span><span class='mfn-icon'\n data-rel='icon-right-dir'>\n<i class='icon-right-dir'></i>\n</span><span class='mfn-icon' data-rel='icon-right-open'>\n<i class='icon-right-open'></i>\n</span><span class='mfn-icon'\n data-rel='icon-right-open-big'>\n<i class='icon-right-open-big'></i>\n</span><span class='mfn-icon'\n data-rel='icon-right-open-mini'>\n<i class='icon-right-open-mini'></i>\n</span><span class='mfn-icon'\n data-rel='icon-right-thin'>\n<i class='icon-right-thin'></i>\n</span><span class='mfn-icon' data-rel='icon-rocket'>\n<i class='icon-rocket'></i>\n</span><span class='mfn-icon' data-rel='icon-rss'>\n<i class='icon-rss'></i>\n</span><span class='mfn-icon' data-rel='icon-scribd'>\n<i class='icon-scribd'></i>\n</span><span class='mfn-icon' data-rel='icon-search'>\n<i class='icon-search'></i>\n</span><span class='mfn-icon' data-rel='icon-search-line'>\n<i class='icon-search-line'></i>\n</span><span class='mfn-icon' data-rel='icon-share'>\n<i class='icon-share'></i>\n</span><span class='mfn-icon' data-rel='icon-shareable'>\n<i class='icon-shareable'></i>\n</span><span class='mfn-icon'\n data-rel='icon-shop-line'>\n<i class='icon-shop-line'></i>\n</span><span class='mfn-icon' data-rel='icon-shuffle'>\n<i class='icon-shuffle'></i>\n</span><span class='mfn-icon' data-rel='icon-signal'>\n<i class='icon-signal'></i>\n</span><span class='mfn-icon' data-rel='icon-sina-weibo'>\n<i class='icon-sina-weibo'></i>\n</span><span class='mfn-icon' data-rel='icon-skype'>\n<i class='icon-skype'></i>\n</span><span class='mfn-icon'\n data-rel='icon-skype-circled'>\n<i class='icon-skype-circled'></i>\n</span><span class='mfn-icon'\n data-rel='icon-smashing'>\n<i class='icon-smashing'></i>\n</span><span class='mfn-icon' data-rel='icon-smashmag'>\n<i class='icon-smashmag'></i>\n</span><span class='mfn-icon' data-rel='icon-songkick'>\n<i class='icon-songkick'></i>\n</span><span class='mfn-icon' data-rel='icon-sound'>\n<i class='icon-sound'></i>\n</span><span class='mfn-icon' data-rel='icon-sound-line'>\n<i class='icon-sound-line'></i>\n</span><span class='mfn-icon'\n data-rel='icon-soundcloud'>\n<i class='icon-soundcloud'></i>\n</span><span class='mfn-icon' data-rel='icon-spotify'>\n<i class='icon-spotify'></i>\n</span><span class='mfn-icon'\n data-rel='icon-spotify-circled'>\n<i class='icon-spotify-circled'></i>\n</span><span class='mfn-icon'\n data-rel='icon-stackoverflow'>\n<i class='icon-stackoverflow'></i>\n</span><span class='mfn-icon' data-rel='icon-star'>\n<i class='icon-star'></i>\n</span><span class='mfn-icon' data-rel='icon-star-empty'>\n<i class='icon-star-empty'></i>\n</span><span class='mfn-icon' data-rel='icon-star-line'>\n<i class='icon-star-line'></i>\n</span><span class='mfn-icon'\n data-rel='icon-statusnet'>\n<i class='icon-statusnet'></i>\n</span><span class='mfn-icon' data-rel='icon-steam'>\n<i class='icon-steam'></i>\n</span><span class='mfn-icon' data-rel='icon-stop'>\n<i class='icon-stop'></i>\n</span><span class='mfn-icon' data-rel='icon-stripe'>\n<i class='icon-stripe'></i>\n</span><span class='mfn-icon' data-rel='icon-stumbleupon'>\n<i class='icon-stumbleupon'></i>\n</span><span class='mfn-icon'\n data-rel='icon-stumbleupon-circled'>\n<i class='icon-stumbleupon-circled'></i>\n</span><span class='mfn-icon'\n data-rel='icon-suitcase'>\n<i class='icon-suitcase'></i>\n</span><span class='mfn-icon' data-rel='icon-sweden'>\n<i class='icon-sweden'></i>\n</span><span class='mfn-icon' data-rel='icon-switch'>\n<i class='icon-switch'></i>\n</span><span class='mfn-icon'\n data-rel='icon-t-shirt-line'>\n<i class='icon-t-shirt-line'></i>\n</span><span class='mfn-icon' data-rel='icon-tag'>\n<i class='icon-tag'></i>\n</span><span class='mfn-icon' data-rel='icon-tag-line'>\n<i class='icon-tag-line'></i>\n</span><span class='mfn-icon' data-rel='icon-tape'>\n<i class='icon-tape'></i>\n</span><span class='mfn-icon' data-rel='icon-target'>\n<i class='icon-target'></i>\n</span><span class='mfn-icon' data-rel='icon-thermometer'>\n<i class='icon-thermometer'></i>\n</span><span class='mfn-icon'\n data-rel='icon-thumbs-down'>\n<i class='icon-thumbs-down'></i>\n</span><span class='mfn-icon'\n data-rel='icon-thumbs-up'>\n<i class='icon-thumbs-up'></i>\n</span><span class='mfn-icon'\n data-rel='icon-thumbs-up-line'>\n<i class='icon-thumbs-up-line'></i>\n</span><span class='mfn-icon'\n data-rel='icon-ticket'>\n<i class='icon-ticket'></i>\n</span><span class='mfn-icon' data-rel='icon-to-end'>\n<i class='icon-to-end'></i>\n</span><span class='mfn-icon' data-rel='icon-to-start'>\n<i class='icon-to-start'></i>\n</span><span class='mfn-icon' data-rel='icon-tools'>\n<i class='icon-tools'></i>\n</span><span class='mfn-icon' data-rel='icon-traffic-cone'>\n<i class='icon-traffic-cone'></i>\n</span><span class='mfn-icon' data-rel='icon-trash'>\n<i class='icon-trash'></i>\n</span><span class='mfn-icon' data-rel='icon-trash-line'>\n<i class='icon-trash-line'></i>\n</span><span class='mfn-icon' data-rel='icon-trophy'>\n<i class='icon-trophy'></i>\n</span><span class='mfn-icon' data-rel='icon-truck-line'>\n<i class='icon-truck-line'></i>\n</span><span class='mfn-icon' data-rel='icon-tumblr'>\n<i class='icon-tumblr'></i>\n</span><span class='mfn-icon'\n data-rel='icon-tumblr-circled'>\n<i class='icon-tumblr-circled'></i>\n</span><span class='mfn-icon'\n data-rel='icon-tv-line'>\n<i class='icon-tv-line'></i>\n</span><span class='mfn-icon' data-rel='icon-twitter'>\n<i class='icon-twitter'></i>\n</span><span class='mfn-icon'\n data-rel='icon-twitter-circled'>\n<i class='icon-twitter-circled'></i>\n</span><span class='mfn-icon' data-rel='icon-up'>\n<i class='icon-up'></i>\n</span><span class='mfn-icon' data-rel='icon-up-bold'>\n<i class='icon-up-bold'></i>\n</span><span class='mfn-icon' data-rel='icon-up-circled'>\n<i class='icon-up-circled'></i>\n</span><span class='mfn-icon' data-rel='icon-up-dir'>\n<i class='icon-up-dir'></i>\n</span><span class='mfn-icon' data-rel='icon-up-open'>\n<i class='icon-up-open'></i>\n</span><span class='mfn-icon'\n data-rel='icon-up-open-big'>\n<i class='icon-up-open-big'></i>\n</span><span class='mfn-icon'\n data-rel='icon-up-open-mini'>\n<i class='icon-up-open-mini'></i>\n</span><span class='mfn-icon' data-rel='icon-up-thin'>\n<i class='icon-up-thin'></i>\n</span><span class='mfn-icon' data-rel='icon-upload'>\n<i class='icon-upload'></i>\n</span><span class='mfn-icon'\n data-rel='icon-upload-cloud'>\n<i class='icon-upload-cloud'></i>\n</span><span class='mfn-icon' data-rel='icon-user'>\n<i class='icon-user'></i>\n</span><span class='mfn-icon' data-rel='icon-user-add'>\n<i class='icon-user-add'></i>\n</span><span class='mfn-icon' data-rel='icon-user-line'>\n<i class='icon-user-line'></i>\n</span><span class='mfn-icon' data-rel='icon-users'>\n<i class='icon-users'></i>\n</span><span class='mfn-icon'\n data-rel='icon-vcard'><i class='icon-vcard'></i></span><span class='mfn-icon' data-rel='icon-viadeo'><i class='icon-viadeo'></i></span><span class='mfn-icon' data-rel='icon-video'><i class='icon-video'></i></span><span class='mfn-icon' data-rel='icon-videocam-line'>\n<i class='icon-videocam-line'></i>\n</span><span class='mfn-icon'\n data-rel='icon-vimeo'>\n<i class='icon-vimeo'></i>\n</span><span class='mfn-icon'\n data-rel='icon-vimeo-circled'>\n<i class='icon-vimeo-circled'></i>\n</span><span class='mfn-icon' data-rel='icon-vk'>\n<i class='icon-vk'></i>\n</span><span class='mfn-icon' data-rel='icon-vkontakte'>\n<i class='icon-vkontakte'></i>\n</span><span class='mfn-icon' data-rel='icon-volume'>\n<i class='icon-volume'></i>\n</span><span class='mfn-icon' data-rel='icon-w3c'>\n<i class='icon-w3c'></i>\n</span><span class='mfn-icon' data-rel='icon-wallet-line'>\n<i class='icon-wallet-line'></i>\n</span><span class='mfn-icon' data-rel='icon-water'>\n<i class='icon-water'></i>\n</span><span class='mfn-icon' data-rel='icon-weibo'>\n<i class='icon-weibo'></i>\n</span><span class='mfn-icon' data-rel='icon-wikipedia'>\n<i class='icon-wikipedia'></i>\n</span><span class='mfn-icon' data-rel='icon-window'>\n<i class='icon-window'></i>\n</span><span class='mfn-icon' data-rel='icon-windows'>\n<i class='icon-windows'></i>\n</span><span class='mfn-icon' data-rel='icon-wordpress'>\n<i class='icon-wordpress'></i>\n</span><span class='mfn-icon' data-rel='icon-xing'>\n<i class='icon-xing'></i>\n</span><span class='mfn-icon' data-rel='icon-yahoo'>\n<i class='icon-yahoo'></i>\n</span><span class='mfn-icon' data-rel='icon-yelp'>\n<i class='icon-yelp'></i>\n</span><span class='mfn-icon' data-rel='icon-youtube'>\n<i class='icon-youtube'></i>\n</span>'"
  //   );

  //   $(".mfn-icon-select .mfn-icon").click(function () {
  //     var field = $(this).closest(".mfn-icon-field");
  //     var input = field.find(".mfn-icon-input");

  //     var icon = $(this).attr("data-rel");

  //     $(this).siblings().removeClass("active");
  //     $(this).addClass("active");
  //     input.val(icon);
  //   });

  //   jQuery(".mfn-container-export-data").click(function () {
  //     $("#import_text").val("");

  //     var ret = makeJson_page();
  //     var dataEncode = JSON.stringify(ret);

  //     $("#exportCode").val(Base64Encode(dataEncode));
  //   });
  //   jQuery(".mfn-container-guide-btn").click(function () {
  //     guideShow();
  //   });
  //   // just save

  //   $(".mfn-container-save-btn").click(function () {
  //     var myAlert = "";
  //     myAlert = "در حال ذخیره سازی...";
  //     popupAlert(myAlert, "/images/saveing.png", "ذخیره طراحی");
  //     var ret = funcJsonPageMaker();
  //     //console.log(ret);
  //     if (window.id == undefined) {
  //       myAlert = "خطا در ذخیره سازی به دلیل عدم دسترسی به کد سیستمی";

  //       popupAlert(myAlert, "", "خطا");
  //     } else {
  //       var model = {
  //         id: window.id,
  //         ver: "1",
  //         jsonValue: ret,
  //         runSafeMode: true
  //       };
  //       $.ajax({
  //         type: "Post",
  //         data: JSON.stringify(model),
  //         dataType: "json",
  //         contentType: "application/json",
  //         url: configPathMvcCms + "HtmlBuilder/EditHtml/",
  //         success: function (msg) {
  //           window.PageJsonValue = ret;
  //           myAlert = "ذخیره سازی با موفقیت انجام شد!";
  //           popupAlert(myAlert, "/images/Save.png", "ذخیره طراحی");
  //         },
  //         error: function (msg) {
  //           console.log(msg);
  //           myAlert = "خطا در ذخیره سازی";
  //           popupAlert(myAlert, "", "خطا");
  //         }
  //       });
  //     }

  //     return;
  //   });
  //   var pageRender = function (byMasterPage) {
  //     var myAlert = "در حال ذخیره سازی  پیش نمایش";
  //     popupAlert(myAlert, "/images/preview-icon.png", "پیش نمایش");
  //     var ret = makeJson_page();
  //     //console.log(ret);

  //     if (window.id == undefined) {
  //       myAlert = "خطا در ذخیره سازی به دلیل عدم دسترسی به کد سیستمی";

  //       popupAlert(myAlert, "", "خطا");
  //     } else {

  //       var model = {
  //         LinkpageId: window.id,
  //         ExportNumber: 0,
  //         ExportCod: JSON.stringify(ret)
  //       };

  //       $.ajax({
  //         type: "Post",
  //         //async: false,
  //         data: JSON.stringify(model),
  //         dataType: "json",
  //         contentType: "application/json",
  //         url: configPathMvcCms + "HtmlBuilder/EditHtmlExport/",
  //         success: function (msg) {
  //           myAlert = "ذخیره سازی با موفقیت انجام شد .";
  //           popupAlert(myAlert, "/images/green_check.png", "ذخیره طراحی");
  //           window.PageJsonValue = ret;
  //           setTimeout(function () {
  //             // var url = window.location.href.substr(0, window.location.href.indexOf("HtmlBuilder")) + "Page/" + window.id;
  //             var url = configPathMvcViewPage + window.id;
  //             if (byMasterPage)
  //               url = url + "?RenderViewPageByMaster=true&preview=true";
  //             else
  //               url = url + "?RenderViewPageByMaster=false&preview=true";
  //             popupAlertClose();
  //             window.open(url, "_blank");
  //           });

  //           popupAlertClose();
  //         },
  //         error: function (msg) {
  //           console.log(msg);
  //           myAlert = "خطا در ذخیره سازی";
  //           popupAlert(myAlert, "/images/error.png", "خطا");
  //         }
  //       });
  //     }
  //     return;
  //   }
  //   //save && preview
  //   $(".mfn-container-preview-btn-master-page").click(function () {
  //     pageRender(true);
  //   });
  //   $(".mfn-container-preview-btn").click(function () {
  //     pageRender();
  //   });

  //   //#help# برای اتصال راهنما
  //   $(".mfn-popup-items").find("li").each(function (i, opt) {
  //     $(this)
  //       .mouseover(function () {
  //         runWidgetHelper($(this));
  //       })
  //       .mouseleave(function () {
  //         //$('.mfn-popup-items-helper').html('...');
  //       });
  //   });

  //   $(".mfn-opts-upload-remove").click(function () {
  //     $(this).prev().prev().prev().empty();
  //   });
  // }
  // var onLoadDataRun = function (mode) {

  //   if (window.theme == undefined || window.theme == "") {
  //     myAlert = "خطا در بارگذاری به دلیل عدم دسترسی به نوع قالب";
  //   } else if (window.id == undefined) {
  //     myAlert = "خطا در بارگذاری به دلیل عدم دسترسی به کد سیستمی";
  //     popupAlert(myAlert, "");
  //   }

  //   else {
  //     if (mode == "admin") {
  //       if (
  //         window.PageJsonValueDefaultByAdmin == undefined ||
  //         window.PageJsonValueDefaultByAdmin == ""
  //       ) {
  //         myAlert = "اطلاعاتی در پیش فرض مدیریت یافت نشد";

  //         jQuery(".mfn-container-load-admin-value-btn")
  //           .parent()
  //           .fadeOut(300);
  //         popupAlert(myAlert, "/images/sad_face.png", "بارگذاری صفحه");
  //       } else {
  //         jQuery(".mfn-container-load-admin-value-btn")
  //           .parent()
  //           .fadeIn(300);
  //         myAlert = "بارگذاری مقادیر پیش فرض مدیریتی با موفقیت انجام شد .";
  //         popupAlert(myAlert, "/images/green_check.png", "بارگذاری صفحه");

  //         loadPage((window.PageJsonValueDefaultByAdmin));
  //       }
  //     } else {
  //       if (
  //         window.PageJsonValue == undefined ||
  //         window.PageJsonValue == ""
  //       ) {
  //         jQuery(".mfn-container-load-admin-value-btn")
  //           .parent()
  //           .fadeOut(300);
  //       } else {
  //         jQuery(".mfn-container-load-admin-value-btn")
  //           .parent()
  //           .fadeIn(300);


  //         loadPage((window.PageJsonValue));
  //         myAlert = "بارگذاری با موفقیت انجام شد .";
  //         popupAlert(myAlert, "/images/green_check.png", "بارگذاری صفحه");
  //       }
  //     }

  //   }
  // }
  // jQuery(document).ready(function () {

  //   onLoadPageRun();
  //   onLoadDataRun();
  //   //multi language
  //   var langs = ["en_US", "fa_IR"];
  //   var langCode = localStorage.userLanguage;
  //   if (langs.indexOf(langCode) > -1)
  //     $.getJSON("/translations/" + langCode + ".json", translate);
  //   else
  //     $.getJSON("/translations/fa_IR.json", translate);

  //   //multi language
  // });



}
