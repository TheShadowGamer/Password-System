const { React } = require("powercord/webpack");
const { FormTitle, Button } = require("powercord/components");
const { TextAreaInput } = require("powercord/components/settings");
const { Modal } = require("powercord/components/modal");
const { close: closeModal } = require("powercord/modal");

module.exports = class addPasswordMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            password: "",
            newPassword: "",
            resetPassword: "",
            userHasInputed: false,
            userHasInputedReset: false,
            changeIncorrect: false,
            resetIncorrect: false,
        };
        this.hasUserInputed = () => {
            if (this.state.password == "" || this.state.newPassword == "") {
              this.setState({ userHasInputed: false });
            } else {
              this.setState({ userHasInputed: true });
            }
        }
        this.hasUserInputedReset = () => {
            if(this.state.resetPassword == "") {
                this.setState({ userHasInputedReset: false });
            } else {
                this.setState({ userHasInputedReset: true });
            }
        }
    }

    render() {
        return (
            <Modal className="powercord-text">
                <Modal.Header>
                    <FormTitle tag="h4">Manage Password</FormTitle>
                </Modal.Header>
                <Modal.Content>
                    <table>
                        <tr>
                            <td>
                            <TextAreaInput
                                onChange={async (o) => {
                                        await this.setState({ password: o.toString() });
                                        this.hasUserInputed();
                                    }}
                                    rows={1}
                                >Current Password</TextAreaInput>
                            </td>
                            <td>
                                <TextAreaInput
                                    onChange={async (o) => {
                                        await this.setState({ newPassword: o.toString() })
                                        this.hasUserInputed();
                                    }}
                                    rows={1}
                                >New Password</TextAreaInput>
                            </td>
                            <td>
                                <Button
                                    disabled={!this.state.userHasInputed}
                                    onClick={() => {
                                        const actualPassword = this.props.settings.get(this.props.args[0].guild.id.toString())
                                        if(btoa(this.state.password.toString()) === actualPassword) {
                                            this.props.settings.set(this.props.args[0].guild.id.toString(), btoa(this.state.newPassword))
                                            this.props.settings.set("unlocked_" + this.props.args[0].guild.id.toString(), false)
                                            return closeModal();
                                        }
                                        this.setState({ changeIncorrect: true })
                                        this.render()
                                    }}
                                >Change Password</Button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="3">
                                <h5 className="colorStandard-2KCXvj size14-e6ZScH h5-18_1nd title-3sZWYQ defaultMarginh5-2mL-bP" hidden={!this.state.changeIncorrect} >That's not the correct password! Please try again!</h5>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <TextAreaInput
                                    onChange={async (o) => {
                                        await this.setState({ resetPassword: o.toString() })
                                        this.hasUserInputedReset()
                                    }}
                                    rows={1}
                                >Password</TextAreaInput>
                            </td>
                            <td>
                                <div>
                                    <Button
                                        disabled={!this.state.userHasInputedReset}
                                        onClick={() => {
                                            const actualPassword = this.props.settings.get(this.props.args[0].guild.id.toString())
                                            if(btoa(this.state.resetPassword.toString()) === actualPassword) {
                                                this.props.settings.delete(this.props.args[0].guild.id.toString())
                                                this.props.settings.delete("unlocked_" + this.props.args[0].guild.id.toString())
                                                return closeModal()
                                            }
                                            this.setState({ resetIncorrect: true })
                                            this.render()
                                        }}
                                    >Remove Password</Button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="3">
                                <h5 className="colorStandard-2KCXvj size14-e6ZScH h5-18_1nd title-3sZWYQ defaultMarginh5-2mL-bP" hidden={!this.state.resetIncorrect} >That's not the correct password! Please try again!</h5>
                            </td>
                        </tr>
                    </table>
                </Modal.Content>
                <Modal.Footer>
                    <Button
                        onClick={closeModal}
                        look={Button.Looks.LINK}
                        color={Button.Colors.TRANSPARENT}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}