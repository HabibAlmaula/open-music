const ClientError = require('./ClientError');

class InVariantError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

module.exports = InVariantError;
