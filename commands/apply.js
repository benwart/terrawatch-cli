import React from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { Box } from 'ink';
import store from '../store';
import { CompletedWork, RunningWork } from '../components';

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
  varFile: PropTypes.string,
  module: PropTypes.string,
};

TerraformApply.defaultProps = {
};

export default TerraformApply;
