'use strict';
import sh from 'shelljs';

/*
https://github.com/strigo/terraformjs

The MIT License (MIT)

Copyright (c) 2017-present Strigo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial 
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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
 * e.g. Converts `vars_file` to `vars-file`.
 * @param {String} opt string to normalize
 * @returns {String} A normalized option
 */
const normalizeArg = (opt) => {
  let normalizedOpt = opt.replace('_', '-');
  normalizedOpt = `${normalizedOpt}`;
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
 const constructOptString = (opts) => {
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
        optString.push(`-${normalizeArg(option)}`);
      }
    } else if (Array.isArray(opts[option])) {
      opts[option].forEach((item) => {
        optString.push(`-${normalizeArg(option)}=${item}`);
      });
    } else {
      optString.push(`-${normalizeArg(option)}=${opts[option]}`);
    }
  });

  return optString;
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
  constructor({ workDir = process.cwd(), silent = false, noColor = false, async = false } = {}) {
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
  terraform(command, options = {}, ...params) {    
    const cmd = [
      'terraform',
      command,
      ...constructOptString({
        ...options,
        'no_color': this.noColor,
      }),
      ...params.filter(param => typeof param !== 'ndefined'),
    ]

    const cmdline = cmd.join(' ');
    const outcome = sh.exec(cmdline, { silent: this.silent, cwd: this.workDir, async: this.async });
    outcome.command = cmdline;

    return outcome;
  }

  /**
   * Execute `terraform apply`
   * @param  {Object} options      option=value pairs for this subcommand
   * @param  {String} dirOrPlan Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  apply(options = {}, dirOrPlan) {
    return this.terraform('apply', options, dirOrPlan);
  }

  /**
   * Execute `terraform destroy`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {String} dir       Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  destroy(options = {}, dir) {
    return this.terraform('destroy', options, dir);
  }

  /**
   * Execute `terraform console`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {String} dir       Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  console(options = {}, dir) {
    return this.terraform('console', options, dir);
  }

  /**
   * Execute `terraform fmt`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {String} dir       Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  fmt(options = {}, dir) {
    return this.terraform('fmt', options, dir);
  }

  /**
   * Execute `terraform get`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {String} path      Path to install modules for
   * @return {Object}           shelljs execution outcome
   */
  get(options = {}, path = process.cwd()) {
    return this.terraform('get', options, path);
  }

  /**
   * Execute `terraform graph`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {String} dir       Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  graph(options = {}, dir) {
    return this.terraform('graph', options, dir);
  }

  /**
   * Execute `terraform import`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {String} addr      Address to import the resource to
   * @param  {String} id        resource-specific ID to identify that resource being imported
   * @return {Object}           shelljs execution outcome
   */
  import(options = {}, addr, id) {
    return this.terraform('import', options, addr, id);
  }

  /**
   * Execute `terraform init`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {String} source    Source to download from
   * @param  {String} path      Path to download to
   * @return {Object}           shelljs execution outcome
   */
  init(options = {}, source, path = process.cwd()) {
    return this.terraform('init', options, source, path);
  }

  /**
   * Execute `terraform output`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {String} name      Name of resource to display outputs for (defaults to all)
   * @return {Object}           shelljs execution outcome
   */
  output(options = {}, name) {
    return this.terraform('output', options, name);
  }

  /**
   * Execute `terraform plan`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {String} dirOrPlan Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  plan(options = {}, dirOrPlan) {
    return this.terraform('plan', options, dirOrPlan);
  }

  /**
   * Execute `terraform push`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {String} dir       Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  push(options = {}, dir) {
    return this.terraform('push', options, dir);
  }

  /**
   * Execute `terraform refresh`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {String} dir       Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  refresh(options = {}, dir) {
    return this.terraform('refresh', options, dir);
  }

  /**
   * Execute `terraform show`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {String} path      Path of state file (defaults to local state file)
   * @return {Object}           shelljs execution outcome
   */
  show(options = {}, path) {
    return this.terraform('show', options, path);
  }

  /**
   * Execute `terraform taint`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {String} name      Name of resource to taint
   * @return {Object}           shelljs execution outcome
   */
  taint(options = {}, name) {
    return this.terraform('taint', options, name);
  }

  /**
   * Execute `terraform untaint`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {String} name      Name of resource to untaint
   * @return {Object}           shelljs execution outcome
   */
  untaint(options = {}, name) {
    return this.terraform('untaint', options, name);
  }

  /**
   * Execute `terraform validate`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {String} path      Path to validate terraform files in (defaults to current)
   * @return {Object}           shelljs execution outcome
   */
  validate(options = {}, path) {
    return this.terraform('validate', options, path);
  }
}
