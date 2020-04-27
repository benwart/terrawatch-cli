import React from 'react';
import BigText from 'ink-big-text';
import { Box, Text } from 'ink';

const TerraWatch = () => {
  return (
    <Box>
      <BigText font="simple" colors={["cyan"]} text="TerraWatch" />
      <Text>Version 1.0.0</Text>
    </Box>
  );
};

export default TerraWatch;