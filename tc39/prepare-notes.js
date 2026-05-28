#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

fs.readFile(process.argv[2]).then((fileContents) => {
  const $ = cheerio.load(fileContents.toString('utf-8'));
  const $h1s = $('h1');
  const title = $($h1s[0]).text();

  /* Set each day's title to a unique value, remove meta */
  $h1s.each((i) => {
    const $currentH1 = $($h1s[i]);
    const $nextP = $currentH1.next('p');

    $currentH1.text($nextP.text());

    /* Remove subtitle p */
    $nextP.remove();
  });

  /* Reduce heading levels */
  $('h3').prop('tagName', 'h4');
  $('h2').prop('tagName', 'h3');
  $h1s.prop('tagName', 'h2');

  /* Add title */
  $('body').prepend(`<h1>${title}</h1>`);

  let markup =  $.html();

  markup = markup.replace(/([a-z])\n +( *[a-z])/g, '$1 $2');
  markup = markup.replace(/([a-z])\n +( *<\/)/g, '$1$2');
  markup = markup.replace(/\n{2,}/g, '\n');

  return markup;
})
  .then((updatedContent) => fs.writeFile(path.join(process.argv[2]), updatedContent));

