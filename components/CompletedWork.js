import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Static, Text } from 'ink';
import { selectCompletedWork } from '../store/workSelectors';

const CompletedWork = ({ completed }) => {
  return (
    <Static>
      {completed.map(item => (
          <Text key={item.id}>{item.work} {item.resource}</Text>
      ))}
    </Static>
  );
};

CompletedWork.propTypes = {
  completed: PropTypes.array
};

const mapStateToProps = state => ({
  completed: selectCompletedWork(state)
});

export default connect(mapStateToProps)(CompletedWork);