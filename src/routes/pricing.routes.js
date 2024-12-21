import express from 'express';
import { checkPricingController } from '../controllers/pricing.controllers.js';
const router = express.Router();

router.route("/check-pricing").post(checkPricingController);

export default router;