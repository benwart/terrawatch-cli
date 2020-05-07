'use strict';
import sh from 'shelljs';

/*
https://github.com/strigo/terraformjs

The MIT License (MIT)

Copyright (c) 2017-present Strigo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * Retrieve a stripped version of terraform's executable version.
 * e.g. (Terraform v0.8.5 => 0.8.5)
 * @todo Use Terraform class API here instead
 * @returns {String} A stripped string representing the version
 */
export const version = () => {
  const outcome = sh.exec('terraform --version', { silent: true });
  const parsedVersion = outcome.stdout.split('\n')[0].split(' ')[1].substr(1);
  return parsedVersion;
};

/**
 * Normalize an option.
 * e.g. Converts `vars_file` to `-vars-file`.
 * @param {String} opt string to normalize
 * @returns {String} A normalized option
 */
const normalizeArg = (opt) => {
  let normalizedOpt = opt.replace('_', '-');
  normalizedOpt = `-${normalizedOpt}`;
  return normalizedOpt;
}

/**
  * Construct a string from an object of options
  *
  *  For instance:
  *    {
  *      'state': 'state.tfstate',
  *      'var': {
  *        'foo': 'bar',
  *        'bah': 'boo'
  *      },
  *      'vars_file': [
  *        'x.tfvars',
  *        'y.tfvars'
  *      ]
  *    }
  * will be converted to:
  *   `-state=state.tfstate -var 'foo=bar' -var 'bah=boo' -vars-file=x.tfvars -vars-file=y.tfvars`
  * @param {Object} opts - an object of options
  * @return {String} a string of CLI options
  */
 const constructOptString = ({ noColor }, opts) => {
  // MAP/forEach
  // push+join array instead of string concat
  let optString = [];

  Object.keys(opts).forEach((option) => {
    if (option === 'var') {
      Object.keys(opts[option]).forEach((v) => {
        optString.push(`-var '${v}=${opts[option][v]}'`);
      });
    } else if (typeof opts[option] === 'boolean') {
      if (opts[option]) {
        optString.push(`-${option}`);
      }
    } else if (Array.isArray(opts[option])) {
      opts[option].forEach((item) => {
        optString.push(`${normalizeArg(option)}=${item}`);
      });
    } else {
      optString.push(`${normalizeArg(option)}=${opts[option]}`);
    }
  });

  if (noColor) {
    optString.push('-no-color');
  }

  return optString.join('');
}

/**
 * Terraform API Class
 */
export default class Terraform {
  /**
   * Execute terraform commands
   * @todo Implement `remote`, `debug` and `state` support (which require subcommands)
   * @todo Assert that terraform exists before allowing to perform actions
   * @todo once finalized, document each command
   * @param {String} workDir (default: cwd)
   * @param {Boolean} silent (default: false)
   * @param {Boolean} noColor (default: false)
   * @param {Boolean} async (default; false)
   */
  constructor(workDir = process.cwd(), silent = false, noColor = false, async = false) {
    this.workDir = workDir;
    this.silent = silent;
    this.noColor = noColor;
    this.async = async;
  }

  /**
  * Execute a terraform subcommand with its arguments and options
  * @todo append subCommandString only if it's not undefined
  * @param {String} subCommandString - a subcommand + options string
  * @return {Object} shelljs exec object
  */
  terraform(subCommandString) {
    let command = 'terraform';
    if (subCommandString) {
      command = `${command} ${subCommandString}`;
    }

    const outcome = sh.exec(command, { silent: this.silent, cwd: this.workDir, async: this.async });
    outcome.command = command;

    return outcome;
  }

  /**
   * Execute `terraform apply`
   * @param  {Object} args      option=value pairs for this subcommand
   * @param  {String} dirOrPlan Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  apply(args = {}, dirOrPlan) {
    let command = `apply ${constructOptString(this, args)}`;
    if (dirOrPlan) {
      command = `${command} ${dirOrPlan}`;
    }
    return this.terraform(command);
  }

  /**
   * Execute `terraform destroy`
   * @param  {Object} args      option=value pairs for this subcommand
   * @param  {String} dir       Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  destroy(args = {}, dir = '') {
    let command = `destroy ${constructOptString(this, args)}`;
    if (dir) {
      command = `${command} ${dir}`;
    }
    return this.terraform(command);
  }

  /**
   * Execute `terraform console`
   * @param  {Object} args      option=value pairs for this subcommand
   * @param  {String} dir       Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  console(args = {}, dir) {
    let command = `console ${constructOptString(this, args)}`;
    if (dir) {
      command = `${command} ${dir}`;
    }
    return this.terraform(command);
  }

  /**
   * Execute `terraform fmt`
   * @param  {Object} args      option=value pairs for this subcommand
   * @param  {String} dir       Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  fmt(args = {}, dir) {
    let command = `fmt ${constructOptString(this, args)}`;
    if (dir) {
      command = `${command} ${dir}`;
    }
    return this.terraform(command);
  }

  /**
   * Execute `terraform get`
   * @param  {Object} args      option=value pairs for this subcommand
   * @param  {String} path      Path to install modules for
   * @return {Object}           shelljs execution outcome
   */
  get(args = {}, path = process.cwd()) {
    let command = `get ${constructOptString(this, args)}`;
    if (path) {
      command = `${command} ${path}`;
    }
    return this.terraform(command);
  }

