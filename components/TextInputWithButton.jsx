/*
  Original component taken from https://github.com/GriefMoDz/smart-typers
  Thank you to @GriefMoDz (Harley) for letting me use this component
*/


const { React, getModule } = require('powercord/webpack');
const { Flex } = require('powercord/components');
const { FormItem } = require('powercord/components/settings');

const Button = getModule(m => m.ButtonLink, false).default;

module.exports = class TextInputWithButton extends React.PureComponent {
  constructor (props) {
    super(props);

    this.classes = getModule([ 'container', 'editIcon' ], false);
    this.iconStyles = (props.buttonIcon && {
      color: 'var(--text-normal)',
      lineHeight: 0,
      backgroundImage: 'none',
      marginTop: 0
    }) || {};
  }

  handleChange (e) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(e.currentTarget.value);
    }
  }

  render () {
    const { classes } = this;
    const { title, disabled, placeholder, buttonOnClick, buttonIcon, onKeyPress } = this.props;

    return (
      <FormItem title={title}>
        <h5 class="colorStandard-2KCXvj size14-e6ZScH h5-18_1nd title-3sZWYQ defaultMarginh5-2mL-bP">{this.props.children}</h5>
        <div className={[ 'passwordSystem-Text-Input', classes.container, classes.hasValue, disabled && classes.disabled ].join(' ')}>
          <Flex className={classes.layout}>
            <Flex.Child className={classes.input.split(' ').splice(1).join(' ')} style={{ cursor: 'auto' }}>
              <input type='text' value={this.props.defaultValue} onKeyPress={onKeyPress} placeholder={placeholder} disabled={disabled} onChange={this.handleChange.bind(this)} id={this.props.textBoxId}></input>
            </Flex.Child>
            <Flex shrink={1} grow={0} style={{ margin: 0 }}>
              <Button className={classes.button} disabled={disabled} size={Button.Sizes.MIN} color={Button.Colors.GREY} look={Button.Looks.GHOST} onClick={buttonOnClick}>
                <span className={classes.text}>{this.props.buttonText}</span>
                <span className={[ buttonIcon, classes.editIcon ].join(' ')} style={this.iconStyles}></span>
              </Button>
            </Flex>
          </Flex>
        </div>
      </FormItem>
    );
  }
};