
//dependencies
const express = require('express');
const router = express.Router();

//controller

const authController = require('../controller/admin/auth/authController')
const accountController = require('../controller/admin/account/accountController')
const { verfiyEmail, verifyCode, resetPassword } = require('../controller/admin/account/resetPasswordController')
const { getAllUsers, updateUserProfile, userRegistration, getUserProfile, updateStatusUser } = require('../controller/admin/users/userController')
const { addProducts, editProducts, getAllProducts, viewProduct, viewProductByID, getProductByStatus, updateProductStatus } = require('../controller/admin/products/productController');
const { getOrders, getOrderByStatus, createOrder, viewOrder, editOrder, orderCount, updateOrderStatus } = require('../controller/admin/orders/orderController')
const { createSession, editSession, viewSessionByID, getAllSessions, updateStatusSession, getSessionDetails } = require('../controller/admin/sessions/sessionController');
const { createSubcription, getAllSubcription, viewSubscriptionbyID, viewSubscriptionByID, editSubscription, deleteSubscription } = require('../controller/admin/subscriptionPlan/subscriptionController');

//validations
const loginValidation = require('../validators/auth/loginValidation');
const accountValidation = require('../validators/account/accountValidation')
const emailValidation = require('../validators/account/emailValidation')
const passwordValidation = require('../validators/account/passwordValidation')
const passwordConValidation = require('../validators/account/passwordConValidation')
const sessionValidator = require('../validators/sessions/sessionValidator');
const codeValidation = require('../validators/account/codeValidation');
const editProfileValidation = require('../validators/account/editProfileValidation');
const addProductValidation = require('../validators/products/addProductValidation');

const userValidation = require('../validators/user/userValidation')
// middlewares
const isAuthorized = require('../middleware/isAuth');
const upload = require('../middleware/uploadImage');
const { createCustomizeSubcription, editCustomizePlan, viewPendingrequest, acceptRequest, viewPendingrequestDetails } = require('../controller/admin/subscriptionPlan/customizeSubscriptionPlan');
const { getFeedback, viewFeedback } = require('../controller/admin/feedback/feedbackController');
const { subscriptionLog, addSubsDetails, updateSubscriptionStatus, viewSubscriptionDetails, viewNormalSubscriptionDetails } = require('../controller/admin/subscriptionPlan/subcriptionLog');
const { getNotifications, getNotificationLimit } = require('../controller/admin/notifications/notificationController');
const { subscriptionsSale, getGraph, getGraphOfSubscriptionSale } = require('../controller/admin/dashboard/dashboardController');
const { addVideo, deleteVideos, editVideo,getVideos } = require('../controller/admin/videos/videoController');
const videosValidator = require('../validators/videos/videosValidator');
const uploadVideos = require('../middleware/uploadImage');
const { getPayments } = require('../controller/admin/payments/paymentController');
const { createServicePlan, editServicePlan, getAllPlans, updatePlanStatus } = require('../controller/admin/servicePlan/servicePlanController');
const servicePlanValidator = require('../validators/servicePlans/servicePlanValidator');



//dashboard
router.get('/graph', isAuthorized, getGraph)
router.get('/total-sale-subs', isAuthorized, subscriptionsSale);
router.get('/subscription-graph', isAuthorized, getGraphOfSubscriptionSale)
//auth
router.post('/login', loginValidation, authController.login);

//edit Account 
router.get('/get-account', isAuthorized, accountController.getAccount);
router.post('/update-account', [isAuthorized, upload.single('image')], accountController.updateAccount);
router.post('/change-password', [isAuthorized, passwordValidation], accountController.changePassword);
// router.post('/image-update', [isAuthorized, upload.single('image')], accountController.updateImage)
//password reset 

router.post('/verify-email', emailValidation, verfiyEmail)
router.post('/verify-code', codeValidation, verifyCode)
router.post('/reset-password/:code', passwordConValidation, resetPassword)

