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
            fieldType: false
        };
        this.submit = () => {
            if(this.state.password.length === 0) return
            this.props.settings.set("folder_" + this.props.args[0].folderId, btoa(this.state.password))
            this.props.settings.set("unlocked_folder_" + this.props.args[0].folderId, false)
            closeModal();
        }
    }

    render() {
        return (
            <Modal className="powercord-text">
                <Modal.Header>
                    <FormTitle tag="h4">{Messages.PASSWORD_SYSTEM.ADD_PASSWORD_FOLDER}</FormTitle>
                </Modal.Header>
                <Modal.Content>
                    <TextInputWithButton
                        onKeyPress={async (e) => {
                            if(e.charCode == 13) this.submit()
                        }}
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
                        }}
                    >{Messages.PASSWORD_SYSTEM.PASSWORD}</TextInputWithButton>
                </Modal.Content>
                <Modal.Footer>
                    <Button
                        disabled={this.state.password.length === 0}
                        onClick={() => {
                            this.submit()
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