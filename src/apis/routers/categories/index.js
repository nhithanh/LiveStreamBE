import { Router } from "express"
import { db } from "../../../db"
export const categoryRouter = Router()

categoryRouter.get("/", async (req, res) => {
  const { limit } = req.query
  const categories = await db
    .Category
    .findAll({ limit, raw: true, order: [["categoryId", "ASC"]] });
  return res
    .status(200)
    .send(categories)
})

categoryRouter.get("/famous", async (req, res) => {
  const categories = await db
    .Category
    .findAll({ raw: true, order: [["categoryId", "ASC"]] })
  const famousCatagories = categories.filter(category => category.smallImageUrl !== null)
  return res
    .status(200)
    .send(famousCatagories)
});

categoryRouter.post("/", async (req, res) => {
  const { categories } = req.body
  for (let i = 0; i < categories.length; i++) {
    const { categoryName, imageUrl, smallImageUrl, type } = categories[i]
    await db
      .Category
      .create({ categoryName, imageUrl, smallImageUrl, type })
  }
  return res
    .status(200)
    .send({ status: "success" })
})

categoryRouter.get("/available", async (req, res) => {
  const { limit } = req.query
  let categories = await db
    .Category
    .findAll({
      attributes: [
        "categoryId", "categoryName"
      ],
      include: [
        {
          model: db.LiveStream,
          where: {
            endedTime: null
          },
          include: [
            {
              model: db.User,
              as: "streamer",
              attributes: ["userId", "username", "avatarUrl"]
            }
          ],
          limit
        }
      ]
    })

  categories = categories.filter(category => category.LiveStreams.length > 0);
  return res
    .status(200)
    .send(categories);
})

categoryRouter.get("/available/:categoryId", async (req, res) => {
  const { limit, offset } = req.query
  const { categoryId } = req.params
  let liveStreams = await db
    .LiveStream
    .findAll({
      where: {
        categoryId,
        endedTime: null
      },
      include: [
        {
          model: db.User,
          as: "streamer",
          attributes: ["userId", "username", "avatarUrl"]
        }
      ],
      limit,
      offset
    });

  return res
    .status(200)
    .send(liveStreams)
})