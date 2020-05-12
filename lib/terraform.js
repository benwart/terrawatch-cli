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
 * Normalize an option.
 * e.g. Converts `var_file` to `var-file`.
 * @param   {String} opt string to normalize
 * @returns {String}     A normalized option
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
  *      'var_file': [
  *        'x.tfvars',
  *        'y.tfvars'
  *      ]
  *    }
  * will be converted to:
  *   `-state=state.tfstate -var 'foo=bar' -var 'bah=boo' -var-file=x.tfvars -var-file=y.tfvars`
  * @param  {Object} opts an object of options
  * @return {String}      a string of CLI options
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
   * @param {String}  workDir (default: cwd)
   * @param {Boolean} silent  (default: false)
   * @param {Boolean} noColor (default: false)
   * @param {Boolean} async   (default; false)
   */
  constructor({ cwd = process.cwd(), silent = false, noColor = false, async = false } = {}) {
    this.cwd = cwd;
    this.silent = silent;
    this.noColor = noColor;
    this.async = async;
  }

  /**
  * Execute a terraform subcommand with its arguments and options
  * @todo append subCommandString only if it's not undefined
  * @param  {String} command  terraform command that matches the method name
  * @param  {Object} options  optins to pass to terraform for the given command
  * @param  {Object} settings override settings for the instance defaults
  * @param  {Array}  params   all extra named parameters passed by the command methods
  * @return {Object}          shelljs exec object
  */
  terraform(command, options = {}, settings = {}, ...params) {    
    const cmd = [
      'terraform',
      command,
      ...constructOptString({
        ...options,
        'no_color': this.noColor,
      }),
      ...params.filter(param => typeof param !== 'undefined'),
    ]

    const cmdline = cmd.join(' ');
    const outcome = sh.exec(cmdline, { 
      silent: this.silent, 
      cwd: this.cwd, 
      async: this.async,
      ...settings
     });
    outcome.command = cmdline;

    return outcome;
  }

  /**
 * Retrieve a stripped version of terraform's executable version.
 * e.g. (Terraform v0.8.5 => 0.8.5)
 * @returns {String} A stripped string representing the version
 */
  version() {
    const outcome = this.terraform('--version', {}, { silent: true, async: false });
    const parsedVersion = outcome.stdout.split('\n')[0].split(' ')[1].substr(1);
    return parsedVersion;
  };

  /**
   * Execute `terraform apply`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {Object} settings  override settings for the instance defaults
   * @param  {String} dirOrPlan Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  apply(options = {}, settings = {}, dirOrPlan) {
    return this.terraform('apply', options, settings, dirOrPlan);
  }

  /**
   * Execute `terraform destroy`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {Object} settings  override settings for the instance defaults
   * @param  {String} dir       Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  destroy(options = {}, settings = {}, dir) {
    return this.terraform('destroy', options, settings, dir);
  }

  /**
   * Execute `terraform console`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {Object} settings  override settings for the instance defaults
   * @param  {String} dir       Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  console(options = {}, settings= {}, dir) {
    return this.terraform('console', options, settings, dir);
  }

  /**
   * Execute `terraform fmt`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {Object} settings  override settings for the instance defaults
   * @param  {String} dir       Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  fmt(options = {}, settings = {}, dir) {
    return this.terraform('fmt', options, settings, dir);
  }

  /**
   * Execute `terraform get`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {Object} settings  override settings for the instance defaults
   * @param  {String} path      Path to install modules for
   * @return {Object}           shelljs execution outcome
   */
  get(options = {}, settings = {}, path = process.cwd()) {
    return this.terraform('get', options, settings, path);
  }

  /**
   * Execute `terraform graph`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {Object} settings  override settings for the instance defaults
   * @param  {String} dir       Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  graph(options = {}, settings = {}, dir) {
    return this.terraform('graph', options, settings, dir);
  }

  /**
   * Execute `terraform import`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {Object} settings  override settings for the instance defaults
   * @param  {String} addr      Address to import the resource to
   * @param  {String} id        resource-specific ID to identify that resource being imported
   * @return {Object}           shelljs execution outcome
   */
  import(options = {}, settings = {}, addr, id) {
    return this.terraform('import', options, settings, addr, id);
  }

  /**
   * Execute `terraform init`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {Object} settings  override settings for the instance defaults
   * @param  {String} source    Source to download from
   * @param  {String} path      Path to download to
   * @return {Object}           shelljs execution outcome
   */
  init(options = {}, settings = {}, source, path = process.cwd()) {
    return this.terraform('init', options, settings, source, path);
  }

  /**
   * Execute `terraform output`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {Object} settings  override settings for the instance defaults
   * @param  {String} name      Name of resource to display outputs for (defaults to all)
   * @return {Object}           shelljs execution outcome
   */
  output(options = {}, settings = {}, name) {
    return this.terraform('output', options, settings, name);
  }

  /**
   * Execute `terraform plan`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {Object} settings  override settings for the instance defaults
   * @param  {String} dirOrPlan Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  plan(options = {}, settings = {}, dirOrPlan) {
    return this.terraform('plan', options, settings, dirOrPlan);
  }

  /**
   * Execute `terraform push`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {Object} settings  override settings for the instance defaults
   * @param  {String} dir       Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  push(options = {}, settings = {}, dir) {
    return this.terraform('push', options, settings, dir);
  }

  /**
   * Execute `terraform refresh`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {Object} settings  override settings for the instance defaults
   * @param  {String} dir       Directory in which the plan resides
   * @return {Object}           shelljs execution outcome
   */
  refresh(options = {}, settings = {}, dir) {
    return this.terraform('refresh', options, settings, dir);
  }

  /**
   * Execute `terraform show`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {Object} settings  override settings for the instance defaults
   * @param  {String} path      Path of state file (defaults to local state file)
   * @return {Object}           shelljs execution outcome
   */
  show(options = {}, settings = {}, path) {
    return this.terraform('show', options, settings, path);
  }

  /**
   * Execute `terraform taint`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {Object} settings  override settings for the instance defaults
   * @param  {String} name      Name of resource to taint
   * @return {Object}           shelljs execution outcome
   */
  taint(options = {}, settings = {}, name) {
    return this.terraform('taint', options, settings, name);
  }

  /**
   * Execute `terraform untaint`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {Object} settings  override settings for the instance defaults
   * @param  {String} name      Name of resource to untaint
   * @return {Object}           shelljs execution outcome
   */
  untaint(options = {}, settings = {}, name) {
    return this.terraform('untaint', options, settings, name);
  }

  /**
   * Execute `terraform validate`
   * @param  {Object} options   option=value pairs for this subcommand
   * @param  {Object} settings  override settings for the instance defaults
   * @param  {String} path      Path to validate terraform files in (defaults to current)
   * @return {Object}           shelljs execution outcome
   */
  validate(options = {}, settings = {}, path) {
    return this.terraform('validate', options, settings, path);
  }
}
