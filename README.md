TODOS:
- Test each abilities
- Add logs
- #each with keys
- Card animations

TO TEST:
- Players are swapped
- Decoy on empty row
- Scorch decoy
- Refresh page should redirect to lobby
- Center change faction
- space to select card
- arrows / a d to select card
- Scorch close
- Waiting on other player notification
- Replace playerIndex with id

- Allow multiple time same weather ?
- Scroll bar style
- Font size card in hand amount, row / player score
- North ability
- Edge double click opens menu
- More than 10 cards on hand
- Safari style -> height is set but not width

src/server/cards.ts -> filterCards
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
