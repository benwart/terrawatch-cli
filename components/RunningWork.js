import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Text } from 'ink';
import { selectRunningWork } from '../store/workSelectors';

const RunningWork = ({ running }) => {
  return (
    <Box flexDirection="column" marginTop={1}>
      {running.map(item => (
          <Text key={item.id}>{item.work} {item.resource}</Text>
      ))}
    </Box>
  );
};

RunningWork.propTypes = {
  running: PropTypes.array
};

const mapStateToProps = state => ({
  running: selectRunningWork(state)
});

export default connect(mapStateToProps)(RunningWork);