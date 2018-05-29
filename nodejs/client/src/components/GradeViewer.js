import React, {Component} from 'react';
import {Row, Col, Label} from 'react-bootstrap';
import GradeSlider from './GradeSlider';

export default class GradeViewer extends Component {
    render() {
        const grades = this.props.grades;
        const divSplit = 3;
        return (grades) ?
            <Col>
                <Row>
                    <Col md={divSplit}>
                        <Label>Full</Label>
                    </Col>
                    <Col md={12 - divSplit}>
                        <GradeSlider defaultValue={grades.full} fixed={true} color={"#0f0"}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={divSplit}>
                        <Label>Frame</Label>
                    </Col>
                    <Col md={12 - divSplit}>
                        <GradeSlider defaultValue={grades.frame} fixed={true} color={"#00f"}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}>
                        <Label>Center</Label>
                    </Col>
                    <Col md={12 - divSplit}>
                        <GradeSlider defaultValue={grades.center} fixed={true} color={"#f00"}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={divSplit}>
                        <Label>Top</Label>
                    </Col>
                    <Col md={12 - divSplit}>
                        <GradeSlider defaultValue={grades.top} fixed={true} color={"#ff0"}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={divSplit}>
                        <Label>Bot</Label>
                    </Col>
                    <Col md={12 - divSplit}>
                        <GradeSlider defaultValue={grades.bot} fixed={true} color={"#f0f"}/>
                    </Col>
                </Row>
            </Col>
            : "Waiting..."
    }
}