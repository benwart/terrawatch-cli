import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BoxWork from './BoxWork';
import { selectRunningWork } from '../store/workSelectors';

export const RunningWork = ({ running }) => {
  return (
    <BoxWork work={running} />
  );
};

RunningWork.propTypes = {
  running: PropTypes.array
};

const mapStateToProps = state => ({
  running: selectRunningWork(state)
});

export default connect(mapStateToProps)(RunningWork);