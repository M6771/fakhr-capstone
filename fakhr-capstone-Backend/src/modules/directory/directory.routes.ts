import { Router } from "express";
import {
  getCenters,
  getCenterById,
  getCities,
  getSpecialties,
  createCenter,
} from "./directory.controller";

const router = Router();


router.get("/centers", getCenters);
router.post("/centers", createCenter);


router.get("/centers/cities", getCities);
router.get("/centers/specialties", getSpecialties);


router.get("/centers/:id", getCenterById);

export default router;
