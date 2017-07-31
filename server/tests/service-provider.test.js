import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../index';

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## ServiceProvider APIs', () => {
  let serviceProvider = {
    serviceProviderName: 'KK12344',
    serviceProviderImagesUrl: ['path'],
    serviceProviderDesc: 'desc',
    domainId: '1'
  };

  describe('# POST /api/serviceProviders', () => {
    it('should create a new serviceProviders', (done) => {
      request(app)
        .post('/api/serviceProviders')
        .send(serviceProvider)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.serviceProviderName).to.equal(serviceProvider.serviceProviderName);
          expect(res.body.serviceProviderDesc).to.equal(serviceProvider.serviceProviderDesc);
          expect(res.body.domainId).to.equal(serviceProvider.domainId);
          serviceProvider = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/serviceProviders/:serviceProviderId', () => {
    it('should get serviceProvider details', (done) => {
      request(app)
        .get(`/api/serviceProviders/${serviceProvider.serviceProviderId}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.serviceProviderName).to.equal(serviceProvider.serviceProviderName);
          expect(res.body.serviceProviderDesc).to.equal(serviceProvider.serviceProviderDesc);
          expect(res.body.domainId).to.equal(serviceProvider.domainId);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when serviceProvider does not exists', (done) => {
      request(app)
        .get('/api/serviceProviders/-1')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/serviceProviders/:serviceProviderId', () => {
    it('should update serviceProvider details', (done) => {
      serviceProvider.serviceProviderName = 'KK';
      request(app)
        .put(`/api/serviceProviders/${serviceProvider.serviceProviderId}`)
        .send(serviceProvider)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.serviceProviderName).to.equal('KK');
          expect(res.body.serviceProviderDesc).to.equal(serviceProvider.serviceProviderDesc);
          expect(res.body.domainId).to.equal(serviceProvider.domainId);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/serviceProviders/', () => {
    it('should get all serviceProviders', (done) => {
      request(app)
        .get('/api/serviceProviders')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all serviceProviders (with limit and skip)', (done) => {
      request(app)
        .get('/api/serviceProviders')
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/serviceProviders/', () => {
    it('should delete serviceProvider', (done) => {
      request(app)
        .delete(`/api/serviceProviders/${serviceProvider.serviceProviderId}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.serviceProviderName).to.equal('KK');
          expect(res.body.serviceProviderDesc).to.equal(serviceProvider.serviceProviderDesc);
          expect(res.body.domainId).to.equal(serviceProvider.domainId);
          done();
        })
        .catch(done);
    });
  });
});
