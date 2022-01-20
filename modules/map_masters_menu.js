import MapMenu from "./map_menu.js";

export default class MapMastersMenu {
    static registerButtons() {               

        game.dsa5.apps.mapMenu = new MapMenu();

        Hooks.on("getSceneControlButtons", btns => {
            if (game.user.isGM) {

                const gmMenu = btns.find(x => x.name == "GM Menu")
                gmMenu.tools.push(
                    {
                        name: "MapMenu",
                        title: game.i18n.localize("mapGMMenu"),
                        icon: "fas fa-dsa5-map",
                        button: true,
                        onClick: () => { game.dsa5.apps.DSA5_Utility.renderToggle(game.dsa5.apps.mapMenu) }
                    }
                )
            }
        });
    }
}