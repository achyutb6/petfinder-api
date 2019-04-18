var mysql = require('mysql');
var express = require('express');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "../Petfinder/src/assets/uploads/")
    },
    filename:function(req, file, cb){
        cb(null, Date.now()+'.jpg')
    }
})
var upload = multer({ storage:storage });
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({ extended: false });
var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
var router = express.Router();
var connection = mysql.createConnection({
    host: 'us-cdbr-iron-east-02.cleardb.net',
    user: 'b6f017c0866ed2',
    password: '3c07d231',
    database: 'heroku_b9ad136c5d2fbf3'
});
connection.connect();

app.use(function(request, result, next) {
    result.header("Access-Control-Allow-Origin", "*");

    result.header("Access-Control-Allow-Headers", "Origin, X-requestuested-With, Content-Type, Accept");
    next();
});

app.listen(3000, () => {
    console.log(`https://localhost:3000`);
});

  app.get('/', (request, result) => {
    console.log('Connected to NodeJS Services');
    result.send('Connected to NodeJS Services');
});

// Upload Image/File
app.post('/uploadImage', upload.single("productImage"), (request, result) => {
    // result.send(request.file.body["destination"]+request.file.body["filename"]+".jpg");
    result.send(request.file);
    console.log(result);
});

app.post('/api/setImage', (request, result) => {
    // console.log(request.body);
    // result.send(request.body);
    connection.query('UPDATE `petimages` SET `petImageName`= ? WHERE `petId`= ?', [request.body.imgPath, request.body.value], function(err, rows, fields) {
        if(err){
            console.log(err);
        }
        else{
            result.send(rows);
        }
    })
});

// get all images of a service
app.get('/api/pet/getImages/:id', (request, result) => {
    connection.query('select * from petimages where petId = ?', [request.params.id], function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(rows);
        }
    });
});

// set image path to some service
app.get('/api/pet/setImage/:id/:path', (request, result) => {
    // 
});

// List of all services
app.get('/api/pet/all/:userid', (request, result) => {
    connection.query('SELECT pet.*, petimages.petImageName FROM pet, petimages WHERE pet.petId = petimages.petId AND pet.petId AND pet.isAvailable = 1', function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            result.send(rows);
        }
    });
});

// services by a specific user
app.get('/api/pet/getByUser/:userId', (request, result) => {
    connection.query("select pet.*, petimages.petImageName from pet, petimages where pet.petId = petimages.petId and petUserId = ? ", [request.params.userId], function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            result.send(rows);
        }
    });
});

// product categories all
app.get('/api/pet/petCategoriesAll', (request, result) => {
    connection.query('Select * from petCategory', function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            result.send(rows);
        }
    });
});

// Delete a product
app.get('/api/pet/delete/:id', (request, result) => {
    connection.query("DELETE FROM pet WHERE pet.petId=?", [request.params.id], function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            result.send(rows);
        }
    });
});


// List of products with one category
app.get('/api/pet/petCategory/:categoryId/:userId', (request, result) => {
    connection.query("SELECT pet.*, petimages.petImageName FROM pet, petimages WHERE pet.petId = petimages.petId AND pet.petId AND pet.isAvailable = 1 and pet.petCategoryId = ?" , [request.params.categoryId] , function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            result.send(rows);
        }
    });
});


// user register
app.get('/api/users/register/:fullName/:password/:emailId', (request, result) => {
    connection.query("INSERT INTO users (`fullName`, `emailId`, `password`) VALUES (?, ?, ?)", [request.params.fullName, request.params.emailId, request.params.password], function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            result.send(rows);
        }
    });
});

// user login
app.get('/api/users/login/:emailId/:password', (request, result) => {
    connection.query("SELECT * from users WHERE emailId= ? and password= ?", [request.params.emailId, request.params.password], function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            result.send(rows);
        }
    });
});

// Change Password
app.get('/api/users/changePassword/:userId/:newPassword', (request, result) => {
    connection.query("UPDATE users SET users.password= ? WHERE userId= ?", [request.params.newPassword, request.params.userId], function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            result.send(rows);
        }
    });
});