//user 
router.post('/user-register', [isAuthorized, upload.single('image'), userValidation], userRegistration)
router.post('/user-update/:id', [isAuthorized, upload.single('image'), editProfileValidation], updateUserProfile)
router.get('/user-profile/:id', isAuthorized, getUserProfile)
router.get('/all', [isAuthorized], getAllUsers)
router.post('/update-status/:id', isAuthorized, updateStatusUser)

//products
router.post('/add-products', [isAuthorized, upload.any(), addProductValidation], addProducts);
router.post('/edit-products/:id', [isAuthorized, upload.any()], editProducts);
router.get('/all-products', isAuthorized, getAllProducts);
router.get('/view-product/:id', isAuthorized, viewProductByID);
router.post('/update-product-status/:id', isAuthorized, updateProductStatus);
// router.get('/get-product-by-status',isAuthorized,getProductByStatus)


//orders
// router.get('/order-sale', isAuthorized, orderCount)
router.get('/get-order', isAuthorized, getOrders)
router.get('/get-order-by-status', isAuthorized, getOrderByStatus)
router.get('/view-order/:id', isAuthorized, viewOrder);
// router.post('/edit-order', isAuthorized, editOrder)
router.post('/update-order-status/:id', isAuthorized, updateOrderStatus)


//session 
router.post('/session-create', [isAuthorized, upload.single('image')],sessionValidator, createSession)
router.post('/session-edit/:id', [isAuthorized, upload.single('image')], editSession)
router.get('/view-session/:id', isAuthorized, viewSessionByID)
router.get('/get-session', isAuthorized, getAllSessions);
router.post('/update-status-session/:id', isAuthorized, updateStatusSession)
router.get('/session-details', isAuthorized, getSessionDetails)




router.post('/subscription-add', isAuthorized, createSubcription);
router.get('/subscription-list', isAuthorized, getAllSubcription);
router.get('/view-subscription-by-id/:id', isAuthorized, viewSubscriptionByID);
router.post('/edit-subscription/:id', isAuthorized, editSubscription)
router.get('/subcription-log/:id', isAuthorized, addSubsDetails)
router.get('/subscription-log/', isAuthorized, subscriptionLog)
router.post('/update-status-subscription/:id',isAuthorized,updateSubscriptionStatus)
//customize subscription

router.post('/customize-subscription', isAuthorized, createCustomizeSubcription)
router.get('/pending-request',isAuthorized,viewPendingrequest)
router.post('/edit-customize-subs/:id', isAuthorized, editCustomizePlan);
router.get('/view-request/:id',isAuthorized,viewPendingrequestDetails)

router.get('/subscription-log', isAuthorized, subscriptionLog)
router.get('/view-subscription-details/:id',isAuthorized,viewNormalSubscriptionDetails)
router.post('/approval-status/:id',isAuthorized,acceptRequest);
router.delete('/delete-subscription/:id',isAuthorized,deleteSubscription)

//feedbacks
router.get('/get-feedbacks', isAuthorized, getFeedback);
router.get('/view-feedback/:id', isAuthorized, viewFeedback);




router.get('/notifications', isAuthorized, getNotifications)
router.get('/notification', isAuthorized, getNotificationLimit)

//videos
// const cpUpload = upload.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 8 }])
router.post('/add-video', [isAuthorized,upload.any()], addVideo)
router.delete('/delete-video/:id', isAuthorized, deleteVideos);
router.post('/edit-video/:id', isAuthorized, editVideo);
router.get('/all-video',isAuthorized,getVideos)




//payments
router.get("/get-payments",isAuthorized,getPayments)

//service plan 
router.post('/add-plan',[isAuthorized,upload.single("image"),servicePlanValidator],createServicePlan);
router.post('/edit-plan/:id',[isAuthorized,upload.single("image")],editServicePlan)
router.get('/all-plans',isAuthorized,getAllPlans);
router.post('/status-active/:id',isAuthorized,updatePlanStatus)

module.exports = router;
