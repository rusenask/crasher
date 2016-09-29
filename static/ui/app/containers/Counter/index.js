/*
 *
 * Counter
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import selectCounter from './selectors';

import { Grid, Row, Col, Button, Jumbotron } from 'react-bootstrap';

export class Counter extends React.Component { // eslint-disable-line react/prefer-stateless-function


  render() {

    const jumbotronInstance = (
      <Jumbotron>
        <Row>
          <Col md={10} >
            <h1>Hello, stateful world!</h1>
            <p>This is a simple app that is counting something very precious!</p>
            <p><Button bsStyle="success">Count</Button>
              {' '}
              <Button bsStyle="warning">Reset</Button>
              {' '}
              <Button bsStyle="danger">Crash!</Button></p>
          </Col>
          <Col md={2}>
            <h1> 10 </h1>
          </Col>
        </Row>
      </Jumbotron>
    );

    return (
      <div>
        <Grid>
          <Row>
            <Col>
              {jumbotronInstance}
            </Col>
          </Row>
          <hr/>

        </Grid>

      </div>
    );
  }
}

const mapStateToProps = selectCounter();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