// Change PhoneNo
app.get('/api/users/changePhoneNo/:userId/:phoneNo', (request, result) => {
    connection.query('Update users set users.phoneNo = ? where userId = ?', [request.params.phoneNo, request.params.userId], function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            result.send(rows);
        }
    });
});

// change Address
app.get('/api/users/changeAddress/:userId/:address/:city/:state/:country/:zipcode', (request, result) => {
    connection.query('update users set users.address= ?, users.city= ?, users.state= ?, users.country= ?, users.zipcode= ? where users.userId= ?', [request.params.address, request.params.city, request.params.state, request.params.country, request.params.zipcode, request.params.userId], function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            result.send(rows);
        }
    });
});

// Change Email
app.get('/api/users/changeEmail/:userId/:newEmail', (request, result) => {
    connection.query('UPDATE users SET users.emailId= ? WHERE userId= ?', [request.params.newEmail, request.params.userId], function (err, rows, fields) {
        if (err) {
            console.log(err.sqlMessage);
            result.send("Email Already Exist");
        }
        else {
            result.send(rows);
        }
    });
});

// delete a user
app.get('/api/users/delete/:userId', (request, result) => {
    connection.query('DELETE FROM users WHERE userId= ?', [request.params.userId], function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            result.send(rows);
        }
    });
});

// Specific User 
app.get('/api/users/get/:id', (request, result) => {
    connection.query('SELECT * FROM users WHERE userId = ?', [request.params.id], function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            result.send(rows);
            console.log(rows);
        }
    });
});

// Specific Product
app.get('/api/pet/:id', (request, result) => {
    connection.query('SELECT pet.*, petimages.petImageName, petcategory.petCategoryName FROM pet, petimages, petcategory WHERE pet.petId = ? AND pet.petId = petimages.petId AND pet.petCategoryId = petcategory.petCategoryId ', [request.params.id], function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            result.send(rows);
        }
    });
});

// List of all users
app.get('/api/users/usersListAll', (request, result) => {
    connection.query('SELECT * FROM users', function (err, rows, fields) {
        if (err) {
            console.log('something went wrong !');
        }
        else {
            result.send(rows); 
        }
    });
});

// service by search Input
app.get('/api/pets/searchInput/:searchInput/:userId', (request, result) => {
    // SELECT service.*, serviceimages.serviceImageName FROM service, serviceimages WHERE service.serviceId = serviceimages.serviceId AND service.serviceId AND service.isAvailable = 1 and service.serviceName like '%first%' and service.serviceId not in (select serviceId from hiddenservices where hiddenservices.userId = 1)
    // console.log("SELECT service.*, serviceimages.serviceImageName FROM service, serviceimages WHERE service.serviceId = serviceimages.serviceId AND service.serviceId AND service.isAvailable = 1 and service.serviceName like '%"+request.params.searchInput+"%' and service.serviceId not in (select serviceId from hiddenservices where hiddenservices.userId ="+ request.params.userId+" )");
    connection.query("SELECT pet.*, petimages.petImageName FROM pet, petimages WHERE pet.petId = petimages.petId AND pet.petId AND pet.isAvailable = 1 and pet.petName like \'%"+request.params.searchInput+"%\' ", function (err, rows, fields) {
        if (err) {
            console.log(err)
        }
        else {
            result.send(rows);
        }
    });
});

// check if the user exists 
app.get('/api/users/findUser/:emailId', (request, result) => {
    console.log("select * from users where users.emailId=" + request.params.emailId);
    connection.query("select * from users where users.emailId='" + request.params.emailId + "'", function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            if (rows.length > 0) {
                // result.send("User Exists");
                result.send(rows);
            }
            else {
                // result.send("User does not exist");
                result.send(rows);
            }
        }
    });
});

// add Service
app.post('/api/pet/addPet', urlEncodedParser, (request, result) => {
    // result.send(request.body);
    connection.query("INSERT INTO `pet`(`petName`, `petCategoryId`, `petDescription`, `petUserId`, `petBreed`) VALUES (?,?,?,?,?)", [request.body.addPetName, request.body.addPetCategory.petCategoryId, request.body.addPetDesc, request.body.userId, request.body.addPetBreed], function(err, rows, fields){
        if(err){
            console.log(err);
        }
        else{
            // console.log(rows);
            // result.send(rows);
            connection.query('INSERT INTO `petimages`(`petImageName`, `petId`) VALUES (?,?)',['temp' , rows["insertId"]], function(err, rows, fields){
                if(err){
                    console.log(err);
                }
                else{
                    // result.send(rows);
                }
            });
            result.send(rows)
        }
    });
    // INSERT INTO `service`(`serviceName`, `serviceCategoryId`, `serviceDescription`, `serviceUserId`, `servicePrice`) VALUES ('trial name', 1, 'trial Desc', 1, 25) 
});


