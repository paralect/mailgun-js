const auth = require('./data/auth.json')
const fixture = require('./data/fixture.json')
const assert = require('assert')

const mailgun = require('../')({
  'apiKey': auth.api_key,
  'domain': auth.domain
})

describe('Domains', () => {
  beforeEach((done) => {
    setTimeout(done, 500)
  })

  it('test domains().create() invalid missing address', (done) => {
    mailgun.domains().create({}, (err) => {
      assert.ok(err)
      assert(/Missing parameter 'name'/.test(err.message))
      done()
    })
  })

  it.skip('test domains().create() ', () => {
    // mailgun.domains().create(fixture.new_domain, function (err, body) {
    //   assert.ifError(err);
    //   assert.ok(body.message);
    //   assert(/Domain has been created/.test(body.message));
    //   assert.ok(body.domain);
    //   assert.strictEqual(fixture.new_domain.name, body.domain.name);
    //   assert.strictEqual(fixture.new_domain.smtp_password, body.domain.smtp_password);
    //   done();
    // });
  })

  it('test domains().list()', (done) => {
    mailgun.domains().list((err, body) => {
      assert.ifError(err)
      assert.ok(body.total_count)
      assert.ok(body.items)
      done()
    })
  })

  it.skip('test domains().delete()', () => {
    // var domain = fixture.new_domain.name;
    // mailgun.domains(domain).delete(function (err, body) {
    //   assert.ifError(err);
    //   assert.ok(body.message);
    //   assert(/Domain has been deleted/.test(body.message));
    //   done();
    // });
  })

  it('test domains().verify() that it is a function', () => {
    // we can't actally just call this endpoint
    const fn = mailgun.domains(fixture.existing_domain.name).verify

    assert.ok(typeof fn === 'function')
  })
})
