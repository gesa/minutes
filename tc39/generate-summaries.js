#!/usr/bin/env node

import fs from 'fs/promises';
import * as cheerio from 'cheerio';

fs.readFile(process.argv[2]).then((fileContents) => {
  const $ = cheerio.load(fileContents.toString('utf-8'));
  const $h2s = $('h2');

  $h2s.each((i) => {
    const $currentH2 = $($h2s[i]);

    /* Remove attendees p */
    $currentH2.next('p').remove();
  });

  /* Remove opening and welcome */
  $('#opening-welcome').nextUntil('h3, h4').add('#opening-welcome').remove();

  /* Remove closing */
  $('#meeting-closing').nextAll().add('#meeting-closing').remove();

  /* Remove participant tables */
  $('table').remove();

  /* Remove transcript after title/presenter/slides & link */
  $('h3 + p + ul').nextUntil('h1, h2, h3, h4').remove();

  /* Do the same even if there isn't slides & link */
  $('h3 + p + p').nextUntil('h1, h2, h3, h4').add('h3 + p + p').remove();

  return $.html();
})
  .then((updatedContent) => fs.writeFile(process.argv[2].replace('.html', '_Summaries.html'), updatedContent));
