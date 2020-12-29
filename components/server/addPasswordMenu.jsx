const { React, i18n: { Messages }  } = require("powercord/webpack");
const { FormTitle, Button } = require("powercord/components");
const { TextAreaInput } = require("powercord/components/settings");
const { Modal } = require("powercord/components/modal");
const { close: closeModal } = require("powercord/modal");

module.exports = class addPasswordMenu extends React.Component {
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

    render() {
        return (
            <Modal className="powercord-text">
                <Modal.Header>
                    <FormTitle tag="h4">{Messages.ADD_PASSWORD_SERVER}</FormTitle>
                </Modal.Header>
                <Modal.Content>
                    <TextAreaInput
                        onChange={async (o) => {
                            await this.setState({ password: o.toString() });
                            this.hasUserInputed();
                        }}
                        rows={1}
                    >{Messages.PASSWORD}</TextAreaInput>
                </Modal.Content>
                <Modal.Footer>
                    <Button
                        disabled={!this.state.userHasInputed}
                        onClick={() => {
                            this.props.settings.set(this.props.args[0].guild.id.toString(), btoa(this.state.password))
                            this.props.settings.set("unlocked_" + this.props.args[0].guild.id.toString(), false)
                            closeModal();
                        }}
                    >{Messages.SET_PASSWORD}</Button>
                    <Button
                        onClick={closeModal}
                        look={Button.Looks.LINK}
                        color={Button.Colors.TRANSPARENT}
                    >
                        {Messages.CANCEL}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}