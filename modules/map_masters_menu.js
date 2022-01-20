import MapMenu from "./map_menu.js";

export default class MapMastersMenu {
    static registerButtons() {               

        CONFIG.Canvas.layers.mapdsamenu = { layerClass: MapDSAMenuLayer, group: "primary" };

        game.dsa5.apps.mapMenu = new MapMenu();

        Hooks.on("getSceneControlButtons", btns => {
            if (game.user.isGM) {
                const mapDSAMenuOptions = [{
                        name: "MapMenu",
                        title: game.i18n.localize("mapGMMenu"),
                        icon: "fas fa-dsa5-map",
                        button: true,
                        onClick: () => { game.dsa5.apps.DSA5_Utility.renderToggle(game.dsa5.apps.mapMenu) }
                    }
                ];
                                
                btns.push({
                    name: "MapGMMenu",
                    title: game.i18n.localize("mapGMMenu"),
                    icon: "fas fa-dsa5-map",
                    layer: "mapdsamenu",
                    tools: mapDSAMenuOptions
                });
            }
        });
    }

}

class MapDSAMenuLayer extends CanvasLayer {
    static get layerOptions() {
        return foundry.utils.mergeObject(super.layerOptions, {
            name: "mapdsamenu",
            canDragCreate: false,
            controllableObjects: true,
            rotatableObjects: true,
            zIndex: 655,
        });
    }
}

