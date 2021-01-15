var express = require('express');
var router = express.Router();
const { auth, duplicateId } = require("../middleware/Auth");
const { duplicate } = require('../middleware/duplicateProduct');
const {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  deleteMultipleUsers,
  updateActiveStatus,
  getAccountTypes,
  getAllMerchants,
  getAllDispatchRiders,
  getMerchantWithId,
  getDispatcherWithId, } = require('../models/users/UserService')

/* GET users listing. */

router.post("/sign-up", duplicateId, createUser)

router.post("/login", loginUser);

router.get('/', auth, getAllUsers);

router.get('/types', getAccountTypes)

router.get("/merchants", auth, getAllMerchants);

router.get("/merchants/:merchantId", auth, getAllMerchants);

router.get("/dispatch-riders", auth, getAllDispatchRiders);

router.get("/dispatch-riders/:dispatcherId", auth, getAllDispatchRiders);

router.get('/:id', auth, getSingleUser);

router.delete('/', auth, deleteMultipleUsers);

router.delete('/:id', auth, deleteSingleUser);

router.patch('/', updateActiveStatus);



// router.get("/test", auth, (req, res) => {
//   res.send({ message: "you successfully logged in" });
// })

module.exports = router;
