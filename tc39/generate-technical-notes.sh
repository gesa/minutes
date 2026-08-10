mkdir -p ./out;

NOTES_PATH=$TC39_NOTES_DIR/meetings/$CURRENT_YYYY_MM;
TITLE=$(basename "$NOTES_PATH");

pandoc -M document-css=false --standalone -o ./out/"$TITLE".html  "$NOTES_PATH"/*.md;

./tc39/prepare-notes.js  ./out/"$TITLE".html
prince-books -s ./assets/ecma.css -o ./out/"$MEETING_NUMBER"\ Meeting\ Notes.pdf ./out/"$TITLE".html;

./tc39/generate-summaries.js ./out/"$TITLE".html
prince-books -s ./assets/ecma.css -o ./out/"$MEETING_NUMBER"\ Meeting\ Summaries\ and\ Conclusions.pdf ./out/"$TITLE"_Summaries.html;

prince-books -s ./assets/ecma.css ./out/attendance-template.html -o ./out/"$MEETING_NUMBER"\ Meeting\ Attendees.pdf;

rm -rf ./out/*.html;
