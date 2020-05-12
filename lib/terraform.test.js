'use strict';

import sh from 'shelljs';
import Terraform, { version } from './terraform';

jest.mock('shelljs');

beforeEach(() => {
  sh.exec = jest.fn();
});

describe('terraform class methods', () => {
  it('returns valid version', () => {
    const value = '0.12.24';
    sh.exec.mockReturnValue({'stdout': `Terraform v${value}\n`});

    const tf = new Terraform();
    const check = tf.version();
    expect(check).toEqual(value);
  });

  it('apply with no options', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.apply({}, {}, 'dir');
    const expected = 'terraform apply dir';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('apply with single var-file', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.apply({
      'var_file': './foo.tfvars',
    }, {}, 'dir');
    const expected = 'terraform apply -var-file=./foo.tfvars dir';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('apply with array vars-file', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.apply({
      'var_file': [
        'foo.tfvars',
        'bar.tfvars'
      ]
    }, {}, 'dir');
    const expected = 'terraform apply -var-file=foo.tfvars -var-file=bar.tfvars dir';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('apply with no-color', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform({ noColor: true });
    const command = tf.apply({}, {}, 'dir');
    const expected = 'terraform apply -no-color dir';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('apply with array var', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.apply({
      'var': {
        'foo': 'bar',
        'bah': 'boo',
      }
    }, {}, 'dir');
    const expected = "terraform apply -var 'foo=bar' -var 'bah=boo' dir";

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('apply with state option', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.apply({
      'state': 'state.tfstate'
    }, {}, 'dir');
    const expected = "terraform apply -state=state.tfstate dir";

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('destroy command', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.destroy({}, {}, 'dir');
    const expected = 'terraform destroy dir';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('console command', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.console({}, {}, 'dir');
    const expected = 'terraform console dir';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('fmt command', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.fmt({}, {}, 'dir');
    const expected = 'terraform fmt dir';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('get command', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.get({}, {}, 'path');
    const expected = 'terraform get path';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('graph command', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.graph({}, {}, 'dir');
    const expected = 'terraform graph dir';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('import command', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.import({}, {}, 'addr', 'id');
    const expected = 'terraform import addr id';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('init command', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.init({}, {}, 'source', 'path');
    const expected = 'terraform init source path';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('output command', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.output({}, {}, 'name');
    const expected = 'terraform output name';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('plan command', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.plan({}, {}, 'dirOrPlan');
    const expected = 'terraform plan dirOrPlan';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('push command', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.push({}, {}, 'dir');
    const expected = 'terraform push dir';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('refresh command', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.refresh({}, {}, 'dir');
    const expected = 'terraform refresh dir';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('show command', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.show({}, {}, 'path');
    const expected = 'terraform show path';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('taint command', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.taint({}, {}, 'name');
    const expected = 'terraform taint name';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('untaint command', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.untaint({}, {}, 'name');
    const expected = 'terraform untaint name';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });

  it('validate command', () => {
    sh.exec.mockReturnValue({});

    const tf = new Terraform();
    const command = tf.validate({}, {}, 'path');
    const expected = 'terraform validate path';

    expect(sh.exec.mock.calls.length).toEqual(1);
    expect(sh.exec.mock.calls[0][0]).toEqual(expected);
    expect(command.command).toEqual(expected);
  });
})

  