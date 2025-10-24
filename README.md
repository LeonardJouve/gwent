TODOS:
- Test each abilities
- Add logs
- #each with keys
- Card animations

- Escape on carousel bugs it
- Arrows on carousel / space / mouse wheel
- Center change faction
- Padding input button
- Scroll bar style
- Redraw a card reopens carousel from index 0
- Scorch close
- Refresh page should redirect to lobby
- Save username
- Players are swapped
- Decoy on empty row
- Font size card in hand amount, row / player score
- Scorch decoy
- North ability
- Edge double click opens menu
- More than 10 cards on hand

file:///app/dist/index.js:44
      const playingCardIndex = c.findIndex(({ filename }) => filename === card.filename);
                                              ^

TypeError: Cannot destructure property 'filename' of 'undefined' as it is undefined.
    at file:///app/dist/index.js:44:47
    at Array.findIndex (<anonymous>)
    at file:///app/dist/index.js:44:34
    at Array.filter (<anonymous>)
    at _Cards.filterCards (file:///app/dist/index.js:43:17)
    at _Cards.restore (file:///app/dist/index.js:82:25)
    at Object.onPlaced (file:///app/dist/index.js:2455:19)
    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
    at async file:///app/dist/index.js:2971:7
    at async Promise.all (index 1)