  /**
   * Execute `terraform graph`
   * @param  {Object} args      option=value pairs for this subcommand
   * @param  {String} dir       Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  graph(args = {}, dir) {
    let command = `graph ${constructOptString(this, args)}`;
    if (dir) {
      command = `${command} ${dir}`;
    }
    return this.terraform(command);
  }

  /**
   * Execute `terraform import`
   * @param  {Object} args      option=value pairs for this subcommand
   * @param  {String} addr      Address to import the resource to
   * @param  {String} id        resource-specific ID to identify that resource being imported
   * @return {Object}           shelljs execution outcome
   */
  import(args = {}, addr, id) {
    return this.terraform(`import ${constructOptString(this, args)} ${addr} ${id}`);
  }

  /**
   * Execute `terraform init`
   * @param  {Object} args      option=value pairs for this subcommand
   * @param  {String} source    Source to download from
   * @param  {String} path      Path to download to
   * @return {Object}           shelljs execution outcome
   */
  init(args = {}, source, path = process.cwd()) {
    let command = `init ${constructOptString(this, args)} ${source}`;
    if (path) {
      command = `${command} ${path}`;
    }
    return this.terraform(command);
  }

  /**
   * Execute `terraform output`
   * @param  {Object} args      option=value pairs for this subcommand
   * @param  {String} name      Name of resource to display outputs for (defaults to all)
   * @return {Object}           shelljs execution outcome
   */
  output(args = {}, name) {
    let command = `output ${constructOptString(this, args)}`;
    if (name) {
      command = `${command} ${name}`;
    }
    return this.terraform(command);
  }

  /**
   * Execute `terraform plan`
   * @param  {Object} args      option=value pairs for this subcommand
   * @param  {String} dirOrPlan Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  plan(args = {}, dirOrPlan) {
    let command = `plan ${constructOptString(this, args)}`;
    if (dirOrPlan) {
      command = `${command} ${dirOrPlan}`;
    }
    return this.terraform(command);
  }

  /**
   * Execute `terraform push`
   * @param  {Object} args      option=value pairs for this subcommand
   * @param  {String} dir       Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  push(args = {}, dir) {
    let command = `push ${constructOptString(this, args)}`;
    if (dir) {
      command = `${command} ${dir}`;
    }
    return this.terraform(command);
  }

  /**
   * Execute `terraform refresh`
   * @param  {Object} args      option=value pairs for this subcommand
   * @param  {String} dir       Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  refresh(args = {}, dir) {
    let command = `refresh ${constructOptString(this, args)}`;
    if (dir) {
      command = `${command} ${dir}`;
    }
    return this.terraform(command);
  }

  /**
   * Execute `terraform show`
   * @param  {Object} args      option=value pairs for this subcommand
   * @param  {String} path      Path of state file (defaults to local state file)
   * @return {Object}           shelljs execution outcome
   */
  show(args = {}, path) {
    let command = `show ${constructOptString(this, args)}`;
    if (path) {
      command = `${command} ${path}`;
    }
    return this.terraform(command);
  }

  /**
   * Execute `terraform taint`
   * @param  {Object} args      option=value pairs for this subcommand
   * @param  {String} name      Name of resource to taint
   * @return {Object}           shelljs execution outcome
   */
  taint(args = {}, name) {
    return this.terraform(`taint ${constructOptString(this, args)} ${name}`);
  }

  /**
   * Execute `terraform untaint`
   * @param  {Object} args      option=value pairs for this subcommand
   * @param  {String} name      Name of resource to untaint
   * @return {Object}           shelljs execution outcome
   */
  untaint(args = {}, name) {
    return this.terraform(`untaint ${constructOptString(this, args)} ${name}`);
  }

  /**
   * Execute `terraform validate`
   * @param  {Object} args      option=value pairs for this subcommand
   * @param  {String} path      Path to validate terraform files in (defaults to current)
   * @return {Object}           shelljs execution outcome
   */
  validate(args = {}, path) {
    let command = `validate ${constructOptString(this, args)}`;
    if (path) {
      command = `${command} ${path}`;
    }
    return this.terraform(command);
  }
}
