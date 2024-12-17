import express from "express";
import { getSimilarTvs, getTrendingTv, getTvDetails, getTvsByCategory, getTvTrailer } from "../controllers/tv.controller.js";

const router = express.Router();

router.get("/trending", getTrendingTv);
router.get("/:id/trailer", getTvTrailer);
router.get("/:id/details", getTvDetails);
router.get("/:id/similar", getSimilarTvs);
router.get("/:category", getTvsByCategory);


export default router;