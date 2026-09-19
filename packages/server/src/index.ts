import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
const PORT = env.PORT;

app.listen(PORT, () => {
   logger.info(`Server is running on http://localhost:${PORT}`);
});
