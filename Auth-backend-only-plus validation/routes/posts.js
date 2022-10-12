const router = require("express").Router();
const verify = require("./privateRoute");

router.get("/", verify, (req, res) => { // tutaj dodajemy middleware verify, która sami tak nazwalismy powyzej. bierze sie ona z privateRoute.js czyli bedzie sprawdzac czy ures jest zalogowany, inaczej nie wyswietli tej strony 
  res.json({
    posts: {
      title: "my private post",
      description: "You will see this page only when you are loged in",
    },
  });
});

module.exports = router;
