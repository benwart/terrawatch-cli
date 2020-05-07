import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StaticWork from './StaticWork';
import { selectCompletedWork } from '../store/workSelectors';

export const CompletedWork = ({ completed }) => {
  return (
    <StaticWork work={completed} />
  );
};

CompletedWork.propTypes = {
  completed: PropTypes.array
};

const mapStateToProps = state => ({
  completed: selectCompletedWork(state)
});

export default connect(mapStateToProps)(CompletedWork);