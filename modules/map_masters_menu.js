import MapMenu from "./map_menu.js";

export default class MapMastersMenu {
    static registerButtons() {               

        game.dsa5.apps.mapMenu = new MapMenu();

        Hooks.on("getSceneControlButtons", btns => {
            if (game.user.isGM) {

                const gmMenu = btns.find(x => x.title == game.i18n.localize("gmMenu"))
                gmMenu.tools.push(
                    {
                        name: "MapMenu",
                        title: game.i18n.localize("dsa5-aventuria-map.mapGMMenu"),
                        icon: "fas fa-dsa5-map",
                        button: true,
                        onClick: () => { 
                            game.dsa5.apps.DSA5_Utility.renderToggle(game.dsa5.apps.mapMenu);

                            let aventuriaMapMainFolder = game.folders.filter(
                                f => f.type === "JournalEntry" && f.name === game.i18n.localize("dsa5-aventuria-map.name")
                            );

                            if (aventuriaMapMainFolder.length == 0) {
                                ui.notifications.error(
                                    game.i18n.localize("dsa5-aventuria-map.mapMenuInfoMainFolderNotFound") + " " + game.i18n.localize("dsa5-aventuria-map.name")
                                );
                            }
                        }
                    }
                )
            }
        });
    }
}