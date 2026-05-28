#!/usr/bin/env node

import {readdir, readFile, writeFile} from 'node:fs/promises';
import {basename, join} from 'node:path';

const missingSpeakers = {};
const TLA = /^([A-Z]{2,3})( \(on queue\))?:/gm;
const attendee = /^\|.+?\| *([A-Z]{2,3}).+$/gm;
const mappedTLAs = new Map();

readFile(join(process.argv[2], '..', '..','delegates.txt'), {encoding: 'utf-8'})
  .then((allDelegates) => {
    allDelegates.split('\n').map((line) => {
      const info = /(.+?) \(([A-Z]{2,3})\)/.exec(line);

      if (info) mappedTLAs.set(info[2], info[1]);
    })
  });

readdir(process.argv[2]).then(files => Promise.all(
  files.map(async filename => readFile(join(process.argv[2], filename), {encoding: 'utf8'})
    .then(fileContents => {
      const foundSpeakers = fileContents.matchAll(TLA);
      const foundAttendees = fileContents.matchAll(attendee);

      const speakers = [];
      const attendees = [];

      for(let result of foundSpeakers) {
        speakers.push(result[1]);
      }

      for (let result of foundAttendees){
        attendees.push(result[1]);
      }

      const dedupedSpeakers = new Set(speakers.sort());
      const dedupedAttendees = new Set(attendees.sort());
      const missing = dedupedSpeakers.difference(dedupedAttendees);
      const attendeeList = [];

      missing.forEach(personTLA => attendeeList.push(`| ${mappedTLAs.get(personTLA)} | ${personTLA} | |`))

      missingSpeakers[basename(filename, '.md')] = attendeeList;
    })
  )).catch(err => console.error(err) ))
  .then(() => console.dir(missingSpeakers, {depth: 3, colors: true}));
