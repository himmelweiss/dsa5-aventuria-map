export default class MapMenu extends Application {
    constructor(app) {
        super(app);
        this.selectedFolder = null;
        this.desiredPermission = 0;
        this.lock = false;
    }

    static get defaultOptions() {
        const options = super.defaultOptions;

        mergeObject(options, {
            width: 600,
            height: 540,
            template: 'modules/dsa5-aventuria-map/templates/map_menu.hbs',
            title: game.i18n.localize("dsa5-aventuria-map.mapGMMenu"),
            dragDrop: [{ dragSelector: null, dropSelector: null }],
            resizable: true
        });

        return options;
    }


    async getData(options) {
        const data = await super.getData(options);

        if (!game.user.isGM)
            return;
       
        let aventuriaMapFolders = game.folders.filter(
            f => f.type === "JournalEntry" 
            && ( (f.parentFolder != null && f.parentFolder.name === game.i18n.localize("dsa5-aventuria-map.name") )
            || (f.parentFolder != null && f.parentFolder.parentFolder != null && f.parentFolder.parentFolder.name === game.i18n.localize("dsa5-aventuria-map.name") ) 
            || f.name === game.i18n.localize("dsa5-aventuria-map.name"))
        );
        aventuriaMapFolders.unshift("");

        mergeObject(data, {
            aventuriaMapFolders: aventuriaMapFolders,
        })

        return data
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find('.aventuria-map-folders-change').change(ev => {
            this.selectedFolder = game.folders.find(
                f => f.type === "JournalEntry" && f.id === $(ev.currentTarget).val()
            );
        });

        html.find('.desired-permission-change').change(ev => {
            this.desiredPermission = $(ev.currentTarget).val();
        });

        html.find('.set-permissions-click').click(async(ev) => { 

            if (this.selectedFolder == null) {
                ui.notifications.error(
                    game.i18n.localize("dsa5-aventuria-map.mapMenuErrorNoFolderSelected")
                );
                return;
            }

            if (this.lock)
                return;

            this.lock = true;
            
            let button = $(this._element).find('.set-permissions-click')
            button.prepend('<i class="fas fa-spinner fa-spin"></i>');

            await this.SetPermissionsProcess(this.selectedFolder, this.desiredPermission);

            button.find("i").remove();
            this.lock = false;
            
            ui.notifications.info(
                game.i18n.localize("dsa5-aventuria-map.mapMenuInfoFinish") + "<br>" + this.selectedFolder.name + " " + game.i18n.localize("dsa5-aventuria-map.mapMenuInfoFinishEnd")
            );
        });
    }

    
    SetPermissions(currentFolder, desiredPermission, journalUpdates)
    {
        if (currentFolder.content) {
                
            console.info(`Setting journal permissions in folder: ${currentFolder.name}`);

            for (const doc of currentFolder.content) {
                const newPerms = duplicate(doc.data.permission);
                newPerms.default = Number(desiredPermission);
                journalUpdates.push({_id: doc.id, permission: newPerms});
            }

        }

        const currentSubFolders = currentFolder.getSubfolders();
        if (currentSubFolders.length > 0) {
            currentSubFolders.forEach(folder => { 
                this.SetPermissions(folder, desiredPermission, journalUpdates);
            });
        }
    }

    SetPermissionsProcess(currentFolder, desiredPermission) {
        
        return new Promise((resolve,reject)=>{
            let journalUpdates = [];
            this.SetPermissions(currentFolder, desiredPermission, journalUpdates);
            
            JournalEntry.updateDocuments(journalUpdates);
                   
            resolve();
        })
        
    }
}