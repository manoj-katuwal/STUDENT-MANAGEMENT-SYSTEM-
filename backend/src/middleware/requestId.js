import { randomUUID } from "crypto";

const requestId = (req, res, next) => {
  const id = randomUUID();

  req.requestId = id;
  res.setHeader("X-Request-User-id", id);

  next();
};

export default requestId;
