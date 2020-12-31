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
        userHasInputed: false,
        fieldType: false
    };
    this.hasUserInputed = () => {
        if (!this.state.password) {
            this.setState({ userHasInputed: false });
        } else {
            this.setState({ userHasInputed: true });
        }
    };
  }

    render() {
        return (
            <Modal className="powercord-text">
                <Modal.Header>
                    <FormTitle tag="h4">{Messages.PASSWORD_SYSTEM.ADD_PASSWORD_FOLDER}</FormTitle>
                </Modal.Header>
                <Modal.Content>
                    <TextInputWithButton
                        textBoxId={"PASSWORD-SYSTEM-ADD-PASSWORD-FOLDER"}
                        buttonIcon={`${this.state.fieldType ? `far fa-eye` : `far fa-eye-slash`}`}
                        buttonText={Messages.PASSWORD_SYSTEM[`${this.state.fieldType ? 'SHOW' : 'HIDE'}_PASSWORD`]}
                        buttonOnClick={async (o) => {
                            const text = document.getElementById("PASSWORD-SYSTEM-ADD-PASSWORD-FOLDER")
                            if(text.getAttribute('type') == "password") {
                                text.setAttribute('type', 'text')
                                this.setState({ "fieldType": false })
                            } else {
                                text.setAttribute('type', 'password')
                                this.setState({ "fieldType": true })
                            }
                            this.render()
                        }}
                        onChange={async (o) => {
                            await this.setState({ password: o.toString() });
                            this.hasUserInputed();
                        }}
                    >{Messages.PASSWORD_SYSTEM.PASSWORD}</TextInputWithButton>
                </Modal.Content>
                <Modal.Footer>
                    <Button
                        disabled={!this.state.userHasInputed}
                        onClick={() => {
                            this.props.settings.set(this.props.args[0].folderId, btoa(this.state.password))
                            this.props.settings.set("unlocked_" + this.props.args[0].folderId, false)
                            closeModal();
                        }}
                    >{Messages.PASSWORD_SYSTEM.SET_PASSWORD}</Button>
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