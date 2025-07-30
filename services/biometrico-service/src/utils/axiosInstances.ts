// src/utils/axiosInstances.ts
import axios from "axios";

export const axiosZkBioAgent = axios.create({
  baseURL: process.env.ZK_AGENT_BASE_URL || "http://localhost:3010", // ajusta el puerto si es otro
  //timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});
