const { React, getModule } = require("powercord/webpack");
const { FormTitle, Button } = require("powercord/components");
const { TextAreaInput } = require("powercord/components/settings");
const electron = require("electron")
const Modal = getModule(['ModalRoot'], false)
const modalStack = getModule(['openModal'], false)

module.exports = class unlockDiscord extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            password: "",
            userHasInputed: false,
            incorrect: false
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
            <Modal.ModalRoot className="powercord-text" transitionState={this.props.transitionState}>
                <Modal.ModalHeader>
                    <FormTitle tag="h4">Unlock Discord</FormTitle>
                </Modal.ModalHeader>
                <Modal.ModalContent>
                    <TextAreaInput
                        onChange={async (o) => {
                            await this.setState({ password: o.toString() });
                            this.hasUserInputed();
                        }}
                        rows={1}
                    >Password</TextAreaInput>
                    <h5 className="colorStandard-2KCXvj size14-e6ZScH h5-18_1nd title-3sZWYQ defaultMarginh5-2mL-bP" hidden={!this.state.incorrect} >That's not the correct password! Please try again!</h5>
                </Modal.ModalContent>
                <Modal.ModalFooter>
                    <Button
                        disabled={!this.state.userHasInputed}
                        onClick={() => {
                            const password = this.props.settings.get("password_Discord")
                            if(btoa(this.state.password) === password) {
                                const popouts = document.querySelector(`.${getModule(['popouts', 'popout'], false).popouts}`)
                                popouts.parentNode.insertBefore(this.props.app, popouts)
                                return modalStack.closeModal(modalStack.useModalsStore.getState().default[0].key)
                            }
                            this.setState({ incorrect: true })
                            if(this.props.settings.get("rickroll") === true) {
                                electron.shell.openExternal("https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstleyVEVO")
                            }
                            this.render()
                        }}
                    >Unlock</Button>
                </Modal.ModalFooter>
            </Modal.ModalRoot>
        );
    }
}