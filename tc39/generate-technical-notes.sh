mkdir -p ./out;

NOTES_PATH=../notes/meetings/$CURRENT_YYYY_MM;
TITLE=$(basename "$NOTES_PATH");

pandoc -M document-css=false --standalone -o ./out/"$TITLE".html  "$NOTES_PATH"/*.md;

./prepare-notes.js  ./out/"$TITLE".html
prince-books -s ./assets/ecma.css -o ./out/"$MEETING_NUMBER"\ Meeting\ Notes.pdf ./out/"$TITLE".html;

./generate-summaries.js ./out/"$TITLE".html
prince-books -s ./assets/ecma.css -o ./out/"$MEETING_NUMBER"\ Meeting\ Summaries\ and\ Conclusions.pdf ./out/"$TITLE"_Summaries.html;

pandoc --pdf-engine prince --standalone -M document-css=false -o ./out/"$MEETING_NUMBER"\ Meeting\ Attendees.html ./out/*.xlsx
prince-books -s ./assets/ecma.css ./out/"$MEETING_NUMBER"\ Meeting\ Attendees.html --script ./tc39/attendees-print.js -o ./out/"$MEETING_NUMBER"\ Meeting\ Attendees.pdf;

rm -rf ./out/*.html;
