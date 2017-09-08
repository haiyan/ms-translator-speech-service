'use strict';
const fs = require('fs');
const path = require('path');
const streamBuffers = require('stream-buffers');

module.exports = function(filepath, callback) {
  let absoluteFilepath;

  fs.access(filepath, (error) => {
    if (error) {
      return callback ? callback(new Error(`could not find file ${filepath}`)) : null;
    }

    absoluteFilepath = path.resolve(filepath);

    const options = {
      frequency: 100, 
      chunkSize: 32000 
    };

    if (!this.audioStream) {
      this.audioStream = new streamBuffers.ReadableStreamBuffer(options);
    }

    fs.readFile(absoluteFilepath, (error, file) => {
      this.audioStream.put(file);

      // add some silences at the end to tell the service that it is the end of the sentence
      this.audioStream.put(new Buffer(160000));
      this.audioStream.stop();

      this.audioStream.on('data', (data) => this.connection.sendBytes(data));
      this.audioStream.on('end', () => {if (callback) return callback()});
    });
  });
};

