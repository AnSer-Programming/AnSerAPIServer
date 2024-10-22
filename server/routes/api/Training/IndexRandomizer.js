const router = require('express').Router();

function randNumGenerator(data) {
  console.log(data);
  if(data.ALL) {
    let isDone = false;
    let isDuplicate = false;
    let isFound = false;
    let results = new Array();

    while(!isDone) {
      placeHolder = Math.floor(Math.random() * data.MAX) +1;
      for(let x = 0; x < results.length; x++) {
        if(results[x] === placeHolder) {
          isDuplicate = true;
        }
      }

      if(!isDuplicate) {
        results[results.length] = placeHolder;
      } else {
        isDuplicate = false;
      }

      if(results.length === data.MAX-1) {
        for(let x = 1; x < data.MAX; x++) {
          isFound = false;
          for(let y = 0; y < results.length; y++) {
            if(results[y] === x) {
              isFound = true;
            }
          }
          if(!isFound) {
            results[results.length] = x;
          }
        }
        isDone = true;
      }
    }

    return results;
  } else {
    return Math.floor(Math.random() * data.MAX) +1;
  }
}

router.get('/:max', async (req, res) => {
  let data = {
    MAX: req.params.max
  };

  res.json({data: randNumGenerator(data)});
});

router.get('/:max/:all', async (req, res) => {
  let data = {
    ALL: req.params.all,
    MAX: req.params.max,
  };

  res.json({data: randNumGenerator(data)});
});

module.exports = router;