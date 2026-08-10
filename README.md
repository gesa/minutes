# Convenience scripts for preparing meeting minutes

these are not good. they are not efficient. I'm also not ashamed—they get the job done, for me.

## npm run-scripts accounting

* `convert-minutes`:
  * Specifically for converting Ecma-formatted Microsoft Word documents into Markdown for contribution to GitHub repos
  * usage: `npm run convert-minutes -- outfile.md infile.docx`,
* `clean-text`:
  * Safe text replacements for a given document context
  * usage: `npm run clean-pandoc-text -- context outfile.md`
  * `context` options:
    * `pandoc`: specifically for being run after `convert-minutes`
    * `tc39`: see below
    * `clipboard`: legacy replacements from Word -> RTF -> Markdown workflow

## TC55, TC57

Minutes are prepared in Microsoft Word using the Ecma template. To convert to Markdown for contribution to git repos, do

```shell
npm run convert-minutes -- outfile.md infile.docx && \
npm run clean-text -- pandoc outfile.md
```

## TC39

The README for managing TC39 minutes has been moved to tc39/.

## Prepare attendee list

This isn't generally relevant for anyone but TC39, but it's not TC39-specific either.  

Copy assets/attendance-template.html ./out. Generate attendee list from Grist using custom widget, copy from textarea and paste in to body. Curse the fact that this is the easiest way to accomplish this goal.

Do:

```shell
prince-books -s ./assets/ecma.css ./out/attendance-template.html -o ./out/attendees.pdf;
```
