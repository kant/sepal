import React from 'react'
import {connect} from 'react-redux'
import {location} from 'route'
import {Selectable} from 'widget/selectable'
import styles from './body.module.css'

const mapStateToProps = () => ({
    location: location()
})

let Section = ({location, path, children}) =>
    <Selectable
        active={inPath(location, path)}
        classNames={{
            default: styles.section,
            in: styles.in,
            out: styles.out
        }}>
        {children}
    </Selectable>
export default Section = connect(mapStateToProps)(Section)

function inPath(location, path) {
    return location.pathname === path
}
