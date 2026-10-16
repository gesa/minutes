# TC39

TC39 plenary artefacts are much more complex than most other TCs.

> [!TIP]
> it's useful to have the Reflector post and the Agenda available while you work

10-ish days after the meeting, remind all delegates that the deadline to update notes is approaching on the Reflector post.

14 days after the meeting, identify all topics with missing presenter name, PR link, proposal link, summary, and conclusion. Update document where possible, otherwise follow up with presenter or on GitHub.

> [!IMPORTANT]
> This document assumes you have [`pandoc`](https://pandoc.org) and [`prince-books`](https://www.princexml.com/) installed somewhere on your $PATH.
>
> Unless stated otherwise, all paths assume cwd is the **parent of this document**.

## Prepare notes PR

Download TCQ log, save to meeting minutes Assets directory.

### Archive raw transcript

First save yourself some touble and do

```shell
export CURRENT_YYYY_MM="YYYY-MM" && export MEETING_NUMBER="NNNth" && export TC39_NOTES_DIR="../TC39/notes" # Update this path as appropriate
```

1. Using the version history feature in Google Docs, mark the current version of the document as "Final draft for publication".
2. Download a docx of all tabs and save it in the meeting minutes Assets directory.
3. Download each day as a Markdown file and name it MMMM-dd.md. Create an archive of these downloads and save them in the meeting minutes Assets directory.
4. Save the Markdown files in the appropriate ../notes/meetings/yyyy-MM directory.
5. Delete the text contents of the Google doc and replace with a message that the notes will soon be available as a PR in the Notes repo.
    > Transcript deleted for preparation before GitHub pull request. If you still need to provide a summary or conclusion, you can see the final version for reference under File > Version history > See version history.

### Clean up Markdown docs

Run safe replacements. Do

```shell
npm run clean-text tc39 "$TC39_NOTES_DIR"/meetings/"$CURRENT_YYYY_MM"/
```

- Autoformat whitespace in attendee table
- look for all `[` to make sure text that should probably have parentheses (or backticks) isn't acting like an anchor
- Check double-URL links from Google export
- Find inappropriate uses of smart quotes and replace `“(.*)”` -> `$1`
- Surround object notation with backticks (not safe to replace all) `(([A-Za-z]+(\(\))?)(\.([A-Za-z]+)(\(\))?)+)([ ,]|(\. ))` -> "`$1`$7"
- Find dunders (`\b([A-Za-z_.]+?__.+?)\b`) and surround full term as appropriate with backticks (not safe to replace all) "`$1`"
- Find code examples from conversation where possible (i.e. `.then`) and surround as appropriate with backticks (try ` \.[a-z]+\b`)
- Frequently TLAs are referenced in Summaries and Conclusions, they generally don't need a colon
- Update GitHub links OrgName/Project#issue where meaningful
- Insert temperature check/poll results from TCQ log
- Spell check, interpretation may require some creativity

### Update attendees by day

Do

```shell
./tc39/audit-attendees.js "$TC39_NOTES_DIR"/meetings/"$CURRENT_YYYY_MM"/
```

Drop the resulting JSON in the normalization widget. This will generate Markdown table rows with delegate name, TLA, and member name for any TLA which appears in the transcript but is excluded from the table at the top of the day. This ensures every TLA is available for future readers. (n.b. double-check "other" to modify either Invited Expert or Secretariat)

### Lint & open pull request

Commit your changes. **Before opening a PR** on the [TC39 notes repo](https://github.com/tc39/notes), make sure to lint and fix. In the notes directory, do `npm run mdlint:fix && npm test`. Commit again if needed. When opening PR, @mention any presenters with missing links or concluding text.

## Prepare attendee list

Copy assets/attendance-template.html ./out. Generate attendee list from Grist using custom widget, copy from textarea and paste in to body. Curse the fact that this is the easiest way to accomplish this goal.

Also save an xlsx version of this data for posterity.

## Generate some PDFs

n.b. if the meeting took place across two months—say, 29 Sept to 01 October, you'll have to name 01 October to 31 September before running this script. This is rare enough that it is not worth programming around. You can rename it back after.

> [!NOTE]
> These scripts expect `prince-books` to be in your $PATH. If you do not have a licence for `prince-books`, contact the secretariat.

> [!WARNING]
> These scripts are destructive—they will delete any file ending in .html in `"$TC39_NOTES_DIR"/meetings/$CURRENT_YYYY_MM/` and in `./out/`

```shell
./tc39/generate-technical-notes.sh
```
