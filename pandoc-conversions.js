#!/usr/bin/env node

import pandoc from 'pandoc-filter';

function walkList(element, format, meta) {
    if (element && element?.t === 'BulletList') {
      return pandoc.walk(element, walkList, format, meta);
    }

    if (element && element?.t === 'Para') {
      return pandoc.Plain(element.c);
    }
}

function action(currentObject, format, meta) {
  if (currentObject.t === "BulletList") {
    return pandoc.walk(currentObject, walkList, format, meta);
  }
}

await pandoc.stdio(action);
