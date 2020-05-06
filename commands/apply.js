import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { Box } from 'ink';
import store from '../store';
import { define, run, complete, WORK_CREATE, WORK_DESTROY } from '../store/workSlice';
import { CompletedWork, RunningWork } from '../components';

store.dispatch(define(1, 'resouce1', WORK_CREATE));
store.dispatch(define(2, 'resouce2', WORK_CREATE));
store.dispatch(define(3, 'resouce1', WORK_DESTROY));
store.dispatch(run(1, 10));
store.dispatch(run(2, 30));
store.dispatch(run(3, 30));
store.dispatch(complete(2, 20));
store.dispatch(complete(1, 60));

/// Terraform Apply Wrapper with Progress
const TerraformApply = ({ varFile, module }) => {
  
  useEffect(() => {
    // kickoff terraform apply (force apply)
    // construct the terraform worker
    // subscribe to event emitter for actions
    // 
  })

  return (
    <Provider store={store}>
      <Box flexDirection="column">
        <CompletedWork />
        <RunningWork />
      </Box>
    </Provider>
  );
};

TerraformApply.propTypes = {
  varFile: PropTypes.string,
  module: PropTypes.string,
};

TerraformApply.defaultProps = {
};

export default TerraformApply;
