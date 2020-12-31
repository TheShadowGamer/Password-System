const { React, i18n: { Messages } } = require("powercord/webpack");
const { FormTitle, Button } = require("powercord/components");
const TextInputWithButton = require("../TextInputWithButton")
const { Modal } = require("powercord/components/modal");
const { close: closeModal } = require("powercord/modal");

module.exports = class addPasswordMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            password: "",
            hidePassword: false,
            newPassword: "",
            hideNewPassword: false,
            resetPassword: "",
            hideResetPassword: false,
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
                    <FormTitle tag="h4">{Messages.PASSWORD_SYSTEM.MANAGE_PASSWORD}</FormTitle>
                </Modal.Header>
                <Modal.Content>
                    <table>
                        <tr>
                            <td>
                                <TextInputWithButton
                                    textBoxId={"PASSWORD-SYSTEM-CURRENT-PASSWORD"}
                                    buttonIcon={`${this.state.hidePassword ? `far fa-eye` : `far fa-eye-slash`}`}
                                    buttonText={Messages.PASSWORD_SYSTEM[`${this.state.hidePassword ? 'SHOW' : 'HIDE'}_PASSWORD`]}
                                    buttonOnClick={async (o) => {
                                        const text = document.getElementById("PASSWORD-SYSTEM-CURRENT-PASSWORD")
                                        if(text.getAttribute('type') == "password") {
                                            text.setAttribute('type', 'text')
                                            this.setState({ "hidePassword": false })
                                        } else {
                                            text.setAttribute('type', 'password')
                                            this.setState({ "hidePassword": true })
                                        }
                                        this.render()
                                    }}
                                    onChange={async (o) => {
                                        await this.setState({ password: o.toString() });
                                        this.hasUserInputed();
                                    }}
                                >{Messages.PASSWORD_SYSTEM.CURRENT_PASSWORD}</TextInputWithButton>
                            </td>
                            <td>
                                <TextInputWithButton
                                    textBoxId={"PASSWORD-SYSTEM-NEW-PASSWORD"}
                                    buttonIcon={`${this.state.hideNewPassword ? `far fa-eye` : `far fa-eye-slash`}`}
                                    buttonText={Messages.PASSWORD_SYSTEM[`${this.state.hideNewPassword ? 'SHOW' : 'HIDE'}_PASSWORD`]}
                                    buttonOnClick={async (o) => {
                                        const text = document.getElementById("PASSWORD-SYSTEM-NEW-PASSWORD")
                                        if(text.getAttribute('type') == "password") {
                                            text.setAttribute('type', 'text')
                                            this.setState({ "hideNewPassword": false })
                                        } else {
                                            text.setAttribute('type', 'password')
                                            this.setState({ "hideNewPassword": true })
                                        }
                                        this.render()
                                    }}
                                    onChange={async (o) => {
                                        await this.setState({ newPassword: o.toString() })
                                        this.hasUserInputed();
                                    }}
                                >{Messages.PASSWORD_SYSTEM.NEW_PASSWORD}</TextInputWithButton>
                            </td>
                            <td>
                                <Button
                                    disabled={!this.state.userHasInputed}
                                    onClick={() => {
                                        const actualPassword = this.props.settings.get(this.props.args[0].folderId.toString())
                                        if(btoa(this.state.password.toString()) === actualPassword) {
                                            this.props.settings.set(this.props.args[0].folderId.toString(), btoa(this.state.newPassword))
                                            this.props.settings.set("unlocked_" + this.props.args[0].folderId, false)
                                            return closeModal();
                                        }
                                        this.setState({ changeIncorrect: true })
                                        this.render()
                                    }}
                                >{Messages.PASSWORD_SYSTEM.CHANGE_PASSWORD}</Button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="3">
                                <h5 className="colorStandard-2KCXvj size14-e6ZScH h5-18_1nd title-3sZWYQ defaultMarginh5-2mL-bP" hidden={!this.state.changeIncorrect} >{Messages.PASSWORD_SYSTEM.INCORRECT_PASSWORD}</h5>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <TextInputWithButton
                                    textBoxId={"PASSWORD-SYSTEM-REMOVE-PASSWORD"}
                                    buttonIcon={`${this.state.hideResetPassword ? `far fa-eye` : `far fa-eye-slash`}`}
                                    buttonText={Messages.PASSWORD_SYSTEM[`${this.state.hideResetPassword ? 'SHOW' : 'HIDE'}_PASSWORD`]}
                                    buttonOnClick={async (o) => {
                                        const text = document.getElementById("PASSWORD-SYSTEM-REMOVE-PASSWORD")
                                        if(text.getAttribute('type') == "password") {
                                            text.setAttribute('type', 'text')
                                            this.setState({ "hideResetPassword": false })
                                        } else {
                                            text.setAttribute('type', 'password')
                                            this.setState({ "hideResetPassword": true })
                                        }
                                        this.render()
                                    }}
                                    onChange={async (o) => {
                                        await this.setState({ resetPassword: o.toString() })
                                        this.hasUserInputedReset()
                                    }}
                                >{Messages.PASSWORD_SYSTEM.PASSWORD}</TextInputWithButton>
                            </td>
                            <td>
                                <Button
                                    disabled={!this.state.userHasInputedReset}
                                    onClick={() => {
                                        const actualPassword = this.props.settings.get(this.props.args[0].folderId.toString())
                                        if(btoa(this.state.resetPassword.toString()) === actualPassword) {
                                            this.props.settings.delete(this.props.args[0].folderId)
                                            this.props.settings.delete("unlocked_" + this.props.args[0].folderId)
                                            return closeModal()
                                        }
                                        this.setState({ resetIncorrect: true })
                                        this.render()
                                    }}
                                >{Messages.PASSWORD_SYSTEM.REMOVE_PASSWORD}</Button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="3">
                                <h5 className="colorStandard-2KCXvj size14-e6ZScH h5-18_1nd title-3sZWYQ defaultMarginh5-2mL-bP" hidden={!this.state.resetIncorrect} >{Messages.PASSWORD_SYSTEM.INCORRECT_PASSWORD}</h5>
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
                        {Messages.PASSWORD_SYSTEM.CANCEL}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}