//Require Things
const { Plugin } = require('powercord/entities')
const { getModule, React, FluxDispatcher, ReactDOM } = require('powercord/webpack')
const { inject, uninject } = require('powercord/injector')
const { open } = require("powercord/modal");

//JSX Files
const addPasswordMenu = require("./components/addPasswordMenu")
const unlockFolder = require("./components/unlockFolder")
const managePassword = require("./components/managePassword");
const Settings = require("./components/settings")
const unlockDiscord = require("./components/unlockDiscord")

module.exports = class PasswordFolder extends Plugin {
    async startPlugin() {
        //REQUIRE
        const menu = await getModule(["MenuItem"])
        const GuildFolderContextMenu = await getModule(m => m.default && m.default.displayName === 'GuildFolderContextMenu');
        //END REQUIRE
        //REGISTER SETTINGS
        powercord.api.settings.registerSettings("Password-Folders", {
            label: "Password Folders",
            category: this.entityID,
            render: Settings
        })
        //END REGISTER SETTINGS
        //BIND FUNCTIONS
        this.folderExpand = this.folderExpand.bind(this);
        this.onDiscordStart = this.onDiscordStart.bind(this);
        //END BUND FUNCTIONS
        //INJECTION
        inject('password-button', GuildFolderContextMenu, 'default', (args, res) => {
            if(!this.settings.get(args[0].folderId.toString())) {
                res.props.children.unshift(React.createElement(menu.MenuItem, {
                    id: 'open-password-menu',
                    label: 'Set Password',
                    action: () => {
                        open(() => React.createElement(addPasswordMenu, { settings: this.settings, args: args }))
                    } 
                }))
                return res
            }
            if(this.settings.get("unlocked_" + args[0].folderId.toString()) == false) {
                res.props.children.unshift(React.createElement(menu.MenuItem, {
                    id: 'unlock-folder',
                    label: 'Unlock Folder',
                    action: () => {
                        open(() => React.createElement(unlockFolder, { settings: this.settings, args: args }))
                    } 
                }))
            }
            if(this.settings.get("unlocked_" + args[0].folderId.toString()) == true) {
                res.props.children.unshift(React.createElement(menu.MenuItem, {
                    id: 'lock-folder',
                    label: 'Lock Folder',
                    action: () => this.settings.set("unlocked_" + args[0].folderId.toString(), false)
                }))
                
            }
            res.props.children.unshift(React.createElement(menu.MenuItem, {
                id: 'manage-password',
                label: 'Manage Password',
                action: () => open(() => React.createElement(managePassword, { settings: this.settings, args: args }))
            }))
            return res
        })
        //END INJECTION
        //FLUX DISPATCHER
        FluxDispatcher.subscribe('TOGGLE_GUILD_FOLDER_EXPAND', this.folderExpand)
        //END FLUX DISPATCHER
        //On discord startup
        const ConnectionStore = await getModule(['isTryingToConnect', 'isConnected'])
        const listener = () => {
            if (!ConnectionStore.isConnected()) return;

            ConnectionStore.removeChangeListener(listener)
            this.onDiscordStart()
        }
        if (ConnectionStore.isConnected()) listener()
        else ConnectionStore.addChangeListener(listener)
        //end on discord startup
        GuildFolderContextMenu.default.displayName = 'GuildFolderContextMenu'
    }

    pluginWillUnload() {
        uninject('password-button')
        powercord.api.settings.unregisterSettings('Password-Folders')
        FluxDispatcher.unsubscribe('TOGGLE_GUILD_FOLDER_EXPAND', this.folderExpand)
    }

    async folderExpand (folder) {
        const { toggleGuildFolderExpand } = await getModule(['move', 'toggleGuildFolderExpand'])
        const ExpandedFolderStore = await getModule(['getExpandedFolders'])
        const expandedFolders = ExpandedFolderStore.getExpandedFolders()
        const setting = await this.settings.get(folder.folderId.toString())
        if(setting) {
            const unlocked = await this.settings.get("unlocked_" + folder.folderId.toString())
            if(unlocked === false) {
                if(expandedFolders.has(folder.folderId)) {
                    toggleGuildFolderExpand(folder.folderId)
                    powercord.api.notices.sendToast('FolderLocked', {
                        header: 'Folder Locked!', // required
                        content: 'This folder is locked! Please unlock the folder first!',
                        type: 'info',
                        timeout: 10e3,
                        buttons: [
                            {
                                text: 'Okay',
                                size: 'medium',
                                look: 'outlined'
                            },
                            {
                                text: 'Unlock',
                                size: 'medium',
                                look: 'outlined',
                                onClick: () => open(() => React.createElement(unlockFolder, { settings: this.settings, args: [{folderId: folder.folderId}] }))
                            }
                        ],
                    });
                }
            }
        }
    }
    async onDiscordStart () {
        const enabled = await this.settings.get("lockDiscord")
        if(enabled === false || !enabled) return;
        const password = await this.settings.get("password_Discord")
        if(!password) return;
        const {openModal: openNewModal} = getModule(['openModal'], false)
        const e = await getModule(m => m.app && Object.keys(m).length === 1, false).app
        const app = await document.querySelector(`.${e}`)
        app.remove()
        openNewModal((props) => React.createElement(unlockDiscord, {settings: this.settings, app: app, ...props}), {onCloseRequest: () => {}})
    }
}
