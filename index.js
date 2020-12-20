//Require Things
const { Plugin } = require('powercord/entities')
const { getModule, React, FluxDispatcher } = require('powercord/webpack')
const { inject, uninject } = require('powercord/injector')
const { selectChannel } = getModule(['selectChannel'], false)
const { open } = require("powercord/modal");

//JSX Files
const addFolderPasswordMenu = require("./components/folder/addPasswordMenu")
const unlockFolder = require("./components/folder/unlockFolder")
const manageFolderPassword = require("./components/folder/managePassword");
const Settings = require("./components/settings")
const unlockDiscord = require("./components/unlockDiscord")
const unlockServer = require("./components/server/unlockServer")
const addServerPasswordMenu = require("./components/server/addPasswordMenu")
const manageServerPassword = require("./components/server/managePassword")
const changelog = require("./components/changelog/changelogs.json")

let _this
module.exports = class PasswordFolder extends Plugin {
    async startPlugin() {
        const enabled = await this.settings.get("lockDiscord")
        if(enabled === false || !enabled) {
            const lastChangelog = this.settings.get('last_changelog', '');
            if (changelog.id !== lastChangelog) {
                const changeLogExports = require("./components/changelog/changelogExports")
                changeLogExports.openChangeLogs(this.settings)
            }
        }
        //REQUIRE
        const menu = await getModule(["MenuItem"])
        const GuildFolderContextMenu = await getModule(m => m.default && m.default.displayName === 'GuildFolderContextMenu');
        const GuildContextMenu = await getModule(m => m.default && m.default.displayName === 'GuildContextMenu');
        //END REQUIRE
        //REGISTER SETTINGS
        powercord.api.settings.registerSettings("Password-System", {
            label: "Password System",
            category: this.entityID,
            render: Settings
        })
        //END REGISTER SETTINGS
        //BIND FUNCTIONS
        this.folderExpand = this.folderExpand.bind(this);
        this.lockDiscord = this.lockDiscord.bind(this);
        this.selectChannel = this.selectChannel.bind(this)
        _this = this
        //END BUND FUNCTIONS
        //REGISTER COMMANDS
        powercord.api.commands.registerCommand({
            command: "lock",
            description: "Locks discord",
            usage: '{c}',
            executor: this.lockDiscord
        })
        //END REGISTER COMMANDS
        //KEYBIND TO LOCK DISCORD
        document.body.addEventListener("keydown", this.keydown)
        //END KEYBIND TO LOCK DISCORD
        //INJECTION
        inject('folder-password', GuildFolderContextMenu, 'default', (args, res) => {
            if(!this.settings.get(args[0].folderId.toString())) {
                res.props.children.unshift(React.createElement(menu.MenuItem, {
                    id: 'set-password-folder',
                    label: 'Set Password',
                    action: () => {
                        open(() => React.createElement(addFolderPasswordMenu, { settings: this.settings, args: args }))
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
                action: () => open(() => React.createElement(manageFolderPassword, { settings: this.settings, args: args }))
            }))
            return res
        })
        //SERVER INJECTION
        inject('server-password', GuildContextMenu, 'default', (args, res) => {
            console.log(args[0].guild.id.toString())
            if(!this.settings.get(args[0].guild.id.toString())) {
                res.props.children.unshift(React.createElement(menu.MenuItem, {
                    id: 'set-password-server',
                    label: 'Set Password',
                    action: () => {
                        open(() => React.createElement(addServerPasswordMenu, { settings: this.settings, args: args }))
                    } 
                }))
                return res
            }
            if(this.settings.get("unlocked_" + args[0].guild.id.toString()) == false) {
                res.props.children.unshift(React.createElement(menu.MenuItem, {
                    id: 'unlock-server',
                    label: 'Unlock Server',
                    action: () => {
                        open(() => React.createElement(unlockServer, { settings: this.settings, args: args }))
                    } 
                }))
            }
            if(this.settings.get("unlocked_" + args[0].guild.id.toString()) == true) {
                res.props.children.unshift(React.createElement(menu.MenuItem, {
                    id: 'lock-server',
                    label: 'Lock Server',
                    action: () => this.settings.set("unlocked_" + args[0].guild.id.toString(), false)
                }))
                
            }
            res.props.children.unshift(React.createElement(menu.MenuItem, {
                id: 'manage-password',
                label: 'Manage Password',
                action: () => open(() => React.createElement(manageServerPassword, { settings: this.settings, args: args }))
            }))
            return res
        })
        //END INJECTION
        //FLUX DISPATCHER
        FluxDispatcher.subscribe('TOGGLE_GUILD_FOLDER_EXPAND', this.folderExpand)
        FluxDispatcher.subscribe('CHANNEL_SELECT', this.selectChannel)
        //END FLUX DISPATCHER
        //On discord startup
        const ConnectionStore = await getModule(['isTryingToConnect', 'isConnected'])
        const listener = () => {
            if (!ConnectionStore.isConnected()) return;

            ConnectionStore.removeChangeListener(listener)
            this.lockDiscord()
        }
        if (ConnectionStore.isConnected()) listener()
        else ConnectionStore.addChangeListener(listener)
        //end on discord startup
        GuildFolderContextMenu.default.displayName = 'GuildFolderContextMenu'
    }

    pluginWillUnload() {
        uninject('folder-password')
        uninject('server-password')
        powercord.api.settings.unregisterSettings('Password-System')
        powercord.api.commands.unregisterCommand('lock');
        FluxDispatcher.unsubscribe('TOGGLE_GUILD_FOLDER_EXPAND', this.folderExpand)
        FluxDispatcher.unsubscribe('CHANNEL_SELECT', this.selectChannel)
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
    async selectChannel (channel) {
        if(!this.lastChannel) this.lastChannel = channel
        if(!this.lastChannel.guildId)
        if (this.lastChannel.guildId !== channel.guildId) {
            const setting = await this.settings.get(channel.guildId.toString())
            if(!setting) return
            const unlocked = await this.settings.get("unlocked_" + channel.guildId.toString())
            if(unlocked === false) {
                selectChannel(this.lastChannel.guildId, this.lastChannel.channelId)
                powercord.api.notices.sendToast('ServerLocked', {
                    header: 'Server Locked!', // required
                    content: 'This server is locked! Please unlock the server first!',
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
                            onClick: () => open(() => React.createElement(unlockServer, { settings: this.settings, args: [{guild: {id: channel.guildId}}] }))
                        }
                    ],
                });
            } else return this.lastChannel = channel
        } else return this.lastChannel = channel
    }
    async lockDiscord () {
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
    async keydown(event) {
        if(event.key.toUpperCase() === "F8") {
            _this.lockDiscord()
        }
    }
}
