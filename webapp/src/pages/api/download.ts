import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.status(200);
  res.setHeader("Content-Disposition", "attachment; filename=test.json");
  res.write(JSON.stringify({ name: "John Doe" }));
  res.end();
}