// activate user
app.get('/api/users/activateUser/:id', (request, result) => {
    connection.query("UPDATE users SET isActive=1 WHERE userId = ?", [request.params.id], function(err, rows, fields){
        if(err){
            console.log(err);
        }
        else{
            result.send(rows);
        }
    });
});

// deactivate user
app.get('/api/users/deactivateUser/:id', (request, result) => {
    connection.query("UPDATE users SET isActive=0 WHERE userId= ?", [request.params.id], function(err, rows, fields){
        if(err){
            console.log(err);
        }
        else{
            result.send(rows);
        }
    });
});

// Update Service
app.get('/api/pet/updatePet/:petName/:petPrice/:petDesc/:petId', (request, result) => {
    connection.query("UPDATE pet SET pet.petName = ?, pet.petBreed = ?, pet.petDescription = ? WHERE pet.petId = ?", [request.params.petName,request.params.petPrice,request.params.petDesc,request.params.petId], function(err, rows, fields){
        if(err){
            console.log(err);
        }
        else{
            result.send(rows);
        }
    })
})


// add service to wish list
app.get(`/api/wishlist/add/:petId/:userId`, (request, result) => {
    console.log(request.params);
    connection.query('INSERT INTO `wishlist`(`wishlistPetId`, `wishlistUserid`) VALUES (?,?)', [request.params.petId, request.params.userId], function(err, rows, fields){
        if(err){
            console.log(err);
        }
        else{
            result.send(rows);
        }
    });
});

// get wishlist service details
app.get('/api/wishlist/get/:userId', (request, result) => {
   connection.query('select pet.*, petimages.petImageName FROM pet, petimages, wishlist where pet.petId = wishlist.wishlistPetId and wishlist.wishlistUserid = ? and petimages.petId = pet.petId ', [request.params.userId], function(err, rows, fields){
       if(err){
           console.log(err);
       }
       else{
           result.send(rows);
       }
   })
});

// remove from wishlist
app.get('/api/wishlist/remove/:petId/:userId', (request, result) => {
    connection.query('DELETE FROM `wishlist` WHERE wishlist.wishlistPetId = ? and wishlist.wishlistUserid = ?', [request.params.petId, request.params.userId], function(err, rows, fields){
        if(err){
            console.log(err);
        }
        else{
            result.send(rows);
        }
    });
});

// discontinue a service
app.get('/api/pet/discontinue/:petId', (request, result) => {
    connection.query('UPDATE `pet` SET `isAvailable`= 0 WHERE petId = ?', [request.params.petId], function(err, rows, fields){
        if (err){
            console.log(err);
        }
        else{
            result.send(rows);
        }
    });
});

// continie a service
app.get('/api/pet/continue/:petId',(request, result) => {
    connection.query('UPDATE `pet` SET `isAvailable`= 1 WHERE petId = ?', [request.params.petId], function(err, rows, fields){
        if (err){
            console.log(err);
        }
        else{
            result.send(rows);
        }
    });
});


// serachby inputand filter
app.get('/api/pet/get/:searchInput/:categoryId', (request, result) => {
    connection.query('SELECT pet.*, petimages.petImageName FROM pet, petimages WHERE pet.petId = petimages.petId AND pet.petId AND pet.isAvailable = 1 and pet.petCategoryId = ? and pet.petName like "%'+request.params.searchInput+'%"', [request.params.categoryId], function(err, rows, fields){
        if(err){
            console.log(err);
        }
        else{
            console.log(rows);
            result.send(rows);
        }
    })
})

app.get('/api/pet/getImageFile/:id', function (req, res) {
    console.log("getimage");
    res.sendFile(__dirname+ '/uploads/'+req.params.id);
});