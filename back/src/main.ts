import { app } from "./app/express/app";

const PORT = process.env.PORT ?? 3333;

app.listen(PORT);
