


$(document).ready(function() {
  /*var style = document.createElement('link');
  style.rel = 'stylesheet';
  style.type = 'text/css';
  style.href = chrome.extension.getURL('css/material.css');
  (document.head||document.documentElement).appendChild(style);*/
  var style = document.createElement('script');
  style.type = 'javascript';
  style.src = chrome.extension.getURL('material.js');
  (document.head||document.documentElement).appendChild(style);



  addActions(kbdCSS);
  statBox();

  function addActions(action) {
    setInterval(function() {
      action();
      console.log('action started');
    }, 6000);
  }

function returnValue(x){
  if (x.getValue){
    return x.getValue;
  }
  else{
    return x.elseValue;
  }
}

function getObjectValue(ob) {
  for (let a in ob) {
    if (ob.hasOwnProperty(a)) {
      console.log("ob has pro obj." + a + " = " + ob[a]);
       if(typeof(ob[a]) === 'object' && ob[a] !== null){
      	console.log('is object');
        listObj(ob[a]);
      }

    }
  }
}

  function kbdCSS() {

    if ($('.guardian-info:has(.TPS)').length == 0) {
      $('.guardian-info').prepend('<span class="TPS" style="cursor: pointer;"><img src="'+chrome.extension.getURL("images/ghost.png")+'"></span>');
      $('.TPS').click(function() {
        var gt = $(this).next().text();
        $.ajax({
          url: "https://proxy.destinytrialsreport.com/Platform/Destiny/SearchDestinyPlayer/1/" + gt + "/?lc=en",
          success: function(result) {
            (function(){
              if(result.Response[0]){
                var gamer = result.Response[0].membershipId;

            $.ajax({
              url: "https://proxy.destinytrialsreport.com/Platform/Destiny/1/Account/" + gamer + "/?lc=en",
              success: function(result) {
                var character = result.Response.data.characters["0"].characterBase.characterId;
                $.ajax({
                  url: "https://api.destinytrialsreport.com/player/" + gamer,
                  success: function(result) {
                    var currentWeek = result;
                    console.log(currentWeek);
                    var weekStats = [
                      // (function(){
                      //   if(currentWeek[0].flawless.years){
                      //       var flawless = currentWeek[0].flawless.years[3];
                      //     return flawless.count
                      //   }
                      //   else{
                      //     return 0;
                      //   }
                      // })()
                      returnValue({
                        getValue : (function(){
                          if (currentWeek['0'].flawless.hasOwnProperty('years')){
                            if(currentWeek['0'].flawless.years.hasOwnProperty('3')){
                              return currentWeek['0'].flawless.years['3'];
                            }
                            else{
                              return null;
                            }
                          }
                          else {
                            return null;
                          }

                        })(),
                        elseValue : 0
                      }),
                      currentWeek[0].thisWeek[0]
                    ];
                    for (i = 0; i < weekStats.length; i++) {
                      console.log(weekStats[i]);
                    }

                  }
                });
                  $.ajax({
                    url:"https://proxy.destinytrialsreport.com/Platform/Destiny/Stats/1/"+gamer+"/"+character+"/?modes=14&lc=en",
                    success: function(result) {
                      var TrialsInfo = result.Response;
                      var playerStats = [
                        "KD:"+TrialsInfo.trialsOfOsiris.allTime.killsDeathsRatio.basic.displayValue,
                        "KaD:"+TrialsInfo.trialsOfOsiris.allTime.killsDeathsAssists.basic.displayValue
                      ];
                      for (i = 0; i < playerStats.length; i++) {
                        console.log(playerStats[i]);
                      }

                    }
                  });
              }
            });
          }
          else{
            console.log ("does not exist");
          }
        })();
//////////// end of 1st aja
          }
        });
      });
    } else {}
  }

  function statBox(status){
    var a =`<div class="demo-card-square mdl-card mdl-shadow--2dp">
      <input class="mdl-slider mdl-js-slider" type="range"
    min="0" max="100" value="0" tabindex="0">
        <div class="mdl-card__title mdl-card--expand">
            <h2 class="mdl-card__title-text">Trials Stats</h2>
        </div>
        <div class="mdl-card__supporting-text"> Stats here</div>
        <div class="mdl-card__actions mdl-card--border">
            <h3>BG Watson</h3> </div>
    </div>`
    $('body').append(a);
      componentHandler.upgradeAllRegistered();
  }
});
