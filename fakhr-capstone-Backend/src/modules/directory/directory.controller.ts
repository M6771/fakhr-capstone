import { Request, Response } from "express";
import Center from "../../models/Center.model";

// محافظات الكويت 
const KUWAIT_CITIES = [
  "Kuwait City",
  "Hawalli",
  "Farwaniya",
  "Ahmadi",
  "Jahra",
  "Mubarak Al-Kabeer",
];


export const getCenters = async (req: Request, res: Response) => {
  try {
    const {
      type,
      city,
      specialties,
      search,
      page = 1,
      limit = 10,
      sortBy = "rating",
      order = "desc",
    } = req.query;

    
    const filter: any = {};

    if (type && (type === "public" || type === "private")) {
      filter.type = type;
    }

    if (city && typeof city === "string") {
      filter.city = { $regex: new RegExp(city, "i") };
    }

    if (specialties && typeof specialties === "string") {
        const specialtiesArray = specialties.split(",");
        filter.specialties = { 
            $in: specialtiesArray.map(s => new RegExp(s.trim(), "i")) 
          };
    }

    if (search && typeof search === "string") {
      filter.name = { $regex: new RegExp(search, "i") };
    }

    
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    
    const sortOrder = order === "asc" ? 1 : -1;
    const sortField = ["rating", "name", "createdAt"].includes(sortBy as string)
      ? (sortBy as string)
      : "rating";

    const [centers, totalCount] = await Promise.all([
      Center.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .select("-reviews"),
      Center.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: centers,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount,
        itemsPerPage: limitNum,
      },
    });
  } catch (error) {
    console.error("Error fetching centers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch centers",
    });
  }
};


export const getCenterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const center = await Center.findById(id);

    if (!center) {
      return res.status(404).json({
        success: false,
        message: "Center not found",
      });
    }

    res.status(200).json({
      success: true,
      data: center,
    });
  } catch (error) {
    console.error("Error fetching center:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch center",
    });
  }
};


export const getCities = async (_req: Request, res: Response) => {
  try {
    const citiesInDb = await Center.distinct("city");
    res.status(200).json({
      success: true,
      data: citiesInDb.length > 0 ? citiesInDb : KUWAIT_CITIES,
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cities",
    });
  }
};


export const getSpecialties = async (_req: Request, res: Response) => {
  try {
    const specialties = await Center.distinct("specialties");
    res.status(200).json({
      success: true,
      data: specialties,
    });
  } catch (error) {
    console.error("Error fetching specialties:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch specialties",
    });
  }
};
/**
 * POST /api/directory/centers
 * Create a new center
 */
export const createCenter = async (req: Request, res: Response) => {
    try {
      const {
        name,
        type,
        address,
        city,
        phone,
        email,
        description,
        specialties,
        operatingHours,
        latitude,
        longitude,
      } = req.body;
  
      if (!name || !type || !address || !city || !phone) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: name, type, address, city, phone",
        });
      }
  
      const newCenter = await Center.create({
        name,
        type,
        address,
        city,
        phone,
        email,
        description,
        specialties: specialties || [],
        operatingHours,
        latitude,
        longitude,
        rating: 0,
        reviews: [],
      });
  
      res.status(201).json({
        success: true,
        data: newCenter,
      });
    } catch (error) {
      console.error("Error creating center:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create center",
      });
    }
  };
