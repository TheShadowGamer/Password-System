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
        };
        this.hasUserInputed = () => {
            if (!this.state.password) {
                this.setState({ userHasInputed: false });
            } else {
                this.setState({ userHasInputed: true });
            }
        };
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
                                this.props.updateSetting("unlocked_Discord", false)
                            }}
                            hidden={true}
                        >Set Password</Button>
                        <SwitchItem
                            value={this.props.getSetting("rickroll", true)}
                            onChange={() => {
                                this.props.toggleSetting('rickroll', true)
                            }}
                        >Rickroll if the password is incorrect</SwitchItem>
                    </div>
                )}
            </div>
        )
    }
}