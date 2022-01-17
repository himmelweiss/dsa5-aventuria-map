Hooks.on("init", async function() {
    console.log("Initializing DSA5 aventuria map module")

    game.settings.register("dsa5-aventuria-map", "firstTimeStart", {
        name: "firstTimeStart",
        hint: "firstTimeStart",
        scope: "world",
        config: false,
        default: false,
        type: Boolean
    })
})


Hooks.once("ready", function() {
    if (!game.settings.get("dsa5-aventuria-map", "firstTimeStart")) {
        let msg = game.i18n.localize('dsa5-aventuria-map.welcome')
        ChatMessage.create(game.dsa5.apps.DSA5_Utility.chatDataSetup(msg))
        game.settings.set("dsa5-aventuria-map", "firstTimeStart", true)
    }

    game.dsa5.apps.journalBrowser.rshs.push({
        id: "Aventurien Karte",
        path: "modules/dsa5-aventuria-map/adventurede.json",
        visible: true
    })
})