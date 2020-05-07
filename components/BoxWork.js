import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from 'ink';

const BoxWork = ({ work }) => {
  return (
    <Box flexDirection="column" marginTop={1}>
      {work.map(item => (
          <Text key={item.id}>{item.work} {item.resource}</Text>
      ))}
    </Box>
  );
};

BoxWork.propTypes = {
  work: PropTypes.array
};

export default BoxWork;