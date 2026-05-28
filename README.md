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

Meeting artefacts are much more complex.

> [!TIP]
> it's useful to have the Reflector post and the Agenda available while you work

10-ish days after the meeting, remind all delegates that the deadline to update notes is approaching on the Reflector post.

14 days after the meeting, identify all topics with missing presenter name, PR link, proposal link, summary, and conclusion. Update document where possible, otherwise follow up with presenter or on GitHub.

## Clean up Markdown docs

> [!IMPORTANT]
> This document assumes you have [`pandoc`](https://pandoc.org) and [`prince-books`](https://www.princexml.com/) installed somewhere on your $PATH
> 
> Unless stated otherwise, all paths assume cwd is the **same as this document**, and that this repo has a **shared parent directory** of a local clone of the [TC39 notes repo](https://github.com/tc39/notes).

Save yourself some touble and do

```shell
export CURRENT_YYYY_MM="YYYY-MM" && export MEETING_NUMBER="NNNth"
```

Using the version history feature in Google Docs, mark the current version of the document as a final draft for publication. Download each day as a Markdown file, name it MMMM-dd.md, and save it in the appropriate ../notes/meetings/yyyy-MM directory. Delete the text contents of the Google doc and replace with a message that the notes will soon be available as a PR in the Notes repo.

Run safe replacements. Do

```shell
npm run clean-text tc39 ../notes/meetings/"$CURRENT_YYYY_MM"/
```

### Search and replace in Markdown

- Autoformat whitespace in attendee table
- Find and deal with transcription artifacts `\> ?\>`
- Check double-URL links from Google export
- look for all `[` to make sure text that should probably have parentheses (or backticks) isn't acting like an anchor
- Surround object notation with backticks (not safe to replace all) `(([A-Za-z]+(\(\))?)(\.([A-Za-z]+)(\(\))?)+)([ ,]|(\. ))` -> "`$1`$7"
- Find dunders (`\b([A-Za-z_.]+?__.+?)\b`) and surround full term as appropriate with backticks (not safe to replace all) "`$1`"
- Find code examples from conversation where possible (i.e. `.then`) and surround as appropriate with backticks (try ` \.[a-z]+\b`)
- Skim for TLAs that didn't get a newline `[^\n][^^]\b[A-Z]{2,3}\b`
- Skim for non-TLA acronyms that did `^[A-Z]{2,3}`
- Frequently TLAs are referenced in Summaries and Conclusions, they generally don't need a colon
- Update GitHub links OrgName/Project#issue where meaningful
- Find constructor words and capitalize as appropriate ("Symbol", "Array", "Promise", "Error", etc)
- Make sure temperature check images are included, add alt text `Temperature Check | Strong Positive ❤️: #, Positive 👍: #, Following 👀: #, Confused ❓: #, Indifferent 🤷: #, Unconvinced 😕: #`
- Spell check, interpretation may require some creativity

### Update attendees by day

Do

```shell
./tc39/audit-attendees.js ../notes/meetings/"$CURRENT_YYYY_MM"/
```

And use the resulting list to append missing attendees to each day's list, making sure every TLA is available for future readers.

### Lint & open pull request

Commit your changes. **Before opening a PR** on the [TC39 notes repo](https://github.com/tc39/notes), make sure to lint and fix. In the notes directory, do `npm run mdlint:fix && npm test`. Commit again if needed. When opening PR, @mention any presenters with missing links or concluding text.

## Prepare attendee list

Get printed & online sign-in sheets, audit for accuracy and produce one sheet with headers Name, Email, Ecma Member. Make sure to confirm each listed org is a member org. Audit all participants who aren't delegates of a member org against invited expert list and approved observers. Save this as an xlsx file for posterity. Additionally, save a copy of this xlsx file to ./out/.

## Generate some PDFs

> [!NOTE]
> These scripts expect `prince-books` to be in your $PATH. If you do not have a licence for `prince-books`, contact the secretariat.

> [!WARNING]
> These scripts are destructive—they will delete any file ending in .html in `../notes/meetings/yyyy-MM/` and in `./out/`

```shell
CURRENT_YYYY_MM="YYYY-MM" MEETING_NUMBER="NNNth" ../tc39/generate-technical-notes.sh
```
