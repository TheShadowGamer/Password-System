const { getModule, React, getModuleByDisplayName } = require('powercord/webpack')
const changelog = require('./changelogs.json');

async function _getChangeLogsComponent (settings) {
    if (!this._ChangeLog) {
        this.settings = settings
        const _this = this;
        const { video } = await getModule([ 'video', 'added' ]);
        const DiscordChangeLog = await getModuleByDisplayName('ChangelogStandardTemplate');

        class ChangeLog extends DiscordChangeLog {
            constructor (props) {
                props.onScroll = () => void 0;
                props.track = () => void 0;
                super(props);

                this.oldRenderHeader = this.renderHeader;
                this.renderHeader = this.renderNewHeader.bind(this);
            }

            renderNewHeader () {
                const header = this.oldRenderHeader();
                header.props.children[0].props.children = `Password Folders - What's New`;
                return header;
            }

            renderVideo () {
                if (!changelog.image) {
                return null;
                }

                return React.createElement('img', {
                src: changelog.image,
                className: video,
                alt: ''
                });
            }

            renderFooter () {
                const footer = super.renderFooter();
                footer.props.children = React.createElement('span', {
                dangerouslySetInnerHTML: {
                    __html: changelog.footer
                }
                });
                return footer;
            }

            componentWillUnmount () {
                _this.settings.set('last_changelog', changelog.id);
            }
        }

        this._ChangeLog = ChangeLog;
    }
    return this._ChangeLog;
}

function formatChangeLog (json) {
    let body = '';
    const colorToClass = {
        GREEN: 'added',
        ORANGE: 'progress',
        RED: 'fixed',
        BLURPLE: 'improved'
    };
    json.contents.forEach(item => {
        if (item.type === 'HEADER') {
        body += `${item.text.toUpperCase()} {${colorToClass[item.color]}${item.noMargin ? ' marginTop' : ''}}\n======================\n\n`;
        } else {
        if (item.text) {
            body += item.text;
            body += '\n\n';
        }
        if (item.list) {
            body += ` * ${item.list.join('\n\n * ')}`;
            body += '\n\n';
        }
        }
    });
    return {
        date: json.date,
        locale: 'en-us',
        revision: 1,
        body
    };
}

module.exports.openChangeLogs = async (settings) => {
    const ChangeLog = await _getChangeLogsComponent(settings);
    const { open: openModal } = require('powercord/modal');
    openModal(() => React.createElement(ChangeLog, {
        changeLog: formatChangeLog(changelog)
    }));
}