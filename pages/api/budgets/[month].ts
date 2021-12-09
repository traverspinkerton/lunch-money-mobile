// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import { getBudgetsForMonth } from "../../../lib/lm-api";

export default async function helloAPI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.cookies.lm_secret === process.env.SECRET) {
    try {
      const { budgets, total } = await getBudgetsForMonth();
      res.send({ budgets, total });
    } catch (error) {
      res.status(500).send("Error fetching budgets");
    }
  } else {
    res.status(401).send("naw");
  }
}
