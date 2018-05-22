import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';

export default class GradeViewer extends Component {
    render() {
        const grades = this.props.grades;
        return (grades) ? <Col>
            <Row>Full is: {grades.full}</Row>
            <Row>Frame is: {grades.frame}</Row>
            <Row>Center is: {grades.center}</Row>
            <Row>Top is: {grades.top}</Row>
            <Row>Bot is: {grades.bot}</Row>
        </Col> : "Waiting..."
    }
}