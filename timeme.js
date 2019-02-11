(function(){(function(root,factory){if(typeof module!=="undefined"&&module.exports){return module.exports=factory()}else if(typeof define==="function"&&define.amd){define([],function(){return root.TimeMe=factory()})}else{return root.TimeMe=factory()}})(this,function(){var TimeMe={startStopTimes:{},idleTimeoutMs:30*1e3,currentIdleTimeMs:0,checkStateRateMs:250,active:false,idle:false,currentPageName:"default-page-name",page_title:0,timeElapsedCallbacks:[],userLeftCallbacks:[],userReturnCallbacks:[],pageloadmetric:0,pageTitles:new Map,trackTimeOnElement:function(elementId){var element=document.getElementById(elementId);if(element){element.addEventListener("mouseover",function(){TimeMe.startTimer(element)});element.addEventListener("mousemove",function(){TimeMe.startTimer(element)});element.addEventListener("mouseleave",function(){TimeMe.stopTimer(element)});element.addEventListener("keypress",function(){TimeMe.startTimer(element)});element.addEventListener("focus",function(){TimeMe.startTimer(element)})}},getTimeOnElementInSeconds:function(elementId){var time=TimeMe.getTimeOnPageInSeconds(elementId);if(time){return time}else{return 0}},startTimer:function(pageName){if(!pageName){pageName=TimeMe.currentPageName}if(TimeMe.startStopTimes[pageName]===undefined){TimeMe.startStopTimes[pageName]=[]}else{var arrayOfTimes=TimeMe.startStopTimes[pageName];var latestStartStopEntry=arrayOfTimes[arrayOfTimes.length-1];if(latestStartStopEntry!==undefined&&latestStartStopEntry.stopTime===undefined){return}}TimeMe.pageTitles.set(pageName,TimeMe.page_title);TimeMe.startStopTimes[pageName].push({startTime:new Date,stopTime:undefined,pageload:TimeMe.pageloadmetric,clicks:0,scrolls:0});TimeMe.active=true},stopAllTimers:function(){var pageNames=Object.keys(TimeMe.startStopTimes);for(var i=0;i<pageNames.length;i++){TimeMe.stopTimer(pageNames[i])}},stopTimer:function(pageName){if(!pageName){pageName=TimeMe.currentPageName}var arrayOfTimes=TimeMe.startStopTimes[pageName];if(arrayOfTimes===undefined||arrayOfTimes.length===0){return}if(arrayOfTimes[arrayOfTimes.length-1].stopTime===undefined){arrayOfTimes[arrayOfTimes.length-1].stopTime=new Date}},getTimeOnCurrentPageInSeconds:function(){return TimeMe.getTimeOnPageInSeconds(TimeMe.currentPageName)},getTimeOnPageInSeconds:function(pageName){var timeInMs=TimeMe.getTimeOnPageInMilliseconds(pageName)["tottime"];if(timeInMs===undefined){return undefined}else{return{tt:TimeMe.getTimeOnPageInMilliseconds(pageName)["tottime"]/1e3,pl:TimeMe.getTimeOnPageInMilliseconds(pageName)["pageload"]}}},getTimeOnCurrentPageInMilliseconds:function(){return TimeMe.getTimeOnPageInMilliseconds(TimeMe.currentPageName)},getTimeOnPageInMilliseconds:function(pageName){var totalTimeOnPage=0;var arrayOfTimes=TimeMe.startStopTimes[pageName];if(arrayOfTimes===undefined){return}var timeSpentOnPageInSeconds=0;for(var i=0;i<arrayOfTimes.length;i++){var startTime=arrayOfTimes[i].startTime;var stopTime=arrayOfTimes[i].stopTime;var page_load=arrayOfTimes[i].pageload;if(stopTime===undefined){stopTime=new Date}var difference=stopTime-startTime;timeSpentOnPageInSeconds+=difference}totalTimeOnPage=Number(timeSpentOnPageInSeconds);return{tottime:totalTimeOnPage,pageload:page_load}},getTotalClickCountOnPage:function(pageName){var arrayOfTimes=TimeMe.startStopTimes[pageName];if(arrayOfTimes===undefined||arrayOfTimes.length===0)return;var clicks=0;for(var i=0;i<arrayOfTimes.length;i++){clicks+=arrayOfTimes[i].clicks}return clicks},getPageTitle:function(pageName){var arrayOfTimes=TimeMe.startStopTimes[pageName];if(arrayOfTimes===undefined||arrayOfTimes.length===0)return;var scrolls=0;for(var i=0;i<arrayOfTimes.length;i++){scrolls+=arrayOfTimes[i].scrolls}return scrolls},getTotalScrollCountOnPage:function(pageName){var arrayOfTimes=TimeMe.startStopTimes[pageName];if(arrayOfTimes===undefined||arrayOfTimes.length===0)return;var scrolls=0;for(var i=0;i<arrayOfTimes.length;i++){scrolls+=arrayOfTimes[i].scrolls}return scrolls},getTimeOnAllPagesInSeconds:function(){var allTimes=[];var pageNames=Object.keys(TimeMe.startStopTimes);for(var i=0;i<pageNames.length;i++){var pageName=pageNames[i];var timeOnPage=TimeMe.getTimeOnPageInSeconds(pageName).tt;var p_l=TimeMe.getTimeOnPageInSeconds(pageName).pl;var clicks=TimeMe.getTotalClickCountOnPage(pageName);console.log("allTimes",pageName,clicks);var scrolls=TimeMe.getTotalScrollCountOnPage(pageName);allTimes.push({pageName:pageName,timeOnPage:timeOnPage,clicks:clicks,scrolls:scrolls,PageLoad:p_l,pageTitle:TimeMe.pageTitles.get(pageName)})}return allTimes},handleClicks:function(){var arrayOfTimes=TimeMe.startStopTimes[TimeMe.currentPageName];var currentTimeRecord=arrayOfTimes.length-1;var clicks=arrayOfTimes[currentTimeRecord].clicks;clicks+=1;TimeMe.startStopTimes[TimeMe.currentPageName][currentTimeRecord].clicks=clicks},handleScroll:function(){var isScrolling;var callback=function(){var arrayOfTimes=TimeMe.startStopTimes[TimeMe.currentPageName];var currentTimeRecord=arrayOfTimes.length-1;var scrolls=arrayOfTimes[currentTimeRecord].scrolls;scrolls+=1;TimeMe.startStopTimes[TimeMe.currentPageName][currentTimeRecord].scrolls=scrolls};return function(){clearTimeout(isScrolling);isScrolling=setTimeout(function(){callback()},66)}}(),setIdleDurationInSeconds:function(duration){var durationFloat=parseFloat(duration);if(isNaN(durationFloat)===false){TimeMe.idleTimeoutMs=duration*1e3}else{throw{name:"InvalidDurationException",message:"An invalid duration time ("+duration+") was provided."}}return this},setCurrentPageName:function(pageName){TimeMe.currentPageName=pageName;return this},setPageTitle:function(page_title){TimeMe.page_title=page_title;return this},setPageLoad:function(pageloadtime){TimeMe.pageloadmetric=pageloadtime;return this},resetRecordedPageTime:function(pageName){delete TimeMe.startStopTimes[pageName]},resetAllRecordedPageTimes:function(){var pageNames=Object.keys(TimeMe.startStopTimes);for(var i=0;i<pageNames.length;i++){TimeMe.resetRecordedPageTime(pageNames[i])}},resetIdleCountdown:function(){if(TimeMe.idle){TimeMe.triggerUserHasReturned()}TimeMe.idle=false;TimeMe.currentIdleTimeMs=0},callWhenUserLeaves:function(callback,numberOfTimesToInvoke){this.userLeftCallbacks.push({callback:callback,numberOfTimesToInvoke:numberOfTimesToInvoke})},callWhenUserReturns:function(callback,numberOfTimesToInvoke){this.userReturnCallbacks.push({callback:callback,numberOfTimesToInvoke:numberOfTimesToInvoke})},triggerUserHasReturned:function(){if(!TimeMe.active){for(var i=0;i<this.userReturnCallbacks.length;i++){var userReturnedCallback=this.userReturnCallbacks[i];var numberTimes=userReturnedCallback.numberOfTimesToInvoke;if(isNaN(numberTimes)||numberTimes===undefined||numberTimes>0){userReturnedCallback.numberOfTimesToInvoke-=1;userReturnedCallback.callback()}}}TimeMe.startTimer()},triggerUserHasLeftPage:function(){if(TimeMe.active){for(var i=0;i<this.userLeftCallbacks.length;i++){var userHasLeftCallback=this.userLeftCallbacks[i];var numberTimes=userHasLeftCallback.numberOfTimesToInvoke;if(isNaN(numberTimes)||numberTimes===undefined||numberTimes>0){userHasLeftCallback.numberOfTimesToInvoke-=1;userHasLeftCallback.callback()}}}TimeMe.stopAllTimers()},callAfterTimeElapsedInSeconds:function(timeInSeconds,callback){TimeMe.timeElapsedCallbacks.push({timeInSeconds:timeInSeconds,callback:callback,pending:true})},checkState:function(){for(var i=0;i<TimeMe.timeElapsedCallbacks.length;i++){if(TimeMe.timeElapsedCallbacks[i].pending&&TimeMe.getTimeOnCurrentPageInSeconds()>TimeMe.timeElapsedCallbacks[i].timeInSeconds){TimeMe.timeElapsedCallbacks[i].callback();TimeMe.timeElapsedCallbacks[i].pending=false}}if(TimeMe.idle===false&&TimeMe.currentIdleTimeMs>TimeMe.idleTimeoutMs){TimeMe.idle=true;TimeMe.triggerUserHasLeftPage()}else{TimeMe.currentIdleTimeMs+=TimeMe.checkStateRateMs}},visibilityChangeEventName:undefined,hiddenPropName:undefined,listenForVisibilityEvents:function(){if(typeof document.hidden!=="undefined"){TimeMe.hiddenPropName="hidden";TimeMe.visibilityChangeEventName="visibilitychange"}else if(typeof document.mozHidden!=="undefined"){TimeMe.hiddenPropName="mozHidden";TimeMe.visibilityChangeEventName="mozvisibilitychange"}else if(typeof document.msHidden!=="undefined"){TimeMe.hiddenPropName="msHidden";TimeMe.visibilityChangeEventName="msvisibilitychange"}else if(typeof document.webkitHidden!=="undefined"){TimeMe.hiddenPropName="webkitHidden";TimeMe.visibilityChangeEventName="webkitvisibilitychange"}document.addEventListener(TimeMe.visibilityChangeEventName,function(){if(document[TimeMe.hiddenPropName]){TimeMe.triggerUserHasLeftPage()}else{TimeMe.triggerUserHasReturned()}},false);window.addEventListener("blur",function(){TimeMe.triggerUserHasLeftPage()});window.addEventListener("focus",function(){TimeMe.triggerUserHasReturned()});document.addEventListener("mousemove",function(){TimeMe.resetIdleCountdown()});document.addEventListener("keyup",function(){TimeMe.resetIdleCountdown()});document.addEventListener("touchstart",function(){TimeMe.resetIdleCountdown()});window.addEventListener("scroll",function(){TimeMe.resetIdleCountdown();TimeMe.handleScroll()},false);window.addEventListener("click",function(){TimeMe.handleClicks()});setInterval(function(){TimeMe.checkState()},TimeMe.checkStateRateMs)},websocket:undefined,websocketHost:undefined,setUpWebsocket:function(websocketOptions){if(window.WebSocket&&websocketOptions){var websocketHost=websocketOptions.websocketHost;try{TimeMe.websocket=new WebSocket(websocketHost);window.onbeforeunload=function(event){TimeMe.sendCurrentTime(websocketOptions.appId)};TimeMe.websocket.onopen=function(){TimeMe.sendInitWsRequest(websocketOptions.appId)};TimeMe.websocket.onerror=function(error){if(console){console.log("Error occurred in websocket connection: "+error)}};TimeMe.websocket.onmessage=function(event){if(console){console.log(event.data)}}}catch(error){if(console){console.error("Failed to connect to websocket host.  Error:"+error)}}}return this},websocketSend:function(data){TimeMe.websocket.send(JSON.stringify(data))},sendCurrentTime:function(appId){var timeSpentOnPage=TimeMe.getTimeOnCurrentPageInMilliseconds();var data={type:"INSERT_TIME",appId:appId,timeOnPageMs:timeSpentOnPage,pageName:TimeMe.currentPageName};TimeMe.websocketSend(data)},sendInitWsRequest:function(appId){var data={type:"INIT",appId:appId};TimeMe.websocketSend(data);return data},initialize:function(options){var page_title=TimeMe.page_title||"default-page-title";var idleTimeoutInSeconds=TimeMe.idleTimeoutMs||30;var currentPageName=TimeMe.currentPageName||"default-page-name";var pageloadmetric=TimeMe.pageloadmetric||0;var websocketOptions=undefined;if(options){page_title=options.page_title||page_title;idleTimeoutInSeconds=options.idleTimeoutInSeconds||idleTimeoutInSeconds;currentPageName=options.currentPageName||currentPageName;pageloadmetric=options.pageloadmetric||pageloadmetric;websocketOptions=options.websocketOptions}TimeMe.setIdleDurationInSeconds(idleTimeoutInSeconds).setPageTitle(page_title).setCurrentPageName(currentPageName).setPageLoad(pageloadmetric).setUpWebsocket(websocketOptions).listenForVisibilityEvents();TimeMe.startTimer()}};return TimeMe})}).call(this);var socket=new WebSocket("wss://montaignelabs.website/");var path=window.location.href;var json;var scroll_count=0;var clicks=0;var page_load;var url;var timeoutID=0;var inactive_state;var tot_clicks=0;var starttime=(new Date).getTime();var currentdate=new Date;var date;var time;$(window).ready(function(){date=currentdate.getFullYear()+"-"+(currentdate.getMonth()+1)+"-"+currentdate.getDate();time=currentdate.getHours()+":"+currentdate.getMinutes()+":"+currentdate.getSeconds();(function(){this.addEventListener("mousemove",resetTimer,false);this.addEventListener("mousedown",resetTimer,false);this.addEventListener("keypress",resetTimer,false);this.addEventListener("DOMMouseScroll",resetTimer,false);this.addEventListener("mousewheel",resetTimer,false);this.addEventListener("touchmove",resetTimer,false);this.addEventListener("MSPointerMove",resetTimer,false);startTimer()})();function startTimer(){timeoutID=window.setTimeout(goInactive,6e4);inactive_state=0}function resetTimer(e){window.clearTimeout(timeoutID);goActive()}function goInactive(){gather();socket.close()}function goActive(){startTimer();inactive_state=1}});setTimeout(console.log((new Date).getTime()));setTimeout(console.log(window.performance.timing.fetchStart));page_load=window.performance.timing.domComplete-window.performance.timing.navigationStart;TimeMe.initialize({currentPageName:path,idleTimeoutInSeconds:120,pageloadmetric:page_load,page_title:document.title,websocketOptions:{appId:""}});function hashHandler(){this.oldHash=window.location.hash;var that=this;var detect=function(){if(that.oldHash!==window.location.hash){TimeMe.stopTimer();console.dir(TimeMe);TimeMe.setCurrentPageName(window.location.href);console.dir(TimeMe);TimeMe.setPageTitle(document.title);that.oldHash=window.location.hash;TimeMe.startTimer()}};this.Check=setInterval(function(){detect()},100)}new hashHandler;window.addEventListener("beforeunload",gather);function gather(){var timeSpentOnPage=TimeMe.getTimeOnCurrentPageInSeconds();var timeSpentInfo=TimeMe.getTimeOnAllPagesInSeconds();console.log("json",json);console.log("data",timeSpentInfo);json=JSON.stringify({spentinfo:timeSpentInfo,date:date,time:time});socket.send(json)}
