import React from 'react';
import PropTypes from 'prop-types';
import { Static, Text } from 'ink';

const StaticWork = ({ work }) => {
  return (
    <Static>
      {work.map(item => (
          <Text key={item.id}>{item.work} {item.resource}</Text>
      ))}
    </Static>
  );
};

StaticWork.propTypes = {
  work: PropTypes.array
};

export default StaticWork;