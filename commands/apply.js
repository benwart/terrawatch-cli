import React, { useState, useEffect } from 'react';
import { Box, Static, Text } from 'ink';

/// Terraform Apply Wrapper with Progress
const TerraWatch = () => {
  const [started] = useState(true);
  const [runningActions, setRunningActions] = useState([
    'running 1',
    'running 2',
    'running 3'
  ]);
  const [completedActions, setCompletedActions] = useState([
    'completed 1',
    'completed 2',
    'completed 3'
  ]);

  useEffect(() => {
    // kickoff terraform apply (force apply)
    // parse plan
    // update task count
    // parse live output
      // update running actions
      setRunningActions([...runningActions, 'on the fly 1']);
      // update completed actions
      // handle errors
      // handle completion of process
    // pass through process messages like sigterm and sigkill
  }, [started])

  return (
    <Box flexDirection="column">
      <Text>TerraWatch</Text>
      <Text>Version 1.0.0</Text>
      <Static>
        {completedActions.map(action => (
					<Text key={action}>{action}</Text>
				))}
      </Static>

      <Box flexDirection="column" marginTop={1}>
        {runningActions.map(action => (
					<Text key={action}>{action}</Text>
				))}
      </Box>
    </Box>
  );
};

export default TerraWatch;