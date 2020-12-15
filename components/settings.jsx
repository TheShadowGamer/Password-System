const { React } = require('powercord/webpack');
const { TextAreaInput } = require("powercord/components/settings");
const { Button } = require("powercord/components");
const { SwitchItem } = require('powercord/components/settings');

module.exports = class Settings extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            password: "",
            userHasInputed: false,
            link: "",
            userHasInputedLink: false,
        };
        this.hasUserInputed = () => {
            if (!this.state.password) {
                this.setState({ userHasInputed: false });
            } else {
                this.setState({ userHasInputed: true });
            }
        };
        this.hasUserInputedLink = () => {
            if(!this.state.link) {
                this.setState({ userHasInputedLink: false })
            } else {
                this.setState({ userHasInputedLink: true})
            }
        }
    }
    render () { 
        return (
            <div>
                <SwitchItem
                    value={this.props.getSetting("lockDiscord", false)}
                    onChange={() => {
                        this.props.toggleSetting('lockDiscord', false)
                    }}
                >Discord Password</SwitchItem>
                {this.props.getSetting("lockDiscord", false) && (
                    <div>
                        <TextAreaInput
                            placeholder={atob(this.props.getSetting("password_Discord"))}
                            onChange={async (o) => {
                                await this.setState({ password: o.toString() });
                                this.hasUserInputed();
                            }}
                            rows={1}
                        >Password</TextAreaInput>
                        <Button
                            disabled={!this.state.userHasInputed}
                            onClick={() => {
                                this.props.updateSetting("password_Discord", btoa(this.state.password))
                            }}
                            hidden={true}
                        >Set Password</Button>
                        <br></br>
                        <SwitchItem
                            value={this.props.getSetting("openLink", false)}
                            onChange={() => {
                                this.props.toggleSetting('openLink')
                            }}
                        >Open a link if the password is incorrect</SwitchItem>
                        {this.props.getSetting("openLink", false) && (
                            <div>
                                <TextAreaInput
                                    placeholder={this.props.getSetting("LinkToOpen", "https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
                                    onChange={async (o) => {
                                        await this.setState({ link: o.toString() });
                                        this.hasUserInputedLink();
                                    }}
                                    rows={1}
                                >Link to open</TextAreaInput>
                                <Button
                                    disabled={!this.state.userHasInputedLink}
                                    onClick={() => {
                                        this.props.updateSetting("LinkToOpen", this.state.link)
                                    }}
                                    hidden={true}
                                >Set Link</Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }
}