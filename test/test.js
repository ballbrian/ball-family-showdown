var request = require('supertest');
var express = require('express');
var sinon = require('sinon');
var server = sinon.fakeServer.create();

var app = require('../app.js');

describe('GET /', function() {
    it('responds with the Catch All Response', function(done) {
        request(app)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200, done);
    })
})

describe('GET /api/weeks', function() {
    it('gets weeks as json', function(done) {
        request(app)
            .get('/api/weeks')
            .expect('Content-Type', /json/)
            .expect(200, done);
    })
})

describe('GET /users', function() {
    it('gets users as json', function(done) {
        request(app)
            .get('/api/users')
            .expect(403, done);
    })
})