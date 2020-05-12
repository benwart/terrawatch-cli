import React from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { Box } from 'ink';
import store from '../store';
import { CompletedWork, RunningWork } from '../components';
import { WORK_CREATE, WORK_UPDATE, WORK_DESTROY, define, run } from '../store/workSlice';

import Terraform from '../lib/terraform';

const defineWork = () => {
  const tf = new Terraform({ cwd: './test', noColor: true, async: true });

  // plan -> output.plan
  const planFile = 'tf.plan';
  tf.plan({ out: planFile }, { silent: true, async: false });

  // show -json output.plan -> stdout -> parse
  const showOutput = tf.show({ json: true }, { silent: true, async: false }, planFile).stdout;
  const planJson = JSON.parse(showOutput);

  // extract resources and actions
  const resourceChanges = planJson.resource_changes
    .map(resource => {
      return resource.change.actions
        .map(action => {
          return { 
            address: resource.address,
            work: action
          }
        })
    })
    .flat();

  resourceChanges.forEach( (change, index) => {
    store.dispatch(define(index, change.address, change.work));
  })
  
  resourceChanges.forEach( (_, index) => {
    store.dispatch(run(index, 10));
  })

  // apply output.plan
}
defineWork();

/// Terraform Apply Wrapper with Progress
const TerraformApply = ({ varFile, module }) => {
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
  /// Terraform var-file
  varFile: PropTypes.string,
  /// Terraform module
  module: PropTypes.string,
};

TerraformApply.defaultProps = {
};

export default TerraformApply;
