//dependencies
const express = require('express');
const router = express.Router();
//passport
const passport = require('passport');
const passportConfig = require('../utils/passport')

//controller
const authController = require('../controller/userApis/Auth/authController');
const accountController = require('../controller/userApis/account/accountController')
const { verfiyEmail, verifyCode, resetPassword } = require('../controller/userApis/account/resetPassword')
const { home } = require('../controller/userApis/home/homeController')
const { googleLogin, googleCurl, facebookOAuth } = require('../controller/userApis/Auth/socialLogin')
const { getSessions, getSessionById, bookSession } = require('../controller/userApis/session/sessionController')

//validation
const userValidator = require('../validators/user/userValidation')
const passwordValidation = require('../validators/account/passwordValidation')


//middlewares
const isAuthorized = require('../middleware/userAuthorization');
const upload = require('../middleware/uploadImage');
const { getAllSubcription, myMeals, viewMealDetails } = require('../controller/userApis/subscriptionLog/subscriptionsController');
const { getOrders, getOrderByStatus, myOrders, addToCart, viewOrder, placeOrder } = require('../controller/userApis/orders/orderController');
const { purchaseMeal, getCustomizeMealPlan, customizeMealPurchase } = require('../controller/userApis/subscriptionLog/mealplanPurchingController');
const { productById, allProducts } = require('../controller/userApis/products/productController');
const { getVideos, subscribeVideo } = require('../controller/userApis/onDemandVideos/videoController');
const { foodIntake, editFood, addfoodIntake, getFoodRecord } = require('../controller/userApis/foodRecod/foodController');
const foodIntakeValidator = require('../validators/foodWaterIntake/foodIntakeValidator');
const { addInterval, addWaterIntake, remindMe, editWaterReminder } = require('../controller/userApis/reminders/waterController');
const waterIntakeValidator = require('../validators/foodWaterIntake/waterIntakeValidator');
const { reminders, addReminder } = require('../controller/userApis/reminders/reminderController');
const { addWorkout, editWorkout } = require('../controller/userApis/reminders/workoutController');
const { createFeedback } = require('../controller/userApis/feedback/feedbackController');
const { privacyPolicy, createtermsAndCondition } = require('../controller/userApis/privacyAndTerms/privayAndTermsConroller');
const { weightTracker, addWeight } = require('../controller/userApis/weightTracker/weightController');
const weightTrackerValidator = require('../validators/weightTracker/weightTrackerValidator');
const addWeightValidator = require('../validators/weightTracker/addWeightValidator');
const workoutValidator = require('../validators/foodWaterIntake/workoutValidator');
const { getNotifications } = require('../controller/userApis/notifications/notificationController');

//Authorization
router.post('/login', authController.login)
router.post('/register', userValidator, authController.userRegistration);
// router.post('/auth/google', passport.authenticate('google', { scope: ['profile'], session: false },), googleLogin);
// router.post('/auth/google/callback', passport.authenticate('google', { scope: ['profile'], session: false }), googleLogin);


router.post('/auth/facebook', passport.authenticate('facebookToken', { session: false }), facebookOAuth);

router.post('/auth/google', googleCurl);

//end


//edi-ptofile
router.get('/me', isAuthorized, accountController.getAccount)
router.post('/update', [isAuthorized, upload.single('image')], accountController.updateAccount)
router.post('/change-password', [isAuthorized, passwordValidation], accountController.changePassword)
//end

//reset-password
router.get('/verify-email', verfiyEmail);
router.get('/verify-code', verifyCode);
router.post('/reset-password/:code', resetPassword)
//end

//homeView
router.get('/home', [isAuthorized, upload.any()], home);

//notifications

router.get("/notifications", isAuthorized, getNotifications)


//session
router.get('/sessions', isAuthorized, getSessions)
router.get('/sessions-by-id/:id', isAuthorized, getSessionById);
router.post('/book-session/:id', isAuthorized, bookSession)




// subscription
router.get('/subscription-log', isAuthorized, getAllSubcription);
router.post('/to-purchase/:id', isAuthorized, purchaseMeal)
router.get('/my-meals', isAuthorized, myMeals);
router.get("/view-details/:id", isAuthorized, viewMealDetails)
router.get('/customize-plan', isAuthorized, getCustomizeMealPlan)
router.post('/customize-meal-checkout/:id', isAuthorized, customizeMealPurchase)
//orders 

router.get('/orders', isAuthorized, myOrders);
router.get('/order-by-status', isAuthorized, getOrderByStatus)
router.post('/order-place', isAuthorized, placeOrder)
router.get('/view-order/:id', isAuthorized, viewOrder)


//products
router.get('/view-product/:id', isAuthorized, productById)
router.get('/products', isAuthorized, allProducts);

//videos
router.get('/vidoes', isAuthorized, getVideos);
router.post('/subscribe/:id', isAuthorized, subscribeVideo)

//foods
router.post('/add-food', [isAuthorized, foodIntakeValidator], addfoodIntake);
router.post('/edit-food/:id', isAuthorized, editFood)
router.get("/food-intake", isAuthorized, getFoodRecord)

//reminderssss
router.post('/reminders', addReminder)

//water-intake
router.get('/interval', isAuthorized, addInterval);
router.get('/remind-me', isAuthorized, remindMe);
router.post('/water-intake', [isAuthorized, waterIntakeValidator], addWaterIntake)
router.post('/edit-water/:id', isAuthorized, editWaterReminder)
//workout reminder
router.post('/add-workout', [isAuthorized, workoutValidator], addWorkout)
router.post('/edit-workout/:id', isAuthorized, editWorkout)

//weight tracker
router.post('/weight-goal', [isAuthorized, weightTrackerValidator], weightTracker)
router.post('/add-weight', [isAuthorized, addWeightValidator], addWeight)
//feedbacks
router.post('/feedback', createFeedback)

//privacy policy
router.get('/privacy', privacyPolicy)
router.post('/terms', createtermsAndCondition)

module.exports = router;