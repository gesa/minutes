#!/usr/bin/env node

/** usage:
 * - ./replacements.js tc39 path/to/markdown/file.md
 *    uses the long-time "safe automatic replacements" for TC39 notes
 * - ./replacements.js clipboard path/to/markdown/file.md
 *    targets artefacts from using clipboard to convert word to rtf to doc
 * - ./replacements.js pandoc path/to/markdown/file.md
 *    targets artefacts from using pandoc to convert from word to doc
 * */
import {readdir, readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';

const source = process.argv[2];
const safeAutomaticReplacements = [];

switch (source) {
  case 'tc39':
    safeAutomaticReplacements.push(
      // start Google Docs conversion to Markdown
      {
        from: / (\\#){2,}/g,
        to: ""
      },
      {
        from: /\\([_\-#!+=<>()*\[\]`.])/g,
        to: "$1"
      },
      {
        from: /^`\|/gm,
        to: "|"
      },
      {
        from: /\|` *$/gm,
        to: "|"
      },
      // end Google Docs conversion to Markdown
      {
        from: / +$/gm, // Remove trailing spaces
        to: ""
      },
      {
        from: /^!\[]\[image1].+!\[]\[image1]$/gm, //Remove cursor park animals
        to: ""
      },
      {
        from: /^( *)[\-*]/gm, // Convert lists to *
        to: "$1*"
      },
      {
        from: / {2,}(\*)?/gm, // Remove multiple spaces everywhere but nested lists
        to(match, g1) {
          if (/^\*/.test(g1)) {
            return match;
          }

          return " ";
        }
      },
      {
        from: /^ +(\*)?/gm, // Remove preceding spaces except nested lists
        to(match, g1) {
          if (/^\*/.test(g1)) {
            return match;
          }

          return "";
        }
      },
      {
        from: /^\. *$/gm, // Remove weird lines with just a period in on them?
        to: ""
      },
      {
        from: / /g, // Replace poorly-encoded spaces
        to: " "
      },
      {
        from: /​/g, // Replace poorly-encoded spaces
        to: " "
      },
      {
        from: /^(\| *)+\n/gm, // Remove blank lines in tables
        to: ""
      },
      {
        from: /\.\n([A-Z]{2,3}) /g, // Add newline and colon to TLA. This specific rule is to guard against false positives
        to: ".\n\n$1: "             // like "SDK" "API", which rarely come after a period.
      },
      {
        from: /(\S)\n([A-Z]{2,3}):/g, // Add newline after presumed TLA
        to: "$1\n\n$2:"
      },
      {
        from: /^([A-Z]{2,3}:)([A-Z])/gm, // Add space after colon
        to: "$1 $2"
      },
      {
        from: /( ?\.){3}/g, // Replace weird transcription ellipses with real ellipses
        to: "…"
      },
      {
        from: / +[\-–—]{1,2}( +|$)/gm, // Replace dashes surrounded by spaces (or EOL) with em dash
        to: "—"
      },
      {
        from: /(—)\n([–Ia-z])/g, // When someone interrupts themself mid-thought and winds up with a newline
        to: "$1$2"
      },
      {
        from: /([A-Za-z0-9.,!?;…`%"*”\]>’]) *\n([A-Za-z0-9+`\[“'"])/g, // Newlines that don't switch speaker
        to: "$1 $2" // (this seems to be the one note-takers stress most about)
      },
      {
        from: /call back/gi,
        to: "callback"
      },
      {
        from: /constructer/g,
        to: "constructor"
      },
      {
        from: /:? [(\[]on queue[)\]]:?/gi,
        to: " (on queue):"
      },
      {
        from: /[<\[]EOM[>\]]/gi,
        to: "(EOM)"
      },
      {
        from: /web *idl/gi,
        to: "WebIDL"
      },
      {
        from: /node\.?js/gi, // don't replace every occurrence of node, just "nodejs"
        to: "Node.js"
      },
      {
        from: /next\.?js/gi,
        to: "Next.js"
      },
      {
        from: /spider ?monkey/gi,
        to: "SpiderMonkey"
      },
      {
        from: /web ?kit/gi,
        to: "WebKit"
      },
      {
        from: /exec{1,2}om/gi,
        to: "ExeCom"
      },
      {
        from: "### **NOTICE: These meeting notes are to be kept private until after the review grace period, at which time they will be submitted to Ecma and published on [https://github.com/tc39/notes](https://github.com/tc39/notes)**.",
        to: ""
      },
      {
        from: "**DO NOT PUBLICIZE LINKS TO THIS DOCUMENT**\n**DO NOT APPEND TO THE END OF THIS DOCUMENT—THAT IS A RED ZONE RESERVED FOR THE AUTOMATED DICTATION SERVICE TO ADD TO**",
        to: ""
      },
      {
        from: "**Cursor Park (feel free to add an animal):**",
        to: ""
      },
      {
        from: "This meeting has an accompanying comment-by-comment written record prepared by IR Broadcast Captioning and TC39 participants. The intention is to capture the various points of view of the committee members, which helps all members evolve proposals based on feedback received and understand the rationale of decisions taken. TC39 participants are encouraged to edit this transcript for accuracy (where the goal is to accurately reflect the intention of the point being made, rather than word-for-word transcription), and to delete comments of theirs which they do not want to be recorded (e.g., due to risk of misunderstanding, inclusion of personal information, or any other reason). Edits may be made during the meeting by editing the Google Doc as it is composed, or afterwards **for a period of at least two weeks** until the notes are published. If a participant makes a comment in the committee meeting and does not remove it from the notes, they are consenting for it to be published. Participants may ask in the future that their personal data be removed from the published notes*.*",
        to: ""
      },
      {
        from: "*----\nDelegates: re-use [your existing abbreviations](https://github.com/tc39/notes/blob/master/delegates.txt)! If you’re a new delegate and don’t already have an abbreviation, choose any three-letter combination that is not [already in use](https://github.com/tc39/notes/blob/master/delegates.txt), and send a PR to add it upstream.\n\nYou can find Abbreviations in [delegates.txt](https://github.com/tc39/notes/blob/master/delegates.txt)\n\n****Attendees:****",
        to: "**Attendees:**"
      },
      {
        from: "***=== BEGIN AGENDA ITEM TEMPLATE ===***\n\n## Topic\n\nPresenter: Firstname Lastname (FLE)\n\n* [proposal]()\n* [slides]()\n\n### Speaker's Summary of Key Points\n\n* List\n* of\n* things\n\n### Conclusion\n\n* List\n* of\n* things\n\n**=== END AGENDA ITEM TEMPLATE ===**\n",
        to: ""
      },
      {
        from: /^# Day/m,
        to: "Day"
      },
      {
        from: /\n{3,}/g, // Replace more than two newlines with two newlines
        to: "\n\n"
      },
      {
        from: /^\n+/, // Remove extra newlines at beginning of document
        to: ""
      });
    break;
  case 'clipboard':
    safeAutomaticReplacements.push({
        from: /~(\[.+?])(\(.+?\))~/g,
        to: "$1$2"
      },
      {
        from: /## (\d)     (.+)/g,
        to: "\n# $1 $2\n"
      },
      {
        from: /## (\d\.\d)     (.+)/g,
        to: "\n## $1 $2\n"
      },
      {
        from: /\*{2}(\d(\.\d){2})     (.+?)\*{2}/g,
        to: "\n### $1 $3\n"
      },
      {
        from: /\*{2}(\d(\.\d){3})     (.+?)\*{2}/g,
        to: "\n#### $1 $3\n"
      },
      {
        from: /\*{2}(\d(\.\d){4})     (.+?)\*{2}/g,
        to: "\n##### $1 $3\n"
      },
      {
        from: /· + /g,
        to: "* "
      },
      {
        from: /o + /g,
        to: "  * "
      },
      {
        from: /§  /g,
        to: "    * "
      });
    break;
  case 'pandoc':
    safeAutomaticReplacements.push({
        from: / /g,
        to: " "
      },
      {
        from: /\n( *?)- /g,
        to: "\n$1\* "
      },
      {
        from: /\*{3}/g,
        to: "**"
      },
      {
        from: /\[(.+?)#(.+?)]/g,
        to: "[$1\\#$2]"
      },
      {
        from: /\|\n\n\|/g,
        to: "|\n\n| | |\n|-|-|\n|"
      },
      {
        from: "|:---|:---|\n",
        to: ""
      });
    break;
}

if (process.argv[2] === 'tc39') {
  readdir(process.argv[3]).then(files => Promise.all(
    files.map(async filename => readFile(join(process.argv[3], filename), {encoding: 'utf8'})
      .then(makeReplacementsInFile)
      .then(correctedContent => writeFile(join(process.argv[3], filename), correctedContent, {encoding: 'utf-8'}))
    )).catch(err => console.error(err) ));
} else {
  readFile(process.argv[3], {encoding: 'utf8'})
    .then(makeReplacementsInFile)
    .then(correctedContent => writeFile(process.argv[3], correctedContent, {encoding: 'utf-8'}))
    .catch(err => console.error(err) );
}

function makeReplacementsInFile(fileContents) {
  return safeAutomaticReplacements.reduce((text, {from,  to}) => {
    const fromString = from.toString().length > 55 ? `${from.toString().substring(0, 49)}…` : from.toString();

    if (typeof to === 'function') {
      console.log(`Replacing ${fromString.replace(/\n/g, "\\n")} with replacer function`);
    } else {
      console.log(`Replacing ${fromString.replace(/\n/g, "\\n")} with ${to.replace(/\n/g, "\\n")}`);
    }
    return text.replace(from, to);
  }, fileContents);
}
