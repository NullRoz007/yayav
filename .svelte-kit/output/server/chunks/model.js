import "@tauri-apps/api/core";
import { s as set_model_sidecar_ready } from "./state.svelte.js";
import { Command } from "@tauri-apps/plugin-shell";
const API_PORT = 3e3;
const API_HOST = "http://localhost";
const start_model_sidecar = async () => {
  const command = Command.sidecar("binaries/yaymodel");
  await command.execute();
  console.log("Model Sidecar is now ready!");
  set_model_sidecar_ready(true);
};
const api_request = async (endpoint, method, data) => {
  let opts = {
    "method": method
  };
  const response = await fetch(API_HOST + ":" + API_PORT + "/" + endpoint, opts);
  const result = await response.json();
  return result;
};
const get_model_status = async () => {
  const status = await api_request("model/status", "GET");
  return status;
};
export {
  get_model_status as g,
  start_model_sidecar as s
};
