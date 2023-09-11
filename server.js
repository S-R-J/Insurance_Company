const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://suraj0:suraj0@clusteraninsurance.oroydjh.mongodb.net/aninsuranceDB", { useNewUrlParser: true, useUnifiedTopology: true });



//PAGES
app.get('/', function (req, res) {
  res.render('index');
})
app.get('/signin', function (req, res) {
  res.render('signin');
})
app.get('/signup', function (req, res) {
  res.render('signup');
})
app.get('/getquote', function (req, res) {
  res.render('getquote');
})
app.get('/general', function (req, res) {
  res.render('general');
})

app.get('/hello', function (req, res) {
  res.render('hello');
})

app.get('/termpolicies', function (req, res) {
  res.render('termpolicies');
})

app.get('/details', async (req, res) => {
  const details = await Detail.find({});
  res.render('details', { detailList: details });
});

app.get('/hlvcalculate', function (req, res) {
  res.render('hlvcalculate');
})

app.get('/hlvpage', function (req, res) {
  res.render('hlvpage');
})
app.get('/payment', function (req, res) {
  res.render('payment');
})
app.get('/gateway', function (req, res) {
  res.render('gateway');
})


app.get('/ty', async (req, res) => {
  const details = await Detail.find({});
  res.render('ty', { detailsty: details.age });


})




//Create Schema 
const detailSchema = {
  name: String,
  number: Number,
  password: String,
  age: Number,
  gender: String,
  education: String,
  income: Number,
  occupation: String,
  smoke: String,
  hlv : Number,
  cover : Number,
  lifeyear : Number,
  term : String,
  lifepremium : Number,
  bikepremium : Number,
  bikeyear : String,
  bikenumber : String
}

//CREATE MODEL
const Detail = mongoose.model("detail", detailSchema);


//SAVE DETAILS
app.post('/signup', function (req, res) {
  let newSignup = new Detail({
    name: req.body.name,
    number: req.body.number,
    password: req.body.password,

  });

  newSignup.save();
  res.redirect('/signin');
})



app.post('/quote', async function (req, res) {
  try {

    const number = req.body.number;

    const user = await Detail.findOne({ number: number });

    const filter = { name: user.name };

    

    var age = user.age;
    var income = user.income;

    var hlv = 0;


    if (age >= 18 && age <= 35) {
      var hlv = 25 * income;
    }


    else if (age >= 36 && age <= 40) {
      var hlv = 20 * income;
    }


    else if (age >= 41 && age <= 45) {
      var hlv = 15 * income;
    }


    else if (age >= 46 && age <= 50) {
      var hlv = 12 * income;
    }


    else if (age >= 51 && age <= 55) {
      var hlv = 10 * income;
    }


    else if (age >= 56 && age <= 100) {
      var hlv = 5 * income;
    }

    else if (age >= 100) {
      res.send('Not Eligible due to age');
    }

    else if (age < 18 && age != 0) {
      res.send('Not Eligible due to age');
    }


    else if (income == 0 && age == 0) {
      res.send('Please Enter above age and Income');
    }


    const update = {
      $set: {
        age: req.body.age,
        gender: req.body.gender_option,
        education: req.body.education_option,
        income: req.body.income,
        occupation: req.body.occupation_option,
        smoke: req.body.smoke_option,
        hlv: hlv

      }
    };

    await Detail.updateOne(filter, update);



    res.render('hlvcalculate', { show: user , hlv : hlv });

  } catch (error) {
    console.error(error);
    // Handle error appropriately
  }
});



app.post('/makepayment' , async function(req, res){

  const number = req.body.number;
  const user = await Detail.findOne({ number: number });
  const filter = { name: user.name };


            var selectedvalue = user.cover;

            var premiumm = 0

            if (selectedvalue === 1000000) {
                  premiumm = 20000;
              } 

            else if (selectedvalue === 2000000) {
              premiumm = 40000;
            }

            else if (selectedvalue === 3000000) {
              premiumm = 60000;
            }

            else if (selectedvalue === 4000000) {
              premiumm = 80000;
            }

            else if (selectedvalue === 5000000) {
              premiumm = 100000;
            }
            else if (selectedvalue === 6000000) {
              premiumm = 1200000;
            }


            const update = {
              $set: {
                cover: req.body.cover,
                lifeyear: req.body.year,
                term: req.body.term,
                lifepremium: premiumm
          
              }
            };

  await Detail.updateOne(filter, update);

  res.render('gateway', { show: user});



})


app.post('/payment', async function (req, res) {

  const number = req.body.number;
  const user = await Detail.findOne({ number: number });

  res.render('payment' , { show: user} );
})



app.post('/bikeinspayment' , async function(req, res){

  const number = req.body.number;
  const user = await Detail.findOne({ number: number });
  const filter = { name: user.name };


            var selectedvalue = user.cover;

            var premiumm = 0

            if (selectedvalue === "option1") {
                  premiumm = 20000;
              } 

            else if (selectedvalue === "option2") {
              premiumm = 40000;
            }

            else if (selectedvalue === "option3") {
              premiumm = 60000;
            }

            else if (selectedvalue === "option4") {
              premiumm = 80000;
            }

            else if (selectedvalue === "option5") {
              premiumm = 100000;
            }


            const update = {
              $set: {
                bikepremium: premiumm,
                bikeyear : req.body.cover,
                bikenumber : req.body.bikenumber                
          
              }
            };

  await Detail.updateOne(filter, update);

  res.render('gateway', { show: user});



})








// const updateDocument = async (name) => {
//   try {

//     const result = await Detail.updateOne({name}, {
//       $set : {
//         // name : "Meeenie"
//         // password : '098765432'
//         age : 33
//       }
//     });

//     console.log(result);

//   } catch (error) {
//       console(error)
//   }
// }



// updateDocument("Meeenie");






// app.post('/signup', function(req, res){
//     let newSignup = new Detail({
//         name: req.body.name,
//         number: req.body.number,
//         password: req.body.password,
//         age: req.body.age,
//         gender: req.body.gender_option,
//         education: req.body.education_option,
//         income : req.body.income,
//         occupation : req.body.occupation_option,
//         smoke : req.body.smoke_option

//     });

//     newSignup.save();
//     res.redirect('/signin');
// })

// app.post('/quote', function(req, res){
//     let newQuote = new Detail({
//         age: req.body.age,
//         gender: req.body.gender_option,
//         education: req.body.education_option,
//         income : req.body.income,
//         occupation : req.body.occupation_option,
//         smoke : req.body.smoke_option
//     });

//     newQuote.save();
//     res.redirect('/signin');
// })










//LOGIN
app.post('/getquote', async function (req, res) {
  const number = req.body.number;
  const password = req.body.password;
  const selectedOption = req.body.contact;

  const user = await Detail.findOne({ number: number });

  if (user && user.password === password) {
    if (selectedOption === 'page1') {
      res.render('getquote', { username: user.name });
    } else if (selectedOption === 'page2') {
      res.render('general', { username: user.name });
    } else {
      res.send('Invalid option selected');
      // res.render('signin', { message: 'Invalid option selected' });
    }
  } else {
    res.send('Invalid number or password');
    // res.render('signin', { message: 'Invalid number or password' });
  }
});








//PORT
app.listen(4000, function () {
  console.log("Server is running on 4000");
})
