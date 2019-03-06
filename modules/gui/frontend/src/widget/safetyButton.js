import {Button} from 'widget/button'
import {msg} from 'translate'
import Confirm from 'widget/confirm'
import PropTypes from 'prop-types'
import React from 'react'

export default class SafetyButton extends React.Component {
    state = {
        askConfirmation: false
    }

    askConfirmation(askConfirmation) {
        this.setState({askConfirmation})
    }

    renderConfirm() {
        const {title, message, label, onConfirm, children} = this.props
        return (
            <Confirm
                title={title}
                message={message}
                label={label || msg('widget.safetyButton.label')}
                onConfirm={() => {
                    this.askConfirmation(false)
                    onConfirm()
                }}
                onCancel={() => this.askConfirmation(false)}>
                {children}
            </Confirm>
        )
    }

    render() {
        const {
            look,
            size,
            shape = 'circle',
            icon = 'trash',
            tooltip,
            tooltipPlacement,
            disabled,
            skip,
            onConfirm
        } = this.props
        const {askConfirmation} = this.state
        return (
            <React.Fragment>
                <Button
                    chromeless
                    look={look}
                    size={size}
                    shape={shape}
                    icon={icon}
                    tooltip={tooltip}
                    tooltipPlacement={tooltipPlacement}
                    onClick={() => skip ? onConfirm() : this.askConfirmation(true)}
                    onClickHold={() => onConfirm()}
                    disabled={disabled}/>
                {askConfirmation ? this.renderConfirm() : null}
            </React.Fragment>
        )
    }
}

SafetyButton.propTypes = {
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    children: PropTypes.any,
    disabled: PropTypes.any,
    icon: PropTypes.string,
    label: PropTypes.string,
    look: PropTypes.string,
    size: PropTypes.string,
    skip: PropTypes.any,
    title: PropTypes.string,
    tooltip: PropTypes.string,
    tooltipPlacement: PropTypes.string
}