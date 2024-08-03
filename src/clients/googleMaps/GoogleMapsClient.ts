import axios, { AxiosInstance } from 'axios';
import { FastifyReply, FastifyRequest } from 'fastify';

import { environment } from '@/config/environment';
import { proxyRequest } from '@/utils/network';

class GoogleMapsClient {
  private api: {
    currentPlaces: AxiosInstance;
    newPlaces: AxiosInstance;
  };

  constructor() {
    this.api = {
      currentPlaces: axios.create({
        baseURL: environment.GOOGLE_MAPS_PLACES_CURRENT_API_URL,
        params: { key: environment.GOOGLE_MAPS_API_KEY },
        paramsSerializer: (params) => new URLSearchParams(params).toString(),
      }),

      newPlaces: axios.create({
        baseURL: environment.GOOGLE_MAPS_PLACES_NEW_API_URL,
        headers: { 'X-Goog-Api-Key': environment.GOOGLE_MAPS_API_KEY },
        paramsSerializer: (params) => new URLSearchParams(params).toString(),
      }),
    };
  }

  async proxyCurrentPlacesRequest(request: FastifyRequest, reply: FastifyReply) {
    return proxyRequest(request, reply, this.api.currentPlaces);
  }

  async proxyNewPlacesRequest(request: FastifyRequest, reply: FastifyReply) {
    return proxyRequest(request, reply, this.api.newPlaces);
  }
}

export default GoogleMapsClient;
