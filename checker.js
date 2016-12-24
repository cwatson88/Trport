$(document).ready(function() {

/**
 * [gamer - the main object holding all gamer data]
 * @type {Object}
 */
    var gamer = {};
  /**
   * [trials - holds all the data for trials, i.e. map etc]
   * @type {Object}
   */
    var trials = {};

/**
 * Begin functons block
 */
    addActions(kbdCSS);
    statBox();

/**
 * [addActions - Needed to make sure as content is refreshed or dynamically updated that the ghost icon to run the main program is inserted into the page, this needed to run the main base of the program. Self envoking function that is run every 6 seconds.]
 * @param {[function]} action [self envoking function]
 */
    function addActions(action) {
        setInterval(function() {
            action();
            console.log('action started');
        }, 6000);
    }

    function getObjectValue(ob, test) {
        for (let a in ob) {
            if (ob.hasOwnProperty(a)) {
                console.log("ob has pro obj." + a + " = " + ob[a]);
            //  if ()
                if (typeof(ob[a]) === 'object' && ob[a] !== null) {
                    console.log('is object');
                    listObj(ob[a]);
                }
            }
        }
    }
/**
 * [statBox - updates a box with a template for the details of the gamer. The box uses MDL styling.]
 *
 */
    function statBox() {
        var a = `<div class="demo-card-square mdl-card mdl-shadow--2dp">
            <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch-1">
        <input type="checkbox" id="switch-1" class="mdl-switch__input" checked>
        <span class="mdl-switch__label"></span>
        </label>
            <div class="mdl-card__title mdl-card--expand">
                <h2 class="mdl-card__title-text">Trials Stats</h2>
            </div>
            <div id= "gamer-stats" class="mdl-card__supporting-text">
            </div>
            <div class="mdl-card__actions mdl-card--border">
                <h3 id ="gamer-tag"></h3> </div>
        </div>`
        $('body').append(a);
        componentHandler.upgradeAllRegistered();
    }


    function kbdCSS() {

        if ($('.guardian-info:has(.TPS)').length == 0) {
            $('.guardian-info').prepend('<span class="TPS" style="cursor: pointer;"><img src="' + chrome.extension.getURL("images/ghost.png") + '"></span>');
            $('.TPS').click(function() {
                gamer.tag = $(this).next().text();
                $.ajax({
                    url: "https://proxy.destinytrialsreport.com/Platform/Destiny/SearchDestinyPlayer/1/" + gamer.tag + "/?lc=en",
                    success: function(result) {
                        (function() {
                            if (result.Response[0]) {
                                gamer.exist = true;
                                gamer.id = result.Response[0].membershipId;
                                $.ajax({
                                    url: "https://proxy.destinytrialsreport.com/Platform/Destiny/1/Account/" + gamer.id + "/?lc=en",
                                    success: function(result) {
                                        gamer.currrentCharacter = result.Response.data.characters["0"].characterBase.characterId;
                                        $.ajax({
                                            url: "https://api.destinytrialsreport.com/player/" + gamer.id,
                                            success: function(result) {
                                                var currentWeek = result;
                                                //gamer.flawlessY3 = getObjectValue(ob);
                                                gamer.flawless =
                                                    (function() {
                                                        if ('3' in currentWeek['0'].flawless.years) {
                                                            //return currentWeek['0'].flawless.years['3'];
                                                            return currentWeek['0'].flawless.years['3'].count;
                                                        } else {
                                                            return null;
                                                        }
                                                    })();
                                                gamer.week = currentWeek[0].thisWeek[0];

                                                console.log(gamer.flawless);
                                            }
                                        });
                                        $.ajax({
                                            url: "https://proxy.destinytrialsreport.com/Platform/Destiny/Stats/1/" + gamer.id + "/" + gamer.currrentCharacter + "/?modes=14&lc=en",
                                            success: function(result) {
                                                var TrialsInfo = result.Response;
                                                gamer.kd = TrialsInfo.trialsOfOsiris.allTime.killsDeathsRatio.basic.displayValue;
                                                gamer.kad = TrialsInfo.trialsOfOsiris.allTime.killsDeathsAssists.basic.displayValue;

                                            }
                                        });
                                    }
                                });
                            } else {
                                gamer.exist = false;
                            }
                        })();
                        //////////// end of 1ist ajax

                      console.log(gamer);
                    }
                });
            });
        } else {}
    }
});
