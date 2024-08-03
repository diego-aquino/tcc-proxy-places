import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().optional(),

  GOOGLE_MAPS_PLACES_CURRENT_API_URL: z.string().url(),
  GOOGLE_MAPS_PLACES_NEW_API_URL: z.string().url(),
  GOOGLE_MAPS_API_KEY: z.string().min(1),
});

export const environment = environmentSchema.parse(process.env);
